const express = require('express');
const app = express();
const { Server } = require('socket.io');
const http = require('http');
const cors = require('cors');

app.use(cors());

const server = http.createServer(app);
const io = new Server(server, { cors: { origin: 'http://localhost:5173', methods: ['GET', 'POST'], credentials: true } });

//this user authentication
const user=false;
io.use((socket,next)=>{
    if(user) next();
})

app.get('/', (req, res) => {
    res.send("Hello World");
});

io.on('connection', (socket) => {
    console.log("A new User Coonnected" + socket.id);

    socket.on('message',({room,message})=>{
        socket.to(room).emit('receive',message);
    })

    socket.on('join',(room)=>{
        socket.join(room)
    })

    socket.on('disconnect',()=>{
        console.log("User Disconnected",socket.id);
    })
})

server.listen(3000, () => {
    console.log("Server Started on Port 3000");
});