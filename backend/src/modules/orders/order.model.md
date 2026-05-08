# order.model.js

## What is it?

    Defines the shape of an Order document in MongoDB.
    One order belongs to one user and can contain many products.

## Fields

### userId
    Links the order to a User document.
    type: ObjectId, ref: "User" means Mongoose can populate this field:
        Order.findById(id).populate("userId")
    Returns the full User object instead of just the ID.

### products (Array of Objects)

    Why an array?
        A user can order 5 different products in one order.
        You need to store each product's ID, quantity, and price.

        [
            { productId: "abc", quantity: 2, priceAtPurchase: 499 },
            { productId: "def", quantity: 1, priceAtPurchase: 1299 }
        ]

    priceAtPurchase is stored separately because product prices change over time.
    If you only stored productId and looked up the price from Product,
    a price increase would change historical order totals. That is wrong.
    You capture the price at the moment of purchase and freeze it.

### total
    The total amount for the order (sum of all products × quantity).
    min: 0 ensures it can never go negative.

### status
    Tracks where the order is in its lifecycle:

        "pending"            → order created, payment not yet started
        "payment_processing" → payment task is running
        "paid"               → payment succeeded
        "confirmed"          → seller confirmed the order
        "shipped"            → item dispatched
        "delivered"          → item reached the customer
        "cancelled"          → order was cancelled
        "payment_failed"     → payment task failed permanently

    Using enum ensures only these exact strings are accepted.
    Saves "Shipped" with capital S? MongoDB will reject it.

### payment
    An embedded object (not a separate collection) because payment
    info always belongs to exactly one order.

        paymentId  - transaction ID from the payment gateway
        method     - how the user paid: UPI, CASH, DEBIT_CARD, etc.
        status     - "pending", "success", or "failed"

### shippingAddress
    Reference to an Address document.
    Required — an order cannot exist without a delivery address.

## timestamps: true
    MongoDB automatically adds createdAt and updatedAt.
