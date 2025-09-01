const express=require('express');
const { sendOtp, verifiedOtp, updateProfile, logout, checkAuthenticated, getAllUsers } = require('../controllers/authController');
const authMiddleWare = require('../middleware/authMiddleware');
const { multerMiddleware } = require('../config/cloudinary');
const authRoutes=express.Router();

authRoutes.post('/send-otp',sendOtp);
authRoutes.post('/verify-otp',verifiedOtp);
authRoutes.put('/update-profile',authMiddleWare,multerMiddleware,updateProfile);
authRoutes.get('/logout',authMiddleWare,logout);
authRoutes.get('/check-auth',authMiddleWare,checkAuthenticated);
authRoutes.get('/users',authMiddleWare,getAllUsers);


module.exports=authRoutes;