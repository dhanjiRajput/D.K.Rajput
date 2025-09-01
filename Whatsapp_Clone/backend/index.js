const express = require('express');
const cors = require('cors');
const http=require('http');
const cookieParser=require('cookie-parser');
const bodyParser=require('body-parser');
const dotenv =require('dotenv');
const dbConnection = require('./config/db');
const authRoutes = require('./routes/authRoute');
const messageRoutes = require('./routes/messageRoute');
const { initializeSocket } = require('./services/socketService');
const statusRoutes = require('./routes/statusRoute');
dotenv.config();


const app = express();

const corsOption={
    origin:process.env.FRONTEND_URL,
    credentials:true,
}
app.use(cors(corsOption));
app.use(express.json()); // Parse body data
app.use(cookieParser()); // Parse token on every request
app.use(bodyParser.urlencoded({extended:true}));

//create Server
const server=http.createServer(app);
const io=initializeSocket(server);

//apply socket middleware before routes
app.use((req,res,next)=>{
    req.io=io;
    req.socketUserMap=io.socketUserMap
    next();
})

app.use('/api/auth',authRoutes);
app.use('/api/chats',messageRoutes);
app.use('/api/status',statusRoutes);



const PORT = process.env.PORT || 8000;
server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    dbConnection();
});