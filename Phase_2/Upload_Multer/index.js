const express= require('express');
const dbConnection = require('./config/db');
const path = require('path');
const cors=require('cors');
const userRoutes = require('./routes/user.routes');

const app = express();

app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.set("view engine","ejs");
app.set("Views",path.join(__dirname,"Views"));
app.use(express.static(path.join(__dirname, "public")));
app.use('/uploads', express.static('uploads'));

app.use("/",userRoutes);

app.listen(3000, () => {
    console.log('Server is running on port 3000');
    dbConnection();
});