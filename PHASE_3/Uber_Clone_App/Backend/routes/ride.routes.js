const express = require('express');
const ridesRouter = express.Router();
const {body,query}=require('express-validator');
const rideController = require('../controllers/ride.controller');
const authMiddleware=require('../middleware/auth.middleware');

ridesRouter.post('/create',[
    body('pickup').isString().isLength({ min: 1 }).withMessage('Pickup location is required'),
    body('destination').isString().isLength({ min: 1 }).withMessage('Dropoff location is required'),
    body('vehicleType').isString().isIn(['auto', 'car', 'moto']).withMessage('Invalid vehicle type')
], authMiddleware.authUser, rideController.createRide);

ridesRouter.get('/get-fare',[
    query('pickup').isString().isLength({ min: 1 }).withMessage('Pickup location is required'),
    query('destination').isString().isLength({ min: 1 }).withMessage('Dropoff location is required'),
],authMiddleware.authUser,rideController.getFares);

module.exports = ridesRouter;