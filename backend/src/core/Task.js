class Task {
    constructor({uniqueId, type, payload, userId, status, retried, priority}) {
        this.uniqueId = uniqueId;
        this.type = type;
        this.payload = payload;
        this.userId = userId;
        this.status = status;
        this.createdAt = new Date().toISOString();
        this.startedAt = null;
        this.complatedAt = null;

        // Retry tracking
        this.retried = retried;
        this.maxRetry = 3;
        this.priority = priority;
        
    }

    // Create a task
    this.
}