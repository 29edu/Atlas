# Queue.js

## What is it?

    Queue.js is not a class. It is just one line:

        const queue = new InMemoryQueue();
        export { queue };

    Its only job is to create a single shared instance of InMemoryQueue
    and make it available to the rest of the app.

## Why does this file exist?

    Without this file, every part of the app that needs the queue
    would have to create its own instance:

        // In worker.js
        const queue = new InMemoryQueue();

        // In controller.js
        const queue = new InMemoryQueue();

    These are two DIFFERENT objects with two DIFFERENT task arrays.
    Workers would never see tasks submitted by controllers. Chaos.

    Queue.js creates ONE shared instance and exports it.
    Everywhere that imports it gets the exact same object → Singleton pattern.

## Circular Dependency Warning

    InMemoryQueue.js does NOT import from Queue.js.
    If it did:

        InMemoryQueue.js → imports → Queue.js → imports → InMemoryQueue.js → loop forever

    This is a circular dependency and Node.js will break.
    That is why InMemoryQueue.js only imports Task.js, not Queue.js.

## When to use

    This file is only used in the in-memory version of the queue (learning/dev).
    In production the app uses RedisQueue directly, not this file.
