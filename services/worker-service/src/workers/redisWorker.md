# RedisWorker.js

## What is it?

    RedisWorker is the production-grade version of Worker.
    It does everything Worker does, but adds one critical feature: Heartbeat.

    A heartbeat is the worker saying "I am still alive" to Redis every 10 seconds.
    If the worker crashes, the heartbeat stops.
    HealthMonitor detects this and rescues any task the dead worker was running.

## Why Heartbeat?

    Scenario without heartbeat:
        1. Worker picks up task: PROCESS_PAYMENT
        2. Server crashes mid-payment
        3. Task is stuck in status = "processing" forever
        4. No one knows the worker is dead
        5. Payment never completes, user never gets confirmation

    Scenario with heartbeat:
        1. Worker picks up task: PROCESS_PAYMENT
        2. Worker writes "I am alive, lastSeen: 12:00:00" to Redis every 10 sec
        3. Server crashes at 12:00:05
        4. HealthMonitor checks at 12:00:30, sees lastSeen was 12:00:00
        5. Detects worker has been dead > 30 seconds
        6. Rescues the task → puts it back in the queue
        7. Another worker picks it up and completes it

## Question: Do I need to delete the old heartbeat before writing the new one?

    No. Redis hset OVERWRITES automatically.
    No need to delete first. hset is idempotent — does the same thing every time.
    Deleting first would be an extra wasted Redis command.

## Constructor

    new RedisWorker(name, queue, taskHandler)

    name        - Label for logs (e.g. "Worker-1")
    queue       - A RedisQueue instance (shares the Redis connection)
    taskHandler - Object mapping task type → function (same as Worker)

    Each RedisWorker gets a unique workerId (UUID).
    This ID is stored in Redis so HealthMonitor can find it.

## Heartbeat Data in Redis

    Stored at key: worker:{workerId}

        {
            workerId:    "abc-123-...",
            workerName:  "Worker-1",
            lastSeen:    "2025-05-09T12:00:00.000Z",
            currentTask: "task-uuid-here" (or "" if idle),
            status:      "active" or "notActive"
        }

    This is a Redis Hash (hset). HealthMonitor reads it to check if worker is alive.

## start()

    1. Calls sendStartHeartBeat() → writes initial heartbeat to Redis immediately
    2. Calls heartBeatFunction() → starts setInterval every 10 seconds
    3. Enters the same while(isRunning) loop as Worker

    Every time a task is picked up, currentTask is updated in heartBeat.
    Every time a task finishes, currentTask is cleared back to "".

## heartBeatFunction()

    Uses setInterval to fire every 10,000 ms (10 seconds).
    On each tick:
        - Updates lastSeen to current time
        - Writes the heartBeat object to Redis using hset

    Why not inside the while loop?
        The loop blocks on getNextTask() (brpop waits for a task).
        If we put heartbeat inside the loop, it would only fire when a task arrives.
        setInterval runs on a separate timer regardless of the blocking loop.

## stop()

    Sets isRunning = false.
    Clears the setInterval so the heartbeat stops firing.
    Updates heartBeat.status = "notActive" and writes it to Redis.
    This lets HealthMonitor know the worker shut down cleanly (vs crashed).

## processTask()

    Same logic as Worker.processTask() but using the queue's methods:

        completeTask(task.uniqueId) → tells RedisQueue the task is done
        failTask(task.uniqueId, error.message) → tells RedisQueue the task failed

    RedisQueue.failTask() handles retry logic automatically.
    If the task can still retry, it goes back into the queue list.

## The setInterval Mistake (Important)

    You cannot put setInterval inside a while loop like this:

        while(this.isRunning) {
            setInterval(() => { ... }, 10000);  // WRONG
        }

    Every iteration of the while loop creates a NEW setInterval.
    After 100 iterations you have 100 timers firing simultaneously.

    Correct approach: call heartBeatFunction() ONCE before the while loop starts.
    One timer is created and keeps running independently.
