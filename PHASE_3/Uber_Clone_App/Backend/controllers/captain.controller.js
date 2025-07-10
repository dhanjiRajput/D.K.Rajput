const captainModel = require("../models/captain.model");
const captainService = require("../services/captain.services");
const { validationResult } = require('express-validator');

exports.registerCaptain = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    };

    const { fullname, email, password, vehicle } = req.body;

    // Check if email already exists
    const existingCaptain = await captainModel.findOne({ email });
    if (existingCaptain) {
        return res.status(409).json({ message: "Email is already registered." });
    };

    const hashedPassword = await captainModel.hashPassword(password);

    const captain = await captainService.createCaptain({
        firstname: fullname.firstname,
        lastname: fullname.lastname,
        email,
        password: hashedPassword,
        color:vehicle.color,
        plate:vehicle.plate,
        capacity:vehicle.capacity,
        vehicleType:vehicle.vehicleType,
    });

    const token = captain.generateAuthToken();

    res.cookie('token', token);

    res.status(201).json({ token, captain });
};

exports.loginCaptain=async(req,res,next)=>{
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    };

    const {email, password } = req.body;

    // Check Captain exist in the database
    const captain = await captainModel.findOne({ email }).select('+password'); // In model password selection by default false so here added select('+password')
    if (!captain) {
        return res.status(401).json({ message: "User Not Found.." });
    };

    const isMatch=await captain.comparePassword(password);

    if(!isMatch){
        return res.status(401).json({message:"Invalid Password"});
    };

    const token=captain.generateAuthToken();

    res.cookie('token',token);

    res.status(200).json({token,captain})
};