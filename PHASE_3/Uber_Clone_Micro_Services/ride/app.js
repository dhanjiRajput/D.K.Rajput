const dotenv=require('dotenv');
dotenv.config();
const express=require('express');
const cookiParser=require('cookie-parser');
const dbConnection = require('./Config/db');
const rideRoutes = require('./routes/ride.routes');
const { connectRabbitMQ } = require('./service/rabbitMq');
const app=express();

//database 
dbConnection();

connectRabbitMQ();

app.use(express.json());
app.use(express.urlencoded({extended:true}))
app.use(cookiParser());

app.use("/",rideRoutes);

module.exports=app;