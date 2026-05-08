import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import pool from './config/db';
import { QueryResult } from 'pg';

// Routes
import authRoutes from './routes/authRoutes';
import adminAuthRoutes from './routes/adminAuthRoutes';

dotenv.config();

const app = express();
app.use(express.json());

app.use(
  cors({
    origin: '*', 
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);

pool.query('SELECT NOW()', (err: Error | null, res: QueryResult<any>) => {
  if (err) {
    console.error('Database connection failed:', err.message);
  } else {
    console.log('Database connected at:', res.rows[0].now);
  }
});

app.use('/api/auth', authRoutes);

app.use('/api/admin/auth', adminAuthRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
