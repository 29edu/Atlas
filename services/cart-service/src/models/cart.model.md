# cart.model.js

## What is it?

    Defines the shape of a Cart document in MongoDB.
    Every user has one cart that holds items they intend to buy.

## Fields

    userId
        - ObjectId linking to the User who owns this cart
        - One user → one cart (you'd enforce this in the controller with findOne)

    Items (array of objects)
        Each item has:
            productId - which product
            quantity  - how many
            price     - price of this product at the time it was added

        Why store price here?
            Product prices can change. If a user adds something to cart and
            the price changes before checkout, you need to know the price
            they saw when they added it (or update it at checkout).

    total
        - The running sum of all items in the cart
        - Updated whenever items are added, removed, or quantities change

## Cart vs Order

    Cart = "things I want to buy" (mutable, user edits it freely)
    Order = "things I bought" (immutable record, created at checkout)

    At checkout:
        1. Cart is read → Order is created from cart items
        2. Cart can be cleared or left as is

## Status

    This model is a basic structure — the controller and routes for cart
    operations (add item, remove item, update quantity) are not yet implemented.
