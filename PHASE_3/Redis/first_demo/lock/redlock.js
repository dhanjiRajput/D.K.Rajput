// redlock.js
import Redlock from 'redlock';
import client from '../redisClient.js';

const redlock = new Redlock([client], {
  retryCount: 3,
  retryDelay: 200,
});

export default redlock;