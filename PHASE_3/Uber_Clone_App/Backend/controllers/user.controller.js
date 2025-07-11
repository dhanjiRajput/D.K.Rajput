const blacklistTokenModel = require("../models/blacklistToken.model");
const userModel = require("../models/user.model");
const userService = require("../services/user.services")
const { validationResult } = require('express-validator');
const jwt=require('jsonwebtoken');

exports.registerUser = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    };

    const { fullname, email, password } = req.body;

    // Check if email already exists
    const existingUser = await userModel.findOne({ email });
    if (existingUser) {
        return res.status(409).json({ message: "Email is already registered." });
    };

    const hashedPassword = await userModel.hashPassword(password);

    const user = await userService.createuser({
        firstname: fullname.firstname,
        lastname: fullname.lastname,
        email,
        password: hashedPassword,
    });

    const token = user.generateAuthToken();

    res.cookie('token',token);

    res.status(201).json({ token, user });
};

exports.loginUser=async(req,res,next)=>{
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    };

    const {email, password } = req.body;

    // Check User exist in the database
    const user = await userModel.findOne({ email }).select('+password'); // In model password selection by default false so here added select('+password')
    if (!user) {
        return res.status(401).json({ message: "User Not Found.." });
    };

    const isMatch=await user.comparePassword(password);

    if(!isMatch){
        return res.status(401).json({message:"Invalid Password"});
    };

    const token=user.generateAuthToken();

    res.cookie('token',token);

    res.status(200).json({token,user})
};

exports.getUserProfile=async(req,res,next)=>{
    res.status(200).json(req.user);
};

exports.logoutUser=async(req,res,next)=>{
    res.clearCookie('token');
    const token=req.cookies.token || req.headers.authorization.split(' ')[1];

    await blacklistTokenModel.create({token});

    res.status(200).json({message:"Logged Out.."});
};