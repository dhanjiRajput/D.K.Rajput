const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        trim: true
    },
    phoneNumber: {
        type: String,
        required: true,
        unique: true,
        sparse: true,
        trim: true
    },
    phoneSuffix: {
        type: String,
    },
    email: {
        type: String,
        lowercase: true,
        validate: {
            validator: function (email) {
                // Simple regex for email validation
                return /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(email);
            },
            message: 'Invalid email format',
        },
    },
    emailOtp:{
        type:String
    },
    emailOtpExpiry:{
        type:Date
    },
    profilePicture: {
        type: String,
        default: ''
    },
    about: {
        type: String,
        default: ''
    },
    isOnline: {
        type: Boolean,
        default: false
    },
    lastSeen: {
        type: Date,
        default: Date.now
    },
    isVerified:{
        type:Boolean,
        default:false,
    },
    agreed:{
        type:Boolean,
        default:false,
    },
}, { timestamps: true });

const User= mongoose.model('User', userSchema);
module.exports =User;