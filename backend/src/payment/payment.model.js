
import mongoose from "mongoose";

const paymentSchema = new mongoose.Schema ({
    orderId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Order",
        required: true
    },

    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },

    paymentMode: {
        type: String,
        enum: ["UPI", "CASH", "DEBIT_CARD", "CREDIT_CARD", "NET_BANKING", "WALLET"],
        required: true
    },

    paymentProvider: {
        type: String, 
        enum: ["RAZORPAY", "STRIPE", "COD", "BANK_TRANSFER"],
        required: true
    },

    transactionId: {
        type: String,
        default: null // After the payment happen, the transactionId will change to some value
    },

    amount: {
        type: Number,
        required: true
    },

    currency: {
        type: String,
        default: "INR"
    },

    paymentStatus: {
        type: String,
        enum : [
            "PENDING",
            "PROCESSING",
            "SUCCESS",
            "FAILED",
            "REFUNDED",
            "PARTIALLY_REFUNDED"
        ],
        default: "PENDING"
    },

    // for successful transaction
    transaction: {
        transactionId: {
            type: String,
            default: null
        },

        gatewayOrderId: {
            type: String,
            default: null
        },

        gatewayPaymentId: {
            type: String,
            default: null
        },

        paidAt: {
            type: Date,
            default:null
        },
    },

    // In case of failure
    failure: {
        reason: {
            type: String,
            default: null
        },

        code: {
            type: String,
            default: null
        },

        failedAt: {
            type: Date,
            default: null
        },

    },

    // Refund
    refund: {
        refundId : {
            type: String,
            default: null
        },

        refundAmount : {
            type:Number,
            default: 0
        },

        refundAt: {
            type: Date,
            default: null
        }
    },

    gatewatResponse: {
        type: Object,
        default: {}
    }
}, {
    timestamps: true
})

const Payment = mongoose.model("Payment", paymentSchema);

export {Payment}