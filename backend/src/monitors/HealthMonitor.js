
import Redis from "ioredis";
import { Task } from "../core/Task.js";

class HealthMonitor {
    constructor(queue) {
        this.queue = queue;
        this.isRunning = this.isRunning;
        this.checkInterval = null;
        this.WORKER_TIMEOUT = 30000; 
    }

    async start(){
        console.log("Starting the health Monitoring System...")
    
        const intervalCheck = setInterval(() => {
            this.checkWorkerHealth();
        }, 30000)
        
    }
    
    async checkWorkerHealth() {
        
        const allTask = await this.queue.get('task:*');
        allTask.array.forEach(element => {
            const task = this.queue.hgetall(element);
            const fromRedisTask = Task.fromRedis(task);

            if(fromRedisTask.status === 'processing') {
                const workerId = fromRedisTask.workerId;

                const worker = this.queue.hgetall(workerId);
                
                
            }
        });
        
    }

    async isWorkerAlive(workerId){

    }

    async recoverOrphanedTask(taskId) {
        console.log('Recovering orphaned task: $')
    }

    async stop() {
        clearInterval(this.intervalId);
        console.log("Stopping the health monitoring");
    }
}