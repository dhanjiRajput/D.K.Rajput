const express = require("express");
const http = require("http");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: "*" }, // Allow all origins (in dev)
});

app.get("/", (req, res) => {
  res.send("Socket.IO Server Running!");
});

io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  // Receive message from client
  socket.on("message", (data) => {
    console.log("Message from client:", data);
    // Send message to all connected clients
    io.emit("message", data);
  });

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});

server.listen(3000, () => {
  console.log("Server is running on http://localhost:3000");
});
