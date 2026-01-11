import { Task } from "./Task.js";
import Redis from "ioredis";

class RedisQueue {
    constructor () {
        this.redis = new Redis({
            host: 'localhost',
            port: 6379
        });
        this.queueName = 'tasks:pending';
    }

    async submit(taskData) {
        const task = new Task(taskData); //  creating task object
        const redisData = task.toRedis(); // converting to redis format
        await this.redis.hset(`task:${task.uniqueId}`, redisData); // storing in hash
        await this.redis.lpush(this.queueName, task.uniqueId); // pushing id to queue
        console.log(`Taskk submitted to Redis : ${task.uniqueId}`);
        return task;
    }
    
    async getNextTask() {
        const result = await this.redis.brpop(this.queueName, 0);

        if(!result) {
            return null;
        }

        const taskId = result[1];
        const taskData = await this.redis.hgetall(`task:${taskId}`);

        const convertedTask = await Task.fromRedis(taskData);  // convert to task Object
        convertedTask.markStarted();

        const redisData = convertedTask.toRedis();
        await this.redis.hset(`task:${taskId}`, redisData);

        return convertedTask;
    }

    async completeTask(taskId) {
        const taskData = await this.redis.hgetall(`task:${taskId}`);

        // Quick Reminder: - I can check whether the task exist or not so i can add a line to check 
        if(!taskData || !taskData.id) {
            console.log(`The task ${taskId} doesn't exist`);
            return;
        }

        const convertedTask =Task.fromRedis(taskData); 
        await convertedTask.markCompleted();
        
        // saving to redis , also to save the task to redis i need to first convert it to redis
        const redisData = convertedTask.toRedis();
        await this.redis.hset(`task:${taskId}`, redisData);
        return convertedTask;
    }

    async failTask(taskId, error) {
        const taskData = await this.redis.hgetall(`task:${taskId}`);

        if(!taskData || !taskId) {
            console.log(`The ${taskId} is not found`);
            return;
        }

        const convertedTask = Task.fromRedis(taskData);
        await convertedTask.markFailed(error);

        const redisData = convertedTask.toRedis();
        await this.redis.hset(`task:${taskId}`, redisData);

        if(convertedTask.canRetry()) {
            await this.redis.lpush(this.queueName, taskId);
            console.log(` Task ${taskId} will retry (${convertedTask.retryCount}/${convertedTask.maxRetry})`)
        } else {
            console.log(`Task ${taskId}failed permanently`);
        }
    }

    async getStatus() {
        const pending = await this.redis.llen(this.queueName);

        return {
            pending,
            processing: 0,
            completed: 0,
            failed: 0
        };
    }
}

export {
    RedisQueue
}

// Remember We use the same queue name so that only one task at a time can be performed from that queue, 
// Suppose if i use another queue name, then it will be independent from other queue name and this multiple actions can be performed 
// So two task is completing simultaneously in the different queue at the same time, thus it is advantage for completing multiple task


// string(value) - safe for all for conversion including null and undefined, never throw an error
// value.toString() - not safe for null and undefined, the program will crash
// string is preferred over toString()