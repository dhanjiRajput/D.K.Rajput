const { default: axios } = require('axios');
const jwt=require('jsonwebtoken');


exports.authUser=async(req,res,next)=>{
    const token=req.cookies.token || req.headers.authorization?.split(' ')[1];
    if(!token){
        return res.status(401).json({message:"UnAuthorized"});
    };

    try {
        const decoded=jwt.verify(token,process.env.JWT_SECRET);
        
        const response=await axios.get(`${process.env.BASE_URL}/user/profile`,{
            headers:{
                Authorization:`Bearer ${token}`
            }
        });

        const user=response.data;

        if(!user){
            return res.status(401).json({message:"UnAuthorized.."})
        }
        req.user=user;
        next();
    } catch (error) {
        return res.status(401).json({message:"UnAuthorized"});
    }
};

exports.authCaptain=async(req,res,next)=>{
    const token=req.cookies.token || req.headers.authorization?.split(' ')[1];
    if(!token){
        return res.status(401).json({message:"UnAuthorized"});
    };

    try {
        const decoded=jwt.verify(token,process.env.JWT_SECRET);
        
        const response=await axios.get(`${process.env.BASE_URL}/captain/profile`,{
            headers:{
                Authorization:`Bearer ${token}`
            }
        });

        const captain=response.data;
        
        req.captain=captain;
        return next();
    } catch (error) {
        return res.status(401).json({message:"UnAuthorized"});
    }
};