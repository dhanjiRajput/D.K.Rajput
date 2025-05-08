require('dotenv').config();
const jwt=require("jsonwebtoken");

const KEY=process.env.KEY;
const validateUser=(req,res,next)=>{
    const token=req.header('x-auth-token');
    if(!token) return res.status(400).send("Access Denied");

    try {
        const decode=jwt.verify(token,KEY);
        req.user=decode;
        next();
    } catch (error) {
        return res.status(400).send('Invalid Token..');
    }
}

module.exports=validateUser;