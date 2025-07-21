import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import { clerkMiddleware, requireAuth } from '@clerk/express'
import aiRoutes from './routes/aiRoutes.js';
import connectCloudinary from './config/cloudinary.js';
const app = express();
const PORT =process.env.PORT || 3000;

await connectCloudinary();

app.use(cors());
app.use(express.json());
app.use(clerkMiddleware())


app.get('/', (req, res) => {
    res.send('Welcome to the Future');
});

app.use(requireAuth());
app.use("/api/ai",aiRoutes);

app.listen(PORT, () => {
    console.log(`Server started on http://localhost:${PORT}`);
});