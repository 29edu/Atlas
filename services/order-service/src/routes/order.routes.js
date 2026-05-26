
import express from 'express';
const router = express.Router();

import { createOrder, getOrders } from '../controllers/order.controller.js';

router.get('/order', getOrders);
router.post('/order', createOrder);

export default router;