const express=require('express');
const captainRoutes=express.Router();
const captainController=require("../controller/captain.controller");
const authMiddleware=require("../Middleware/authMiddleware");

captainRoutes.post('/register',captainController.register);
captainRoutes.post('/login',captainController.login);
captainRoutes.get('/logout',authMiddleware.authCaptain,captainController.logout);
captainRoutes.get('/profile',authMiddleware.authCaptain,captainController.profile);
captainRoutes.patch('/toggle-availability',authMiddleware.authCaptain,captainController.toggleAvailability);
captainRoutes.get('/new-ride',authMiddleware.authCaptain,captainController.waitForNewRide);


module.exports=captainRoutes;