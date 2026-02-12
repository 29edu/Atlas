import mongoose from "mongoose";

const cartSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },

    Items: [{
        productId: mongoose.Schema.Types.ObjectId,
        ref: "Product",
        quantity: Number,
        price: Number,
    }],

    total: Number,
}, {
    timestamps: true
})