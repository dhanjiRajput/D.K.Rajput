import {createClient } from 'redis';
const publisher = createClient();

await publisher.connect();

setInterval(async()=>{
    const message=`Hello, this is a message from the publisher at ${new Date().toISOString()}`;
    await publisher.publish('chatroom', message);
    console.log(`Published message: ${message}`);
},2000);