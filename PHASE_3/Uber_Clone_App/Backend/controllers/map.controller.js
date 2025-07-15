const mapsService = require('../services/maps.services');
const { validationResult } = require('express-validator');

exports.getCoordinates = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { address } = req.query;

    if (!address) {
        return res.status(400).json({ error: 'Address is required' });
    }

    try {
        const coordinates = await mapsService.getAddressCoordinates(address);
        return res.status(200).json(coordinates);
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};
