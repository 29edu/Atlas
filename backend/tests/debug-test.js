import { RedisQueue } from '../src/core/RedisQueue.js';
import { RedisWorker } from '../src/workers/RedisWorker.js';
import { taskHandlers } from '../src/handlers/index.js';
import Redis from 'ioredis';

console.log('=== Heartbeat Debug Test ===\n');

const redis = new Redis({ host: 'localhost', port: 6379 });
const queue = new RedisQueue();

// Clean
await redis.del('tasks:pending');
const keys = await redis.keys('task:*');
if (keys.length > 0) await redis.del(...keys);
const workerKeys = await redis.keys('worker:*');
if (workerKeys.length > 0) await redis.del(...workerKeys);

console.log('✅ Cleaned\n');

// Create worker
console.log('Creating worker...');
const worker = new RedisWorker('Worker-1', queue, taskHandlers);

console.log('Starting worker...');
worker.start();

console.log('Worker started! Waiting 35 seconds...\n');

// Check EVERY SECOND what's in Redis
let counter = 0;
const checkInterval = setInterval(async () => {
  counter++;
  console.log(`\n--- Check ${counter} (${counter} seconds elapsed) ---`);
  
  const workerKeys = await redis.keys('worker:*');
  
  if (workerKeys.length === 0) {
    console.log('❌ NO worker keys found in Redis!');
  } else {
    for (const key of workerKeys) {
      const heartbeat = await redis.hgetall(key);
      console.log('💓 Redis has:', heartbeat.lastSeen);
    }
  }
}, 1000);  // Every 1 second!

// Stop after 35 seconds
setTimeout(async () => {
  clearInterval(checkInterval);
  console.log('\n🛑 Stopping worker...\n');
  await worker.stop();
  
  await queue.redis.quit();
  await redis.quit();
  process.exit(0);
}, 35000);