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
exports.initSocket = void 0;
const redis_1 = __importDefault(require("../redis"));
const message_model_1 = __importDefault(require("../models/message.model"));
const initSocket = (io) => {
    io.on('connection', (socket) => {
        const userId = socket.handshake.query.userId;
        if (userId)
            redis_1.default.set(`user:${userId}`, socket.id);
        socket.on('message', (_a) => __awaiter(void 0, [_a], void 0, function* ({ to, content }) {
            const from = userId;
            yield message_model_1.default.create({ sender: from, receiver: to, content });
            const toSocketId = yield redis_1.default.get(`user:${to}`);
            if (toSocketId)
                io.to(toSocketId).emit('message', { from, content });
        }));
        socket.on('disconnect', () => {
            if (userId)
                redis_1.default.del(`user:${userId}`);
        });
    });
};
exports.initSocket = initSocket;
