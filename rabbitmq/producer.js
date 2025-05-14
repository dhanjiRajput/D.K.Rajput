const amqp=require('amqplib');

async function sendMail() {
    try {
        const connection=await amqp.connect("amqp://localhost");
        const channel=await connection.createChannel();
        const exchanage="mail_exchange";
        
        const rountingkeyForSubscribe="send_mail_to_subscribed_users";
        const rountingkeyForNormal="send_mail_to_users";

        const message={
            to:"pasom93562@jazipo.com",
            from:"kidechadhanji@gmail.com",
            subject:"Hello TP Mail",
            body:"hello Guys",
        }

        await channel.assertExchange(exchanage,"direct",{durable:false});

        await channel.assertQueue("subscribed_user_mail_queue",{durable:false});
        await channel.assertQueue("user_mail_queue",{durable:false});


        await channel.bindQueue("subscribed_user_mail_queue",exchanage,rountingkeyForSubscribe);
        await channel.bindQueue("user_mail_queue",exchanage,rountingkeyForNormal);

        channel.publish(exchanage,rountingkeyForSubscribe,Buffer.from(JSON.stringify(message)));

        console.log("mail data was sent...",message);

        setTimeout(()=>{
            connection.close();
        },500)
        
    } catch (error) {
        console.log(error);
    }
};

sendMail();