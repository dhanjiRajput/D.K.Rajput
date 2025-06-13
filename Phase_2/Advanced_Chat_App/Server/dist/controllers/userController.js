"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateProfile = exports.checkAuth = exports.login = exports.signup = void 0;
const cloudinary_1 = __importDefault(require("../lib/cloudinary"));
const utils_1 = require("../lib/utils");
const User_1 = __importDefault(require("../models/User"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
//Signup New User
const signup = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { fullName, email, password, bio } = req.body;
    try {
        if (!fullName || !email || !password || !bio) {
            return res.json({ success: false, message: "Missing Details" });
        }
        const user = yield User_1.default.findOne({ email });
        if (user) {
            return res.json({ success: false, message: "Account already exist, try Another one" });
        }
        const hashed = yield bcryptjs_1.default.hash(password, 10);
        const newUser = yield User_1.default.create({
            fullName,
            email,
            password: hashed,
            bio,
        });
        const token = (0, utils_1.generateToken)(newUser._id.toString());
        res.json({ success: true, userData: newUser, token, message: "Account created Successfully....." });
    }
    catch (error) {
        if (error instanceof Error) {
            console.log(error.message);
            res.json({ success: false, message: error.message });
        }
        else {
            console.log(error);
            res.json({ success: false, message: "An error occurred" });
        }
    }
});
exports.signup = signup;
//Login User
const login = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password } = req.body;
        const userData = yield User_1.default.findOne({ email });
        if (!userData) {
            return res.json({ success: false, message: "Invalid Credentials.." });
        }
        const isPasswordMatched = yield bcryptjs_1.default.compare(password, userData.password);
        if (!isPasswordMatched) {
            return res.json({ success: false, message: "Invalid Credentials.." });
        }
        const token = (0, utils_1.generateToken)(userData._id.toString());
        res.json({ success: true, userData, token, message: "Login Successfully....." });
    }
    catch (error) {
        if (error instanceof Error) {
            console.log(error.message);
            res.json({ success: false, message: error.message });
        }
        else {
            console.log(error);
            res.json({ success: false, message: "An error occurred" });
        }
    }
});
exports.login = login;
//controller to check if user is authenticated
const checkAuth = (req, res) => {
    res.json({ success: true, user: req.user });
};
exports.checkAuth = checkAuth;
//controller to update user Profile Details using Clodinary
//1. Open Account in Cloudinary website
//2. Declare cloud_Name,api_key,and secret_key in .env file
//3. after that create here this controller updateProfile
const updateProfile = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { profilePic, bio, fullName } = req.body;
        const userId = req.user._id;
        let updatedUser;
        if (!profilePic) {
            updatedUser = yield User_1.default.findByIdAndUpdate(userId, { bio, fullName }, { new: true });
        }
        else {
            const upload = yield cloudinary_1.default.uploader.upload(profilePic);
            updatedUser = yield User_1.default.findByIdAndUpdate(userId, { profilePic: upload.secure_url, bio, fullName }, { new: true });
        }
        res.json({ success: true, user: updatedUser });
    }
    catch (error) {
        if (error instanceof Error) {
            console.log(error.message);
            res.json({ success: false, message: error.message });
        }
        else {
            console.log(error);
            res.json({ success: false, message: "An error occurred" });
        }
    }
});
exports.updateProfile = updateProfile;
