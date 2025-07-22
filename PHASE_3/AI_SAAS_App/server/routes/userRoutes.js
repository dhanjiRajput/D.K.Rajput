import express from 'express';
import { auth } from '../Middleware/auth.js';
import { getPublishedCreations, getUserCreations, toggleLikeCreation } from '../controllers/userController.js';
const userRoutes=express.Router();

userRoutes.get("/get-user-creations",auth,getUserCreations);
userRoutes.get("/get-published-creations",auth,getPublishedCreations);
userRoutes.post("/toggle-like-creation",auth,toggleLikeCreation);

export default userRoutes;