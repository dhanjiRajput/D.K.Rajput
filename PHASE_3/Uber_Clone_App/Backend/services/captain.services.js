const captainModel = require("../models/captain.model");

exports.createCaptain = async ({ firstname, lastname, email, password, color, capacity, plate, vehicleType }) => {
    if (!firstname, !email, !password, !color, !capacity, !plate, !vehicleType) {
        throw new Error('All Fiels are Requird');
    };

    const captain = captainModel.create({
        fullname: {
            firstname,
            lastname,
        },
        email,
        password,
        vehicle: {
            color,
            capacity,
            plate,
            vehicleType,
        }
    });

    return captain;
};