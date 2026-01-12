import { RedisQueue } from '../src/core/RedisQueue.js';
import { RedisWorker } from '../src/workers/RedisWorker.js';
import { taskHandlers } from '../src/handlers/index.js';

console.log('=== Testing RedisWorker ===\n');

const queue = new RedisQueue();

// Clean Redis
console.log('🧹 Cleaning Redis...');
await queue.redis.del('tasks:pending');
const keys = await queue.redis.keys('task:*');
if (keys.length > 0) {
  await queue.redis.del(...keys);
}

console.log('✅ Redis cleaned\n');

// Create RedisWorker
const worker = new RedisWorker('RedisWorker-1', queue, taskHandlers);

// Start worker
worker.start();

console.log('📋 Submitting 3 tasks...\n');

// Submit tasks
await queue.submit({
  type: 'send_email',
  payload: {
    to: 'user1@example.com',
    from: 'noreply@app.com',
    subject: 'Welcome!',
    content: 'Thanks for signing up!'
  },
  userId: 'user_123'
});

await queue.submit({
  type: 'send_payment',
  payload: {
    to: 'merchant@example.com',
    from: 'user@example.com',
    amount: 99.99
  },
  userId: 'user_456'
});

await queue.submit({
  type: 'resize_image',
  payload: {
    width: 800,
    height: 600
  },
  userId: 'user_789'
});

console.log('✅ 3 tasks submitted!\n');

// Show stats every 3 seconds
const statsInterval = setInterval(async () => {
  const stats = await queue.getStatus();
  console.log('📊 Stats:', stats);
}, 3000);

// Stop after 20 seconds
setTimeout(async () => {
  console.log('\n🛑 Stopping worker...');
  await worker.stop();
  clearInterval(statsInterval);
  
  console.log('\n📊 Final Stats:', await queue.getStatus());
  await queue.redis.quit();
  process.exit(0);
}, 20000);