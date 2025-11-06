import express from 'express';
import authRoutes from './routes/auth.routes.js';
import cors from 'cors';
import deviceRoutes from './routes/device.routes.js';
import widgetRoutes from './routes/widget.routes.js';

const app = express();

app.use(
  cors({
    origin: ['http://localhost:3000', 'https://nodepilot-one.vercel.app'], // asal frontend
    credentials: true,
  }),
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/auth', authRoutes);
app.use('/api/devices', deviceRoutes);
app.use('/api/widgets', widgetRoutes);

export default app;
