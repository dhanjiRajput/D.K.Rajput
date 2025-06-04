const express=require('express');
const axios=require('axios');
const client = require('./client');
const app=express();

app.get('/',async(req,res)=>{
    const cachevalue=await client.get('todos');
    if(cachevalue) return res.json(JSON.parse(cachevalue));


 const {data}=await axios.get("https://jsonplaceholder.typicode.com/todos");

 await client.set("todos",JSON.stringify(data));
 client.expire("todos",30);

  let secondsLeft = 30;
    const interval = setInterval(() => {
        console.log(`Data will expire in ${secondsLeft} seconds`);
        secondsLeft--;
        if (secondsLeft <= 0) clearInterval(interval);
    }, 1000);
 
 return res.json(data);
})

app.listen(9000);