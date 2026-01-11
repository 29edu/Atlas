import { RedisQueue } from '../src/core/RedisQueue.js';

console.log('=== Crash Recovery Test ===\n');

const queue = new RedisQueue();

// Clear any old data
console.log('🧹 Cleaning Redis...');
await queue.redis.del('tasks:pending');
const keys = await queue.redis.keys('task:*');
if (keys.length > 0) {
  await queue.redis.del(...keys);
}
console.log('✅ Redis cleaned\n');

// Submit 5 tasks
console.log('📋 Submitting 5 tasks...\n');

for (let i = 1; i <= 5; i++) {
  await queue.submit({
    type: 'send_email',
    payload: {
      to: `user${i}@example.com`,
      subject: `Email ${i}`,
      content: 'Test email'
    },
    userId: `user_${i}`
  });
}

console.log('\n📊 Stats before crash:', await queue.getStatus());

// Get one task (simulate worker starting to process)
const task = await queue.getNextTask();
console.log(`\n🔨 Worker processing: ${task.uniqueId}`);
console.log('📊 Stats after getting task:', await queue.getStatus());

console.log('\n💥 SIMULATING CRASH IN 3 SECONDS...');
console.log('💥 (Your app will exit, but Redis keeps running!)');

await new Promise(resolve => setTimeout(resolve, 3000));

console.log('\n💥💥💥 CRASH!\n');

await queue.redis.quit();
process.exit(1);  // Simulate crash!