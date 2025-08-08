const express=require('express');
const authMiddleWare = require('../middleware/authMiddleware');
const { multerMiddleware } = require('../config/cloudinary');
const { createStatus, getStatuses, viewStatus, deleteStatus } = require('../controllers/statusController');
const statusRoutes=express.Router();

statusRoutes.post('/',authMiddleWare,multerMiddleware,createStatus);
statusRoutes.get('/',authMiddleWare,getStatuses);
statusRoutes.put('/:statusId/view',authMiddleWare,viewStatus);
statusRoutes.delete('/:statusId',authMiddleWare,deleteStatus);


module.exports=statusRoutes;