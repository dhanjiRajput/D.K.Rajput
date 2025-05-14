const amqp=require('amqplib');

async function sendMail(rountingkey,message) {
    try {
        const connection=await amqp.connect("amqp://localhost");
        const channel=await connection.createChannel();
        const exchanage="notification_exchange";
        const exchanage_type="topic";

        await channel.assertExchange(exchanage,exchanage_type,{durable:true});

        channel.publish(exchanage,rountingkey,Buffer.from(JSON.stringify(message)),{persistent:true});
        console.log(" [x] Sent '%s':'%s'",rountingkey,JSON.stringify(message));
        console.log(`mail data was sent...with routing key${rountingkey} and content as${message}`);

        setTimeout(()=>{
            connection.close();
        },500)
        
    } catch (error) {
        console.log(error);
    }
};

sendMail("order.place",{orderId:12345,status:"placed"});
sendMail("payment.processed",{paymenId:67890,status:"processed"});