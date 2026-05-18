import { RedisQueue } from '../src/core/RedisQueue.js';
import { RedisWorker } from '../src/workers/RedisWorker.js';
import HealthMonitor  from '../src/monitors/HealthMonitor.js'
import { taskHandlers } from '../src/handlers/index.js';
import Redis from 'ioredis';

console.log('=== Complete Self-Healing System Test ===\n');

const redis = new Redis({ host: 'localhost', port: 6379 });
const queue = new RedisQueue();

// Clean
await redis.del('tasks:pending');
let keys = await redis.keys('task:*');
if (keys.length > 0) await redis.del(...keys);
let workerKeys = await redis.keys('worker:*');
if (workerKeys.length > 0) await redis.del(...workerKeys);

console.log('✅ Cleaned\n');

// Start HealthMonitor
const monitor = new HealthMonitor(queue);
await monitor.start();

// Start Worker-1
const worker1 = new RedisWorker('Worker-1', queue, taskHandlers);
worker1.start();

await new Promise(resolve => setTimeout(resolve, 1000));

// Submit tasks
console.log('📋 Submitting 3 tasks...\n');
await queue.submit({
  type: 'send_email',
  payload: { to: 'user1@example.com', from: 'app@example.com', subject: 'Test 1', content: 'Test' },
  userId: 'user_1'
});

await queue.submit({
  type: 'send_email',
  payload: { to: 'user2@example.com', from: 'app@example.com', subject: 'Test 2', content: 'Test' },
  userId: 'user_2'
});

await queue.submit({
  type: 'send_email',
  payload: { to: 'user3@example.com', from: 'app@example.com', subject: 'Test 3', content: 'Test' },
  userId: 'user_3'
});

// Wait a bit
await new Promise(resolve => setTimeout(resolve, 2000));

console.log('\n💥 SIMULATING WORKER CRASH!\n');
console.log('(Worker will stop but HealthMonitor keeps running)\n');

// Stop worker (simulate crash)
await worker1.stop();

// Wait for HealthMonitor to detect and recover (35 seconds)
console.log('⏳ Waiting 35 seconds for recovery...\n');
await new Promise(resolve => setTimeout(resolve, 35000));

// Start new worker to process recovered tasks
console.log('\n🚀 Starting Worker-2 to process recovered tasks...\n');
const worker2 = new RedisWorker('Worker-2', queue, taskHandlers);
worker2.start();

// Wait for tasks to complete
await new Promise(resolve => setTimeout(resolve, 20000));

console.log('\n🛑 Stopping everything...\n');
await worker2.stop();
await monitor.stop();

console.log('\n📊 Final Stats:', await queue.getStatus());

await queue.redis.quit();
await redis.quit();

console.log('\n🎉 DAY 3 COMPLETE! Self-healing system works!');
process.exit(0);
