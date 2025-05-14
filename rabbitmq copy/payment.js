const amqp=require('amqplib');
const { json } = require('express');

async function sendMail() {
    try {
        const connection=await amqp.connect("amqp://localhost");
        const channel=await connection.createChannel();
        const exchanage="notification_exchange";
        const queue="payment_queue";


        await channel.assertExchange(exchanage,"topic",{durable:true});
        await channel.assertQueue(queue,{durable:true});

        await channel.bindQueue(queue,exchanage,"payment.*");

        console.log("waiting for message");

        channel.consume(
            queue,
            (msg)=>{
                if(msg!=null){
                    console.log(`[Payment Notification] msg was consumed    with routing key as ${msg.fields.routingKey} and content as ${msg.content.toString()} `);
                    channel.ack(msg);
                }
            }
        );
            
    } catch (error) {
        console.log(error);
    }
};

sendMail();