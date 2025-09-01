
const jwt=require('jsonwebtoken');
const response = require('../utils/responseHandler');

const authMiddleWare=(req,res,next)=>{
    const authToken=req.cookies?.auth_token;

    if(!authToken){
        return response(res,401,"Authorization token Missing. Please provide Soon");
    }

    try {
        const decode=jwt.verify(authToken,process.env.JWT_SECRET);
        req.user=decode;
        next();
    } catch (error) {
        console.error(error);
        return response(res,401,"Invalid or expiry token...");
    }
};

module.exports=authMiddleWare;