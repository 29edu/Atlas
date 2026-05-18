# HealthMonitor.js

## What is it?

    HealthMonitor watches all workers and rescues tasks that got stuck
    when a worker crashed or went offline.

    Think of it like a shift supervisor at a factory.
    Every 30 seconds the supervisor walks the floor.
    If a worker is slumped over their machine (crashed),
    the supervisor picks up the unfinished work and puts it back in the queue
    so another worker can complete it.

## The Problem it Solves

    Workers can crash. Servers restart. Processes get killed.
    When this happens, any task the worker was running gets stuck:
        - status stays "processing"
        - workerId points to a dead worker
        - No one picks it up again

    This is called an "orphaned task".
    HealthMonitor finds these tasks and rescues them.

## How it Works

    start()
        Sets a setInterval that calls checkWorkerHealth() every 30 seconds.

    checkWorkerHealth()
        1. Gets all task keys from Redis:  redis.keys('task:*')
        2. For each task, checks if status === "processing"
        3. For processing tasks, looks up the worker that owns it
        4. Calls isWorkerAlive(workerId)
        5. If dead → calls recoverOrphanedTask(taskId)

    isWorkerAlive(workerId)
        Fetches the worker's heartbeat hash from Redis.
        Compares current time vs worker.lastSeen.
        If difference > 30 seconds → worker is dead → return false.

        Important: subtract Date objects, not ISO strings.
            new Date() - new Date(worker.lastSeen) → gives milliseconds (correct)
            "2025-05-09T12:00:00" - "2025-05-09T11:59:30" → NaN (wrong)

    recoverOrphanedTask(taskId)
        1. Fetch the stuck task from Redis
        2. Reset status → "pending"
        3. Clear workerId → null
        4. Save updated task to Redis
        5. Push task ID back into the queue list

## WORKER_TIMEOUT = 30,000 ms

    Workers send heartbeats every 10 seconds.
    If 30 seconds pass with no heartbeat → definitely dead.
    The buffer (30s vs 10s heartbeat) handles brief network delays.

## forEach vs for...of (Important Lesson)

    forEach does NOT work with async/await:

        allTask.forEach(async (taskKey) => {
            await redis.hgetall(taskKey);  // does NOT wait properly
        })

    All iterations fire at the same time → race conditions.

    for...of works correctly:

        for(let taskKey of allTask) {
            await redis.hgetall(taskKey);  // waits for each one
        }

    Always use for...of when you need await inside a loop.
