"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
require("dotenv/config");
const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY;
// Function to generate a token for a user
const generateToken = (userId) => {
    if (!JWT_SECRET_KEY) {
        throw new Error("JWT_SECRET_KEY is not defined in environment variables.");
    }
    const token = jsonwebtoken_1.default.sign({ userId }, JWT_SECRET_KEY);
    return token;
};
exports.generateToken = generateToken;
