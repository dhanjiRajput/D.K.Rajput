const express=require('express');
const moragn=require('morgan');

const app=express();
app.use(moragn('dev'));

app.get('/',(req,res)=>{
    for(let i=0;i<10000000000;i++){
        
    }
    res.send("Welcome to the future.....");
});

app.listen(3001,()=>{
    console.log("Server Started on Port at ",3001);
})