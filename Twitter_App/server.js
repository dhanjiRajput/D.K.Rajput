const express=require('express');
const dbConnection = require('./config/db');
const http=require('http');
const session= require('express-session');
const {Server}=require('socket.io');
const path=require('path');
const cors=require('cors');
const engine = require('ejs-mate');
const cookie=require("cookie-parser");
const indexRoutes = require('./routes/index.routes');
const Message = require('./models/message.model');
const User = require('./models/user.model');
require('dotenv').config();

const app=express();
const server=http.createServer(app);
const io=new Server(server,{cors:{origin:'*'}});


app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(cors());
app.use(cookie());

app.engine('ejs', engine);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
// app.set('view engine', 'ejs');
// app.set('views', path.join(__dirname, 'views'));
// app.use(express.static(path.join(__dirname,'public')));

app.use(
  session({
    secret: 'session-secret',
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false },
  })
);

app.get('/api/v1', async (req, res) => {
  const user = await User.findById(req.session.userId);
  if (!user) return res.redirect('/api/v1/users/login');
  res.render('index', { title: 'Home', user });
});

app.use("/api/v1",indexRoutes(io));

io.on('connection', (socket) => {
  socket.on('join_user_room', (userId) => {
    socket.join(userId);
  });

  socket.on('private_message', async ({ from, to, text }) => {
    const msg = await Message.create({ from, to, text });
    io.to(to).emit('private_message', msg);
    io.to(from).emit('private_message', msg);
  });
});


const PORT=process.env.PORT||8090;
server.listen(PORT,()=>{
    console.log("Server Started on Port",PORT);
    dbConnection();
});