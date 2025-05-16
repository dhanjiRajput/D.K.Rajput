const express = require('express');
const http = require('http');
const path = require('path');
const session = require('express-session');
const sharedSession = require('express-socket.io-session');
const cors = require('cors');
const { Server } = require('socket.io');
const engine = require('ejs-mate');
require('dotenv').config();

// Database connection and Models
const dbConnection = require('./config/db');
const User = require('./models/user.model');

const indexRoutes = require('./routes/index.routes');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: '*' }
});


// ========== Using inbuilt and customized Middleware  ==========
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use('/uploads', express.static(path.join(__dirname, 'public/uploads')));


// ========== View Engine Setup for Server Side Rendering Page ==========
app.engine('ejs', engine);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));


// ========== SESSION SETUP ==========
const sessionMiddleware = session({
  secret: process.env.SESSION_SECRET || 'keyboard cat',
  resave: false,
  saveUninitialized: false,
});
app.use(sessionMiddleware);
io.use(sharedSession(sessionMiddleware, { autoSave: true }));



// ========== Home Routes ==========
app.get('/api/v1', async (req, res) => {
  try {
    const user = await User.findById(req.session.userId);
    if (!user) return res.redirect('/api/v1/users/login');
    res.render('index', { title: 'Home', user });
  } catch (err) {
    res.status(500).send('Server error');
  }
});

// Getting Routes from index.routes.ejs all together
app.use('/api/v1', indexRoutes(io));

// ========== Socket Io Handles which going to connect frontend ==========
io.on('connection', (socket) => {
  console.log('New socket connected with socket Id  : ',socket.id);

  socket.on('join_user_room', (userId) => {
    console.log(`User ${userId} joined their room`);
    socket.join(userId);
  });
});

const PORT = process.env.PORT || 8090;
server.listen(PORT, async () => {
  console.log(`Server running on port ${PORT}`);
  await dbConnection();
});
