# Day 1 - Learned Today

    1. What is Task?
    2. Storage Trade-off / Speed
    3. Worker Model
    4. Atomic Operations
    5. BRPOP ( Blocking Right pop )

# Day 2 - Topics

    1. Outbox Pattern 
    2. Fault Tolerance

# Day 3 Design Decisions-
    - Formula: Workers = Tasks/sec × Time per task
    - Example: 10,000 tasks/sec × 2 sec = 20,000 workers

    ## Retry Strategy
      - Max retries: 3 attempts
      - Exponential backoff: 1s, 2s, 4s, 8s
      - Circuit breaker: Stop after 5 consecutive failures
      - Retry budget: Max 1000 retries/hour globally

    ## Autoscaling
      - Normal: 2,000 workers
      - Black Friday: Scale to 100,000 workers
      - Buffer: +20% above calculated need
      - Reasoning: Crash costs more than capacity

    ## Why These Decisions?
        For Business Purpose, I can buy more servers in case the spike goes more from expected numbers and if the system crash, it will ruin the reputation and sales.

# Date:- 16th feb 2026

    1. Implementing Priority Queue in the backend because all the tasks are not equal like some are highly important like payment processing, order confirmation emails, password reset emails, and there are some tasks which can be run in the background like image optimisation, analytic processing, report regeration. 

  
  Architecture:-
