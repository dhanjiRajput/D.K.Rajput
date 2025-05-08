const mongoose=require("mongoose");
require("dotenv").config();


const DB_URL=process.env.DB_URL;
const dbConnect=async()=>{
    await mongoose.connect(DB_URL);
    console.log("Database Connected Successfully...");
}

module.exports=dbConnect;