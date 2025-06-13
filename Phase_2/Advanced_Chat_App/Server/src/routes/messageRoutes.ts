import { Router } from "express";
import { protectRoutes } from "../middleware/auth";
import { getMessages, getuserForSidebar, markMessageAsSeen, sendMessage } from "../controllers/messageController";
const messageRouter=Router();

messageRouter.get("/users",protectRoutes,getuserForSidebar);
messageRouter.get("/:id",protectRoutes,getMessages);
messageRouter.get("/mark/:id",protectRoutes,markMessageAsSeen);
messageRouter.post("/send/:id",protectRoutes,sendMessage);

export default messageRouter;