class Worker {
  constructor(name, queue, taskHandlers) {
    this.name = name;
    this.queue = queue;
    this.taskHandlers = taskHandlers;
    this.isRunning = false;
  }

  async start() {
    console.log(`Worker ${this.name} is working...`);
    this.isRunning = true;
    try {
      while (this.isRunning) {
        const task = await this.queue.getNextTask();
        if (!task) {
          await this.sleep(5000); //  i am using await here because sleep is returning a promise so  i must wait
          break;
        } else {
          await this.processTask(task);
        }
      }
    } catch (error) {
      // This is to catch the unexpected Error
      await this.sleep(2000);
      console.log("Some Unexpected error happened: ", error);
    }
  }

  async processTask(task) {
    await task.markStarted();
    try {
      const response = await this.taskHandlers[task.type](task.payload);
      await task.markCompleted();
      console.log("The task has been completed successfully");
    } catch (error) {
      console.log("The task has failed");
      await task.markFailed();
      if (task.canRetry()) {
        console.log(`Task will retry again after 2 sec`);
        await this.sleep(2000);
      } else {
        console.log("The task has failed completely and will not retry again");
      }
    }
  }

  async stop() {
    this.isRunning = false;
  }

  sleep = async (ms) => {
    return new Promise((resolve) => {
      console.log(`Wait for ${ms / 1000} seconds to run this start again`);
      setTimeout(() => {
        resolve();
      }, ms);
    });
  };
}

export { Worker };
