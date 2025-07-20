const express=require('express');
const rideRoutes=express.Router();
const authMiddleware=require('../Middleware/authMiddleware');
const rideController=require("../controllers/ride.controller");

rideRoutes.post("/create-ride",authMiddleware.authUser,rideController.createRide);
rideRoutes.put("/accept-ride",authMiddleware.authCaptain,rideController.acceptRide);

module.exports=rideRoutes;