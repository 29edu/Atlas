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
      workerId: this.workerId,
      workerName: this.name,
      lastSeen: new Date().toISOString(),
      currentTask: this.currentTask || "",
      status: "active",
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
          this.heartBeat.currentTask = this.currentTask.uniqueId || "";
          await this.processTask(task);
          this.currentTask = null;
          this.heartBeat.currentTask = "";

        } else {
          // If no task, wait a bit before checking again to allow event loop to process
          console.log('Wait for a few seconds');
          await this.sleep(1000);
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

    await this.sendStopHeartBeat();

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
    if (this.heartBeatInterval) {
        clearInterval(this.heartBeatInterval);
    }


    this.heartBeatInterval = setInterval(async () => {
      console.log('⏰ Timer fired!');

      try {
        this.heartBeat.lastSeen = new Date().toISOString();
        
        await this.queue.redis.hset(
          `worker:${this.workerId}`,
          ...Object.entries(this.heartBeat).flat(),
        );

        console.log('✅ Heartbeat updated:', this.heartBeat.lastSeen);
      } catch (error) {
        console.error('❌ Heartbeat failed:', error.message);
      }
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
