
import express from  'express'

const router = express.Router();

import { initiatePayment, verifyPayment, refundPayment, getPaymentStatus } from './payment.controller.js';
import authMiddleware from '../shared/middlewares/auth.middleware.js';

router.post('/payment/initiate', authMiddleware, initiatePayment);
router.post("/payment/verify", authMiddleware, verifyPayment);
router.post("/payment/refund",authMiddleware, refundPayment);
router.get("/payment/status/:id", authMiddleware, getPaymentStatus);

export default router;