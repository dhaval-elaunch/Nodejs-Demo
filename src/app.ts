import express from 'express';
import dotenv from 'dotenv';
import connectDB from './config/db';
import authRoutes from '../src/routes/auth.routes';

dotenv.config();
connectDB();

const app = express();

app.use(express.json());
app.use('/api/auth', authRoutes);
app.use('/api/products', authRoutes);

app.get('/', (_req, res) => {
  res.send('API is running...');
});

export default app;
