import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import path from 'path';
import { subscribeToChannel } from './subscriber';

const app = express();
const server = createServer(app);
const io = new Server(server);

app.use(express.static(path.join(__dirname, '../public')));

io.on('connection', (socket) => {
    console.log('Client connected',socket.id);
});

subscribeToChannel(io);
server.listen(3000, () => {
    console.log('Server is running on http://localhost:3000');
});