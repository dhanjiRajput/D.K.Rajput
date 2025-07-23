// pubsub/publisher.js
import client from '../redisClient.js';

export const publishMessage = async (channelName, msg) => {
  try {
    await client.publish(channelName, msg);
    console.log(`📢 Published to ${channelName}: ${msg}`);
  } catch (err) {
    console.error('❌ Failed to publish:', err);
  }
};