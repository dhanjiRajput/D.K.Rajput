const express = require('express');
const http = require('http');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);

// Add CORS options for Socket.IO
const io = new Server(server, {
    cors: {
        origin: '*', // Allow all origins. Change to specific origin if needed.
        methods: ['GET', 'POST']
    }
});

// Serve a simple homepage
app.get('/', (req, res) => {
    res.send('Socket.IO server is running');
});

const emailToSocketIdMap=new Map();
const SocketIdToEmailMap=new Map();

// Socket.IO connection handler
io.on('connection', (socket) => {
    console.log('A user connected:', socket.id);

    socket.on('room:join',data=>{
        const {email,room}=data
        emailToSocketIdMap.set(email,socket.id)
        SocketIdToEmailMap.set(socket.id,email)
        io.to(room).emit('user:joined',{email,id:socket.id});
        socket.join(room);
        //Second event From  server send new event to client with this data... go to client
        io.to(socket.id).emit('room:join',data);
    });

    socket.on('disconnect', () => {
        console.log('User disconnected:', socket.id);
    });
});

// Start the server
const PORT = process.env.PORT || 8000;
server.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
});