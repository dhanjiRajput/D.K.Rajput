const express = require('express');
const ridesRouter = express.Router();
const {body,query}=require('express-validator');
const rideController = require('../controllers/ride.controller');
const authMiddleware=require('../middleware/auth.middleware');

ridesRouter.post('/create',authMiddleware.authUser,[
    body('pickup').isString().isLength({ min: 1 }).withMessage('Pickup location is required'),
    body('destination').isString().isLength({ min: 1 }).withMessage('Dropoff location is required'),
    body('vehicleType').isString().isIn(['auto', 'car', 'moto']).withMessage('Invalid vehicle type')
],  rideController.createRide);

ridesRouter.get('/get-fare',authMiddleware.authUser,[
    query('pickup').isString().isLength({ min: 1 }).withMessage('Pickup location is required'),
    query('destination').isString().isLength({ min: 1 }).withMessage('Dropoff location is required'),
],rideController.getFares);

ridesRouter.post('/confirm',authMiddleware.authCaptain,[
    body('rideId').isMongoId().withMessage('Invalid Ride Id'),
],rideController.confirmRide);

ridesRouter.get('/start-ride',authMiddleware.authCaptain,[
    query('rideId').isMongoId().withMessage('Invalid Ride Id'),
    query('otp').isString().isLength({min:6,max:6}).withMessage("Invalid OTP"),
],rideController.startRide);

ridesRouter.post('/end-ride',authMiddleware.authCaptain,[
    body('rideId').isMongoId().withMessage('Invalid ride id'),
],rideController.endRide);

module.exports = ridesRouter;