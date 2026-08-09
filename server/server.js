import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import { eventBus } from './sse/eventBus.js';

import authRoutes from './routes/authRoutes.js';
import restaurantRoutes from './routes/restaurantRoutes.js';
import orderRoutes from './routes/orderRoutes.js';
import addressRoutes from './routes/addressRoutes.js';
import reviewRoutes from './routes/reviewRoutes.js';
import dishRoutes from './routes/dishRoutes.js';

dotenv.config();
dotenv.config({ path: './server/.env' });

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://pshreyambbk_db_user:QrUNQ0LW9tuVFsE7@cluster0.jjzssos.mongodb.net/?appName=Cluster0';

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true
}));
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/restaurants', restaurantRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/addresses', addressRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/dishes', dishRoutes);

// MongoDB connection with retry
let currentUri = MONGODB_URI;

const connectWithRetry = () => {
  mongoose.connect(currentUri, {
    serverSelectionTimeoutMS: 5000,
  })
    .then(() => {
      console.log(`MongoDB connected (${currentUri.includes('127.0.0.1') ? 'local' : 'Atlas'})`);
    })
    .catch((err) => {
      console.error("MongoDB connection error:", err.message);
      if (currentUri !== 'mongodb://127.0.0.1:27017/order-ticket') {
        console.log("Attempting fallback to local MongoDB (mongodb://127.0.0.1:27017/order-ticket)...");
        currentUri = 'mongodb://127.0.0.1:27017/order-ticket';
        setTimeout(connectWithRetry, 1000);
      } else {
        console.log("Retrying MongoDB connection in 5 seconds...");
        setTimeout(connectWithRetry, 5000);
      }
    });
};

connectWithRetry();

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', service: 'The Order Ticket API' });
});

// HTML Architecture & Logic Guide endpoint
app.get('/guide', (req, res) => {
  res.sendFile('c:/Users/Shreyam/OneDrive/Desktop/FOS/PROJECT_ARCHITECTURE_AND_LOGIC_GUIDE.html');
});

// SSE endpoint
app.get('/api/events', (req, res) => {
  const userId = req.query.userId || 'anonymous';

  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');
  res.setHeader('X-Accel-Buffering', 'no');

  res.write(`event: connected\ndata: ${JSON.stringify({ message: 'Connected to SSE stream' })}\n\n`);

  eventBus.addClient(userId, res);
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
