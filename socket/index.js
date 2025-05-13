const express=require('express');
const app=express();
const http=require('http');
const path=require('path');
const {Server}=require('socket.io');

const server=http.createServer(app);
const io=new Server(server);

app.use(express.static(path.resolve('./public')));

app.get('/',(req,res)=>{
    return res.sendFile('/public/index.html');
});

//socket.emit stands for senf the message
//socket.on stands for recive thw message

io.on('connection',(socket)=>{
    socket.on('user1',(message)=>{
        io.emit('user 2',message);
    });
});

server.listen(3000,()=>{
    console.log('server Strted on port on 3000');
});