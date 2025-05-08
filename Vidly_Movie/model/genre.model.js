const mongoose=require('mongoose');


const genreSchema=new mongoose.Schema({
    name:{
        type:String,
        minlenght:5,
        maxlength:255,
        required:true,
    }
});

const Genre=mongoose.model('Genre',genreSchema);
module.exports=Genre;



