import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import connectDB from './config/db.js';
import {clerkMiddleware} from '@clerk/express';
import clerkWebHooks from './controllers/clerkWebhooks.js';
import userRouter from './routes/userRoutes.js';
import hotelRoutes from './routes/hotelRoutes.js';
import connectCloudinary from './config/cloudinary.js';
import roomRouter from './routes/roomRoutes.js';
import bookingRouter from './routes/bookinRoutes.js';
import { stripeWebhooks } from './controllers/stripeWebhooks.js';

connectDB();
connectCloudinary();

const app=express();
app.use(cors());

//API to listen to Stripe WebHooks
app.post('/api/stripe',express.raw({type:"application/json"}),stripeWebhooks);

//Middleware
app.use(express.json());
app.use(clerkMiddleware());

//API to listen to clerk webhooks
app.use('/api/clerk',clerkWebHooks);

app.get("/",(req,res)=> res.send("Welcome to the future..."));
app.use("/api/user",userRouter);
app.use("/api/hotels",hotelRoutes);
app.use("/api/rooms",roomRouter);
app.use("/api/bookings",bookingRouter);


const PORT=process.env.PORT || 3000;
app.listen(PORT,()=> console.log(`Server running  on port ${PORT}`));