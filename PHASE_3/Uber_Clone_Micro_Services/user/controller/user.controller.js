const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const userModel = require('../models/user.model');
const blackListModel = require('../models/blackList.model');
const { subscribeToQueue } = require('../service/rabbitMq');
const EventEmitter = require('events');
const rideEventEmitter = new EventEmitter();

exports.register = async (req, res) => {
    try {
        const { name, email, password } = req.body;
        // Check if email already exists
        const existingUser = await userModel.findOne({ email });
        if (existingUser) {
            return res.status(409).json({ message: "Email is already registered." });
        };

        const hash=await bcrypt.hash(password,10);
        const newUser=await userModel.create({
            name,
            email,
            password:hash,
        })

        const token=jwt.sign({
            id:newUser._id
        },process.env.JWT_SECRET);

        res.cookie('token',token);

        res.send({message:"User Registered Successfully..",token,newUser})

    } catch (error) {
        res.status(500).json({message:error.message});
    }
};

exports.login=async(req,res)=>{
    try {
        const { email, password } = req.body;
        const user = await userModel.findOne({ email });
        if (!user) {
            return res.status(401).json({ message: "Invalid email or password." });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: "Invalid email or password." });
        }

        const token = jwt.sign(
            { id: user._id },
            process.env.JWT_SECRET
        );

        //this will remove password from response
        delete user._doc.password;

        res.cookie('token', token);

        res.send({ message: "Login successful.",token,user });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.logout=async(req,res)=>{
    try {
        const token = req.cookies.token;
        if (!token) {
            return res.status(400).json({ message: "No token found." });
        }

        await blackListModel.create({ token });

        res.clearCookie('token');
        res.send({ message: "Logout successful." });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.profile=async(req,res)=>{
    res.status(200).json(req.user);
};

exports.acceptedRide = async (req, res) => {
    let responded = false;

    const timer = setTimeout(() => {
        if (!responded) {
            responded = true;
            res.status(204).send(); // No ride accepted in 30s
        }
    }, 30000);

    rideEventEmitter.once('ride-accepted', (data) => {
        if (!responded) {
            responded = true;
            clearTimeout(timer);
            res.send(data);
        }
    });
};

subscribeToQueue('ride-accepted',async(msg)=>{
    const data=msg;
    rideEventEmitter.emit('ride-accepted',data);
})