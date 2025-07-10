const express=require('express');
const userController=require('../controllers/user.controller');
const authMiddleware=require('../middleware/auth.middleware');
const userRouter=express.Router();
const {body}=require('express-validator');

userRouter.post('/register',[
    body('email').isEmail().withMessage('Inavlid Email'),
    body('fullname.firstname').isLength({min:3}).withMessage('First Name must be at least 3 characters long'),
    body('password').isLength({min:6}).withMessage('Password Must be a least  6 Character..')],userController.registerUser);

userRouter.post('/login',[
    body('email').isEmail().withMessage('Inavlid Email'),
    body('password').isLength({min:6}).withMessage('Password Must be a least  6 Character..')],userController.loginUser);

userRouter.get('/profile',authMiddleware.authUser,userController.getUserProfile);

userRouter.get('/logout',authMiddleware.authUser,userController.logoutUser);

module.exports=userRouter;