
import express from  'express'

const router = express.Router();

import { initiatePayment, verifyPayment, refundPayment, getPaymentStatus } from '../controllers/payment.controller.js';
import authMiddleware from '../../../../shared/middlewares/auth.middleware.js';

router.post("/initiate", authMiddleware, initiatePayment);
router.post("/verify", authMiddleware, verifyPayment);
router.post("/refund", authMiddleware, refundPayment);
router.get("/status/:id", authMiddleware, getPaymentStatus);

export default router;