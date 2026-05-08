# HealthMonitor.js

## What is it?

    HealthMonitor is the system that watches the workers and rescues stuck tasks.

    Think of it like a shift supervisor at a factory.
    Every 30 seconds, the supervisor walks the floor.
    If a worker is slumped over their machine (crashed),
    the supervisor picks up the unfinished work and assigns it to someone else.

## Why does it exist?

    Workers can crash. Servers restart. Processes get killed.
    When this happens, any task the worker was running gets stuck:
        - Its status stays "processing"
        - Its workerId points to a dead worker
        - No one picks it up again

    This task is called an "orphaned task".
    HealthMonitor finds orphaned tasks and puts them back in the queue.

## WORKER_TIMEOUT

    this.WORKER_TIMEOUT = 30000  // 30 seconds

    If a worker's lastSeen timestamp is older than 30 seconds,
    HealthMonitor considers that worker dead.

    Workers send a heartbeat every 10 seconds (see RedisWorker.md).
    So if 30 seconds pass with no heartbeat → worker is definitely gone.

## start()

    Sets a setInterval that calls checkWorkerHealth() every 30 seconds.
    This keeps running until stop() is called.

## checkWorkerHealth()

    Step 1: Get all task keys from Redis
        await this.queue.redis.keys('task:*')
        Returns something like: ["task:abc123", "task:def456", ...]

    Step 2: For each task, get its full data
        redis.hgetall(`task:${taskKey}`)
        Reconstruct it as a Task object using Task.fromRedis()

    Step 3: Only care about tasks with status === "processing"
        Pending/completed/failed tasks are fine. Only "processing" can be orphaned.

    Step 4: Check if the worker who owns this task is still alive
        isWorkerAlive(workerId)

    Step 5: If worker is dead → recoverOrphanedTask(taskId)

## isWorkerAlive(workerId)

    Fetches the worker's heartbeat from Redis:
        redis.hgetall(`worker:${workerId}`)

    Compares current time vs worker.lastSeen:
        currTime - workerLastSeen > 30000 ms → worker is dead → return false
        Otherwise → worker is alive → return true

    Important: Both times must be Date objects for subtraction to work.
    Subtracting ISO strings gives NaN, not a number.

## recoverOrphanedTask(taskId)

    1. Fetch the stuck task from Redis
    2. Reset its status to "pending"
    3. Clear its workerId (no worker owns it anymore)
    4. Save the updated task back to Redis
    5. Push the task ID back into the queue list (lpush)

    Now a healthy worker will pick it up on the next iteration of its loop.

## stop()

    Sets isRunning = false.
    Clears the setInterval so health checks stop.

## forEach vs for...of (A Lesson Learned)

    The original code used forEach to check workers.
    forEach does NOT work with async/await properly:

        allTask.forEach(async (taskKey) => {
            await ...  // this doesn't actually wait!
        })

    All iterations start at the same time → race conditions.

    for...of works correctly:

        for(let taskKey of allTask) {
            await ...  // properly waits for each one
        }

    Always use for...of when you need to await inside a loop.
