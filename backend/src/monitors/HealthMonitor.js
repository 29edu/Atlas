
import Redis from "ioredis";
import { Task } from "../core/Task.js";

class HealthMonitor {
    constructor(queue) {
        this.queue = queue;
        this.isRunning = false;
        this.checkInterval = null;
        this.WORKER_TIMEOUT = 30000; 
        this.deadTask = [];
    }

    async start(){
        console.log("Starting the health Monitoring System...")
    
        this.isRunning = true;
        this.intervalCheck = setInterval(() => {
            this.checkWorkerHealth();
        }, 30000)
        
    }
    
    async checkWorkerHealth() {
        
        const allTask = await this.queue.redis.key('task:*');

        allTask.array.forEach(async element => {

            const task = await this.queue.redis.hgetall(`task:${element}`);
            const fromRedisTask = Task.fromRedis(task);

            if(fromRedisTask.status === 'processing') {

                const workerId = fromRedisTask.workerId;
                const worker = await this.queue.redis.hgetall(`worker:${workerId}`);

                const isworkeralive = await this.isWorkerAlive(workerId);
                if(!isworkeralive) {
                    await this.recoverOrphanedTask(task.uniqueId);
                } else {
                    console.log("Worker is working fine");
                }
            }
            });
    }
        

    async isWorkerAlive(workerId){
        const worker = await this.queue.redis.hgetall(`worker:${workerId}`);

        const currTime = new Date();
        const workerLastSeen = new Date(worker.lastSeen);
        if(currTime - workerLastSeen > 30000) { // time difference will come in ms
            return false;
        } else {
            return true;
        }
    }

    async recoverOrphanedTask(taskId) {
        console.log('Recovering orphaned task: $')

        const task = await this.queue.redis.hgetall(`task:${taskId}`);
        const taskObject = Task.fromRedis(task);
        taskObject.status = "pending";
        taskObject.workerId = null;
        const redisObjectTask = taskObject.toRedis();
        this.queue.hset(`task:${taskId}`, ...Object.entries(redisObjectTask).flat());
        this.queue.lpush(this.queue.name, taskId);
    }

    async stop() {
        console.log('Stopping HealthMonitor')
        this.isRunning = false;
    }
}

export default {HealthMonitor}

// Mistake 
// I was substracting worker last seen and current time in ISOString(), but i cannot substract in ISO string
// taskObject.toRedis() is a method so we are using like this
// Use async and await properly