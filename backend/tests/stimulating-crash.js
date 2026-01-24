import { RedisQueue } from '../src/core/RedisQueue.js';
import { RedisWorker } from '../src/workers/RedisWorker.js';
import { taskHandlers } from '../src/handlers/index.js';
import Redis from 'ioredis';

console.log('=== Worker Crash Simulation ===\n');

// Setup
const submitterRedis = new Redis({ host: 'localhost', port: 6379 });
const submitterQueue = new RedisQueue(submitterRedis);
const workerQueue = new RedisQueue();

// Clean
await submitterRedis.del('tasks:pending');
const keys = await submitterRedis.keys('task:*');
if (keys.length > 0) await submitterRedis.del(...keys);

console.log('✅ Cleaned\n');

// Create worker
const worker = new RedisWorker('Worker-1', workerQueue, taskHandlers);
worker.start();

await new Promise(resolve => setTimeout(resolve, 500));

// Submit a task that takes 3 seconds
console.log('📋 Submitting email task (takes 3 seconds)...\n');
await submitterQueue.submit({
  type: 'send_email',
  payload: {
    to: 'user@example.com',
    from: 'app@example.com',
    subject: 'Test',
    content: 'Test'
  },
  userId: 'user_1'
});

console.log('✅ Task submitted!\n');

// Wait 1 second (task is now processing) 
await new Promise(resolve => setTimeout(resolve, 1000));

console.log('💥 SIMULATING WORKER CRASH!\n'); // we are killing the task in the middle by simulating
console.log('(Killing worker while task is processing...)\n');

// Force crash - don't call stop(), just exit
process.exit(1);