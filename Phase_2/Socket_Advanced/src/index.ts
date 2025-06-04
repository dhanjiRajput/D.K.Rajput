import express from 'express';
import dotenv from 'dotenv';
import http from 'http';
import cors from 'cors';
import { Server } from 'socket.io';
import dbConnect from './configs/db';
import { initSocket } from './socket';
import router from './routes/auth.routes';

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());



const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
  },
});

app.use('/api/auth',router);

initSocket(io);
const PORT = process.env.PORT || 5000;
server.listen(PORT, () =>{ 
    console.log(`Server running on port ${PORT}`);
    dbConnect();
});