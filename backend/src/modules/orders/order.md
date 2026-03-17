
# Difference between findByID and find

    findById or findOne() returns one object and find returns all orders whose userId is this.

    find expects curly braces 
    const order = Order.find( {userId});
    This is query function. It expects condition and based on condition it gives the result

    for eg:- Order.find( {userId: userId, status: "updated"});

    But const order = Order.findById(userId); // It doesn't need curly braces. Internally it does automatically

    