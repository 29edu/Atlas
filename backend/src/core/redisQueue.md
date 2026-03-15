
# What Problem RedisQueue solve

    Imagine the Atlas backend without a queue. A user places an order.
    
    My server has to save the order to MongoDB
    Send a confirmation email
    Resize the product image
    Process the Payment

    All of this inside the same request handler, Synchronously. The user's browser is sitting there waiting. If the email server is slow, - the user waits. If the image resize takes 3 seconds. If any step crashes - the entire orders fails, no retrym nothing.

    RedisQueue is the solution to this. 
    
    
