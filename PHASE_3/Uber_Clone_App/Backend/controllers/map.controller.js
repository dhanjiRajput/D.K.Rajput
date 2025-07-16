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

exports.getDistanceTime = async (req, res) => {
    // const errors = validationResult(req);
    // if (!errors.isEmpty()) {
    //     return res.status(400).json({ errors: errors.array() });
    // }

    // const { origin, destination } = req.query;

    // if (!origin || !destination) {
    //     return res.status(400).json({ error: 'Origin and destination are required' });
    // }

    // try {
    //     // Assuming a function exists in mapsService to get distance and time
    //     const distanceTime = await mapsService.getDistanceAndTime(origin, destination);
    //     return res.status(200).json(distanceTime);
    // } catch (error) {
    //     return res.status(500).json({ error: error.message });
    // }

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { fromLat, fromLng, toLat, toLng } = req.query;

    if (!fromLat || !fromLng || !toLat || !toLng) {
        return res.status(400).json({ error: 'Query params fromLat, fromLng, toLat, toLng are required' });
    }

    try {
        const from = [parseFloat(fromLat), parseFloat(fromLng)];
        const to = [parseFloat(toLat), parseFloat(toLng)];

        const distanceData = await mapsService.getDistanceAndTime(from, to);
        return res.status(200).json(distanceData);
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};

exports.getSuggestions = async (req, res) => {
    // const errors = validationResult(req);
    // if (!errors.isEmpty()) {
    //     return res.status(400).json({ errors: errors.array() });
    // }

    // const { input } = req.query;

    // if (!input) {
    //     return res.status(400).json({ error: 'Input is required' });
    // }

    // try {
    //     // Assuming a function exists in mapsService to get suggestions
    //     const suggestions = await mapsService.getSuggestions(input);
    //     return res.status(200).json(suggestions);
    // } catch (error) {
    //     return res.status(500).json({ error: error.message });
    // }

    const query = req.query.query; // ✅ must match frontend param
    if (!query || query.trim() === '') {
        return res.status(400).json({ error: 'Query is required' });
    }

    try {
        const suggestions = await mapsService.getSuggestions(query);
        res.json(suggestions);
    } catch (error) {
        console.error("Autocomplete Error:", error.message);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};