const {Router} = require('express');
const { createBlog, getPage } = require('../controllers/user.controller');
const uploads = require('../utils/multer');
const routerss = Router();

routerss.get("/",getPage);
routerss.post("/upload",uploads.single('profilePicture'),createBlog);

module.exports = routerss;