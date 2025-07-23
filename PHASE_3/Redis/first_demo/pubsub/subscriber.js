// pubsub/subscriber.js
import Redis from 'ioredis';

const subscriber = new Redis();

subscriber.subscribe('chat-channel', (err, count) => {
  if (err) {
    console.error('❌ Failed to subscribe:', err);
  } else {
    console.log(`📡 Subscribed to ${count} channel(s). Waiting for messages...`);
  }
});

subscriber.on('message', (channel, message) => {
  console.log(`📩 New Message on ${channel}: ${message}`);
});