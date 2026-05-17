
import Razorpay from "razorpay"
import { Payment } from "./payment.model.js";

import { validatePaymentVerification } from "razorpay/dist/utils/razorpay-utils"; // inbuilt function in razor pay , directly access it

class PaymentService {

    // Create a razorpay order (called when the user hits checkout)

    constructor() {
        this.razorpay = new Razorpay({
            key_id: process.env.RAZORPAY_KEY_ID,
            key_secret: process.env.RAZORPAY_KEY_SECRET
        })
    }

    async createPaymentOrder(orderId, amount, currency) {

        try {
            const amountInPaisa = amount * 100;
            const defaultCurrency = "INR";
            const receipt = `recipt_${orderId}`;

            const order = await this.razorpay.orders.create({
                amount: amountInPaisa,
                currency:defaultCurrency,
                receipt: receipt
            })

            return order;
        } catch (error) {
            console.log(`Found Error in Payment Service`, error.message);

            throw new Error(`Failed to create new Payment with OrderId ${orderId}`); // will be catch by controller
        }
    }

    // verify signature after frontend complete payment
    // Razorpay sends: raozrpay_order_id, razor
    async verifyPayment(razorpayOrderId, razorpayPaymentId, razorSignature) {

        try {
            const isValid = validatePaymentVerification (
                {
                    order_id : razorpayOrderId,
                    payment_id: razorpayPaymentId
                },
                razorSignature,
                process.env.RAZORPAY_KEY_SECRET
            );
    
            return isValid; // return true or false
        } catch (error) {
            console.log(`Failed to verify the payment`)
        }
    }

    // Save Payment record to mongoDB after successfull verification
    async savePayment(orderId, userId, paymentData) {

        try {
            const payment = await Payment.create({
                orderId,
                userId,
                amount: paymentData.amount,
                currency: paymentData.currency,
                paymentMode: paymentData.method,
                paymentProvider: "RAZORPAY",
                paymentStatus: "PENDING",
                transaction: {
                    gatewayOrderId: paymentData.gatewayOrderId, // gatewayorderId is given by the gateway like Razorpay or paytm, 
                    gatewayPaymentId: paymentData.gatewayPaymentId
                },
            });
    
            return payment;
        } catch (error) {
            console.log(`Failed to save the payment with OrderId ${orderId}`);
        }
    }

    // Update payment status in DB (PENDING -> SUCCESS OR FAILED)
    async updatePaymentStatus(paymentId, status, gatewatResponse) {

        try {
            const payment = await Payment.findById(paymentId);
    
            if(!payment) {
                throw new Error(`Payment ${paymentId} not found`);
            }
    
            payment.paymentStatus = status;
            payment.gatewatResponse = gatewatResponse;
    
            await payment.save();
    
            return payment;
        } catch (error) {
            console.log(`Failed to update the Payment Status ${paymentId}`)
        }
    }

    // Initiate refund via razorpay + updateDB
    async processRefund(paymentId, refundAmount) {

        try {
            const payment = await Payment.findById(paymentId);
    
            if(!payment) {
                throw new Error(`Payment ${paymentId} not found`);
            }
    
            // To get the refundId i need to get it from the razor pay using API
            const razorRefund = await this.razorpay.payments.refund(payment.transaction.gatewayPaymentId, {amount: refundAmount * 100})
    
            payment.refund.refundId = razorRefund.id; // given by razor pay
            payment.refund.refundAmount = refundAmount;
            payment.refund.refundAt = new Date();
            payment.paymentStatus = "REFUNDED";
    
            await payment.save();
    
            return payment;
        } catch (error) {
            console.log(`Failed to Refund the Amount with Payment Id ${paymentId}`)
        }
    }

    // Handle failures - save reason and code into failure field
    async handleFailure(paymentId, reason, code)  {
        
        try {
            const payment = await Payment.findById(paymentId);

            if(!payment) {
                throw new Error(`Payment ${paymentId} not found`);
            }
            
            payment.failure.failure = reason;
            payment.failure.code = code;
            payment.failure.failedAt = new Date();
    
            await payment.save();
    
            return payment;
        } catch (error) {
            console.log(`Failed to handle Failure with payment Id ${paymentId}`)
        }
    }

    // get payment details by orderId (for order statu page)
    async getPaymentOrderById(orderId) {

        try {
            const payment = await Payment.findOne({orderId});
            
            if(!payment) {
                throw new Error(`Payment for order ${orderId} doesn't exist`);
            }
    
            return payment;
        } catch (error) {
            console.log(`Failed to getPayment Order By Id ${orderId}`)
        }
    }
}