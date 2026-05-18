# address.model.js

## What is it?

    Defines the shape of an Address document in MongoDB.
    Each address belongs to one user.
    Orders reference an address by its ObjectId for shipping.

## Why is address a separate collection?

    A user can have multiple addresses:
        - Home address
        - Office address
        - A friend's address for gift delivery

    If address was embedded inside User, managing multiple addresses is messy.
    As a separate collection, you can:
        - List all of a user's saved addresses
        - Let the user pick one at checkout
        - Delete or update one address without touching others

## Fields

    userId       - ObjectId linking to the User. Every address belongs to one user.
    country      - Country name (String, no constraints — flexibility for all countries)
    fullName     - Recipient's full name (may differ from account name for gifts)
    mobileNumber - Contact number for delivery agent
    pincode      - Postal code for routing
    flat         - Flat/apartment/house number
    street       - Street name
    landMark     - Nearby landmark for directions
    city         - City name
    state        - State/province

## Security Rule (applied in order.controller.js)

    When creating an order, the address is verified like this:
        Address.findOne({ _id: addressId, userId })

    Both the address ID AND the userId must match.
    This prevents a user from using another user's address ID in their order.
