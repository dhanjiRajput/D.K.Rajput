const mongoose=require('mongoose');

const movieSchema=new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true, 
        minlength: 5,
        maxlength: 255
      },
      genre: { 
        type:mongoose.Schema.Types.ObjectId,
        ref:"Genre",
        required: true
      },
      numberInStock: { 
        type: Number, 
        required: true,
        min: 0,
        max: 255
      },
      dailyRentalRate: { 
        type: Number, 
        required: true,
        min: 0,
        max: 255
      }
});

const Movie=mongoose.model('Movie',movieSchema);
module.exports=Movie;