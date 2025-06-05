import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import path from 'path';
import { publishNotification } from './redispub';
import { subscriberToChannel } from './redissub';

const app = express();
const server = createServer(app);
const io = new Server(server);

app.use(express.static(path.join(__dirname, '../public')));

setInterval(() => {
    publishNotification(`Notification at ${new Date().toLocaleTimeString()}`);
},5000);

io.on('connection', (socket) => {
    console.log('Client Connected:', socket.id);
});

subscriberToChannel(io);

server.listen(3000, () => {
    console.log('Server is running on http://localhost:3000');
});