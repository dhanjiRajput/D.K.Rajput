import mongoose from "mongoose";
import "dotenv/config";

const MONGODB_URI = process.env.MONGODB_URI;

//Function to connect the Databse
export const connectDB = async () => {
    if (!MONGODB_URI) {
        throw new Error("MONGODB_URI is not defined in environment variables.");
    }
    await mongoose.connect(MONGODB_URI);
    console.log("Database Connected Successfully....");
}