import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import "dotenv/config";
import http from 'http';
import { connectDB } from './lib/db';
import userRouter from './routes/userRoutes';
import messageRouter from './routes/messageRoutes';
import {Server} from 'socket.io';


//Create Express App and HTTP Server
const app = express();
const server=http.createServer(app);

//Middlewarre Setup
app.use(cors({ origin: 'http://localhost:5173', credentials: true }));
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//Initialize socket.io server
export const io=new Server(server,{
  cors: {
    origin: "http://localhost:5173", // <--- same frontend origin
    credentials: true,              // <--- allow sending cookies with socket
  }
})

app.set("io",io);

//store online users
export const userSocketMap: { [userId: string]: string } = {};

//socket.io connection handler
io.on("connection",(socket)=>{
  const userId = socket.handshake.query.userId;
  console.log("User Connected", userId);

  if (typeof userId === "string") userSocketMap[userId] = socket.id;

  //Emit Online Users to all connected Clients
  io.emit("getOnlineUsers",Object.keys(userSocketMap));

  socket.on("disconnect",()=>{
    console.log("User Disconnected", userId);
    if (typeof userId === "string") {
      delete userSocketMap[userId];
    }
    io.emit("getOnlineUsers", Object.keys(userSocketMap));
  })
  
});


//Route setup
app.use("/api/status",(req:any,res:any)=>res.send("Server Is Alive.."));
app.use("/api/auth",userRouter);
app.use("/api/messages",messageRouter);

const PORT=process.env.PORT;
  server.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
    connectDB();
  });
 export default server;