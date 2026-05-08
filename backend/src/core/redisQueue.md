# RedisQueue.js

## What Problem Does RedisQueue Solve?

    Imagine Atlas without any queue.
    A user places an order and the server must:
        - Save order to MongoDB
        - Send a confirmation email
        - Resize the product image
        - Process the payment

    All of this happens synchronously inside the same request.
    The user's browser sits there waiting.
    If the email server is slow → user waits.
    If image resize takes 3 seconds → user waits.
    If any step crashes → the entire order fails with no retry.

    RedisQueue fixes this.
    Heavy tasks go into the queue. The user gets a response immediately.
    Workers process them in the background.

## How Tasks Are Stored in Redis

    Two data structures work together:

    1. Hash (hset) — stores all task data by ID
        Key:   task:{uniqueId}
        Value: { id, type, payload, status, retryCount, workerId, ... }

        Think of this like a file cabinet.
        Each drawer (key) holds one task's complete information.

    2. List (lpush/brpop) — the queue itself
        Key:   tasks:pending
        Value: a list of task IDs waiting to be processed

        Think of this like a ticket dispenser.
        Workers pull the next ticket ID from the list,
        then go to the file cabinet to get the full task details.

    Why separate the two?
        The list gives you ordering (who's next).
        The hash gives you data (what to do).
        Combining them in one structure would be much more complex.

## submit(taskData)

    1. Creates a new Task object (generates uniqueId, sets status = "pending")
    2. task.toRedis() converts it to a flat key-value format Redis understands
    3. hset(`task:${task.uniqueId}`, redisData) → stores task data
    4. lpush(this.queueName, task.uniqueId) → adds ID to the queue list

    The 5-second timeout in submit is a safety net.
    If hset hangs (Redis connection issue), it throws after 5s instead of hanging forever.

## getNextTask(workerId)

    Uses brpop (blocking pop) — waits up to 1 second for a task ID to appear.

    brpop vs rpop:
        rpop - non-blocking, returns null immediately if list is empty
               requires manual polling → wastes CPU constantly checking
        brpop - blocks and waits up to N seconds for an item
                more efficient, no polling needed

    Once a task ID is retrieved:
        1. hgetall(`task:${taskId}`) → get full task data
        2. Task.fromRedis(data) → rebuild Task object from stored data
        3. markStarted(workerId) → update status to "processing", set workerId
        4. Save updated task back to Redis
        5. Return the task to the worker

## completeTask(taskId)

    1. hgetall → get task from Redis
    2. Task.fromRedis → rebuild object
    3. markCompleted() → status = "completed"
    4. Save back to Redis

## failTask(taskId, error)

    1. hgetall → get task from Redis
    2. Task.fromRedis → rebuild object
    3. markFailed(error) → increments retryCount, sets lastError
    4. Save back to Redis
    5. If canRetry() → lpush the task ID back into the queue (will be picked up again)
       If cannot retry → task stays failed permanently

## String Conversion: String() vs .toString()

    When saving to Redis all values must be strings.

    String(value)    - safe for ALL values including null and undefined
    value.toString() - crashes if value is null or undefined

    Always use String() or "" as fallback when the value might be null.
    Example from the code:
        lastError: this.lastError || ""
    If lastError is null, store empty string instead.

## Same Queue Name = One Task at a Time Per Queue

    Both submit() and getNextTask() use the same queueName: "tasks:pending"
    This means all workers compete for the same list.
    Only one worker can brpop a given task ID.
    Redis guarantees this is atomic — no two workers grab the same task.

    If you used different queue names:
        Worker A processes from "queue:A"
        Worker B processes from "queue:B"
        They are completely independent and run simultaneously.
        This is how you process different task types in parallel.

## fromRedis() / toRedis()

    Redis stores everything as strings.
    toRedis() converts the Task object to all strings before saving.
    fromRedis() converts the strings back to the right types when loading.

    Example:
        retryCount is stored as "2" (string) in Redis
        fromRedis does: parseInt(data.retryCount) to get back the number 2
