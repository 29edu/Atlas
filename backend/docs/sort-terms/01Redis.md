# What is Redis?
    It is a super fast database that stores data in memory (RAM  instead of disk)
        Extremely Fast
        Great for real time apps
        Good for caching
        Perfect for Job queues, messaging and sessions

    They are faster than mysql and monggoDB. These two database are not great for real time things. Not ideal for jobs, quues, counters, sessions.

# How it handle memory if the information is too large? computer can slow down
    Redis lets you set a memory cap. After setting the memory cap, redis will never use more than that amount of space in ram.

    When Redis Reaches its max memory, it automatically removes old data depending on your polcy.

    Redis is not mean to store large amount of data.