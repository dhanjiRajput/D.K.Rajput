const jwt=require('jsonwebtoken');
const blackListModel = require('../models/blackList.model');
const userModel = require('../models/user.model');


exports.authUser=async(req,res,next)=>{
    const token=req.cookies.token || req.headers.authorization?.split(' ')[1];
    if(!token){
        return res.status(401).json({message:"UnAuthorized"});
    };

    const isBlacklisted=await blackListModel.findOne({token:token});
    if(isBlacklisted){
        return res.status(401).json({message:"UnAuthorized"});
    };

    try {
        const decoded=jwt.verify(token,process.env.JWT_SECRET);
        
        const user=await userModel.findById(decoded.id);
        
        req.user=user;
        return next();
    } catch (error) {
        return res.status(401).json({message:"UnAuthorized"});
    }
};