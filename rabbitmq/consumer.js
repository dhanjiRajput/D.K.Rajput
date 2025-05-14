const amqp=require('amqplib');
const { json } = require('express');

async function sendMail() {
    try {
        const connection=await amqp.connect("amqp://localhost");
        const channel=await connection.createChannel();

        await channel.assertQueue("subscribed_user_mail_queue",{durable:false});
        channel.consume("subscribed_user_mail_queue",(message)=>{
            if(message!=null){
                console.log("Receve Message",JSON.parse(message.content));
                channel.ack(message);
            }
        })
            
    } catch (error) {
        console.log(error);
    }
};

sendMail();