import { RedisQueue } from '../src/core/RedisQueue.js';
import { RedisWorker } from '../src/workers/RedisWorker.js';
import { taskHandlers } from '../src/handlers/index.js';
import Redis from 'ioredis';

console.log('=== Redis Task Queue - Complete System Test ===\n');

// Create connections
const submitterRedis = new Redis({ host: 'localhost', port: 6379 });
const submitterQueue = new RedisQueue(submitterRedis);
const workerQueue = new RedisQueue();

// Clean Redis
console.log('🧹 Cleaning Redis...');
await submitterRedis.del('tasks:pending');
const keys = await submitterRedis.keys('task:*');
if (keys.length > 0) {
  await submitterRedis.del(...keys);
}
console.log('✅ Cleaned\n');

// Create 2 workers
const worker1 = new RedisWorker('Worker-1', workerQueue, taskHandlers);
const worker2 = new RedisWorker('Worker-2', new RedisQueue(), taskHandlers);

// Start workers
worker1.start();
worker2.start();

// Wait for workers to start
await new Promise(resolve => setTimeout(resolve, 500));

console.log('📋 Submitting 5 tasks...\n');

// Submit tasks
await submitterQueue.submit({
  type: 'send_email',
  payload: { to: 'user1@example.com', from: 'app@example.com', subject: 'Welcome!', content: 'Thanks!' },
  userId: 'user_1'
});

await submitterQueue.submit({
  type: 'send_payment',
  payload: { to: 'merchant@example.com', from: 'user@example.com', amount: 99.99 },
  userId: 'user_2'
});

await submitterQueue.submit({
  type: 'resize_image',
  payload: { width: 800, height: 600 },
  userId: 'user_3'
});

await submitterQueue.submit({
  type: 'send_email',
  payload: { to: 'user2@example.com', from: 'app@example.com', subject: 'Order Confirm', content: 'Order received' },
  userId: 'user_4'
});

await submitterQueue.submit({
  type: 'send_payment',
  payload: { to: 'vendor@example.com', from: 'customer@example.com', amount: 49.99 },
  userId: 'user_5'
});

console.log('✅ 5 tasks submitted!\n');

// Show stats every 3 seconds
const statsInterval = setInterval(async () => {
  const stats = await submitterQueue.getStatus();
  console.log('📊 Stats:', stats);
}, 3000);

// Stop after 30 seconds
setTimeout(async () => {
  console.log('\n🛑 Stopping workers...');
  await worker1.stop();
  await worker2.stop();
  clearInterval(statsInterval);
  
  console.log('\n📊 Final Stats:', await submitterQueue.getStatus());
  
  await workerQueue.redis.quit();
  await worker2.queue.redis.quit();
  await submitterRedis.quit();
  
  console.log('\n🎉 DAY 2 COMPLETE!');
  process.exit(0);
}, 30000);