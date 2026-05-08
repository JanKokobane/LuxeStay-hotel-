import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import pool from '../config/db';
import generateToken from '../utils/generateToken';

// Register Admin
export const registerAdmin = async (req: Request, res: Response) => {
  const { name, email, password } = req.body;

  if (!name.trim()) return res.status(400).json({ error: 'Full name is required' });
  if (!/^\S+@\S+\.\S+$/.test(email)) return res.status(400).json({ error: 'Invalid email' });
  if (password.length < 6) return res.status(400).json({ error: 'Password too short' });

  try {
    // ✅ Check if admin already exists
    const { rows } = await pool.query('SELECT id FROM admins WHERE email = $1', [email]);
    if (rows.length > 0) {
      return res.status(409).json({ error: 'Admin email already registered' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newAdmin = await pool.query(
      'INSERT INTO admins (name, email, password) VALUES ($1, $2, $3) RETURNING id, name, email',
      [name, email, hashedPassword]
    );

    const admin = newAdmin.rows[0];
    res.status(201).json({ token: generateToken(admin.id), admin });
  } catch (err) {
    console.error('Admin register error:', err);
    res.status(500).json({ error: 'Server error' });
  }
};

// Login Admin
export const loginAdmin = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  try {
    const result = await pool.query('SELECT * FROM admins WHERE email = $1', [email]);
    const admin = result.rows[0];
    if (!admin) return res.status(400).json({ error: 'Invalid credentials' });

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) return res.status(400).json({ error: 'Invalid credentials' });

    res.json({
      token: generateToken(admin.id),
      admin: { id: admin.id, name: admin.name, email: admin.email }
    });
  } catch (err) {
    console.error('Admin login error:', err);
    res.status(500).json({ error: 'Server error' });
  }
};
