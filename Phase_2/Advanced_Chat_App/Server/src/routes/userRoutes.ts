import { Router } from "express";
import { checkAuth, login, logout, signup, updateProfile } from "../controllers/userController";
import { protectRoutes } from "../middleware/auth";
const userRouter=Router();

userRouter.post('/signup',signup);
userRouter.post('/login',login);
userRouter.put('/update-profile',protectRoutes,updateProfile);
userRouter.get('/check',protectRoutes,checkAuth);
userRouter.post('/logout', protectRoutes,logout);

export default userRouter;