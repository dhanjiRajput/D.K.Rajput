const express = require('express');
const mapsRouter = express.Router();
const authMiddleware = require('../middleware/auth.middleware');
const mapsController = require('../controllers/map.controller');
const { query } = require('express-validator');

mapsRouter.get('/get-coordinates', authMiddleware.authUser, [
    query('address').isString().isLength({ min: 3 }).withMessage('Address is required')
], mapsController.getCoordinates);

mapsRouter.get('/get-distance-time', authMiddleware.authUser, [
    query('fromLat').notEmpty().withMessage('fromLat is required'),
    query('fromLng').notEmpty().withMessage('fromLng is required'),
    query('toLat').notEmpty().withMessage('toLat is required'),
    query('toLng').notEmpty().withMessage('toLng is required'),
], mapsController.getDistanceTime);

mapsRouter.get('/get-suggestions', authMiddleware.authUser, [
    query('input').isString().isLength({ min: 3 }).withMessage('Input is required')
], mapsController.getSuggestions);

module.exports = mapsRouter;