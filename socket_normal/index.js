const express = require('express');
const http = require('http');
const app = express();
const server = http.createServer(app);
const { Server } = require('socket.io');

const io = new Server(server, { cors: { origin: "*" } });

app.use(express.static('public'));

io.on('connection', (socket) => {
  console.log('A user connected');

  socket.on('user1', (msg) => {
    console.log("Received from user1:", msg);
    socket.emit('user2', "hey i m there");
  });
});

server.listen(3000, () => {
  console.log("Server Connected on http://localhost:3000");
});
