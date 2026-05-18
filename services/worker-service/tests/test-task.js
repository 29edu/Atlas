import { queue } from '../src/core/Queue.js';
import { Worker } from '../src/workers/Worker.js';
import { taskHandlers } from '../src/handlers/index.js';

console.log('=== Crash Test ===\n');

// Create worker
const worker = new Worker('Worker-1', queue, taskHandlers);

// Start worker
worker.start();

// Submit tasks
console.log('📋 Submitting 10 tasks...\n');

for (let i = 1; i <= 10; i++) {
  await queue.submit({
    type: 'send_email',
    payload: {
      to: `user${i}@example.com`,
      from: 'noreply@app.com',
      subject: `Email ${i}`,
      content: 'Test email'
    },
    userId: `user_${i}`
  });
}

console.log('✅ 10 tasks submitted!');
console.log('📊 Initial stats:', queue.getStats());

// Wait 5 seconds
await new Promise(resolve => setTimeout(resolve, 5000));

console.log('\n💥 SIMULATING CRASH IN 2 SECONDS...');
console.log('📊 Stats before crash:', queue.getStats());

await new Promise(resolve => setTimeout(resolve, 2000));

console.log('\n💥💥💥 CRASH! (Press Ctrl+C now or wait 2 sec)\n');

await new Promise(resolve => setTimeout(resolve, 2000));

// Force exit (simulates crash)
process.exit(1);