const rideModel = require('../models/ride.model');
const axios = require('axios');
const crypto = require('crypto');

// Generate OTP
async function generateOtp(num) {
    return crypto.randomInt(Math.pow(10, num - 1), Math.pow(10, num)).toString();
}

// Get Fares for all vehicle types
async function getFare(from, to) {
    try {
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

        return fares;
    } catch (error) {
        console.error("Error calculating fare:", error.message);
        throw new Error("Unable to calculate fare at this moment. Please try again later.");
    }
}

// Create Ride
async function createRide({ user, pickup, destination, vehicleType }) {
    try {
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
    } catch (error) {
        console.error("Error creating ride:", error.message);
        throw new Error("Ride creation failed. Please try again.");
    }
}

async function confirmRide({ rideId, captain }) {
    try {
        if (!rideId) {
            throw new Error('Ride id is required');
        }

        await rideModel.findOneAndUpdate(
            { _id: rideId },
            { status: 'accepted', captain: captain._id }
        );

        const ride = await rideModel.findOne({ _id: rideId })
            .populate('user')
            .populate('captain')
            .select('+otp');

        if (!ride) {
            throw new Error('Ride not found');
        }

        return ride;
    } catch (error) {
        console.error("Error confirming ride:", error.message);
        throw new Error("Ride confirmation failed.");
    }
}

async function startRide({ rideId, otp, captain }) {
    try {
        if (!rideId || !otp) {
            throw new Error('Ride id and OTP are required');
        }

        const ride = await rideModel.findOne({ _id: rideId })
            .populate('user')
            .populate('captain')
            .select('+otp');

        if (!ride) {
            throw new Error('Ride not found');
        }

        if (ride.status !== 'accepted') {
            throw new Error('Ride not accepted');
        }

        if (ride.otp !== otp) {
            throw new Error('Invalid OTP');
        }

        await rideModel.findOneAndUpdate({ _id: rideId }, { status: 'ongoing' });

        return ride;
    } catch (error) {
        console.error("Error starting ride:", error.message);
        throw new Error("Unable to start ride. Please check the OTP and try again.");
    }
}

module.exports = {
    getFare,
    createRide,
    confirmRide,
    startRide,
};
