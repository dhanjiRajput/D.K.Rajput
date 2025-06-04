import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import path from 'path';
import { subscriber, publisher } from './redis';

interface ChatMessage {
  room: string;
  username: string;
  text: string;
}

const app = express();
const server = http.createServer(app);
const io = new Server(server);
app.use(express.static(path.join(__dirname, '../public')));

// Redis: Subscribe to wildcard channel pattern
subscriber.psubscribe('room:*');

subscriber.on('pmessage', (pattern, channel, message) => {
  const [, room] = channel.split(':');
  const parsed: ChatMessage = JSON.parse(message);
  io.to(room).emit('chat_message', parsed); // emit to socket.io room
});

io.on('connection', (socket) => {
  console.log('User connected');

  socket.on('join_room', ({ room, username }: { room: string; username: string }) => {
    socket.join(room);
    socket.data.username = username;
    socket.data.room = room;
    console.log(`${username} joined room: ${room}`);
  });

  socket.on('send_message', (text: string) => {
    const room = socket.data.room;
    const username = socket.data.username;
    if (!room || !username) return;

    const msg: ChatMessage = { room, username, text };
    publisher.publish(`room:${room}`, JSON.stringify(msg));
  });

  socket.on('disconnect', () => {
    console.log('User disconnected');
  });
});

server.listen(3000, () => {
  console.log('Server is running at http://localhost:3000');
});
