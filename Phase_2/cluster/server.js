const cluster=require("node:cluster");
const os=require("os");
const express=require("express");

const totalCpus=os.cpus().length;
console.log(totalCpus);

if(cluster.isPrimary){

    for(let i=0;i<totalCpus;i++){
        cluster.fork();
    }
}else{
    const app=express();
    
    app.get("/",async(req,res)=>{
        return res.json({
            message:`Hello From Express Server ${process.pid}`
        })
    })

    app.listen(3000,()=>{
        console.log("Server Started on Port no. 3000");
    });
}