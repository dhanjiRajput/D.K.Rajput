import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import connectDB from './config/db.js';
import {clerkMiddleware} from '@clerk/express';
import clerkWebHooks from './controllers/clerkWebhooks.js';

connectDB();

const app=express();
app.use(cors());

//Middleware
app.use(express.json());
app.use(clerkMiddleware());

//API to listen to clerk webhooks
app.use('/api/clerk',clerkWebHooks);

app.get("/",(req,res)=> res.send("Welcome to the future..."));

const PORT=process.env.PORT || 3000;
app.listen(PORT,()=> console.log(`Server running  on port ${PORT}`));