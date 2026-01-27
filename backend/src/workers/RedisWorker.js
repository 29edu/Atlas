// This worker help to manage the tasks
import { RedisQueue } from "../core/RedisQueue.js";
import { v4 as uuidv4 } from "uuid";

class RedisWorker {
  constructor(name, queue, taskHandler) {
    this.name = name;
    this.queue = queue;
    this.taskHandler = taskHandler;
    this.isRunning = false;
    this.currentTask = null;
    this.workerId = uuidv4();
    this.heartBeatInterval = null;

    this.heartBeat = {
      WorkerId: this.workerId,
      workerName: this.name,
      lastSeen: new Date().toISOString(),
      currentTask: this.currentTask || "",
      status: "Active",
    };

    console.log(this.heartBeat);
  }

  async start() {
    this.isRunning = true;
    console.log(`Redis worker ${this.name} has started`);
    console.log("HearBeat: ", this.heartBeat);

    // while(this.isRunning) {  wrong I Cannot do like this because it will run forever and won't prcoceed to the next code so its kind of stuck
    //     setInterval(() => {
    //         console.log(this.heartBeat)
    //     }, 10000);
    // }

    this.sendStartHeartBeat();
    this.heartBeatFunction();

    try {
      while (this.isRunning) {
        const task = await this.queue.getNextTask(this.workerId);
        if (task) {
          this.currentTask = task;
          this.heartBeat.currentTask = this.currentTask;
          await this.processTask(task);
          this.currentTask = null;
        } else {
          // If no task, wait a bit before checking again to allow event loop to process
          await this.sleep(100);
        }
      }
    } catch (error) {
      console.log("Something Error in the Redis Worker", error);
      await this.sleep(2000);
    }
  }

  async processTask(task) {
    console.log(`${this.name} redis worker is processing the task`);
    try {
      const response = this.taskHandler[task.type];

      if (!response) {
        throw new Error(`No handler for task type ${task.type}`);
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

    clearInterval(this.heartBeatInterval);

    this.heartBeat.status = "notActive";
    this.heartBeat.lastSeen = new Date().toISOString();

    this.sendStopHeartBeat();

    if (this.currentTask) {
      console.log(`Waiting for current task to finish`);
    }
  }

  sleep = async (ms) => {
    return new Promise((resolve) => {
      console.log(`Wait for ${ms / 1000} sec to start again`);
      setTimeout(() => {
        resolve();
      }, ms);
    });
  };

  heartBeatFunction = async () => {
    this.heartBeatInterval = setInterval(async () => {
      this.heartBeat.lastSeen = new Date().toISOString();

      // this is wrong because redis doesn't store object , it only understand key value pair
      // so we will have to convert the object into key value pair using
      // ...Object.entries(data).flat()

      // await this.queue.redis.hset(
      //     `worker:${this.workerId}`, this.heartBeat
      // )

      await this.queue.redis.hset(
        `worker:${this.workerId}`,
        ...Object.entries(this.heartBeat).flat(),
      );

      console.log(this.heartBeat);
    }, 10000);
  };

  sendStartHeartBeat = async () => {
    this.heartBeat.lastSeen = new Date().toISOString();
    console.log("Starting the heartbeat...", this.heartBeat);
    await this.queue.redis.hset(
      `worker:${this.workerId}`,
      ...Object.entries(this.heartBeat).flat(),
    );
  };

  sendStopHeartBeat = async () => {
    this.heartBeat.lastSeen = new Date().toISOString();
    console.log("Stopping the heartBeat ....", this.heartBeat);
    await this.queue.redis.hset(
      `worker:${this.workerId}`,
      ...Object.entries(this.heartBeat).flat(),
    );
  };
}

export { RedisWorker };
