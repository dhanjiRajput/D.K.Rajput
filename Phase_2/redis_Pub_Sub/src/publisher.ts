// src/publisher.ts
import { publisher } from './redis';

const CHANNEL = 'chat_messages';

function sendMessage(msg: string) {
  publisher.publish(CHANNEL, msg);
}

// Send a message every 5 seconds
setInterval(() => {
  const msg = `Message @ ${new Date().toLocaleTimeString()}`;
  console.log('Publishing:', msg);
  sendMessage(msg);
}, 5000);
