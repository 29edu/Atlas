# InMemoryQueue

## What is it?

    InMemoryQueue is the simplest version of a task queue.
    It stores all tasks inside a plain JavaScript array in RAM (memory).
    When the server restarts, all tasks are gone.

    Think of it like a whiteboard in a classroom.
    You write tasks on it, erase them when done.
    If someone turns off the lights and comes back, the board is clean.

## Why does it exist?

    Before building the full Redis-backed queue, InMemoryQueue was built to
    understand how a task queue works in its simplest form:

        1. You submit a task
        2. A worker picks the next pending task
        3. The task gets marked started, then completed or failed

    It helped answer: "Does the queue logic work at all?" before adding complexity.

## How it works

    constructor()
        Creates an empty array: this.tasks = []
        This is where all Task objects live while the server is running.

    submit(taskData)
        Creates a new Task object from taskData.
        Pushes it into the tasks array.
        Returns the created task.

        Example:-
            await queue.submit({
                type: "SEND_EMAIL",
                payload: { to: "user@gmail.com", subject: "Hello" },
                userId: "abc123",
                priority: 3
            });

    getNextTask()
        Searches the array for the first task with status === "pending"
        Calls markStarted() on it and returns it to the worker.
        If no pending task exists, returns null.

        Important: It picks the FIRST pending task it finds.
        There is no priority sorting here. Priority sorting lives in RedisQueue.

    completeTask(taskId)
        Finds the task by its uniqueId.
        Calls markCompleted() on it.

    failTask(taskId, error)
        Finds the task by its uniqueId.
        Calls markFailed(error) on it.
        Task.markFailed() decides whether to retry or permanently fail.

    getStats()
        Counts how many tasks are in each state:
            { PendingTask: 2, ProcessingTask: 1, CompletedTask: 5 }

## The Singleton Problem

    There is a trap here.

    If you create two separate instances of InMemoryQueue:
        const queue1 = new InMemoryQueue();  // in file A
        const queue2 = new InMemoryQueue();  // in file B

    They each have their own separate tasks array.
    Worker A reads from queue1, Worker B reads from queue2.
    Both can pick up the same task → race condition.

    Solution: Only ever create ONE instance and export it.
    That is what Queue.js does:

        const queue = new InMemoryQueue();
        export { queue };

    Now every file that imports queue gets the same object.

## InMemoryQueue vs RedisQueue

    | Feature         | InMemoryQueue        | RedisQueue              |
    |-----------------|----------------------|-------------------------|
    | Storage         | RAM                  | Redis (disk + RAM)      |
    | Survives crash  | No                   | Yes                     |
    | Multiple workers| Risky (race cond.)   | Safe (Redis is atomic)  |
    | Priority sort   | No                   | Yes (lpush order)       |
    | Use case        | Dev / learning       | Production              |
