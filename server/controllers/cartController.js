const Cart = require('../models/Cart');
const Product = require('../models/Product');
const { memoryCarts, memoryProducts } = require('../services/seedService');

// @desc    Get logged in user cart
// @route   GET /api/cart
// @access  Private
const getCart = async (req, res) => {
  const userId = req.user.id;
  try {
    let cart = await Cart.findOne({ user: userId }).populate('products.product');
    if (!cart) {
      cart = await Cart.create({ user: userId, products: [] });
    }
    return res.json({ success: true, data: cart });
  } catch (error) {
    let memItems = memoryCarts[userId] || [];
    // Map product data
    const populated = memItems.map((item) => {
      const prod = memoryProducts.find((p) => p._id.toString() === item.product.toString()) || {
        _id: item.product,
        title: 'Sample Product',
        price: 99.99,
        image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&q=80',
      };
      return { _id: item._id, product: prod, quantity: item.quantity };
    });
    return res.json({ success: true, data: { user: userId, products: populated } });
  }
};

// @desc    Add product to cart or update quantity
// @route   POST /api/cart
// @access  Private
const addToCart = async (req, res) => {
  const userId = req.user.id;
  const { productId, quantity = 1 } = req.body;

  try {
    let cart = await Cart.findOne({ user: userId });
    if (!cart) {
      cart = new Cart({ user: userId, products: [] });
    }

    const existingIndex = cart.products.findIndex((p) => p.product.toString() === productId);
    if (existingIndex > -1) {
      cart.products[existingIndex].quantity += Number(quantity);
    } else {
      cart.products.push({ product: productId, quantity: Number(quantity) });
    }

    await cart.save();
    const updatedCart = await Cart.findById(cart._id).populate('products.product');
    return res.status(200).json({ success: true, data: updatedCart });
  } catch (error) {
    if (!memoryCarts[userId]) memoryCarts[userId] = [];
    const idx = memoryCarts[userId].findIndex((item) => item.product.toString() === productId);
    if (idx > -1) {
      memoryCarts[userId][idx].quantity += Number(quantity);
    } else {
      memoryCarts[userId].push({
        _id: 'item_' + Date.now(),
        product: productId,
        quantity: Number(quantity),
      });
    }

    const populated = memoryCarts[userId].map((item) => {
      const prod = memoryProducts.find((p) => p._id.toString() === item.product.toString()) || {
        _id: item.product,
        title: 'Sample Product',
        price: 99.99,
        image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&q=80',
      };
      return { _id: item._id, product: prod, quantity: item.quantity };
    });
    return res.status(200).json({ success: true, data: { user: userId, products: populated } });
  }
};

// @desc    Update cart item quantity
// @route   PUT /api/cart/:id
// @access  Private
const updateCartItem = async (req, res) => {
  const userId = req.user.id;
  const productId = req.params.id; // item product id or item id
  const { quantity } = req.body;

  try {
    let cart = await Cart.findOne({ user: userId });
    if (cart) {
      const item = cart.products.find((p) => p.product.toString() === productId || p._id.toString() === productId);
      if (item) {
        item.quantity = Number(quantity);
        await cart.save();
        const updatedCart = await Cart.findById(cart._id).populate('products.product');
        return res.json({ success: true, data: updatedCart });
      }
    }
  } catch (error) {}

  if (memoryCarts[userId]) {
    const item = memoryCarts[userId].find((p) => p.product.toString() === productId || p._id.toString() === productId);
    if (item) {
      item.quantity = Number(quantity);
    }
  }

  const populated = (memoryCarts[userId] || []).map((item) => {
    const prod = memoryProducts.find((p) => p._id.toString() === item.product.toString()) || {
      _id: item.product,
      title: 'Sample Product',
      price: 99.99,
      image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&q=80',
    };
    return { _id: item._id, product: prod, quantity: item.quantity };
  });
  return res.json({ success: true, data: { user: userId, products: populated } });
};

// @desc    Remove product from cart or clear cart
// @route   DELETE /api/cart/:id
// @access  Private
const removeFromCart = async (req, res) => {
  const userId = req.user.id;
  const targetId = req.params.id;

  try {
    let cart = await Cart.findOne({ user: userId });
    if (cart) {
      if (targetId === 'clear') {
        cart.products = [];
      } else {
        cart.products = cart.products.filter((p) => p.product.toString() !== targetId && p._id.toString() !== targetId);
      }
      await cart.save();
      const updatedCart = await Cart.findById(cart._id).populate('products.product');
      return res.json({ success: true, data: updatedCart });
    }
  } catch (error) {}

  if (memoryCarts[userId]) {
    if (targetId === 'clear') {
      memoryCarts[userId] = [];
    } else {
      memoryCarts[userId] = memoryCarts[userId].filter(
        (p) => p.product.toString() !== targetId && p._id.toString() !== targetId
      );
    }
  }

  const populated = (memoryCarts[userId] || []).map((item) => {
    const prod = memoryProducts.find((p) => p._id.toString() === item.product.toString()) || {
      _id: item.product,
      title: 'Sample Product',
      price: 99.99,
      image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&q=80',
    };
    return { _id: item._id, product: prod, quantity: item.quantity };
  });
  return res.json({ success: true, data: { user: userId, products: populated } });
};

module.exports = {
  getCart,
  addToCart,
  updateCartItem,
  removeFromCart,
};
