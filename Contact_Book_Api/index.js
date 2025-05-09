const express=require('express');
const dbConnect = require('./config/db');
const contactRoutes = require('./routes/contact.routes');
const validateUser = require('./middleware/validateuser');
const userRoutes = require('./routes/user.routes');
const logger = require('./middleware/logger');
require('dotenv').config();
const app=express();

app.use(express.json());
app.use(express.urlencoded({extended:true}));

app.use("/api/v1/users",userRoutes);
app.use("/api/v1/contacts",validateUser,contactRoutes);

const PORT=process.env.PORT || 3000;
app.listen(PORT,()=>{
    logger.info(`Server Started On Port ${PORT}`);
    dbConnect();
});