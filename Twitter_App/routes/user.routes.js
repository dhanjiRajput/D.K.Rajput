const {Router}=require("express");
const { createUser, userLogin, getUser, getUserByUserName, signupPage, loginPage, logoutUser} = require("../controllers/user.controller");
const requireLogin = require("../middleware/require.login");

const userRoutes=Router();


userRoutes.get("/signup",signupPage);
userRoutes.get("/login",loginPage);
userRoutes.post("/signup",createUser);
userRoutes.post("/login",userLogin);
userRoutes.get('/me',requireLogin,getUser);
userRoutes.get('/:username',getUserByUserName);
userRoutes.get('/logout',logoutUser);

module.exports=userRoutes;