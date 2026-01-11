import { RedisQueue } from "../src/core/RedisQueue.js";

console.log("=== After Crash - Recovery Test ===\n");

const queue = new RedisQueue();

console.log("📊 Checking queue after crash...\n");

const stats = await queue.getStatus();
console.log("Stats:", stats);

if (stats.pending > 0) {
  console.log("\n🎉 SUCCESS! Tasks survived the crash!");
  console.log(`✅ ${stats.pending} tasks still in queue!`);

  console.log("\n📋 Retrieving tasks...\n");

  // Get all pending tasks
  for (let i = 0; i < stats.pending; i++) {
    const task = await queue.getNextTask();
    if (task) {
      console.log(`Task ${i + 1}: ${task.uniqueId} (${task.type})`);
      console.log(`  Payload:`, task.payload);
    }
  }

  console.log("\n✅ All tasks recovered successfully!");
  console.log("📊 Final stats:", await queue.getStatus());
} else {
  console.log("\n❌ No tasks found - something went wrong!");
}

await queue.redis.quit();
process.exit(0);
