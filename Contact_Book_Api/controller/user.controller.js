const Joi = require("joi");
const PasswordComplexity=require("joi-password-complexity");
const bcrypt=require("bcrypt");
const jwt=require("jsonwebtoken");
const User = require("../model/user.model");
require("dotenv").config();

const KEY=process.env.KEY;

const complexityOptions = {
    min: 6,
    max: 30,
    lowerCase: 1,
    upperCase: 1,
    numeric: 1,
    symbol: 1,
    requirementCount: 4, // how many of the above are required
};

const createUser=async(req,res)=>{
    const {email,password}=req.body;

    const {error}=validateUser(req.body);
    if(error) return res.status(400).send(error.message);

    const valid=await User.findOne({email});
    if(valid) return res.status(400).send("User Already Registerd.... try another one");

    const hashedpassword=await bcrypt.hash(password,10);
    req.body.password=hashedpassword;
    const user=await User.create(req.body);

    const token=jwt.sign({
        id:user.id,
        username:user.username,
        email:user.email,
    },KEY);
    
    res.header('x-auth-token',token).send(user);
};

const userLogin=async(req,res)=>{
    const {email,password}=req.body;
    const valid=await User.findOne({email});
    if(!valid) return res.send("User Not Found...");

    const isMatch=await bcrypt.compare(password,valid.password);
    if(!isMatch) return res.send("Incorrect Password....");

    const token=jwt.sign({
        id:valid.id,
        email:valid.email,
        admin:valid.admin,
    },KEY);
    
    res.header('x-auth-token',token).send(valid);
}

module.exports={createUser,userLogin}

const validateUser=(user)=>{
    const schema=Joi.object({
        username:Joi.string().required().min(3).max(255),
        email:Joi.string().required().email(),
        password: PasswordComplexity(complexityOptions).required(),
    });

    return schema.validate(user);
}