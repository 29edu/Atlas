# taskPriorities.js

## What is it?

    A simple config file that defines priority numbers for different task types.
    Lower number = higher priority = processed first.

## The Priority Scale

    PAYMENT:     1   (most critical — real money involved)
    INVENTORY:   2   (reserve stock before someone else buys it)
    FRAUD_CHECK: 3   (should happen before payment clears)
    EMAIL:       4   (nice to send fast, but not critical)
    ANALYTICS:   5   (can wait the longest)

## Why define these here instead of hardcoding numbers?

    Without this file you might write:
        { type: "PAYMENT_PROCESS", priority: 1 }
        { type: "SEND_EMAIL",      priority: 4 }

    If you later decide to change EMAIL priority from 4 to 6,
    you'd have to search and replace every occurrence across the entire codebase.

    With this file:
        { type: "SEND_EMAIL", priority: TASK_PRIORITIES.EMAIL }

    Change EMAIL: 4 to EMAIL: 6 in one place → done.

## How it connects to Task

    Task.getPriorityCategory(priority):
        1–3  → "critical"
        4–6  → "high"
        7+   → "low"

    PAYMENT (1) → critical
    INVENTORY (2) → critical
    FRAUD_CHECK (3) → critical
    EMAIL (4) → high
    ANALYTICS (5) → high
