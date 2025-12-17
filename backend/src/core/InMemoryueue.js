// Learning Goal :- Simple array based queue for learning

import { Task } from "./Task";
class InMemoryQueue {
    constructor() {
        this.tasks = []; // Array to hold all tasks
    }

    // Submit a new task to the queue
    
    async submit(taskData) {
        const task = new Task(taskData);

        // Add to the queue
        this.tasks.push(task)
        console.log(`task submitted: ${task.id} (type:${task.type})`);
        return task;
    }

    // Get next Pending Task (FIFO - first in first out)
    async getNextTask() {
        const task = this.tasks.find( t => t.status === 'pending');

        if(!task) {
            return null; // No pending tasks
        }

        // Mark as processing
        task.markStarted();
        console.log(`Task Claimed: ${task.id}`);
        return task;
    }

    // Mark task as completed

    async complatedTask(taskId) {
        const task = this.tasks.find(t => t.id === taskId);

        if(!task) {
            throw new Error(`Task not found: ${taskId}`);
        }

        task.markCompleted();
        console.log(`Task Completed: ${taskId}`);
    }

    // Mark task as failed

    async failedTask(taskId, error) {
        const task = this.tasks.find( t => t.id === taskId);

        if(!task) {
            throw new Error(`Task not found: ${taskId}`)
        }

        task.markFailed(error);
        if(task.canRetry()) {
            console.log(`Task failed , will retry: ${taskId} (attempt ${task.retryCount}/${task.maxRetries})`)
        } else {
            console.log(`Task failed Permanently: ${taskId}`);
        }
        
    }

    getStatus() {
        return {
            total: this.tasks.length,
            pending: this.tasks.filter(t => t.status === 'pending').length,
            processing: this.tasks.filter(t => t.status === 'processing').length,
            completed: this.tasks.filter(t => t.status === 'completed').length,
            failed: this.tasks.filter(t => t.status === 'failed').length,
        }
    }

    // Get task by Id
    async getTask(taskId) {
        return this.tasks.find(t => t.id === taskId) || null;
    }
}

export {
    InMemoryQueue
}