
const handlError=(err,req,res,next)=>{
    res.status(500).send("Something Failed..");
}
module.exports=handlError;