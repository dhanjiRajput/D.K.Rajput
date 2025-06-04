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
exports.login = exports.register = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const user_model_1 = __importDefault(require("../models/user.model"));
const register = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { username, password } = req.body;
    const hashed = yield bcrypt_1.default.hash(password, 10);
    const user = yield user_model_1.default.create({ username, password: hashed });
    res.json(user);
});
exports.register = register;
const login = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { username, password } = req.body;
    const user = yield user_model_1.default.findOne({ username });
    if (!user) {
        res.status(404).json({ error: 'User not found' });
        return;
    }
    const match = yield bcrypt_1.default.compare(password, user.password);
    if (!match) {
        res.status(403).json({ error: 'Invalid credentials' });
        return;
    }
    const token = jsonwebtoken_1.default.sign({ id: user._id }, process.env.JWT_SECRET);
    res.json({ token, userId: user._id });
});
exports.login = login;
