import express from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import cors from 'cors';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import Database from 'better-sqlite3';
import Stripe from 'stripe';

const db = new Database('tripster.db');
const JWT_SECRET = 'your-secret-key'; // In production, use env var

// Initialize Database
db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT UNIQUE,
    password TEXT,
    name TEXT
  );

  CREATE TABLE IF NOT EXISTS hotels (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT,
    rating REAL,
    ratingText TEXT,
    reviews INTEGER,
    distance TEXT,
    price INTEGER,
    image TEXT,
    description TEXT,
    stars INTEGER
  );

  CREATE TABLE IF NOT EXISTS bookings (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    userId INTEGER,
    hotelId INTEGER,
    checkIn TEXT,
    checkOut TEXT,
    status TEXT DEFAULT 'Confirmed',
    FOREIGN KEY(userId) REFERENCES users(id),
    FOREIGN KEY(hotelId) REFERENCES hotels(id)
  );
`);

// Seed some data if empty
const hotelCount = db.prepare('SELECT count(*) as count FROM hotels').get() as { count: number };
if (hotelCount.count === 0) {
  const insertHotel = db.prepare('INSERT INTO hotels (name, rating, ratingText, reviews, distance, price, image, description, stars) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)');
  insertHotel.run('Main Deluxe Suite', 9.6, 'Excellent', 1920, 'Inner Circle View', 180, 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1200&q=80', 'A refined 3-star suite featuring classic architecture and contemporary amenities.', 3);
  insertHotel.run('Skyline Presidential Room', 8.3, 'Good', 792, 'Upper Terrace', 260, 'https://images.unsplash.com/photo-1582719478250-c89cae4df85b?auto=format&fit=crop&w=1200&q=80', 'Modern design with panoramic city views and a dedicated workspace.', 4);
  insertHotel.run('Oceanic Royal Penthouse', 9.5, 'Excellent', 2000, 'Seaside Wing', 420, 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=1200&q=80', 'Our most exclusive experience, offering a private terrace and direct ocean views.', 5);
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(cors());
  app.use(express.json());

  // Auth Middleware
  const authenticateToken = (req: any, res: any, next: any) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) return res.status(401).json({ error: 'Auth token missing' });

    jwt.verify(token, JWT_SECRET, (err: any, user: any) => {
      if (err) return res.status(403).json({ error: 'Invalid token' });
      req.user = user;
      next();
    });
  };

  // API Routes
  app.post('/api/auth/signup', async (req, res) => {
    const { email, password, name } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    try {
      const info = db.prepare('INSERT INTO users (email, password, name) VALUES (?, ?, ?)').run(email, hashedPassword, name);
      const token = jwt.sign({ id: info.lastInsertRowid, email, name }, JWT_SECRET);
      res.json({ token, user: { id: info.lastInsertRowid, email, name } });
    } catch (err) {
      res.status(400).json({ error: 'Email already exists' });
    }
  });

  app.post('/api/auth/login', async (req, res) => {
    const { email, password } = req.body;
    const user = db.prepare('SELECT * FROM users WHERE email = ?').get(email) as any;
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }
    const token = jwt.sign({ id: user.id, email, name: user.name }, JWT_SECRET);
    res.json({ token, user: { id: user.id, email, name: user.name } });
  });

  app.get('/api/hotels', (req, res) => {
    const hotels = db.prepare('SELECT * FROM hotels').all();
    res.json(hotels);
  });

  app.get('/api/hotels/:id', (req, res) => {
    const hotel = db.prepare('SELECT * FROM hotels WHERE id = ?').get(req.params.id);
    if (!hotel) return res.status(404).json({ error: 'Room not found' });
    res.json(hotel);
  });

  app.post('/api/bookings', authenticateToken, (req: any, res) => {
    const { hotelId, checkIn, checkOut } = req.body;
    const info = db.prepare('INSERT INTO bookings (userId, hotelId, checkIn, checkOut) VALUES (?, ?, ?, ?)').run(req.user.id, hotelId, checkIn, checkOut);
    res.json({ id: info.lastInsertRowid, status: 'Confirmed' });
  });

  app.get('/api/bookings', authenticateToken, (req: any, res) => {
    const bookings = db.prepare(`
      SELECT b.*, h.name as hotelName, h.image as hotelImage 
      FROM bookings b 
      JOIN hotels h ON b.hotelId = h.id 
      WHERE b.userId = ?
    `).all(req.user.id);
    res.json(bookings);
  });

  app.delete('/api/bookings/:id', authenticateToken, (req: any, res) => {
    const info = db.prepare('DELETE FROM bookings WHERE id = ? AND userId = ?').run(req.params.id, req.user.id);
    if (info.changes === 0) return res.status(404).json({ error: 'Booking not found or unauthorized' });
    res.json({ success: true });
  });

  app.put('/api/bookings/:id', authenticateToken, (req: any, res) => {
    const { checkIn, checkOut, status } = req.body;
    const info = db.prepare('UPDATE bookings SET checkIn = ?, checkOut = ?, status = ? WHERE id = ? AND userId = ?')
      .run(checkIn, checkOut, status || 'Confirmed', req.params.id, req.user.id);
    if (info.changes === 0) return res.status(404).json({ error: 'Booking not found or unauthorized' });
    res.json({ success: true });
  });

  app.get('/api/profile', authenticateToken, (req: any, res) => {
    const user = db.prepare('SELECT id, email, name FROM users WHERE id = ?').get(req.user.id) as any;
    res.json(user);
  });

  app.put('/api/profile', authenticateToken, (req: any, res) => {
    const { name, email } = req.body;
    try {
      db.prepare('UPDATE users SET name = ?, email = ? WHERE id = ?').run(name, email, req.user.id);
      res.json({ success: true, user: { id: req.user.id, name, email } });
    } catch (err) {
      res.status(400).json({ error: 'Email already in use' });
    }
  });

  // Stripe Payment Intent Route
  app.post('/api/create-payment-intent', authenticateToken, async (req: any, res) => {
    const { amount } = req.body;
    
    const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
    if (!stripeSecretKey) {
      // In a real app, you'd fail gracefully. For this environment, we'll return a simulated success if key is missing, 
      // but log an error to help the user know they need to set the key.
      console.error('STRIPE_SECRET_KEY is not set in environment variables.');
      return res.json({ clientSecret: 'simulated_secret_' + Math.random().toString(36).substring(7), simulated: true });
    }

    try {
      const stripe = new Stripe(stripeSecretKey);
      const paymentIntent = await stripe.paymentIntents.create({
        amount: Math.round(amount * 100), // Stripe expects cents
        currency: 'zar',
        automatic_payment_methods: { enabled: true },
      });

      res.json({ clientSecret: paymentIntent.client_secret });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
