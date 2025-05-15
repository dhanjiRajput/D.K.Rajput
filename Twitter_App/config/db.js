const mongoose=require('mongoose');
require('dotenv').config();

const DB_URL=process.env.DB_URL;

const dbConnection=async()=>{
    await mongoose.connect(DB_URL);
    console.log("Database Connected Successfuly...");
};

module.exports=dbConnection;