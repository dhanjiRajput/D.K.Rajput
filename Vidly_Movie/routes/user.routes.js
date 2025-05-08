const {Router}=require("express");
const { createUser, userLogin } = require("../Controller/user.controller");
const userRoutes=Router();

userRoutes.post("/signup",createUser);
userRoutes.post("/login",userLogin);

module.exports=userRoutes;