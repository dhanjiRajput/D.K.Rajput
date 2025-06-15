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
exports.protectRoutes = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
require("dotenv/config");
const User_1 = __importDefault(require("../models/User"));
const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY;
//Middleware to Protect Routes
const protectRoutes = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const token = (_a = req.cookies) === null || _a === void 0 ? void 0 : _a.token;
        console.log("Token from cookies:", token);
        // If token is not present in cookies, return unauthorized
        if (!token)
            return res.status(401).json({ message: "Unauthorized" });
        if (!JWT_SECRET_KEY) {
            throw new Error("JWT secret key is not defined");
        }
        const decode = jsonwebtoken_1.default.verify(token, JWT_SECRET_KEY);
        const user = yield User_1.default.findById(decode.userId).select('-password');
        if (!user) {
            return res.status(401).json({ success: false, message: "User Not Found...." });
        }
        req.user = user;
        next();
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
exports.protectRoutes = protectRoutes;
