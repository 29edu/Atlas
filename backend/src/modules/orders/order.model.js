import mongoose from "mongoose";
import Address from "../address/address.model.js";

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

    payment: {
        paymentId: String,
        method: {
            type: String,
            enum: ["UPI", "CASH", "DEBIT_CARD", "CREDIT_CARD", "NET_BANKING", "WALLET"]
        },
        status: {
            type: String,
            enum: ["pending", "success", "failed"],
        }
    },

    shippingAddress: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Address",
        required: true
    }

}, {
    timestamps: true
})

const Order = mongoose.model("Order", orderSchema);

export {
    Order
}

// Array Of Object:-
// Scenario:- When a user orders so amny products, different products and about the order has to be stored somewhere.
// Now i need an array of object where the details of the products ordered by the user can be stored. An user can order many products so i need to store
// the productsId, price at purchase, quantity of that product