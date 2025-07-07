import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import dbConnection from './config/db.js';
import { clerkMiddleware } from '@clerk/express';
import clerkWebHooks from './controllers/clerkWebHooks.js';
dbConnection();
const app = express();
app.use(cors()); //Enable Cross-Origin Resources Sharing
//Middleware
app.use(express.json());
app.use(clerkMiddleware());
//Api To Listen clerkWebhooks
app.use("/api/clerk", clerkWebHooks);
app.get('/', (req, res) => {
    res.send("Welcome to the Future.....");
});
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
