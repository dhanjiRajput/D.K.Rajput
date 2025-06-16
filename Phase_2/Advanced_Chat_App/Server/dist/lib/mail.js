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
const nodemailer_1 = __importDefault(require("nodemailer"));
require("dotenv/config");
const transport = nodemailer_1.default.createTransport({
    service: "gmail",
    auth: {
        user: process.env.user,
        pass: process.env.pass,
    },
});
const sendMail = (to, subject, body) => __awaiter(void 0, void 0, void 0, function* () {
    const mailOptions = {
        from: process.env.user,
        to: to,
        subject: subject,
        html: body,
    };
    try {
        const mail = yield transport.sendMail(mailOptions);
        console.log("mail", mail);
    }
    catch (error) {
        console.error(error.message);
    }
});
exports.default = sendMail;
