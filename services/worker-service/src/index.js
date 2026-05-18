import "dotenv/config";
import { RedisQueue } from "./core/RedisQueue.js";
import { RedisWorker } from "./workers/RedisWorker.js";
import HealthMonitor from "./monitors/HealthMonitor.js";
import { taskHandlers } from "./handlers/index.js";

const queue = new RedisQueue();
const monitor = new HealthMonitor(queue);

const worker = new RedisWorker("worker-1", queue, taskHandlers);

await monitor.start();
await worker.start();

process.on("SIGTERM", async () => {
    console.log("Shutting down worker service...");
    await worker.stop();
    await monitor.stop();
    process.exit(0);
});
