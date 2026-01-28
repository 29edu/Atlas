
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
        this.checkInterval = setInterval(() => {
            this.checkWorkerHealth();
        }, 30000)
        
    }
    
    async checkWorkerHealth() {
        
        const allTask = await this.queue.redis.keys('task:*'); //  it will always be keys not key

        for(let taskKey of allTask) {

            const task = await this.queue.redis.hgetall(taskKey);

            // check if task exist or not
            if(!task || !task.id) {
                continue;
            }
 

            const fromRedisTask = Task.fromRedis(task);

            if(fromRedisTask.status === 'processing') {

                const workerId = fromRedisTask.workerId;
                const worker = await this.queue.redis.hgetall(`worker:${workerId}`);

                const isworkeralive = await this.isWorkerAlive(workerId);
                if(!isworkeralive) {
                    await this.recoverOrphanedTask(fromRedisTask.uniqueId);
                } else {
                    console.log("Worker is working fine");
                }
            }
        };
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
        await this.queue.redis.hset(`task:${taskId}`, ...Object.entries(redisObjectTask).flat());
        await this.queue.redis.lpush(this.queue.queueName, taskId);
    }

    async stop() {
        console.log('Stopping HealthMonitor')
        this.isRunning = false;
        clearInterval(this.checkInterval)
    }
}

export default HealthMonitor;

// Mistake 
// I was substracting worker last seen and current time in ISOString(), but i cannot substract in ISO string
// taskObject.toRedis() is a method so we are using like this
// Use async and await properly