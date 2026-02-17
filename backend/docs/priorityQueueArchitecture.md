# Priorrity Queue Implementation

    Architecture:-
        1. We create different & multiple task queue system based on priority like critical , high, normal. Based on this, workers can check the which one is more important and can run those tasks. 
        2. Workers check queue first to process critical queue first like payment processing.
        3. We will make 🚩DLQ(Dead Letter Queue ) that separately stores the permanent failed tasks.    

            Why we implemented DLQ:-
                1. After max retries, task shouldn't disappear
                2. I need to investigate what went wrong
                3. Manual retry or fix capability

        4. Task Scheduling/Delayed Tasks
           1. Schedule tasks for future execution.
           2. Uses:-
              1. Send 'Complete your purchase' email 1 hour after cart abandonment
              2. Send review request 7  days after delivery
              3. Schedule promotional emails

            Implementation:-
                Scheduled Queue: {taskId, executeAt, payload}
                Background Scheduler checks every minute
                If executeAt-> now -> move to appropriate priority Queue 

        5. Advance Monitoring & Metrics
           1. Tracks:-
              1. Tasks processed per minute
              2. Average task duration by type
              3. Queue dept by priority
              4. Worker Utilisation

            Problem it solves:- Understand if i need more workers, identify bottlenecks

        6. Task History/Audit Trail
           1. Store  completed task metadata in mongodb
           
           {
                taskId,
                type,
                status,
                startedAt,
                completedAt,
                duration,
                workerId,
                retryCount
           }
           What it does:- Analyze performance, business analytics, debug issues

        7. Metrix Aggregation:-
            Metrix Aggregation:- Collecting raw data points and summarizing them into meaningful statistics.

            Instead fo storing every single event forever, we calculate
                Count,
                Sum,
                Average,
                Min/Max,
                Percentile etc

            eg:- Imagine Your backend receives 10,000 requests per minute.
                Instead of storing every request latency individually, I store:
                    Total requests = 10,000
                    Average Latetency:- 120ms
                    Max Latency:- 980 ms,
                    Error Rate:- 2%

                Problem:- It is impossible to log every request. It can consume a lot of space. High cost,
                 Hard to detect Patters
                 Too much raw data

            


    Working Flow:-
        8. Check critical queue -> Process immediately
        9.  If empty, check high queue.
        10. If empty, check normal queue.
        11. Sleep and repeat

    