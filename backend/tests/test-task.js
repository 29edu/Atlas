import { queue } from '../src/core/Queue.js';
import { Worker } from '../src/workers/Worker.js';
import { taskHandlers } from '../src/handlers/index.js';

console.log('=== Atlas Orchestrator - Complete System Test ===\n');

// Create workers
const worker1 = new Worker('Worker-1', queue, taskHandlers);
const worker2 = new Worker('Worker-2', queue, taskHandlers);

// Start workers
worker1.start();
worker2.start();

console.log('📋 Submitting tasks...\n');

// Submit email tasks
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
  type: 'send_email',
  payload: {
    to: 'user2@example.com',
    from: 'noreply@app.com',
    subject: 'Order Confirmation',
    content: 'Your order is confirmed!'
  },
  userId: 'user_456'
});

// Submit payment task
await queue.submit({
  type: 'send_payment',
  payload: {
    to: 'merchant@example.com',
    from: 'user@example.com',
    amount: 99.99
  },
  userId: 'user_789'
});

// Submit image task
await queue.submit({
  type: 'resize_image',
  payload: {
    width: 800,
    height: 600
  },
  userId: 'user_999'
});

console.log('✅ 4 tasks submitted!\n');

// Show stats every 3 seconds
const statsInterval = setInterval(() => {
  const stats = queue.getStats();
  console.log('📊 Queue Stats:', stats);
}, 3000);

// Stop after 30 seconds
setTimeout(async () => {
  console.log('\n🛑 Stopping workers...');
  await worker1.stop();
  await worker2.stop();
  clearInterval(statsInterval);
  
  console.log('\n📊 Final Stats:', queue.getStats());
  process.exit(0);
}, 30000);