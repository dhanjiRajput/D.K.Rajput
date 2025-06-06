const {Router} = require('express');
const { createBlog, getPage } = require('../controllers/user.controller');
const uploads = require('../utils/multer');
const userRoutes = Router();

userRoutes.get("/upload",getPage);
userRoutes.post("/upload",uploads.single('profilePicture'),createBlog);

module.exports = userRoutes;