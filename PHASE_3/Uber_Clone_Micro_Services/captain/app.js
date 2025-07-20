const dotenv=require('dotenv');
dotenv.config();
const express=require('express');
const cookiParser=require('cookie-parser');
const captainRoutes = require('./routes/captain.routes');
const dbConnection = require('./Config/db');
const { connectRabbitMQ } = require('./service/rabbitMq');
const app=express();

//database 
dbConnection();

connectRabbitMQ();


app.use(express.json());
app.use(express.urlencoded({extended:true}))
app.use(cookiParser());

app.use("/",captainRoutes);

module.exports=app;