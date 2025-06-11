import { Server } from "socket.io";

export const handleSocket = (io: Server) => {
    const users = new Map<string, string>(); // socketId -> username

    io.on("connection", (socket) => {
        console.log("User connected:", socket.id);

        socket.on("join", (username: string) => {
            users.set(socket.id, username);
            broadcastUsers();
        });

        socket.on("sendMessage", (msg: string) => {
            const username = users.get(socket.id);
            if (username) {
                io.emit("newMessage", {
                    user: { id: socket.id, username }, // Make sure this is sent
                    message: msg,
                    timestamp: new Date()
                });

            }
        });

        socket.on("disconnect", () => {
            const username = users.get(socket.id);
            if (username) {
                users.delete(socket.id);
                broadcastUsers();
                io.emit("userLeft", username);
            }
        });

        const broadcastUsers = () => {
            const userList = Array.from(users.entries()).map(([id, username]) => ({
                id,
                username
            }));
            io.emit("userList", userList);
        };
    });
};
