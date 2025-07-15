const express = require('express');
const mapsRouter = express.Router();
const authMiddleware=require('../middleware/auth.middleware');
const mapsController = require('../controllers/map.controller');
const { query } = require('express-validator');

mapsRouter.get('/get-coordinates', authMiddleware.authUser, [
    query('address').isString().isLength({ min: 3 }).withMessage('Address is required')
], mapsController.getCoordinates);

module.exports = mapsRouter;