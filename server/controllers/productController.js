const Product = require('../models/Product');
const { memoryProducts, mockProducts } = require('../services/seedService');

// @desc    Get all products with filtering, search, sorting & pagination
// @route   GET /api/products
// @access  Public
const getProducts = async (req, res) => {
  const { search, category, sort, page = 1, limit = 12 } = req.query;

  try {
    let query = {};
    if (search) {
      query.title = { $regex: search, $options: 'i' };
    }
    if (category && category !== 'All') {
      query.category = category;
    }

    let sortOption = {};
    if (sort === 'price-asc') sortOption.price = 1;
    else if (sort === 'price-desc') sortOption.price = -1;
    else if (sort === 'newest') sortOption.createdAt = -1;
    else sortOption.createdAt = -1;

    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skip = (pageNum - 1) * limitNum;

    const total = await Product.countDocuments(query);
    let products = await Product.find(query).sort(sortOption).skip(skip).limit(limitNum);

    if (products.length === 0 && total === 0 && !search && (!category || category === 'All')) {
      // Seed if empty
      await Product.insertMany(mockProducts);
      products = await Product.find(query).sort(sortOption).skip(skip).limit(limitNum);
    }

    return res.json({
      success: true,
      count: products.length,
      total,
      page: pageNum,
      pages: Math.ceil(total / limitNum) || 1,
      data: products,
    });
  } catch (error) {
    // Memory Fallback
    let list = [...memoryProducts];
    if (search) {
      list = list.filter((p) => p.title.toLowerCase().includes(search.toLowerCase()));
    }
    if (category && category !== 'All') {
      list = list.filter((p) => p.category === category);
    }
    if (sort === 'price-asc') list.sort((a, b) => a.price - b.price);
    else if (sort === 'price-desc') list.sort((a, b) => b.price - a.price);

    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const startIndex = (pageNum - 1) * limitNum;
    const paginated = list.slice(startIndex, startIndex + limitNum);

    return res.json({
      success: true,
      count: paginated.length,
      total: list.length,
      page: pageNum,
      pages: Math.ceil(list.length / limitNum) || 1,
      data: paginated,
    });
  }
};

// @desc    Get single product by ID
// @route   GET /api/products/:id
// @access  Public
const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (product) {
      return res.json({ success: true, data: product });
    }
  } catch (error) {}

  const memProduct = memoryProducts.find((p) => p._id.toString() === req.params.id);
  if (memProduct) {
    return res.json({ success: true, data: memProduct });
  }

  return res.status(404).json({ success: false, message: 'Product not found' });
};

// @desc    Create a product
// @route   POST /api/products
// @access  Private/Admin
const createProduct = async (req, res) => {
  const { title, description, category, price, stock, image } = req.body;
  try {
    const product = await Product.create({
      title,
      description,
      category,
      price: Number(price),
      stock: Number(stock),
      image,
    });
    return res.status(201).json({ success: true, data: product });
  } catch (error) {
    const newProd = {
      _id: 'prod_' + Date.now(),
      title,
      description,
      category,
      price: Number(price),
      stock: Number(stock),
      image,
      createdAt: new Date(),
    };
    memoryProducts.unshift(newProd);
    return res.status(201).json({ success: true, data: newProd });
  }
};

// @desc    Update a product
// @route   PUT /api/products/:id
// @access  Private/Admin
const updateProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (product) {
      Object.assign(product, req.body);
      const updated = await product.save();
      return res.json({ success: true, data: updated });
    }
  } catch (error) {}

  const idx = memoryProducts.findIndex((p) => p._id.toString() === req.params.id);
  if (idx !== -1) {
    memoryProducts[idx] = { ...memoryProducts[idx], ...req.body };
    return res.json({ success: true, data: memoryProducts[idx] });
  }

  return res.status(404).json({ success: false, message: 'Product not found' });
};

// @desc    Delete a product
// @route   DELETE /api/products/:id
// @access  Private/Admin
const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (product) {
      await product.deleteOne();
      return res.json({ success: true, message: 'Product removed' });
    }
  } catch (error) {}

  const idx = memoryProducts.findIndex((p) => p._id.toString() === req.params.id);
  if (idx !== -1) {
    memoryProducts.splice(idx, 1);
    return res.json({ success: true, message: 'Product removed' });
  }

  return res.status(404).json({ success: false, message: 'Product not found' });
};

module.exports = {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
};
