const express=require('express');
const userRoutes=express.Router();
const userController=require("../controller/user.controller");
const authMiddleware=require("../Middleware/authMiddleware");

userRoutes.post('/register',userController.register);
userRoutes.post('/login',userController.login);
userRoutes.get('/logout',authMiddleware.authUser,userController.logout);
userRoutes.get('/profile',authMiddleware.authUser,userController.profile);
userRoutes.get('/accepted-ride',authMiddleware.authUser,userController.acceptedRide);


module.exports=userRoutes;