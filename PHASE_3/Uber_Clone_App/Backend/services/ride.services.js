
const rideModel = require('../models/ride.model');
const mapService = require('../services/maps.services');
const axios = require('axios');
const crypto=require('crypto');

async function generateOtp(num) {
    const otp=crypto.randomInt(Math.pow(10,num-1),Math.pow(10,num)).toString();
    return otp;
}

async function getFare(from, to, vehicleType) {
    console.log(`Calculating fare from ${from} to ${to} for vehicle type: ${vehicleType}`);

    if (!from || !to || !vehicleType) {
        throw new Error("Invalid input for fare calculation");
    }

    const apiKey = process.env.WEATHER_API;

    const pickup = await axios.get(`https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(from)}&appid=${apiKey}&units=metric`);
    const destination = await axios.get(`https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(to)}&appid=${apiKey}&units=metric`);

    const froms = [parseFloat(pickup.data.coord.lat), parseFloat(pickup.data.coord.lon)];
    const tos = [parseFloat(destination.data.coord.lat), parseFloat(destination.data.coord.lon)];

    const url = `https://router.project-osrm.org/route/v1/driving/${froms[1]},${froms[0]};${tos[1]},${tos[0]}?overview=false`;

    const { data } = await axios.get(url);

    const { distance, duration } = data.routes[0];

    const distanceInKm = distance / 1000;
    const durationInMin = duration / 60;

    // Fare settings
    const baseFares = {
        auto: 30,
        car: 50,
        moto: 20
    };
    const perKmRates = {
        auto: 10,
        car: 15,
        moto: 8
    };
    const perMinRates = {
        auto: 1,
        car: 2,
        moto: 0.5
    };

    if (!baseFares[vehicleType]) {
        throw new Error("Invalid vehicle type");
    }

    const fare = Math.round(
        baseFares[vehicleType] +
        (distanceInKm * perKmRates[vehicleType]) +
        (durationInMin * perMinRates[vehicleType])
    );

    return fare;
}


exports.createRide = async ({ user, pickup, destination, vehicleType }) => {
    if (!user || !pickup || !destination || !vehicleType) {
        throw new Error("All fields are required: user, pickup, destination, vehicleType");
    }

    const fare = await getFare(pickup, destination, vehicleType);
    const otp = await generateOtp(6);

    const ride = await rideModel.create({
        user,
        pickup,
        destination,
        vehicleType,
        otp,
        fare,
    });

    return ride;
};
