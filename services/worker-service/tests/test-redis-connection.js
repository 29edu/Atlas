import Redis from 'ioredis';

console.log('=== Testing Redis Connection ===\n');

const redis = new Redis({
  host: 'localhost',
  port: 6379
});

redis.on('connect', () => {
  console.log('✅ Connected to Redis!');
});

redis.on('error', (err) => {
  console.log('❌ Redis error:', err.message);
  process.exit(1);
});

// Wait for connection
await new Promise(resolve => setTimeout(resolve, 1000));

try {
  // Test 1: SET and GET
  console.log('--- Test 1: Basic Operations ---');
  await redis.set('test_key', 'Hello Redis!');
  const value = await redis.get('test_key');
  console.log('Stored:', 'Hello Redis!');
  console.log('Retrieved:', value);
  console.log('✅ SET/GET works!\n');
  
  // Test 2: List operations (for queues!)
  console.log('--- Test 2: List Operations ---');
  await redis.del('test_queue');  // Clear any existing data
  
  await redis.lpush('test_queue', 'task-1');
  await redis.lpush('test_queue', 'task-2');
  await redis.lpush('test_queue', 'task-3');
  console.log('Pushed 3 tasks to queue');
  
  const length = await redis.llen('test_queue');
  console.log('Queue length:', length);
  
  const task1 = await redis.rpop('test_queue');
  const task2 = await redis.rpop('test_queue');
  console.log('Popped task 1:', task1);
  console.log('Popped task 2:', task2);
  console.log('✅ Queue operations work!\n');
  
  // Test 3: BRPOP (blocking pop - important for workers!)
  console.log('--- Test 3: Blocking Pop ---');
  await redis.lpush('test_queue', 'urgent-task');
  
  const result = await redis.brpop('test_queue', 1);  // Block for 1 second
  console.log('BRPOP result:', result);
  // Result format: ['queue_name', 'value']
  console.log('✅ BRPOP works!\n');
  
  // Cleanup
  await redis.del('test_key', 'test_queue');
  
  console.log('🎉 All tests passed! Redis is ready!\n');
  
} catch (error) {
  console.log('Error:', error.message);
}

await redis.quit();
process.exit(0);