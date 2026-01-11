
// This worker help to manage the tasks

import { RedisQueue } from "../core/RedisQueue.js";

class RedisWorker {
    constructor(name, queue, taskHandler) {
        this.name = name;
        this.queue = queue;
        this.taskHandler = taskHandler;
        this.isRunning = false;
        this.currentTask = null;
    }

    async start() {
        this.isRunning = true;
        console.log(`Redis worker ${this.name} has started`);

        try {
            while(this.isRunning) {
                const task = await this.queue.getNextTask();
                if(task) {

                    this.currentTask = task;
                    await this.procesTask(task);
                    this.currentTask = null;
                }
            }
        } catch (error) {
            console.log('Something Error in the Worker',  error);
            await this.sleep(2000);
        }
        
    }

    async procesTask(task) {
        console.log(`${this.name} redis worker is processing the task`);
        task.markStarted(); // I don't need to import Task because RedisQueue is already doing that
        try {

            const response = await this.taskHandler[task.type];

            if(!response) {
                throw new Error(`No handler for task type ${task.type}`)
            }

            await response(task.payload);
            await this.queue.completeTask(task.uniqueId);
            console.log(`The task ${task.type} has been successfully completed`);

        } catch (error) {
            console.log(`The task ${task.type} has been failed`);

            await this.queue.failTask(task.uniqueId, error.message);
        }
    }

    async stop() {
        console.log(`Stopped redis worker ${this.name}...`);
        this.isRunning = false;
        if(this.currentTask) {
            console.log(`Waiting for current task to finish`)
        }
    }

    sleep = async (ms) => {
        return new Promise((resolve) => {
            console.log(`Wait for ${ms/2000} sec to start again`)
            setTimeout(() => {
                resolve();
            }, ms)
        })
    }
}