const express=require('express');
const dotenv=require('dotenv');
const cors=require('cors');
const cookie=require('cookie-parser');
const connectToDb = require('./db/db');
const userRouter = require('./routes/user.routes');
const captainRoutes = require('./routes/captain.routes');
const mapsRouter = require('./routes/maps.routes');
dotenv.config();
const app=express();

//Databse Connection
connectToDb();

//Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(cookie());


app.get('/',(req,res)=>{
    res.send('Welcome to the future...')
});
app.use('/users',userRouter);
app.use('/captains',captainRoutes);
app.use('/maps',mapsRouter);

module.exports=app;