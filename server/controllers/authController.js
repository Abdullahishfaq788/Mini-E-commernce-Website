const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { memoryUsers } = require('../services/seedService');

const generateToken = (user) => {
  return jwt.sign(
    { id: user._id || user.id, email: user.email, role: user.role },
    process.env.JWT_SECRET || 'super_secret_jwt_key_mini_ecommerce_2026_dev_key',
    { expiresIn: '30d' }
  );
};

// @desc    Register new user
// @route   POST /api/auth/register
// @access  Public
const registerUser = async (req, res) => {
  const { name, email, password, role } = req.body;

  try {
    // Try Mongoose DB
    let userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ success: false, message: 'User already exists with this email' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role: role || 'user',
    });

    const token = generateToken(user);

    return res.status(201).json({
      success: true,
      data: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        token,
      },
    });
  } catch (error) {
    // Fallback to memoryUsers if DB disconnected
    const existingMem = memoryUsers.find((u) => u.email.toLowerCase() === email.toLowerCase());
    if (existingMem) {
      return res.status(400).json({ success: false, message: 'User already exists with this email' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const newUser = {
      _id: 'mem_user_' + Date.now(),
      name,
      email,
      password: hashedPassword,
      role: role || 'user',
      createdAt: new Date(),
    };
    memoryUsers.push(newUser);
    const token = generateToken(newUser);

    return res.status(201).json({
      success: true,
      data: {
        _id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
        token,
      },
    });
  }
};

// @desc    Authenticate user & get token
// @route   POST /api/auth/login
// @access  Public
const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (user && (await bcrypt.compare(password, user.password))) {
      const token = generateToken(user);
      return res.json({
        success: true,
        data: {
          _id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          token,
        },
      });
    } else if (user) {
      return res.status(401).json({ success: false, message: 'Invalid email or password' });
    }
  } catch (error) {
    // Continue to check memory fallback
  }

  // Check Memory Fallback
  const memUser = memoryUsers.find((u) => u.email.toLowerCase() === email.toLowerCase());
  if (memUser && (await bcrypt.compare(password, memUser.password))) {
    const token = generateToken(memUser);
    return res.json({
      success: true,
      data: {
        _id: memUser._id,
        name: memUser.name,
        email: memUser.email,
        role: memUser.role,
        token,
      },
    });
  }

  return res.status(401).json({ success: false, message: 'Invalid email or password' });
};

// @desc    Get user profile
// @route   GET /api/auth/profile
// @access  Private
const getUserProfile = async (req, res) => {
  try {
    let user;
    try {
      user = await User.findById(req.user.id).select('-password');
    } catch (e) {}

    if (!user) {
      user = memoryUsers.find((u) => u._id === req.user.id);
    }

    if (user) {
      const { password, ...userData } = user._doc || user;
      return res.json({ success: true, data: userData });
    } else {
      return res.json({
        success: true,
        data: {
          _id: req.user.id,
          email: req.user.email,
          role: req.user.role,
          name: req.user.email.split('@')[0],
        },
      });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error retrieving profile' });
  }
};

module.exports = { registerUser, loginUser, getUserProfile };
