
import { PaymentService} from "../services/payment.service.js";

const paymentService = new PaymentService();

// This will be called at checkout
const initiatePayment = async (req, res) => {
    try {
        const {orderId, amount, currency} = req.body;
    
        if(!orderId || amount <= 0 || !currency) {
            return res.status(400).json({
                success: false,
                message: "Invalid data"
            })
        }
    
        const razorPayOrder = await paymentService.createPaymentOrder(orderId, amount, currency);
    
        res.status(200).json({
            success: true,
            razorPayOrder
        })
    } catch (error) {
        
        return res.status(500).json({
            success: false,
            message: error.message
        })
    }
}

// Frontend will call this after verification

const verifyPayment = async (req, res) => {
    
    try {
        const {razorpayOrderId, razorpayPaymentId, razorSignature, orderId, userId} = req.body;
    
        const isValid = await paymentService.verifyPayment(razorpayOrderId, razorpayPaymentId, razorSignature);
    
        if(!isValid) {
            return res.status(400).json({
                success: false,
                error: "Invalid payment"
            })
        }
    
        const payment = await paymentService.savePayment(
            orderId,
            userId,
            {
                amount: req.body.amount,
                currency: req.body.currency || "INR",
                method: req.body.method,
                gatewayOrderId: req.body.gatewayOrderId,
                gatewayPaymentId: req.body.gatewayPaymentId
            }
        )
    
        await paymentService.updatePaymentStatus(payment._id, "SUCCESS", {}) // will add this later
    
        return res.status(200).json({
            success: true,
            message: "Payment is Successful",
            payment: {
                payment
            }
        })
    } catch (error) {
        
        return res.status(500).json({
            success: false,
            message: error.message
        })
    }
}

// Admin or System will initiate the refund

const refundPayment = async (req, res) => {

    try {
        const {paymentId, refundAmount} = req.body;
    
        const refund = await paymentService.processRefund(paymentId, refundAmount);
    
        if(!refund) {
            return res.status(500).json({
                success: false,
                message: "Failed to refund the Payment"
            })
        }
    
        // await paymentService.updatePaymentStatus(paymentId, "REFUNDED", {}); I don't need to call this because 
        // refund me update ho ja raha hai
    
        return res.status(200).json({
            success: true,
            message: "Refund Complete"
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        })
    }
}

const getPaymentStatus = async (req, res) => {
    
    try {
        const {orderId} = req.params;
    
        const paymentStatus = await paymentService.getPaymentOrderById(orderId);
    
        if(!paymentStatus) {
            return res.status(404).json({
                success: false,
                message: "Failed to get payment Status"
            })
        }
    
        return res.status(200).json({
            success: true, 
            message: "Successful fetching",
            paymentStatus: paymentStatus
        })
    } catch (error) {
        
        return res.status(500).json({
            success: false,
            message: error.message
        })
    }
}

export { initiatePayment, verifyPayment, refundPayment, getPaymentStatus }