const express = require('express');
const Product = require('../models/Product');

const router = express.Router();

const SORT_MAP = {
  price_asc: { price: 1 },
  price_desc: { price: -1 },
  rating: { rating: -1 },
  newest: { createdAt: -1 },
};

// GET /api/products?search=&category=&brand=&minPrice=&maxPrice=&minRating=&sort=&page=&limit=
router.get('/', async (req, res) => {
  try {
    const {
      search,
      category,
      brand,
      minPrice,
      maxPrice,
      minRating,
      sort = 'newest',
      page = 1,
      limit = 12,
    } = req.query;

    const query = {};
    if (search) query.$text = { $search: search };
    if (category) query.category = category;
    if (brand) query.brand = { $in: brand.split(',') };
    if (minRating) query.rating = { $gte: Number(minRating) };
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }

    const skip = (Number(page) - 1) * Number(limit);
    const sortOption = SORT_MAP[sort] || SORT_MAP.newest;

    const [products, total] = await Promise.all([
      Product.find(query).skip(skip).limit(Number(limit)).sort(sortOption),
      Product.countDocuments(query),
    ]);

    res.json({ products, total, page: Number(page), pages: Math.ceil(total / limit) });
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch products', error: err.message });
  }
});

router.get('/categories', async (req, res) => {
  const categories = await Product.distinct('category');
  res.json(categories);
});

router.get('/brands', async (req, res) => {
  const brands = await Product.distinct('brand');
  res.json(brands);
});

router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.json(product);
  } catch (err) {
    res.status(400).json({ message: 'Invalid product id' });
  }
});

module.exports = router;
