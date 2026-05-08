# Task Handlers

    These files are the actual "work" that gets executed when a worker picks up a task.
    Each handler is a function that receives a payload and does something async.

    Files in this folder:
        emailHandler.js   - Sends emails
        paymentHandler.js - Processes payments
        imageHandler.js   - Resizes images
        createOrderTasks.js - Creates tasks when an order is placed

---

# emailHandler.js

## What it does

    Simulates sending an email.
    Receives: { to, from, subject, content }

    Flow:
        1. Logs the email details
        2. Waits 3 seconds (simulates network call to email provider)
        3. Has a 50% chance of failing (Math.random() < 0.5)
           This simulates real-world flaky email services
        4. On success → logs "Email sent successfully"
        5. On failure → throws an Error (caught by the worker)

## Why throw Error instead of returning false?

    throw new Error("Failed to send email") creates:
        { name: "Error", message: "Failed to send email", stack: "..." }

    The worker's processTask() wraps handler calls in try/catch.
    The catch block gets error.message automatically.
    This is the standard JavaScript way to signal failure from async functions.

---

# paymentHandler.js

## What it does

    Simulates processing a payment.
    Receives: { to, from, amount }

    Flow:
        1. Logs who is sending how much to whom
        2. Waits 3 seconds (simulates payment gateway call)
        3. 50% chance of failure
        4. On success → logs "Payment done successfully"
        5. On failure → throws Error

## Why simulate failures?

    Real payment gateways fail sometimes:
        - Network timeout
        - Insufficient funds
        - Gateway down

    The random failure tests that the retry system works correctly.
    If a payment fails, the worker calls queue.failTask() which checks
    canRetry() and re-queues the task if retries remain.

---

# imageHandler.js

## What it does

    Simulates resizing an image.
    Receives: { width, height }

    Flow:
        1. Logs target dimensions
        2. Waits 3 seconds (simulates CPU-heavy image processing)
        3. 50% chance of failure
        4. On success → logs "Resizing Complete"
        5. On failure → throws Error

---

# createOrderTasks.js

## What it does

    When an order is placed, multiple async jobs need to happen.
    createOrderTasks() generates all those tasks in the right priority order.

    Tasks created per order:
        1. PAYMENT_PROCESS     - priority 1 (PAYMENT)   → most urgent
        2. RESERVE_INVENTORY   - priority 2 (INVENTORY) → lock the stock
        3. SEND_CONFIRMATION_EMAIL - priority 4 (EMAIL) → notify user

## Why create tasks instead of doing everything directly?

    Without tasks (synchronous approach):
        User places order → server processes payment → server sends email → response
        User waits 6+ seconds. If email fails, the whole order fails.

    With tasks:
        User places order → tasks queued → response sent immediately (< 100ms)
        Workers process payment and email in the background.
        If email fails, only the email task retries — order is not affected.

## Connection to TASK_PRIORITIES

    TASK_PRIORITIES from taskPriorities.js are used here:
        priority: TASK_PRIORITIES.PAYMENT    → 1
        priority: TASK_PRIORITIES.INVENTORY  → 2
        priority: TASK_PRIORITIES.EMAIL      → 4

    This ensures the most critical work (payment) runs first.
