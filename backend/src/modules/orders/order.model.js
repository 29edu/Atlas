import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },

    products: [{
        productId: ObjectId,
        quantity: Number,
        priceAtPurchase: Number
    }],

    total: {
        type: Number,
        min: 0,
    },

    status: {
        type: String,
        enum: ["pending", "processing", "completed", "failed"],
    },

    tasks: [{
        type: String, 
        status: String,
        priority: Number,
        completedAt: Date,
    }],

    createdAt: Date
})

const Order = mongoose.model("Model", orderSchema);

export {
    Order
}