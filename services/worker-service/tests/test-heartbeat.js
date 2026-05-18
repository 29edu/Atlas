import { RedisQueue } from '../src/core/RedisQueue.js';
import { RedisWorker } from '../src/workers/RedisWorker.js';
import { taskHandlers } from '../src/handlers/index.js';
import Redis from 'ioredis';

console.log('=== Testing Worker Heartbeat ===\n');

const redis = new Redis({ host: 'localhost', port: 6379 });
const queue = new RedisQueue();

// Clean
await redis.del('tasks:pending');
const keys = await redis.keys('task:*');
if (keys.length > 0) await redis.del(...keys);
const workerKeys = await redis.keys('worker:*');
if (workerKeys.length > 0) await redis.del(...workerKeys);

console.log('Cleaned\n');

// Create worker
const worker = new RedisWorker('Worker-1', queue, taskHandlers);
worker.start();

// Check heartbeats every 5 seconds
const checkInterval = setInterval(async () => {
  const workerKeys = await redis.keys('worker:*');
  
  for (const key of workerKeys) {
    const heartbeat = await redis.hgetall(key);
    
    console.log('💓 Heartbeat detected:');
    console.log('   Worker:', heartbeat.workerName);
    console.log('   Last seen:', heartbeat.lastSeen);
    console.log('   Current task:', heartbeat.currentTask || 'none');
    console.log('   Status:', heartbeat.status);
    console.log('');
  }
}, 5000);

// Stop after 25 seconds
setTimeout(async () => {
  console.log('🛑 Stopping worker...\n');
  await worker.stop();
  clearInterval(checkInterval);
  
  // Check final heartbeat
  const workerKeys = await redis.keys('worker:*');
  if (workerKeys.length > 0) {
    const finalHeartbeat = await redis.hgetall(workerKeys[0]);
    console.log('Final heartbeat status:', finalHeartbeat.status);
  }
  
  await queue.redis.quit();
  await redis.quit();
  process.exit(0);
}, 25000);