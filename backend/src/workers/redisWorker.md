# Question 1

    I am storing worker heartbeat in the redis, so do i need to remove the old heartbeat and push the new one?

    Answer:- It is automatic, redis hset OVERWRITES automatically
        No need to delete first
        Extra operations = slower system
        Waste Redis commands

    hset is idempotent(does same thing everyt time)
    It overwrites old data automatically
    No need to check or delete beforehand
    Super Efficient

    