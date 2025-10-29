import express from 'express';
import authRoutes from './routes/auth.routes.js';
import cors from 'cors';

const app = express();

app.use(
  cors({
    origin: 'http://localhost:3000', // asal frontend
    credentials: true,
  }),
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/auth', authRoutes);

export default app;
