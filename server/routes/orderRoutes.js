const express = require('express');
const { check } = require('express-validator');
const {
  createOrder,
  getOrders,
  getOrderById,
  updateOrderStatus,
  deleteOrder,
} = require('../controllers/orderController');
const { protect, adminOnly } = require('../middleware/authMiddleware');
const validate = require('../middleware/validateMiddleware');

const router = express.Router();

router.use(protect); // All order routes require authentication

router.post(
  '/',
  [
    check('items', 'Order items are required').isArray({ min: 1 }),
    check('shippingAddress.address', 'Address is required').notEmpty(),
    check('shippingAddress.city', 'City is required').notEmpty(),
    check('shippingAddress.postalCode', 'Postal Code is required').notEmpty(),
    check('shippingAddress.country', 'Country is required').notEmpty(),
  ],
  validate,
  createOrder
);

router.get('/', getOrders);
router.get('/:id', getOrderById);
router.put('/:id', adminOnly, updateOrderStatus);
router.delete('/:id', deleteOrder);

module.exports = router;
