const express=require('express');
const authMiddleWare = require('../middleware/authMiddleware');
const { multerMiddleware } = require('../config/cloudinary');
const { sendMessage, getConversation, getMessages, markAsRead, deleteMessage, updateMessage } = require('../controllers/messageController');
const messageRoutes=express.Router();

messageRoutes.post('/send-message',authMiddleWare,multerMiddleware,sendMessage);
messageRoutes.get('/conversations',authMiddleWare,getConversation);
messageRoutes.get('/conversations/:conversationId/messages',authMiddleWare,getMessages);
messageRoutes.put('/messages/read',authMiddleWare,markAsRead);
messageRoutes.delete('/messages/:messageId',authMiddleWare,deleteMessage);
messageRoutes.put('/messages/update/:messageId',authMiddleWare,updateMessage);



module.exports=messageRoutes;