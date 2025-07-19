const http=require('http');
const app=require('./app');

const server=http.createServer(app);

server.listen(3001,()=>{
    console.log("User Service is Running on Port at 3001");
});