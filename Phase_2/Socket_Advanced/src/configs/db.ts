import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();


const DB_URL= process.env.DB_URL;

if (!DB_URL) {
  throw new Error("DB_URL environment variable is not defined");
}

const dbConnect = async () => {
    await mongoose.connect(DB_URL);
    console.log("Database connected successfully"); 
};

export default dbConnect;