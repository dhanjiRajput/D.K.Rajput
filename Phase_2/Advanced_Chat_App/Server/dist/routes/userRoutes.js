"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const userController_1 = require("../controllers/userController");
const auth_1 = require("../middleware/auth");
const userRouter = (0, express_1.Router)();
userRouter.post('/signup', userController_1.signup);
userRouter.post('/login', userController_1.login);
userRouter.put('/update-profile', auth_1.protectRoutes, userController_1.updateProfile);
userRouter.get('/check', auth_1.protectRoutes, userController_1.checkAuth);
userRouter.post('/logout', auth_1.protectRoutes, userController_1.logout);
exports.default = userRouter;
