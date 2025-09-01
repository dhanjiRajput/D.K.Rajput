const { uplodFileToCloudinary } = require("../config/cloudinary");
const Conversation = require("../models/conversationModel");
const Message = require("../models/messageModel");
const response = require("../utils/responseHandler");

const sendMessage = async (req, res) => {
    try {
        const { senderId, receiverId, content, messageStatus } = req.body;
        const file = req.file;
        const participants = [senderId, receiverId].sort();

        //CHeck if conversation already exist
        let conversation = await Conversation.findOne({ participants });

        if (!conversation) {
            conversation = new Conversation({
                participants
            });
            await conversation.save();
        }

        let imageOrVideoUrl = null;
        let contentType = null;

        //Handle File Upload
        if (file) {
            const uploadFile = await uplodFileToCloudinary(file);
            if (!uploadFile?.secure_url) {
                return response(res, 400, "Failed to Upload Media..");
            };
            imageOrVideoUrl = uploadFile?.secure_url;

            if (file.mimtype.startwith('image')) {
                contentType = 'image';
            } else if (file.mimtype.startwith('video')) {
                contentType = 'video';
            } else {
                return response(res, 400, 'UnSupported File Formaet');
            }
        } else if (content?.trim()) {
            contentType = 'text';
        } else {
            return response(res, 400, "Message Content Is required..");
        }

        const message = new Message({
            conversation: conversation?._id,
            sender: senderId,
            receiver: receiverId,
            content,
            contentType,
            imageOrVideoUrl,
            messageStatus,
        });

        await message.save();

        if (message?.content) {
            conversation.lastMessage = message?._id
        }
        conversation.unReadCount += 1;
        await conversation.save();

        const populatedMessage = await Message.findOne(message?._id)
            .populate("sender", "username profilePicture")
            .populate("receiver", "username profilePicture")

        //Emit Socket Event
        if (req.io && req.socketUserMap) {
            //Broadcasting to All Connecting User except creator
            const receiverSocketId = req.socketUserMap.get(receiverId);
            if (receiverSocketId) {
                req.io.to(receiverSocketId).emit("receive_message", populatedMessage);
                message.messageStatus = "deliever"
                await message.save();
            }
        }

        return response(res, 201, "Message Send Successfully", populatedMessage)
    } catch (error) {
        console.error(error);
        return response(res, 500, 'Internal server error.');
    }
};

//Get all Conversation
const getConversation = async (req, res) => {
    const userId = req.user.userId;
    try {
        let conversation = await Conversation.find({ participants: userId })
            .populate("participants", "username profilePicture isOnline lastSeen")
            .populate({
                path: "lastMessage",
                populate: {
                    path: "sender receiver",
                    select: "username profilePicture"
                }
            }).sort({ updatedAt: -1 })

        return response(res, 201, "Conversation Get SuccessFully...", conversation)
    } catch (error) {
        console.error(error);
        return response(res, 500, 'Internal server error.');
    }
};


//Get Messages of Specific Conversation
const getMessages = async (req, res) => {
    const { conversationId } = req.params;
    const userId = req.user.userId;

    try {
        const conversation = await Conversation.findById(conversationId);
        if (!conversation) {
            return response(res, 404, "Conversation Not Found..");
        };

        if (!conversation.participants.includes(userId)) {
            return response(res, 403, "Not Authorized to view this conversation...");
        }

        const messages = await Message.find({ conversation: conversationId })
            .populate("sender", "username profilePicture")
            .populate("receiver", "username profilePicture")
            .sort("createdAt");

        await Message.updateMany({
            conversation: conversationId,
            receiver: userId,
            messageStatus: { $in: ["send", "delivered"] },
        }, {
            $set: {
                messageStatus: "read",
            }
        })
        conversation.unReadCount = 0;
        await conversation.save();

        return response(res, 200, "Message retrived", messages);
    } catch (error) {
        console.error(error);
        return response(res, 500, 'Internal server error.');
    }
};

const markAsRead = async (req, res) => {
    const { messageIds } = req.body;
    const userId = req.user.userId;

    try {
        //get relavent message to determine senders
        let messages = await Message.find({
            _id: { $in: messageIds },
            receiver: userId,
        })
        await Message.updateMany({
            _id: { $in: messageIds },
            receiver: userId,
        }, {
            $set: {
                messageStatus: "read"
            }
        })

        //Emit Socket Event for notify to original sender
        if (req.io && req.socketUserMap) {
            for (const message of messages) {
                const senderSocketId = req.socketUserMap.get(message.sender.toString())
                if (senderSocketId) {
                    const updatedMessage = {
                        _id: message._id,
                        messageStatus: "read"
                    }
                    req.io.to(senderSocketId).emit("message_read", updatedMessage);
                    await message.save();
                }
            }
        }

        return response(res, 200, "Messages Marked as read..", messages)
    } catch (error) {
        console.error(error);
        return response(res, 500, 'Internal server error.');
    }
};

const deleteMessage = async (req, res) => {
    const { messageId } = req.params;
    const userId = req.user.userId;

    try {
        const message = await Message.findById(messageId);
        if (!message) {
            return response(res, 404, "Message Not Found")
        };

        if (message.sender.toString() !== userId) {
            return response(res, 403, "Not Authorized to delete This Message")
        }

        await message.deleteOne();

        //Emit Socket Event for delete message
        if (req.io && req.socketUserMap) {
            const receiverSocketId = req.socketUserMap.get(message.receiver.toString());
            if (receiverSocketId) {
                req.io.to(receiverSocketId).emit("message_deleted", messageId)
            }
        }

        return response(res, 200, "Message deleted Successfully..");
    } catch (error) {
        console.error(error);
        return response(res, 500, 'Internal server error.');
    }
};

const updateMessage = async (req, res) => {
    const { messageId } = req.params;
    const { content, messageStatus } = req.body;
    const userId = req.user.userId;
    const file = req.file;

    try {
        const message = await Message.findById(messageId);

        if (!message) {
            return response(res, 404, "Message not found.");
        }

        // Only the original sender can update the message
        if (message.sender.toString() !== userId) {
            return response(res, 403, "Not authorized to update this message.");
        }

        let imageOrVideoUrl = message.imageOrVideoUrl;
        let contentType = message.contentType;

        // Handle file replacement if a new one is provided
        if (file) {
            const uploadedFile = await uplodFileToCloudinary(file);

            if (!uploadedFile?.secure_url) {
                return response(res, 400, "Failed to upload media.");
            }

            imageOrVideoUrl = uploadedFile.secure_url;

            if (file.mimetype.startsWith("image")) {
                contentType = "image";
            } else if (file.mimetype.startsWith("video")) {
                contentType = "video";
            } else {
                return response(res, 400, "Unsupported file format.");
            }

            // Clear old text if media is present
            message.content = null;
        }

        // Update text if content is sent
        if (content?.trim()) {
            message.content = content;
            contentType = "text";
            imageOrVideoUrl = null; // remove media if text is updated
        }

        if (!content?.trim() && !file) {
            return response(res, 400, "Either media or content is required to update.");
        }

        // Update values
        message.imageOrVideoUrl = imageOrVideoUrl;
        message.contentType = contentType;
        if (messageStatus) {
            message.messageStatus = messageStatus;
        }

        await message.save();

        const updatedMessage = await Message.findById(messageId)
            .populate("sender", "username profilePicture")
            .populate("receiver", "username profilePicture");

            
        // Emit Socket Event for updated message
        if (req.io && req.socketUserMap) {
            const receiverSocketId = req.socketUserMap.get(message.receiver.toString());
            if (receiverSocketId) {
                req.io.to(receiverSocketId).emit("message_updated", updatedMessage);
            }
        }

        return response(res, 200, "Message updated successfully.", updatedMessage);
    } catch (error) {
        console.error(error);
        return response(res, 500, "Internal server error.");
    }
};


module.exports = { deleteMessage, markAsRead, getMessages, getConversation, sendMessage, updateMessage }