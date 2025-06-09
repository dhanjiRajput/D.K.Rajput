import express from 'express';
import http from 'http';
import { setupSocket } from './socket';

const app = express();
const server = http.createServer(app);

// Setup Socket.IO
setupSocket(server);

// Basic route
app.get('/', (_req, res) => {
  res.send('Socket.IO TypeScript Server Running');
});

server.listen(5000, () => {
  console.log('Server running on http://localhost:5000');
});
