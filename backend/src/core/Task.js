import { v4 as uuidv4 } from "uuid";
class Task {
  constructor({
    type,
    payload,
    userId,
    priority = 5,
    maxRetry = 3,
    result = false,
    workerId = null,
    
  }) {
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
    this.priority = (Number.isInteger(priority) ? priority : null);

    // Error tracking
    this.lastError = null;

    // Tracking which worker is working on the task
    this.workerId = workerId || null;
  }

  static getPriorityCategory(priority) {
    if(priority == null) {
      return 'Invalid Priority'
    }
    if(priority>=1 && priority<=3) {
      return 'critical';
    } else if(priority>=4 && priority<=6) {
      return 'high';
    } else {
      return 'low'
    }
  }

  // Create a task

  async markStarted(workerId) {
    this.startedAt = new Date().toISOString();
    this.status = "processing";
    this.workerId = workerId;
    console.log(`Started the task ... ${this.type}`);
  }

  async markFailed(error) {
    this.retryCount++;
    this.lastError = error;
    this.failedAt = new Date().toISOString();
    if (this.retryCount >= this.maxRetry) {
      this.status = "failed";
      console.log("Maximum retry reached .... Task is completely failed");
    } else {
      this.status = "pending";
      console.log("Task is failed. Can be started");
    }
  }

  async markCompleted() {
    this.status = "completed";
    this.completedAt = new Date().toISOString();
    console.log(`Completed the task ${this.type}`);
  }

  canRetry() {
    if (this.retryCount >= this.maxRetry) {
      return false;
    } else {
      return true;
    }
  }

  static fromRedis(data) {
    const newTask = new Task({
      type: data.type,
      payload: data.payload,
      userId: data.userId,
      priority: parseInt(data.priority),
      maxRetry: parseInt(data.maxRetry),
    });

    newTask.uniqueId = data.id;
    newTask.status = data.status;
    newTask.createdAt = data.createdAt;
    newTask.startedAt = data.startedAt || null;
    newTask.completedAt = data.completedAt || null;
    newTask.failedAt = data.failedAt || null;
    newTask.retryCount = parseInt(data.retryCount);
    newTask.lastError = data.lastError || null;
    newTask.workerId = data.workerId || "";

    return newTask;
  }

  toRedis() {
    return {
      id: this.uniqueId,
      type: this.type,
      payload: JSON.stringify(this.payload), // converting object to string
      userId: this.userId,
      status: this.status,
      // createdAt: this.createdAt ? this.dateToRedis(this.createdAt) : "",
      // startedAt: this.startedAt ? this.dateToRedis(this.startedAt) : "",
      // completedAt: this.completedAt ? this.dateToRedis(this.completedAt) : "",
      // failedAt: this.failedAt ? this.dateToRedis(this.failedAt) : "",
       createdAt: this.createdAt || "",    
      startedAt: this.startedAt || "",     
      completedAt: this.completedAt || "",  
      failedAt: this.failedAt || "", 
      retryCount: this.retryCount.toString(),
      maxRetry: this.maxRetry.toString(),
      priority: this.priority.toString(),
      lastError: this.lastError || "", // I use this because if somehow lastError is null and if i do null.toString() then i use "" to avoid crash in case lastError is null
      workerId: this.workerId || null,
    };
  }

  dateToRedis(value) {
    console.log(
      "dateToRedis called with:",
      JSON.stringify(value),
      "type:",
      typeof value
    );
    if (!value) return "";
    if (typeof value === "string") return value; // Already a string
    if (value instanceof Date) return value.toISOString();
    return new Date(value).toISOString();
  };
}

export { Task };