"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const http_1 = __importDefault(require("http"));
const socket_1 = require("./socket");
const app = (0, express_1.default)();
const server = http_1.default.createServer(app);
// Setup Socket.IO
(0, socket_1.setupSocket)(server);
// Basic route
app.get('/', (_req, res) => {
    res.send('Socket.IO TypeScript Server Running');
});
server.listen(5000, () => {
    console.log('Server running on http://localhost:5000');
});
