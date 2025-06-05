import { createClient } from 'redis';

const publisher = createClient();

export async function publishNotification(message: string) {
  await publisher.connect();
  await publisher.publish('notifications', message);
  await publisher.quit();
};
