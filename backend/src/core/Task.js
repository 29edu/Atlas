import { v4 as uuidv4 } from 'uuid';
class Task {
    constructor({type, payload, userId, priority=5, maxRetry=3,result=false}) {
        this.uniqueId = uuidv4();
        this.type = type;
        this.payload = payload;
        this.userId = userId;
        this.status = "pending";
        this.createdAt = new Date().toISOString();
        this.startedAt = null;
        this.completedAt = null;
        this.failedAt = null;
        this.result = result;

        // Retry tracking
        this.retryCount = 0;
        this.maxRetry = maxRetry;
        this.priority = priority;

        // Error tracking
        this.lastError = null;
        
    };

    // Create a task

    async markStarted() {
        this.startedAt = new Date().toISOString();
        this.status = "processing";
        console.log(`Started the task ... ${this.type}`);
    }

    async markFailed(error) {
        this.retryCount++;
        this.lastError = error;
        this.failedAt = new Date().toISOString();
        if(this.retryCount >= this.maxRetry) {
            this.status = "failed"
            console.log('Maximum retry reached ....');
            return;
        }else {
            this.status = "pending";
            console.log("Can be started");
        }
    }

    async markCompleted() {
        this.status = "completed";
        this.completedAt = new Date().toISOString();
        console.log('Completed this task');
    }

    canRetry() {
        if(this.retryCount >= this.maxRetry) {
            return false;
        } else {
            return true;
        }
    }
}

export {
    Task
}