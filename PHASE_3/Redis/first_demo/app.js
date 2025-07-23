import express from 'express';
import redlock from './lock/redlock.js';
import { publishMessage } from './pubsub/publisher.js';
import emailQueue from './queue/emailQueue.js';
const app = express();

app.use(express.json());

app.post('/send', async (req, res) => {
    const { userId, message, email } = req.body;

    try {
        const lock = await redlock.lock(`locks:message:${userId}`, 2000);
        console.log("Function got locked");
        
        await publishMessage('chat-channel', message);

        const que=await emailQueue.add({
            to: email,
            subject: 'New Message Received',
            body: message,
        });
        console.log("Email Queue :-",que.id);
        
        await lock.unlock();
        console.log("Function got Unlocked..");
        res.send('✅ Message processed, notification scheduled');
    } catch (err) {
        console.error('❌ Redlock/Processing Error:', err);
        res.status(500).send('❌ Could not acquire lock or process message');
    }
});

app.listen(3000, () => {
    console.log("Server is Running on port 3000");
});