const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const amqp = require('amqplib');
const path = require('path');

const app = express();
const PORT = process.argv[2] || 3000;

const server = http.createServer(app);
const io = new Server(server);

const RABBITMQ_URL = 'amqp://localhost'; // Replace with your RabbitMQ URL
const EXCHANGE_NAME = 'chat_exchange';

let channel;

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, 'public')));

// Connect to RabbitMQ
async function connectRabbitMQ() {
    const connection = await amqp.connect(RABBITMQ_URL);
    channel = await connection.createChannel();

    // Assert a fanout exchange
    await channel.assertExchange(EXCHANGE_NAME, 'fanout', { durable: false });

    // Assert a temporary queue for this instance
    const q = await channel.assertQueue('', { exclusive: true });

    // Bind the queue to the exchange
    await channel.bindQueue(q.queue, EXCHANGE_NAME, '');

    console.log('Connected to RabbitMQ');

    // Consume messages from the queue
    channel.consume(q.queue, (msg) => {
        if (msg !== null) {
            const data = JSON.parse(msg.content.toString());
            console.log(`Received message:`, data);
            io.emit('chat_message', data);
            channel.ack(msg);
        }
    });
}

io.on('connection', (socket) => {
    console.log('New client connected');

    socket.on('chat_message', async (msg) => {
        const data = { message: msg, timestamp: new Date(), sender: PORT };
        console.log(`Received message from user on port ${PORT}:`, msg);

        // Publish message to the exchange
        if (channel) {
            channel.publish(EXCHANGE_NAME, '', Buffer.from(JSON.stringify(data)));
        }
    });

    socket.on('disconnect', () => {
        console.log('Client disconnected');
    });
});

// Start the server and connect to RabbitMQ
server.listen(PORT, async () => {
    console.log(`🚀 Server started on port ${PORT}`);
    await connectRabbitMQ();
});
