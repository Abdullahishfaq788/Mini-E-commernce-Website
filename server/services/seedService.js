const Product = require('../models/Product');
const User = require('../models/User');
const bcrypt = require('bcryptjs');

const mockProducts = [
  {
    _id: '668000000000000000000001',
    title: 'Aura Wireless Noise-Canceling Headphones',
    description: 'Immerse yourself in high-fidelity acoustics with ultra-low latency, 40-hour battery life, and spatial audio support.',
    category: 'Electronics',
    price: 249.99,
    stock: 25,
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&q=80',
    createdAt: new Date(),
  },
  {
    _id: '668000000000000000000002',
    title: 'Minimalist Chronograph Smartwatch',
    description: 'Sleek titanium case featuring continuous heart monitoring, sleep tracking, and custom watch faces.',
    category: 'Electronics',
    price: 199.50,
    stock: 18,
    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&q=80',
    createdAt: new Date(),
  },
  {
    _id: '668000000000000000000003',
    title: 'Ergonomic Mechanical Keyboard',
    description: 'Hot-swappable tactile mechanical switches with per-key RGB lighting and brushed aluminum top chassis.',
    category: 'Electronics',
    price: 129.00,
    stock: 30,
    image: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=800&q=80',
    createdAt: new Date(),
  },
  {
    _id: '668000000000000000000004',
    title: 'Urban Explorer Leather Backpack',
    description: 'Handcrafted genuine leather backpack with padded 15-inch laptop compartment and water-resistant lining.',
    category: 'Fashion',
    price: 159.99,
    stock: 12,
    image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&q=80',
    createdAt: new Date(),
  },
  {
    _id: '668000000000000000000005',
    title: 'Ultra-HD Curved Gaming Monitor 34"',
    description: '144Hz refresh rate, 1ms response time, dynamic HDR, and panoramic ultrawide resolution for cinematic gaming.',
    category: 'Electronics',
    price: 499.00,
    stock: 8,
    image: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=800&q=80',
    createdAt: new Date(),
  },
  {
    _id: '668000000000000000000006',
    title: 'Pro-Precision Wireless Gaming Mouse',
    description: 'Ultralight weight of 60g, 26,000 DPI optical sensor, and zero-lag wireless connectivity.',
    category: 'Electronics',
    price: 79.99,
    stock: 45,
    image: 'https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?w=800&q=80',
    createdAt: new Date(),
  },
  {
    _id: '668000000000000000000007',
    title: 'Artisan Ceramic Pour-Over Coffee Set',
    description: 'Elevate your morning brew with heat-retentive matte ceramic dripper, glass carafe, and stainless steel filter.',
    category: 'Home & Kitchen',
    price: 45.00,
    stock: 20,
    image: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=800&q=80',
    createdAt: new Date(),
  },
  {
    _id: '668000000000000000000008',
    title: 'Active Fit Seamless Gym Hoodie',
    description: 'Breathable moisture-wicking stretch fabric designed for high performance and daily comfort.',
    category: 'Fashion',
    price: 59.95,
    stock: 50,
    image: 'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?w=800&q=80',
    createdAt: new Date(),
  }
];

let memoryProducts = [...mockProducts];
let memoryUsers = [];
let memoryCarts = {}; // user_id -> items
let memoryOrders = [];

const seedDB = async () => {
  try {
    const count = await Product.countDocuments();
    if (count === 0) {
      await Product.insertMany(mockProducts);
      console.log('Sample products seeded into MongoDB successfully!');
    }
  } catch (err) {
    console.log('MongoDB seed check bypassed (Memory fallback ready)');
  }
};

module.exports = {
  seedDB,
  mockProducts,
  memoryProducts,
  memoryUsers,
  memoryCarts,
  memoryOrders,
};
