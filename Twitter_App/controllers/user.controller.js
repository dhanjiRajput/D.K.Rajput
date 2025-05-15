const Joi = require("joi");
const PasswordComplexity=require("joi-password-complexity")

const bcrypt=require("bcrypt");
const jwt=require("jsonwebtoken");
const User = require("../models/user.model");
require("dotenv").config();

const KEY=process.env.KEY;

const complexityOptions = {
    min: 6,
    max: 30,
    lowerCase: 1,
    upperCase: 1,
    numeric: 1,
    symbol: 1,
    requirementCount: 4,
};

const signupPage=async(req, res) =>res.render('signup', { title: 'Login' });

const loginPage=async(req, res) => res.render('login', { title: 'Login' });

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
    req.session.userId = user._id;

    res.cookie("token", token, {
        httpOnly: true
    });
    res.redirect("http://localhost:8090/api/v1");
    
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
    },KEY);
    
    req.session.userId = valid._id;
    res.redirect("http://localhost:8090/api/v1");
};

const getUser=async (req, res) => {
  const user = await User.findById(req.session.userId);
  res.json(user);
};

const getUserByUserName= async (req, res) => {
  const user = await User.findOne({ username: req.params.username });
  if (!user) return res.status(404).json({ message: 'User not found' });
  const tweets = await Tweet.find({ author: user._id })
    .sort({ createdAt: -1 })
    .populate('author', 'username')
    .populate('comments.user', 'username');
  res.json({ user, tweets });
};

module.exports={createUser,userLogin,getUser,getUserByUserName,signupPage,loginPage}

const validateUser=(user)=>{
    const schema=Joi.object({
        username:Joi.string().required().min(3).max(255),
        email:Joi.string().required().email(),
        password: PasswordComplexity(complexityOptions).required(),
    });

    return schema.validate(user);
}