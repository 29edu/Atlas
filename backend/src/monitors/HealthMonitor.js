
import Redis from "ioredis";
import { Task } from "../core/Task.js";

class HealthMonitor {
    constructor(queue) {
        this.queue = queue;
        this.isRunning = this.isRunning;
        this.checkInterval = null;
        this.WORKER_TIMEOUT = 30000; 
        this.deadTask = [];
    }

    async start(){
        console.log("Starting the health Monitoring System...")
    
        const intervalCheck = setInterval(() => {
            this.checkWorkerHealth();
        }, 30000)
        
    }
    
    async checkWorkerHealth() {
        
        const allTask = await this.queue.get('task:*');

        while(this.isRunning) {
            allTask.array.forEach(element => {

                const task = this.queue.hgetall(element);
                const fromRedisTask = Task.fromRedis(task);

                if(fromRedisTask.status === 'processing') {
                    const workerId = fromRedisTask.workerId;

                    const worker = this.queue.hgetall(workerId);

                    const currentDate = new Date().toISOString();
                    if(currentDate - worker.lastSeen > 30) {
                        console.log(`Worker${workerId} is dead`);

                        const recoveredTask = worker.currentTask;
                        this.deadTask.push(recoveredTask)

                    } else {
                        console.log(`Worker:${workerId} is Working Properly`);
                    }
                }
            });
        }
        
        
    }

    async isWorkerAlive(workerId){
        const worker = this.queue.hgetall(workerId);

        const currTime = new Date().toISOString();
        if(currTime - worker.lastSeen > 30) {
            return false;
        } else {
            return true;
        }
    }

    async recoverOrphanedTask(taskId) {
        console.log('Recovering orphaned task: $')

        const task = this.queue.hgetall(taskId);
        const taskObject = Task.fromRedis(task);
        taskObject.status = "pending";
        taskObject.workerId = null;
        const redisObjectTask = Task.toRedis(taskObject);
        this.queue.lpush(`task:${taskId}`, redisObjectTask);
    }

    async stop() {
        console.log('Stopping HealthMonitor')
        this.isRunning = false;
    }
}