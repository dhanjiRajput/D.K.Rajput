const mongoose = require('mongoose');
const jwt=require('jsonwebtoken');
const bcrypt=require('bcrypt');

const captainSchema = new mongoose.Schema({
    fullname: {
        firstname: {
            type: String,
            required: true,
            minlength: [3, 'First name must be at least 3 characters'],
            trim: true,
        },
        lastname: {
            type: String,
            minlength: [3, 'Last name must be at least 3 characters'],
            trim: true,
        },
    },

    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
        match: [/.+@.+\..+/, 'Please enter a valid email'],
    },

    password: {
        type: String,
        required: true,
        select: false,
    },

    socketId: {
        type: String,
    },

    status: {
        type:String,
        enum:['active','inactive'],
        default:'inactive'
    },

    vehicle: {
        color: { 
            type: String,
            required:true,
        },
        plate: {
            type: String,
            required: true,
            unique: true,
        },
        capacity:{
            type:Number,
            required:true,
            min:[1,'Capacity must be atleast 1'],
        },
        vehicleType: {
            type: String,
            required: true,
            enum:['car','motorcycle','auto'],
        },
    },

    location: {
        ltd:{
            type:Number,
        },
        lng:{
            type:Number,
        },
    },
});

//This is instance method this we can call after the create model instance
captainSchema.methods.generateAuthToken=function(){
    const token=jwt.sign({_id:this._id},process.env.JWT_SECRET,{expiresIn:'24h'});
    return token;
};

captainSchema.methods.comparePassword=async function(password){
    return await bcrypt.compare(password,this.password);
};

//This is static method this we can call directly
captainSchema.statics.hashPassword=async function(password) {
    return await bcrypt.hash(password,10);
};

const captainModel=mongoose.model('captain',captainSchema);
module.exports=captainModel;