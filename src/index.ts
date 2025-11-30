// src/index.ts
import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectDB, sequelize } from './config/database'; // Import Sequelize setup
import { ChatSessionModel, MessageModel, TypingIndicatorModel, AdminModel } from './models'; // Import models for typing

import authRoutes from './routes/auth';
import chatRoutes from './routes/chat';
import sessionRoutes from './routes/session';
import { setupSocketIO } from './socket';

dotenv.config();

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
    methods: ['GET', 'POST'],
    credentials: true,
  },
});

// Expose models globally for easier access in routes/socket
// Note: This is a simplified approach. In a larger app, you'd use a service layer.
export const models = {
  Admin: AdminModel,
  ChatSession: ChatSessionModel,
  Message: MessageModel,
  TypingIndicator: TypingIndicatorModel,
};

app.use(
  cors({
    origin: "*",
    credentials: true,
  })
);
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/sessions', sessionRoutes);

// Socket.IO setup
setupSocketIO(io);

const PORT = process.env.PORT || 3001;

// Connect to DB and start server
connectDB().then(() => {
  httpServer.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}).catch(err => {
  console.error("Failed to start server due to database error:", err);
});

// Graceful exit handler
process.on('beforeExit', async () => {
  console.log('Closing database connection...');
  await sequelize.close();
  console.log('Database connection closed.');
});