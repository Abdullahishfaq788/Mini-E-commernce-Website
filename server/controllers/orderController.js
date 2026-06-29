const Order = require('../models/Order');
const Cart = require('../models/Cart');
const { memoryOrders, memoryCarts } = require('../services/seedService');

// @desc    Create new order
// @route   POST /api/orders
// @access  Private
const createOrder = async (req, res) => {
  const userId = req.user.id;
  const { items, totalPrice, shippingAddress, paymentMethod } = req.body;

  if (!items || items.length === 0) {
    return res.status(400).json({ success: false, message: 'No order items provided' });
  }

  try {
    const order = new Order({
      user: userId,
      items,
      totalPrice,
      shippingAddress,
      paymentMethod: paymentMethod || 'Credit Card',
    });

    const createdOrder = await order.save();

    // Clear user cart
    try {
      await Cart.findOneAndUpdate({ user: userId }, { products: [] });
    } catch (e) {}

    return res.status(201).json({ success: true, data: createdOrder });
  } catch (error) {
    const newOrd = {
      _id: 'ord_' + Date.now(),
      user: userId,
      items,
      totalPrice,
      shippingAddress,
      paymentMethod: paymentMethod || 'Credit Card',
      orderStatus: 'Pending',
      createdAt: new Date(),
    };
    memoryOrders.unshift(newOrd);
    memoryCarts[userId] = [];

    return res.status(201).json({ success: true, data: newOrd });
  }
};

// @desc    Get logged in user orders (or all if admin)
// @route   GET /api/orders
// @access  Private
const getOrders = async (req, res) => {
  const userId = req.user.id;
  try {
    let query = req.user.role === 'admin' ? {} : { user: userId };
    const orders = await Order.find(query).sort({ createdAt: -1 });
    return res.json({ success: true, count: orders.length, data: orders });
  } catch (error) {
    let list = memoryOrders;
    if (req.user.role !== 'admin') {
      list = list.filter((o) => o.user.toString() === userId.toString());
    }
    return res.json({ success: true, count: list.length, data: list });
  }
};

// @desc    Get order by ID
// @route   GET /api/orders/:id
// @access  Private
const getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (order) {
      return res.json({ success: true, data: order });
    }
  } catch (error) {}

  const memOrd = memoryOrders.find((o) => o._id.toString() === req.params.id);
  if (memOrd) {
    return res.json({ success: true, data: memOrd });
  }

  return res.status(404).json({ success: false, message: 'Order not found' });
};

// @desc    Update order status
// @route   PUT /api/orders/:id
// @access  Private/Admin
const updateOrderStatus = async (req, res) => {
  const { orderStatus } = req.body;
  try {
    const order = await Order.findById(req.params.id);
    if (order) {
      order.orderStatus = orderStatus;
      const updated = await order.save();
      return res.json({ success: true, data: updated });
    }
  } catch (error) {}

  const memOrd = memoryOrders.find((o) => o._id.toString() === req.params.id);
  if (memOrd) {
    memOrd.orderStatus = orderStatus;
    return res.json({ success: true, data: memOrd });
  }

  return res.status(404).json({ success: false, message: 'Order not found' });
};

// @desc    Cancel / Delete order
// @route   DELETE /api/orders/:id
// @access  Private
const deleteOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (order) {
      await order.deleteOne();
      return res.json({ success: true, message: 'Order cancelled' });
    }
  } catch (error) {}

  const idx = memoryOrders.findIndex((o) => o._id.toString() === req.params.id);
  if (idx !== -1) {
    memoryOrders.splice(idx, 1);
    return res.json({ success: true, message: 'Order cancelled' });
  }

  return res.status(404).json({ success: false, message: 'Order not found' });
};

module.exports = {
  createOrder,
  getOrders,
  getOrderById,
  updateOrderStatus,
  deleteOrder,
};
