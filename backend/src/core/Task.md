# type

    It tells what kind of action/event/ job/ message this is
    It answers the question : "What is happening?"
    like "DELIVER_PACKAGE"
        "RETURN_PACKAGE"
        "CANCEL_ORDER"

        Amazon-style Order System:
            type: "ORDER_PLACED"
            type: "ORDER_CONFIRMED"
            type: "ORDER_SHIPPED"
            type: "ORDER_OUT_FOR_DELIVERY"
            type: "ORDER_DELIVERED"
            type: "ORDER_CANCELLED"
            type: "RETURN_REQUESTED"
            type: "RETURN_PICKED_UP"
            type: "REFUND_INITIATED"
            type: "REFUND_COMPLETED"
            type: "REPLACE_ITEM"
            type: "TRACK_PACKAGE"

        In Notification System : 
            type: "EMAIL",
            type: "SMS",
            type: "PUSH_NOTIFICATION"

        In job Queue
            type: "SEND_MESSAGE_EMAIL"
            type: "PROCESS PAYMENT"
            type: "GENERATE INVOICE"

        In Event System
            type: "USER_CREATED",
            type: "ORDER_PLACED",
            type: "PASSWORD_RESET"

    Without type i don't know the object
    I have to use if-else and it will look ugly

## Payload

    Payload is the actual data needed to perform that action
    It answers "What information do i need to do this job?"

    Example:-
        Type: "DELIVERY_PACKAGE"
        Payload:- Address, Phone_number, item, instructions

        Amazon-style Examples:-

            Order Placed:-
                {
                    type: "ORDER_PLACED",
                    payload: {
                        orderId: "AMZ-9821",
                        userId: 101,
                        items: [{ productId: "B09X3", name: "Boat Earbuds", qty: 1, price: 1299 }],
                        totalAmount: 1299,
                        currency: "INR",
                        address: "221B, Baker Street, Mumbai"
                    }
                }

            Order Shipped:-
                {
                    type: "ORDER_SHIPPED",
                    payload: {
                        orderId: "AMZ-9821",
                        trackingId: "TRK-44821",
                        courier: "Amazon Logistics",
                        estimatedDelivery: "2026-05-11"
                    }
                }

            Order Cancelled:-
                {
                    type: "ORDER_CANCELLED",
                    payload: {
                        orderId: "AMZ-9821",
                        userId: 101,
                        reason: "Customer requested cancellation",
                        refundAmount: 1299,
                        refundTo: "original_payment_method"
                    }
                }

            Return Requested:-
                {
                    type: "RETURN_REQUESTED",
                    payload: {
                        orderId: "AMZ-9821",
                        userId: 101,
                        productId: "B09X3",
                        reason: "Item defective",
                        pickupDate: "2026-05-12",
                        pickupAddress: "221B, Baker Street, Mumbai"
                    }
                }

            Refund Initiated:-
                {
                    type: "REFUND_INITIATED",
                    payload: {
                        orderId: "AMZ-9821",
                        userId: 101,
                        refundAmount: 1299,
                        currency: "INR",
                        refundTo: "UPI",
                        expectedBy: "2026-05-15"
                    }
                }

            Track Package:-
                {
                    type: "TRACK_PACKAGE",
                    payload: {
                        trackingId: "TRK-44821",
                        orderId: "AMZ-9821",
                        currentLocation: "Delhi Warehouse",
                        status: "In Transit",
                        lastUpdated: "2026-05-09T10:30:00Z"
                    }
                }

        Email Job:-
            {
                type: "SEND_EMAIL",
                payload: {
                    to: "user@gmail.com",
                    subject: "Welcome",
                    body: "Thanks for joining
                }
            }

        Payment Job:-
            {
                type: "PROCESS_PAYMENT",
                payload: {
                    userId: 123,
                    amount: 499,
                    currency: "INR"
                }
            }

        User Event:-
            {
                type: "USER_CREATED",
                payload: {
                    userId: 456,
                    name: "Edison",
                    email: "edison@gmail.com"
                }
            }

        Putting directly is bad like
            constructor(email, action, amount, message, phone)

## Restore State

    Scenario:
        A user submit the details and saved in database. Now worker picks the task and worker crashes the server or server restarts,
        and reloads tasks from storage.

        Now the question is 
            Should the task restart like a brand new task?
            or continue knowing?
                It already started
                It failed once
                It has 2 retries left
                It already has an ID
            Continue where it left off -> This is restore state

    How it works in code:
        static fromRedis(data) reconstructs a Task from raw Redis data
        instead of creating a fresh one with new Task({...}).
        It restores uniqueId, status, timestamps, retryCount, lastError, workerId —
        everything that was saved before the crash.

        toRedis() is the inverse — it serializes the Task into a flat object
        that Redis can store (Redis can't store nested objects, so payload
        is JSON.stringify'd and numbers are .toString()'d).

---

## Fields

### uniqueId

    A UUID generated at construction time (uuid v4).
    Stable across restores — fromRedis() puts the saved id back in,
    so the task keeps the same identity even after a crash.

    Amazon example:
        uniqueId: "a3f2c1d0-91ab-4bcd-8ef0-123456789abc"
        → This is the internal task ID. Even if the delivery worker crashes
          mid-shipment, when it restarts it loads the same task by this ID —
          not a duplicate new one.

### userId

    Who submitted the task. Used to associate the task with an account
    or to filter tasks by user.

    Amazon example:
        userId: "USR-10482"
        → The customer who placed the order. If they cancel it,
          we look up all tasks where userId matches and cancel them.

### status

    The lifecycle state of the task. Possible values:

        "pending"     — waiting to be picked up by a worker
        "processing"  — a worker has started it (markStarted called)
        "completed"   — finished successfully (markCompleted called)
        "failed"      — exhausted all retries (markFailed called after maxRetry reached)

    After a failed attempt that still has retries left, status goes back to "pending"
    so the queue can pick it up again.

    Amazon example (ORDER_SHIPPED task lifecycle):
        1. Customer places order        → status: "pending"
           (task is sitting in queue, no worker touched it yet)

        2. Shipping worker picks it up  → status: "processing"
           (worker is generating label, notifying courier)

        3. Label printed, courier notified → status: "completed"
           (done, customer gets SMS "Your order has shipped")

        4. Worker crashes mid-label print  → status: "pending" (retry)
           (retryCount goes 0→1, task re-queued, another worker picks it)

        5. Fails 3 times in a row          → status: "failed"
           (maxRetry exhausted, alert fires, human investigates)

### priority

    Integer 1–10 (default 5). Lower number = higher urgency.
    Must be an integer; any non-integer input is stored as null.

    Bands (via getPriorityCategory):
        1–3  → "critical"
        4–6  → "high"
        7+   → "low"
        null → "Invalid Priority"

    Amazon example:
        priority: 1  → Same-day delivery order, must ship within 2 hours  (critical)
        priority: 5  → Standard 3–5 day delivery                          (high)
        priority: 9  → Scheduled delivery 2 weeks out                     (low)

### maxRetry

    Maximum number of times the task can be retried before it is
    permanently marked "failed". Default is 3.

    Amazon example:
        A REFUND_INITIATED task has maxRetry: 5
        → Payment gateway is flaky, so we give it 5 chances before
          escalating to a human agent instead of failing the refund silently.

        A SEND_OTP task has maxRetry: 1
        → OTP expires in 60 seconds, retrying a stale one makes no sense.

### retryCount

    How many times the task has already failed and been re-queued.
    Incremented inside markFailed(). When retryCount >= maxRetry
    the task is dead.

    Amazon example:
        retryCount: 2, maxRetry: 3
        → The courier API timed out twice while trying to book a pickup
          for a return. One attempt left before the task dies and a
          support ticket is auto-created.

### lastError

    The error from the most recent failure, stored by markFailed(error).
    Useful for debugging why a task kept failing.
    Stored as "" in Redis (never null) to avoid a null.toString() crash.

    Amazon example:
        lastError: "CourierAPI 503: Service Unavailable"
        → Tells the on-call engineer exactly why the RETURN_PICKED_UP
          task kept failing — courier service was down, not our bug.

### workerId

    Which worker is currently processing (or last processed) this task.
    Set by markStarted(workerId). Helps identify which worker to
    investigate if the task crashes.

    Amazon example:
        workerId: "worker-Mumbai-07"
        → The ORDER_SHIPPED task was being processed by the Mumbai
          fulfilment worker. If the task crashed, we know exactly
          which server to check logs on.

### Timestamps

    createdAt   — set at construction, ISO string
    startedAt   — set by markStarted(), null until a worker picks it up
    completedAt — set by markCompleted(), null until success
    failedAt    — set by markFailed(), updated on every failure

    Amazon example (RETURN_REQUESTED task):
        createdAt:   "2026-05-09T08:00:00Z"  ← customer clicked "Return"
        startedAt:   "2026-05-09T08:01:10Z"  ← pickup worker picked it up
        completedAt: "2026-05-09T08:01:45Z"  ← courier booked, SMS sent
        failedAt:    null                     ← no failure, smooth run

---

## Methods

### markStarted(workerId)

    Call this when a worker begins executing the task.
    Sets status → "processing", records startedAt, saves workerId.

### markFailed(error)

    Call this when a worker encounters an error.
    Increments retryCount, saves lastError and failedAt.
    If retryCount >= maxRetry → status "failed" (dead).
    Otherwise → status back to "pending" (eligible for retry).

### markCompleted()

    Call this when the worker finishes successfully.
    Sets status → "completed" and records completedAt.

### canRetry()

    Returns true if retryCount < maxRetry, false otherwise.
    Quick check before deciding whether to re-queue a failed task.

### static getPriorityCategory(priority)

    Maps a numeric priority to a human-readable band:
        1–3  → "critical"
        4–6  → "high"
        7+   → "low"
        null → "Invalid Priority"

### toRedis()

    Serializes the Task into a flat string-only object for Redis storage.
    payload is JSON.stringify'd (Redis can't store nested objects).
    Numbers (retryCount, maxRetry, priority) become strings.
    null dates become "" to keep Redis happy.

### static fromRedis(data)

    The inverse of toRedis(). Rebuilds a full Task object from raw Redis data.
    This is restore state in practice — the task picks up with its original id,
    status, retry history, and timestamps instead of starting fresh.

### dateToRedis(value)

    Helper that safely converts any date representation (Date object, ISO string,
    null/undefined) into an ISO string for Redis, or "" if the value is falsy.
