const jwt=require('jsonwebtoken');
const blackListModel = require('../models/blackList.model');
const captainModel = require('../models/captain.model');



exports.authCaptain=async(req,res,next)=>{
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
        
        const captain=await captainModel.findById(decoded.id);
        
        req.captain=captain;
        return next();
    } catch (error) {
        return res.status(401).json({message:"UnAuthorized"});
    }
};