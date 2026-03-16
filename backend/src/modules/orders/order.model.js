import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },

    products: [
        {
            productId : {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Product"
            },

            quantity: {
                type: Number,
                required: true
            },
            priceAtPurchase: {
                type: Number,
                required: true,
            }
        }
    ],

    total: {
        type: Number,
        min: 0,
    },

    status: {
        type: String,
        enum: ["pending", "payment_processing", "paid", "confirmed", "shipped", "delivered", "cancelled", "payment_failed"],
    },

    createdAt: { // when the order was placed
        type: Date,
        default: Date.now
    },

    updatedAt: { // when the status of the order is changed
        
        type: Date,
        default: Date.now
    } 

})

const Order = mongoose.model("Model", orderSchema);

export {
    Order
}

// Array Of Object:-
// Scenario:- When a user orders so amny products, different products and about the order has to be stored somewhere.
// Now i need an array of object where the details of the products ordered by the user can be stored. An user can order many products so i need to store
// the productsId, price at purchase, quantity of that product