const mongoose=require('mongoose');

const phoneSchema=new mongoose.Schema({
    number:String,
    type:{type:String,enum:["HOME","OFFICE","MOBILE"]},
});

const contactSchema=new mongoose.Schema({
    fullname:String,
    city:String,
    phones:[phoneSchema]
});

const Contact=mongoose.model("Contact",contactSchema);
module.exports=Contact;