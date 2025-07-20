const mongoose=require('mongoose');

const dbConnection=async()=>{
    await mongoose.connect(process.env.MONGO_URL);
    console.log("Ride Service Connected to Database Successfully....");
};

module.exports=dbConnection;