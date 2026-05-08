# Worker.js

## What is it?

    Worker is the engine that pulls tasks from the queue and runs them.

    Think of it like a chef in a kitchen.
    The queue is the order board with tickets hanging on it.
    The worker keeps looking at the board, grabs the next ticket,
    makes the dish (runs the task), and moves to the next one.

## Why does it exist?

    Without a worker, tasks would just sit in the queue forever.
    Something has to pick them up and execute them.

    Worker separates "storing a task" from "running a task".
    This lets you:
        - Submit tasks fast without waiting for them to finish
        - Run multiple workers at the same time
        - Retry failed tasks automatically

## Constructor

    new Worker(name, queue, taskHandlers)

    name         - A label for logging, like "EmailWorker" or "Worker-1"
    queue        - The queue object (InMemoryQueue or RedisQueue)
    taskHandlers - An object mapping task types to functions

    Example taskHandlers:
        {
            "SEND_EMAIL": emailHandler,
            "PROCESS_PAYMENT": paymentHandler,
            "RESIZE_IMAGE": imageHandler,
        }

    When a task of type "SEND_EMAIL" comes in, the worker calls emailHandler(payload).
    If the type is missing from taskHandlers → crash. So always register all handlers.

## How start() works

    start() runs an infinite loop:

        while (this.isRunning) {
            const task = await this.queue.getNextTask();

            if (!task) {
                sleep(4000);   // no task found, wait 4 sec and try again
            } else {
                processTask(task);
            }
        }

    The loop keeps checking the queue forever until stop() is called.
    Sleep prevents the CPU from spinning at 100% when the queue is empty.

## How processTask() works

    1. Marks the task as started
    2. Looks up the handler function for task.type
    3. Calls the handler with task.payload
    4. On success → markCompleted()
    5. On failure → markFailed(), then checks if it can retry

    If canRetry() is true, the worker sleeps 2 seconds and the loop
    naturally picks it up again on the next iteration.

## stop()

    Sets this.isRunning = false.
    The while loop condition fails on the next iteration and exits cleanly.

## sleep()

    A helper that returns a Promise that resolves after ms milliseconds.
    Used with await so the event loop is not blocked during the wait.

    await this.sleep(2000);  // wait 2 seconds before retrying

## Worker vs RedisWorker

    Worker (this file) is the basic version.
    It works with InMemoryQueue and has no heartbeat.
    If the worker crashes, no one knows and tasks are lost.

    RedisWorker is the production version.
    It adds a heartbeat to Redis so HealthMonitor can detect crashes
    and recover orphaned tasks automatically.
