import express from 'express';
import 'dotenv/config';
import path from 'path';
import cors from 'cors';
import { fileURLToPath } from 'url';
import router from './Routes/authRoutes.js';

const app=express();

//this conversion because of using type mofule
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

//Inbulit Middleware
app.use(express.json());
app.use(cors());
app.use(express.urlencoded({extended:false}));
app.use(express.static(path.join(__dirname, "public")));
app.use('/uploads', express.static('uploads'));

app.get("/",(req,res)=>{
    return res.json({message:"Hello Guys, Server is runnning"})
});

//Import Auth Routes
app.use('/api',router);

const PORT=process.env.PORT;
app.listen(PORT,()=>{
    console.log("Sevrer Started on Port at,",PORT);
});