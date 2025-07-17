const rideModel = require('../models/ride.model');
const axios = require('axios');
const crypto = require('crypto');

// Generate OTP
async function generateOtp(num) {
    return crypto.randomInt(Math.pow(10, num - 1), Math.pow(10, num)).toString();
}

// Get Fares for all vehicle types
async function getFare(from, to) {
    console.log(`Calculating fare from ${from} to ${to}`);

    if (!from || !to) {
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

    const baseFares = { auto: 30, car: 50, moto: 20 };
    const perKmRates = { auto: 10, car: 15, moto: 8 };
    const perMinRates = { auto: 1, car: 2, moto: 0.5 };

    const fares = {};
    for (const type in baseFares) {
        fares[type] = Math.round(
            baseFares[type] +
            distanceInKm * perKmRates[type] +
            durationInMin * perMinRates[type]
        );
    }

    return fares; // { auto: 265, car: 414, moto: 201 }
}

// Create Ride
async function createRide({ user, pickup, destination, vehicleType }) {
    if (!user || !pickup || !destination || !vehicleType) {
        throw new Error("All fields are required: user, pickup, destination, vehicleType");
    }

    const fare = await getFare(pickup, destination);
    console.log("All Fares..:-", fare);

    const otp = await generateOtp(6);

    const ride = await rideModel.create({
        user,
        pickup,
        destination,
        vehicleType,
        otp,
        fare: fare[vehicleType],
    });

    return ride;
}

// ✅ Correct export:
module.exports = {
    getFare,
    createRide,
};
