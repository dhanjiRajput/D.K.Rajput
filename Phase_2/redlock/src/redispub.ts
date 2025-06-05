import Redlock from 'redlock';
import {redisClient} from './redisclient';

// const redlock=new Redlock(
//   [redisClient],
//   {
//   retryCount: 3,
//   retryDelay: 200, // time in ms
//   driftFactor: 0.01,
//   automaticExtensionThreshold: 500,
// });

export async function publishNotification(message:string){
  //this code for multiple client or user query
  // const lock = await redlock.acquire(['locks:notifications'], 2000);
  // console.log('Lock acquired publishing:',message);
  // await redisClient.publish('notifications', message);
  // await lock.release();
  // console.log('Lock released after publishing:', message);


  //this oce for single client or user query
  const lockKey = 'locks:notifications';
const isLocked = await redisClient.set(lockKey, 'locked', { NX: true, PX: 2000 });

if (isLocked) {
  console.log('Lock acquired manually. Publishing...');
  await redisClient.publish('notifications', message);
  await redisClient.del(lockKey);
} else {
  console.log('Another process holds the lock. Skipping publish.');
}
};