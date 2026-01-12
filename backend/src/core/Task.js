import { v4 as uuidv4 } from "uuid";
class Task {
  constructor({
    type,
    payload,
    userId,
    priority = 5,
    maxRetry = 3,
    result = false,
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
    this.priority = priority;

    // Error tracking
    this.lastError = null;
  }

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
       createdAt: this.createdAt || "",       // ✅ Already a string!
      startedAt: this.startedAt || "",       // ✅ Already a string!
      completedAt: this.completedAt || "",   // ✅ Already a string!
      failedAt: this.failedAt || "", 
      retryCount: this.retryCount.toString(),
      maxRetry: this.maxRetry.toString(),
      priority: this.priority.toString(),
      lastError: this.lastError || "",
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

  static fromRedis(data) {
    const task = new Task({
      type: data.type,
      payload: JSON.parse(data.payload),
      userId: data.userId,
      priority: parseInt(data.priority),
      maxRetry: parseInt(data.maxRetry),
    });

    task.uniqueId = data.id;
    task.status = data.status;
    task.createdAt = data.createdAt;
    task.startedAt = data.startedAt || null;
    task.completedAt = data.completedAt || null;
    task.failedAt = data.failedAt || null;
    task.retryCount = parseInt(data.retryCount);
    task.lastError = data.lastError || null;

    return task;
  }
}

export { Task };
