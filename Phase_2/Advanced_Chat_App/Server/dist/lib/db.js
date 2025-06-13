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
exports.connectDB = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
require("dotenv/config");
const MONGODB_URI = process.env.MONGODB_URI;
//Function to connect the Databse
const connectDB = () => __awaiter(void 0, void 0, void 0, function* () {
    if (!MONGODB_URI) {
        throw new Error("MONGODB_URI is not defined in environment variables.");
    }
    yield mongoose_1.default.connect(MONGODB_URI);
    console.log("Database Connected Successfully....");
});
exports.connectDB = connectDB;
