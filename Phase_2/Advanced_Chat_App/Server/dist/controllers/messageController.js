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
exports.deleteMessage = exports.sendMessage = exports.markMessageAsSeen = exports.getMessages = exports.getuserForSidebar = void 0;
const cloudinary_1 = __importDefault(require("../lib/cloudinary"));
const Message_1 = __importDefault(require("../models/Message"));
const User_1 = __importDefault(require("../models/User"));
const server_1 = require("../server");
//Get All Users except the logged in User
const getuserForSidebar = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = req.user._id;
        const filterUsers = yield User_1.default.find({ _id: { $ne: userId } }).select("-password");
        //count number of messages not seen
        const unSeenMessages = {};
        const promises = filterUsers.map((user) => __awaiter(void 0, void 0, void 0, function* () {
            const messages = yield Message_1.default.find({ senderId: user._id, receiverId: userId, seen: false });
            if (messages.length > 0) {
                unSeenMessages[user._id.toString()] = messages.length;
            }
        }));
        yield Promise.all(promises);
        res.json({ success: true, users: filterUsers, unSeenMessages });
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
exports.getuserForSidebar = getuserForSidebar;
//Get all messages for selected users
const getMessages = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id: selectedUserId } = req.params;
        const myId = req.user._id;
        const messages = yield Message_1.default.find({ $or: [
                { senderId: myId, receiverId: selectedUserId },
                { senderId: selectedUserId, receiverId: myId },
            ] });
        yield Message_1.default.updateMany({ senderId: selectedUserId, receiverId: myId }, { seen: true });
        res.json({ success: true, messages });
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
exports.getMessages = getMessages;
//api to mark message as seen using message id
const markMessageAsSeen = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        yield Message_1.default.findByIdAndUpdate(id, { seen: true });
        res.json({ success: true });
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
exports.markMessageAsSeen = markMessageAsSeen;
//send message to selected user
const sendMessage = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { text, image } = req.body;
        const receiverId = req.params.id;
        const senderId = req.user._id;
        let imageUrl;
        if (image) {
            const uploadResponse = yield cloudinary_1.default.uploader.upload(image);
            imageUrl = uploadResponse.secure_url;
        }
        const newMessage = yield Message_1.default.create({
            senderId,
            receiverId,
            text,
            image: imageUrl,
        });
        //Emit the new message to the receiver
        const receiverSocketId = server_1.userSocketMap[receiverId];
        if (receiverSocketId) {
            server_1.io.to(receiverSocketId).emit("newMessage", newMessage);
        }
        res.json({ success: true, newMessage });
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
exports.sendMessage = sendMessage;
const deleteMessage = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const message = yield Message_1.default.findById(id);
        if (!message)
            return res.status(404).json({ success: false, message: "Message not found" });
        if (message.senderId.toString() !== req.user._id.toString()) {
            return res.status(403).json({ success: false, message: "Not allowed to delete this message" });
        }
        yield Message_1.default.findByIdAndDelete(id);
        // Emit to both sender and receiver in real-time
        const senderSocketId = server_1.userSocketMap[message.senderId.toString()];
        const receiverSocketId = server_1.userSocketMap[message.receiverId.toString()];
        [senderSocketId, receiverSocketId].forEach(socketId => {
            if (socketId) {
                server_1.io.to(socketId).emit("messageDeleted", { messageId: id });
            }
        });
        res.json({ success: true, message: "Message deleted", messageId: id });
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
});
exports.deleteMessage = deleteMessage;
