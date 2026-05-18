import Redis from 'ioredis';

console.log('=== Checking for Orphaned Tasks ===\n');

const redis = new Redis({ host: 'localhost', port: 6379 });

// Get all task keys
const taskKeys = await redis.keys('task:*');

console.log(`Found ${taskKeys.length} tasks in Redis\n`);

for (const key of taskKeys) {
  const taskData = await redis.hgetall(key);
  
  console.log(`📋 Task ${taskData.id}:`);
  console.log(`   Type: ${taskData.type}`);
  console.log(`   Status: ${taskData.status}`);
  console.log(`   Started: ${taskData.startedAt}`);
  console.log(`   Completed: ${taskData.completedAt}`);
  
  if (taskData.status === 'processing') {
    const startedTime = new Date(taskData.startedAt);
    const now = new Date();
    const elapsed = (now - startedTime) / 1000;
    
    console.log(`   ⚠️  ORPHANED! Been processing for ${elapsed.toFixed(0)} seconds!`);
  }
  console.log('');
}

// Check queue
const queueLength = await redis.llen('tasks:pending');
console.log(`📊 Queue has ${queueLength} pending tasks`);

await redis.quit();
process.exit(0);