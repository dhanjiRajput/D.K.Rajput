const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const blackListModel = require('../models/blackList.model');
const captainModel = require('../models/captain.model');
const { subscribeToQueue } = require('../service/rabbitMq');

const pendingRequest = [];

exports.register = async (req, res) => {
    try {
        const { name, email, password } = req.body;
        // Check if email already exists
        const existingUser = await captainModel.findOne({ email });
        if (existingUser) {
            return res.status(409).json({ message: "Email is already registered." });
        };

        const hash = await bcrypt.hash(password, 10);
        const newCaptain = await captainModel.create({
            name,
            email,
            password: hash,
        })

        const token = jwt.sign({
            id: newCaptain._id
        }, process.env.JWT_SECRET);

        res.cookie('token', token);

        res.send({ message: "Captain Registered Successfully..", token, newCaptain })

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const captain = await captainModel.findOne({ email });
        if (!captain) {
            return res.status(401).json({ message: "Invalid email or password." });
        }

        const isMatch = await bcrypt.compare(password, captain.password);
        if (!isMatch) {
            return res.status(401).json({ message: "Invalid email or password." });
        }

        const token = jwt.sign(
            { id: captain._id },
            process.env.JWT_SECRET
        );

        //this will remove password from response
        delete captain._doc.password;

        res.cookie('token', token);

        res.send({ message: "Login successful.", token, captain });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.logout = async (req, res) => {
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

exports.profile = async (req, res) => {
    res.status(200).json(req.captain);
};

exports.toggleAvailability = async (req, res) => {
    try {
        const captainId = req.captain._id;
        const captain = await captainModel.findById(captainId);
        if (!captain) {
            return res.status(404).json({ message: "Captain not found." });
        }

        captain.isAvailable = !captain.isAvailable;
        await captain.save();

        res.status(200).json({
            message: "Availability status updated.",
            isAvailable: captain.isAvailable
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.waitForNewRide = async (req, res) => {
    //set timeout for long polling
    req.setTimeout(30000, () => {
        res.status(204).end();
    });

    //Add the response object to the pendingRequest array
    pendingRequest.push(res);
};


subscribeToQueue("new-ride", (data) => {
    console.log("Send Ride Data from user to captain", data);
    const rideData = data;

    //send the new ride data to all pending request
    pendingRequest.forEach(res => {
        res.json(rideData);
    });

    //clear the pending request
    pendingRequest.length = 0;
});