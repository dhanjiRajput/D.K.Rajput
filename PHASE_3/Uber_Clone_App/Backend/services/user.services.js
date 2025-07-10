const userModel = require("../models/user.model");

exports.createuser=async({firstname,lastname,email,password})=>{
    if(!firstname,!email,!password){
        throw new Error('All Fiels are Requird');
    };

    const user=userModel.create({
        fullname:{
            firstname,
            lastname,
        },
        email,
        password,
    });

    return user;
};