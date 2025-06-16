"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.userSocketMap = exports.io = void 0;
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
require("dotenv/config");
const http_1 = __importDefault(require("http"));
const db_1 = require("./lib/db");
const userRoutes_1 = __importDefault(require("./routes/userRoutes"));
const messageRoutes_1 = __importDefault(require("./routes/messageRoutes"));
const socket_io_1 = require("socket.io");
//Create Express App and HTTP Server
const app = (0, express_1.default)();
const server = http_1.default.createServer(app);
//Middlewarre Setup
app.use((0, cors_1.default)({ origin: 'http://localhost:5173', credentials: true }));
app.use((0, cookie_parser_1.default)());
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
//Initialize socket.io server
exports.io = new socket_io_1.Server(server, {
    cors: {
        origin: "http://localhost:5173", // <--- same frontend origin
        credentials: true, // <--- allow sending cookies with socket
    }
});
app.set("io", exports.io);
//store online users
exports.userSocketMap = {};
//socket.io connection handler
exports.io.on("connection", (socket) => {
    const userId = socket.handshake.query.userId;
    console.log("User Connected", userId);
    if (typeof userId === "string")
        exports.userSocketMap[userId] = socket.id;
    //Emit Online Users to all connected Clients
    exports.io.emit("getOnlineUsers", Object.keys(exports.userSocketMap));
    socket.on("disconnect", () => {
        console.log("User Disconnected", userId);
        if (typeof userId === "string") {
            delete exports.userSocketMap[userId];
        }
        exports.io.emit("getOnlineUsers", Object.keys(exports.userSocketMap));
    });
});
//Route setup
app.use("/api/status", (req, res) => res.send("Server Is Alive.."));
app.use("/api/auth", userRoutes_1.default);
app.use("/api/messages", messageRoutes_1.default);
const PORT = process.env.PORT;
server.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
    (0, db_1.connectDB)();
});
exports.default = server;
