const { Server } = require('socket.io');
const User = require('../models/userModel');
const Message = require('../models/messageModel');


//Map to store online users ->userId,socketId
const onlineUsers = new Map();

//Map to track typing Status >userId -> [conversation]:boolean
const typingUsers = new Map();


const initializeSocket = (server) => {
    const io = new Server(server, {
        cors: {
            origin: process.env.FRONTEND_URL,
            credentials: true,
            methods: ["GET", "PUT", "DELETE", "OPTIONS", "POST"],
        },
        pingTimeout: 6000, //Disconnect inactive users or sockets after 60s.
    });

    //when a new socket connection is established
    io.on("connection", (socket) => {
        console.log(`🔌 New client connected: ${socket.id}`);
        let userId = null;


        // Handle user connection and mark them online in db
        socket.on("user_connected", async (connectingUserId) => {
            try {
                userId = connectingUserId;
                onlineUsers.set(userId, socket.id);
                socket.join(userId);  //Join a personal room for direct emit
                console.log(`✅ User ${userId} connected with socket ${socket.id}`);

                //update user status in db
                await User.findByIdAndUpdate(userId, {
                    isOnline: true,
                    lastSeen: new Date(),
                })

                //Notify All users that this user i online now
                io.emit("user_status", { userId, isOnline: true });
            } catch (error) {
                console.error("Error handling user connection", error);
            }
        });



        //Return online status of requested Users
        socket.on("get_user_status", (requestedUserId, callback) => {
            const isOnline = onlineUsers.has(requestedUserId);
            callback({
                userId: requestedUserId,
                isOnline,
                lastSeen: isOnline ? new Date() : null,
            });
        })



        // forward  message to receiver if online
        socket.on("send_message", async (message) => {
            try {
                const receiverSocketId = onlineUsers.get(message.receiver?._id);
                if (receiverSocketId) {
                    io.to(receiverSocketId).emit("receive_message", message);
                }
            } catch (error) {
                console.error("Error sending message", error);
                socket.emit("message_error", { error: "failed to send message" });
            }
        });


        //update message as read and notify sender
        socket.on("message_read", async ({ messageIds, senderId }) => {
            try {
                await Message.updateMany(
                    {
                        _id: { $in: messageIds }
                    },
                    {
                        $set: { messageStatus: "read" }
                    }
                )

                const senderSocketId = onlineUsers.get(senderId);
                if (senderSocketId) {
                    messageIds.forEach((messageId) => {
                        io.to(senderSocketId).emit("message_status_update", {
                            messageId,
                            messageStatus: "read",
                        })
                    });
                }
            } catch (error) {
                console.error('Error updating message read status', error)
            }
        })

        // Handle  typing start events and auto-stop after 3s
        socket.on("typing_start", ({ conversationId, receiverId }) => {
            if (!userId || !conversationId || !receiverId) return;
            if (!typingUsers.has(userId)) {
                typingUsers.set(userId, {});
            }

            const userTyping = typingUsers.get(userId);
            userTyping[conversationId] = true;

            //clear any exiting timeout
            if (userTyping[`${conversationId}_timeout`]) {
                clearTimeout(userTyping[`${conversationId}_timeout`])
            }

            //auto-stop after 3s
            userTyping[`${conversationId}_timeout`] = setTimeout(() => {
                userTyping[conversationId] = false;
                socket.to(receiverId).emit("user_typing", {
                    userId,
                    conversationId,
                    isTyping: false,
                })
            }, 3000);

            //Notify Receiver
            socket.io(receiverId).emit("user_typing", {
                userId,
                conversationId,
                isTyping: true,
            })
        });

        socket.on("typing_stop",({conversationId,receiverId})=>{
            if(!userId || !conversationId || !receiverId) return;
            if(typingUsers.has(userId)){
                const userTyping=typingUsers.get(userId);
                userTyping[conversationId]=false;

                if(userTyping[`${conversationId}_timeout`]){
                    clearTimeout(userTyping[`${conversationId}_timeout`])
                    delete userTyping[`${conversationId}_timeout`]
                }
            };

            socket.to(receiverId).emit("user_typing",{
                userId,
                conversationId,
                isTyping:false,
            });
        });


        //Add or update reactions on Message
        socket.on("add_reaction",async({messageId,emoji,userId,reactionUserId})=>{
            try {
                const message=await Message.findById(messageId);
                if(!message) return;

                const existingIndex=message.reactions.findIndex((r)=>r.user.toString()===reactionUserId);
                if(existingIndex > -1){
                    const existing=message.reactions(existingIndex);
                    if(existing.emoji===emoji){
                        //remove same reactions
                        message.reactions.splice(existingIndex,1)
                    }else{
                        //change Emoji
                        message.reactions[existingIndex].emoji=emoji;
                    }
                }else{
                    //add new reactions
                    message.reactions.push({user:reactionUserId,emoji});
                }

                await message.save();

                const populatedMessage=await Message.findOne(message?._id)
                .populate("sender","username profilePicture")
                .populate("receiver","username profilePicture")
                .populate("reactions.user","username")

                const reactionUpdated={
                    messageId,
                    reactions:populatedMessage.reactions
                }

                const senderSocket=onlineUsers.get(populatedMessage.sender._id.toString())
                const receiverSocket=onlineUsers.get(populatedMessage.receiver._id.toString())

                if(senderSocket) io.to(senderSocket).emit("reaction_updated",reactionUpdated);
                if(receiverSocket) io.to(receiverSocket).emit("reaction_updated",reactionUpdated);
            } catch (error) {
                console.error('Error Hnadling reactions',error);
            }
        })

        // Handle disconnect
        const handleDisconnected=async()=>{
            if(!userId) return;

            try {
                onlineUsers.delete(userId);

                //clear all typing timeouts
                if(typingUsers.has(userId)){
                    const userTyping=typingUsers.get(userId);
                    Object.keys(userTyping).forEach((key)=>{
                        if(key.endsWith('_timeout')) clearTimeout(userTyping[key])
                    })

                    typingUsers.delete(userId);
                }

                await User.findByIdAndUpdate(userId,{
                    isOnline:false,
                    lastSeen:new Date(),
                })

                io.emit("user_status",{
                    userId,
                    isOnline:false,
                    lastSeen:new Date(),
                })

                socket.leave(userId),
                console.log(`User ${userId} Disconnected...`);
            } catch (error) {
                console.error('Error Handling Disconnection',error);
            }
        }

        //disconnect event
        socket.on("disconnect",handleDisconnected);
    });
    //attach the online user map to socket server for external user
    io.socketUserMap=onlineUsers;

    return io;
};

module.exports = {
    initializeSocket
};
