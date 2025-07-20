const rideModel = require("../models/ride.model");
const { publishToQueue } = require("../service/rabbitMq");

exports.createRide=async(req,res)=>{
    const {pickup,destination}=req.body;

    const newRide=new rideModel({
        user:req.user._id,
        pickup,
        destination,
    })
    await newRide.save();

    publishToQueue("new-ride",newRide);

    res.send({message:"Ride Created Successfully",newRide});
};

exports.acceptRide=async(req,res)=>{
    const {rideId}=req.query;
    const ride=await rideModel.findById(rideId);
    if(!ride){
        return res.status(404).json({message:"Ride not found"});
    }
    ride.status='accepted';
    await ride.save();
    publishToQueue("ride-accepted",ride);
    res.send(ride);
};
