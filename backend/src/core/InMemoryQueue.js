import { Task } from "./Task.js";
// import { queue } from "./Queue.js"; will create circular dependency

class InMemoryQueue {
  constructor() {
    this.tasks = [] // regular instance property
  }

  async submit(taskData) {
    
    const newTask = new Task(taskData);
    this.tasks.push(newTask); // since tasks it static so we can access only using class name
    return newTask;
  }

  async getNextTask() {
    const nextTask = this.tasks.find(task => task.status === "pending");
    if(nextTask) {
      return nextTask;
    }
    else {
      console.log(`Task not found ${nextTask}`)
      return null;
    };
  }

  async completeTask(taskId) {
    let task = this.tasks.find(task => task.uniqueId === taskId);
    if(task) {
      task.markCompleted();
      return task;
    }
    else {
      console.log(`Task not found ${task}`)
    }; // we have already initianatednew object in the submit so need to create here
  }

  async failTask(taskId, error) {
    let task = this.tasks.find(task => task.uniqueId === taskId);
    if(task){
      task.markFailed(error);
      console.log('Task has been failed: ')
    }
  }

  getStats() {
    let pendingCount = 0;
    let processingCount = 0;
    let completedCount = 0;
    
    this.tasks.forEach((task) => {
      if(task.status === "pending") {
        pendingCount++;
      } else if(task.status === "processing") {
        processingCount++;
      } else {
        completedCount++;
      }
    })

    const stat ={
      "PendingTask" : pendingCount,
      "ProcessingTask" : processingCount,
      "CompletedTask": completedCount,
    }

    return stat;
  }
}

export { InMemoryQueue };