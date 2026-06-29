const express = require('express');
const { check } = require('express-validator');
const { getCart, addToCart, updateCartItem, removeFromCart } = require('../controllers/cartController');
const { protect } = require('../middleware/authMiddleware');
const validate = require('../middleware/validateMiddleware');

const router = express.Router();

router.use(protect); // All cart routes require user login

router.get('/', getCart);
router.post(
  '/',
  [check('productId', 'Product ID is required').notEmpty()],
  validate,
  addToCart
);
router.put('/:id', updateCartItem);
router.delete('/:id', removeFromCart);

module.exports = router;
