const mongoose=require("mongoose");
const logger = require("../middleware/logger");
require("dotenv").config();


const DB_URL=process.env.DB_URL;
const dbConnect=async()=>{
    await mongoose.connect(DB_URL);
    logger.info("Database Connected Successfully...");
}

module.exports=dbConnect;