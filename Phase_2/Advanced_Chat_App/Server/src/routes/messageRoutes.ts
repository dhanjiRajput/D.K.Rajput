import { Router } from "express";
import { protectRoutes } from "../middleware/auth";
import { deleteMessage, getMessages, getuserForSidebar, markMessageAsSeen, sendMessage } from "../controllers/messageController";
const messageRouter=Router();

messageRouter.get("/users",protectRoutes,getuserForSidebar);
messageRouter.get("/:id",protectRoutes,getMessages);
messageRouter.put("/mark/:id",protectRoutes,markMessageAsSeen);
messageRouter.post("/send/:id",protectRoutes,sendMessage);
messageRouter.delete("/delete/:id", protectRoutes, deleteMessage);

export default messageRouter;