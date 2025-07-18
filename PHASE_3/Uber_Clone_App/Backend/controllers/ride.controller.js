const rideService = require('../services/ride.services');
const mapService=require('../services/maps.services');
const { validationResult } = require('express-validator');
const {sendMessageToSocketId}=require('../socket');
const rideModel = require('../models/ride.model');

exports.createRide = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    

    const { pickup, destination, vehicleType } = req.body;

    
    try {
        const ride = await rideService.createRide({ user: req.user._id, pickup, destination, vehicleType });
        res.status(201).json(ride);

        const pickupCordinates=await mapService.getAddressCoordinates(pickup);
        console.log("Pickup Cordiantes :-",pickupCordinates);
        
        const captainInRadius=await mapService.getCaptainInTheRadius(pickupCordinates.ltd,pickupCordinates.lng,100)

        ride.otp="";

        const rideWithUSer=await rideModel.findOne({_id:ride._id}).populate("user");

        captainInRadius.map(captain=>{
            sendMessageToSocketId(captain.socketId,{
                event:"new-ride",
                data:rideWithUSer
            })
        });
        
    } catch (error) {
        console.error("Error creating ride:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

exports.getFares=async(req,res)=>{
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { pickup, destination } = req.query;

     try {
        const fare = await rideService.getFare( pickup, destination);
        return res.status(201).json(fare);
    } catch (error) {
        console.error("Error creating ride:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

exports.confirmRide = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { rideId } = req.body;

    try {
        const ride = await rideService.confirmRide({ rideId, captain: req.captain });

        sendMessageToSocketId(ride.user.socketId, {
            event: 'ride-confirmed',
            data: ride
        })

        return res.status(200).json(ride);
    } catch (err) {

        console.log(err);
        return res.status(500).json({ message: err.message });
    }
};

exports.startRide = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { rideId, otp } = req.query;

    try {
        const ride = await rideService.startRide({ rideId, otp, captain: req.captain });

        console.log(ride);

        sendMessageToSocketId(ride.user.socketId, {
            event: 'ride-started',
            data: ride
        })

        return res.status(200).json(ride);
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
};

exports.endRide = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { rideId } = req.body;

    try {
        const ride = await rideService.endRide({ rideId, captain: req.captain });

        sendMessageToSocketId(ride.user.socketId, {
            event: 'ride-ended',
            data: ride
        })
        return res.status(200).json(ride);
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
};