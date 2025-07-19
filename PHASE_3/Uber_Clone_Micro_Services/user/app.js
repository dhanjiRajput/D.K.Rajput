const dotenv=require('dotenv');
dotenv.config();
const express=require('express');
const cookiParser=require('cookie-parser');
const userRoutes = require('./routes/user.routes');
const dbConnection = require('./Config/db');
const app=express();

//database 
dbConnection();


app.use(express.json());
app.use(express.urlencoded({extended:true}))
app.use(cookiParser());

app.use("/",userRoutes);

module.exports=app;