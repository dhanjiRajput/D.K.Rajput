const express=require("express");
const dbConnect = require("./config/db");
const genreRoutes = require("./routes/genre.routes");
const movieRoutes = require("./routes/movie.routes");
const customerRoutes = require("./routes/customer.routes");
const rentalRoutes = require("./routes/rental.routes");
const userRoutes = require("./routes/user.routes");
const handlError = require("./middleware/error");
const logger = require("./middleware/logger");
require("dotenv").config();
const app=express();

app.use(express.json());
app.use(express.urlencoded({extended:true}));

app.use('/api/users',userRoutes);
app.use('/api/genres',genreRoutes);
app.use('/api/movies',movieRoutes);
app.use('/api/customers',customerRoutes);
app.use('/api/rentals',rentalRoutes);
app.use(handlError);

app.use((err, req, res, next) => {
    logger.error(err.message, err);
    res.status(500).send('Something failed.');
  });

const PORT=process.env.PORT||3000;
app.listen(PORT,()=>{
    logger.info("Server has Started on port.",PORT);
    dbConnect();
});