const mongoose=require('mongoose');
const jwt=require('jsonwebtoken');
const bcrypt=require('bcrypt');

const userSchema=new mongoose.Schema({
    fullname:{
        firstname:{
            type:String,
            required:true,
            minlength:[3,'First Name Must be at least 3 charachter long..'],
        },
        lastname:{
            type:String,
            minlength:[3,'Last Name Must be at least 3 charachter long..'],
        },
    },
    email:{
        type:String,
        required:true,
        unique:true,
    },
    password:{
        type:String,
        required:true,
        select:false,
    },
    socketId:{
        type:String
    },
});


//This is instance method this we can call after the create model instance
userSchema.methods.generateAuthToken=function(){
    const token=jwt.sign({_id:this._id},process.env.JWT_SECRET,{expiresIn:'24h'});
    return token;
};

userSchema.methods.comparePassword=async function(password){
    return await bcrypt.compare(password,this.password);
};

//This is static method this we can call directly
userSchema.statics.hashPassword=async function(password) {
    return await bcrypt.hash(password,10);
};

const userModel=mongoose.model('user',userSchema);
module.exports=userModel;