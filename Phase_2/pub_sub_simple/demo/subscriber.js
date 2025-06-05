// subscriber.js
import { createClient } from 'redis';

const subscriber = createClient();

await subscriber.connect();

await subscriber.subscribe('chatroom', (message) => {
  console.log('Received:', message);
});
