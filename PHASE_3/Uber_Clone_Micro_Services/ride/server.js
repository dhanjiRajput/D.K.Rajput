const http=require('http');
const app=require('./app');

const server=http.createServer(app);


server.listen(3003,()=>{
    console.log("Ride Service is Running on Port at 3003");
});