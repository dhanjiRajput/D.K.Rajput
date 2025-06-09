"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setupSocket = setupSocket;
const socket_io_1 = require("socket.io");
function setupSocket(server) {
    const io = new socket_io_1.Server(server, {
        cors: {
            origin: '*',
        },
    });
    io.on('connection', (socket) => {
        console.log('User connected:', socket.id);
        // Listen for user registration
        socket.on('register', ({ userId, tableId }) => {
            socket.userId = userId;
            socket.tableId = tableId;
            console.log(`Registered: userId=${userId}, tableId=${tableId}`);
            // Optional: Join the user to a room based on tableId
            socket.join(tableId);
        });
        // Example: handle a message
        socket.on('send-message', (message) => {
            console.log(`User ${socket.userId} sent message: ${message} (table ${socket.tableId})`);
            if (socket.tableId) {
                // Broadcast to everyone in the same table
                socket.to(socket.tableId).emit('receive-message', {
                    userId: socket.userId,
                    message,
                });
            }
        });
        // Handle disconnection
        socket.on('disconnect', () => {
            console.log(`User disconnected: ${socket.userId}`);
        });
    });
}
