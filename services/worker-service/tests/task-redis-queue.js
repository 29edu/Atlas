import { RedisQueue } from '../src/core/RedisQueue.js';

console.log('=== Testing RedisQueue ===\n');

const queue = new RedisQueue();

// Test 1: Submit task
console.log('--- Test 1: Submit ---');
const task1 = await queue.submit({
  type: 'send_email',
  payload: { to: 'user@example.com' },
  userId: 'user_123'
});

console.log('Submitted:', task1.uniqueId);
console.log('Stats:', await queue.getStatus());
console.log('');

// Test 2: Get task
console.log('--- Test 2: Get Next Task ---');
const task2 = await queue.getNextTask();
console.log('Got task:', task2.uniqueId);
console.log('Status:', task2.status);
console.log('');

// Test 3: Complete task
console.log('--- Test 3: Complete Task ---');
await queue.completeTask(task2.uniqueId);
console.log('Completed!');
console.log('');

console.log('🎉 Basic tests passed!');
process.exit(0);