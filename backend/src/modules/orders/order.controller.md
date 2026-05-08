# order.controller.js

## What is it?

    Handles the HTTP logic for creating and retrieving orders.
    It is protected by authMiddleware — req.user.id is always available.

## createOrder

    What the frontend sends:
        POST /orders (with JWT in Authorization header)
        Body: { products, total, status, paymentMethod, addressId }

    What the controller does:

    Step 1: Get userId from req.user.id
        authMiddleware already decoded the JWT and attached req.user.
        No need to ask the frontend who the user is — we trust the token.

    Step 2: Validate the shipping address
        Address.findOne({ _id: addressId, userId })

        Why include userId in the query?
            To make sure the address belongs to THIS user.
            Without it, a user could pass someone else's addressId.
            This is a security check.

        If address not found → 404 "Address Not Found"

    Step 3: Create the order
        Order.create({ userId, products, total, status, shippingAddress: shippingAddress._id })

        Note: paymentMethod is stored as:
            { method: paymentMethod, status: "pending" }
        Status starts as "pending" because payment hasn't happened yet.

    Step 4: Return 201 Created with the order

## getOrders

    Returns all orders for the logged-in user.

        const order = await Order.find({ userId });

    This is not Order.findById() — it's Order.find() with a query object.
    find() returns an ARRAY (zero or more orders).
    findById() returns ONE document.

    Why { userId } instead of just userId?
        find() expects a query condition object.
        { userId } is shorthand for { userId: userId }.

## Payment Status at Order Creation

    When an order is first created, payment status = "pending".
    This is intentional — there are two separate moments:
        1. Order is created (controller does this)
        2. Payment is processed (async task in the queue does this)

    The queue handles payment processing separately so the user
    doesn't have to wait for the payment to complete before getting
    a response from the server.
