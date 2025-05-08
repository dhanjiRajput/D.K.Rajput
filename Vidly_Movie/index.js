const express=require("express");
const dbConnect = require("./config/db");
const genreRoutes = require("./routes/genre.routes");
const movieRoutes = require("./routes/movie.routes");
const customerRoutes = require("./routes/customer.routes");
const rentalRoutes = require("./routes/rental.routes");
const userRoutes = require("./routes/user.routes");
require("dotenv").config();
const app=express();

app.use(express.json());
app.use(express.urlencoded({extended:true}));

app.use('/api/users',userRoutes);
app.use('/api/genres',genreRoutes);
app.use('/api/movies',movieRoutes);
app.use('/api/customers',customerRoutes);
app.use('/api/rentals',rentalRoutes);

const PORT=process.env.PORT||3000;
app.listen(PORT,()=>{
    console.log("Server has Started on port.",PORT);
    dbConnect();
});