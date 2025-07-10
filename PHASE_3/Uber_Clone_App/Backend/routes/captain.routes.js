const express=require('express');
const captainRoutes=express.Router();
const captainController=require('../controllers/captain.controller');
const {body}=require('express-validator');

captainRoutes.post('/register',[
    body('email').isEmail().withMessage('Inavlid Email'),
    body('fullname.firstname').isLength({min:3}).withMessage('First Name must be at least 3 characters long'),
    body('password').isLength({min:6}).withMessage('Password Must be a least  6 Character..'),
    body('vehicle.color').isLength({min:3}).withMessage('Color Must be atleast 3 character'),
    body('vehicle.plate').isLength({min:3}).withMessage('Plate Must be atleast 3 character'),
    body('vehicle.capacity').isInt({min:1}).withMessage('Capacity must be atleast 1'),
    body('vehicle.vehicleType').isIn(['car','motorcycle','auto']).withMessage('Invalid Vehicle Type'),
],captainController.registerCaptain);

captainRoutes.post('/login',[
    body('email').isEmail().withMessage('Inavlid Email'),
    body('password').isLength({min:6}).withMessage('Password Must be a least  6 Character..'),
],captainController.loginCaptain);


module.exports=captainRoutes;