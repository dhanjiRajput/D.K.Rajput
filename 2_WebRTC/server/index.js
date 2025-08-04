const express = require('express');
const http = require('http');
const { off } = require('process');
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
        emailToSocketIdMap.set(email,socket.id);
        SocketIdToEmailMap.set(socket.id,email);

        // Join the Socket.IO room
        socket.join(room);

        // Optionally notify others in the room that this user joined
        io.to(room).emit('user:joined',{email,id:socket.id});

        // Confirm to the joining user
        io.to(socket.id).emit('room:join',data);
    });


    //After joined room page will be redirect to the room page with room id

    socket.on('user:call',({to,offer})=>{
        io.to(to).emit('incomming:call',{from:socket.id,offer});
    });

    socket.on('call:accepted',({to,ans})=>{
        io.to(to).emit('call:accepted',{from:socket.id,ans});
    });

    socket.on('peer:nego:needed',({to,offer})=>{
        io.to(to).emit('peer:nego:neededd',{from:socket.id,offer});
    });

    socket.on('peer:nego:done',({to,ans})=>{
        io.to(to).emit('peer:nego:final',{from:socket.id,ans});
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