const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');

const app = express();
app.use(cors());

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*", // For development, allow all origins
    methods: ["GET", "POST"]
  }
});

const users = {}; // Track users by socket.id

io.on('connection', (socket) => {
  console.log('New client connected:', socket.id);

  // When a user joins a room
  socket.on('joinRoom', ({ username, room }) => {
    socket.join(room);
    users[socket.id] = { username, room };

    // Welcome message to the user
    socket.emit('message', { user: 'System', text: `Welcome ${username}!` });

    // Broadcast to others in room
    socket.to(room).emit('message', {
      user: 'System',
      text: `${username} has joined the chat`
    });

    // Send updated user list to all in the room
    io.to(room).emit('userList', getUsersInRoom(room));
  });

  // When a user sends a message
  socket.on('sendMessage', (message) => {
    const user = users[socket.id];
    if (user) {
      io.to(user.room).emit('message', {
        user: user.username,
        text: message
      });
    }
  });

  // When a user starts typing
  socket.on('typing', ({ room, user }) => {
    socket.to(room).emit('typing', user);
  });

  // When a user stops typing
  socket.on('stopTyping', (room) => {
    socket.to(room).emit('stopTyping', users[socket.id]?.username);
  });

  // When a user disconnects
  socket.on('disconnect', () => {
    const user = users[socket.id];
    if (user) {
      io.to(user.room).emit('message', {
        user: 'System',
        text: `${user.username} has left the chat`
      });
      // Send updated user list after user disconnects
      io.to(user.room).emit('userList', getUsersInRoom(user.room));
      delete users[socket.id];
    }
    console.log('Client disconnected:', socket.id);
  });

  // Helper function to get list of users in a room
  function getUsersInRoom(room) {
    return Object.values(users).filter(user => user.room === room).map(user => user.username);
  }
});

const PORT = 3000;
server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
