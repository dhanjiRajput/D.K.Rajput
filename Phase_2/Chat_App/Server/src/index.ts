// src/index.ts
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import authRoutes from './routes/auth';
import { createServer } from 'http';
import { Server } from 'socket.io';
import { handleSocket } from './socket';

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
    cors: { origin: 'http://localhost:5173', methods: ['GET', 'POST'] },
});

app.use(cors({
  origin: 'http://localhost:5173', // frontend origin
  credentials: true, // allow cookies and auth headers
}));
app.use(express.json());
app.use('/api/auth', authRoutes);

// MongoDB connection
mongoose.connect('mongodb://localhost:27017/chatting_app')
    .then(() => console.log('MongoDB connected'))
    .catch((err) => console.error('MongoDB error:', err));

// Socket.IO logic
handleSocket(io);

const PORT = 8088;
httpServer.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
