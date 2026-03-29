const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth.middleware');
const { getOrders, createOrder, getOrderById, cancelOrder } = require('../controllers/order.controller');

router.use(auth);
router.get('/', getOrders);
router.post('/', createOrder);
router.get('/:id', getOrderById);
router.put('/:id/cancel', cancelOrder);

module.exports = router;
