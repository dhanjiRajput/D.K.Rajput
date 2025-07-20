const amqp = require('amqplib');

let channel = null;
let connection = null;

async function connectRabbitMQ(url) {
    if (channel) return channel;
    connection = await amqp.connect(url);
    channel = await connection.createChannel();
    console.log("Connected to RabbitMq..!");
    return channel;
}

async function publishToQueue(queue, message, url = 'amqp://localhost') {
    const ch = await connectRabbitMQ(url);
    await ch.assertQueue(queue, { durable: true });
    ch.sendToQueue(queue, Buffer.from(JSON.stringify(message)), { persistent: true });
}

async function subscribeToQueue(queue, onMessage, url = 'amqp://localhost') {
    const ch = await connectRabbitMQ(url);
    await ch.assertQueue(queue, { durable: true });
    ch.consume(queue, (msg) => {
        if (msg !== null) {
            onMessage(JSON.parse(msg.content.toString()));
            ch.ack(msg);
        }
    });
}

module.exports = {
    publishToQueue,
    subscribeToQueue,
    connectRabbitMQ,
};