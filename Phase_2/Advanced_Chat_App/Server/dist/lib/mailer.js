"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.transporter = void 0;
const nodemailer_1 = __importDefault(require("nodemailer"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
exports.transporter = nodemailer_1.default.createTransport({
    host: "smtp.gmail.com",
    port: 465, // use 465 for SSL
    secure: true,
    auth: {
        user: process.env.SMTP_USER, // Gmail address
        pass: process.env.SMTP_PASS, // App password
    },
    tls: {
        rejectUnauthorized: false, // for development only, allows self-signed certs
    },
    connectionTimeout: 10000, // 10 seconds
});
