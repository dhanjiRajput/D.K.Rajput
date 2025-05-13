const express=require('express');
const { getproducts } = require('./api/products');
const Redis=require('ioredis');
const app=express();

const redis=new Redis({
    host:"redis-18594.c305.ap-south-1-1.ec2.redns.redis-cloud.com",
    port:18594,
    password:"fde4tKbCTazXatdQV4apxUsebe5ob2xb"
});

redis.on('connect',()=>{
    console.log("redis connected");
});

app.get("/",(req,res)=>{
    res.send("Hello World..");
});

app.get("/products",async(req,res)=>{
    let products=await redis.exists('products');
    if(products){
        const products=await redis.get('products');
        return res.json({
            products:JSON.parse(products),
        })
    }
    products=await getproducts();
    await redis.set("products",JSON.stringify(products.products))
    res.json({products});
})

app.listen(3000,()=>{
    console.log("Server Started on Port 3000..");
})