import express from 'express';
import { Product } from '../models/Product.js';
import { protect, adminOnly } from '../middleware/auth.js';

const router = express.Router();

// @route   GET /api/products
// @desc    Get all products with optional filters (category, search, featured, sale)
router.get('/', async (req, res) => {
  try {
    const { category, search, featured, sale } = req.query;
    let query = { active: true };

    if (category && category !== 'all') {
      if (category === 'sale') {
        query.isSale = true;
      } else {
        query.category = category;
      }
    }

    if (featured === 'true') {
      query.isFeatured = true;
    }

    if (sale === 'true') {
      query.isSale = true;
    }

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { categoryName: { $regex: search, $options: 'i' } },
        { tags: { $in: [new RegExp(search, 'i')] } },
      ];
    }

    const products = await Product.find(query).sort({ createdAt: -1 });
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: 'Server error retrieving products', error: error.message });
  }
});

// @route   GET /api/products/:slug
// @desc    Get single product by slug or ID
router.get('/:slug', async (req, res) => {
  try {
    const { slug } = req.params;
    let product = await Product.findOne({ slug: slug.toLowerCase() });

    if (!product && slug.match(/^[0-9a-fA-F]{24}$/)) {
      product = await Product.findById(slug);
    }

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    res.json(product);
  } catch (error) {
    res.status(500).json({ message: 'Server error retrieving product', error: error.message });
  }
});

// @route   POST /api/products
// @desc    Create new product (Admin)
router.post('/', protect, adminOnly, async (req, res) => {
  try {
    const {
      title,
      category,
      categoryName,
      price,
      oldPrice,
      sku,
      stock,
      tags,
      images,
      description,
      specs,
      isFeatured,
      isSale,
      slug: customSlug
    } = req.body;

    const slug = customSlug
      ? customSlug.toLowerCase().replace(/[^a-z0-9]+/g, '-')
      : title.toLowerCase().replace(/[^a-z0-9]+/g, '-');

    const existing = await Product.findOne({ slug });
    const finalSlug = existing ? `${slug}-${Date.now()}` : slug;

    const product = new Product({
      slug: finalSlug,
      title,
      category: category || 'dresses',
      categoryName: categoryName || 'Handcrafted Batik',
      price: Number(price) || 0,
      oldPrice: oldPrice ? Number(oldPrice) : null,
      sku: sku || 'CB-' + Math.floor(100 + Math.random() * 900),
      stock: stock !== undefined ? Number(stock) : 10,
      inStock: (stock !== undefined ? Number(stock) : 10) > 0,
      tags: Array.isArray(tags) ? tags : [],
      images: Array.isArray(images) && images.length > 0 ? images : ['/images/01.jpeg'],
      description: description || '',
      specs: specs || {},
      isFeatured: Boolean(isFeatured),
      isSale: Boolean(isSale),
    });

    const saved = await product.save();
    res.status(201).json(saved);
  } catch (error) {
    res.status(400).json({ message: 'Failed to create product', error: error.message });
  }
});

// @route   PUT /api/products/:id
// @desc    Update product (Admin)
router.put('/:id', protect, adminOnly, async (req, res) => {
  try {
    const { id } = req.params;
    let product;

    if (id.match(/^[0-9a-fA-F]{24}$/)) {
      product = await Product.findById(id);
    } else {
      product = await Product.findOne({ slug: id });
    }

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    const updatableFields = [
      'title', 'category', 'categoryName', 'price', 'oldPrice', 'sku',
      'stock', 'inStock', 'tags', 'images', 'description', 'specs',
      'isFeatured', 'isSale', 'active'
    ];

    updatableFields.forEach((field) => {
      if (req.body[field] !== undefined) {
        product[field] = req.body[field];
      }
    });

    if (req.body.stock !== undefined) {
      product.inStock = Number(req.body.stock) > 0;
    }

    const updated = await product.save();
    res.json(updated);
  } catch (error) {
    res.status(400).json({ message: 'Failed to update product', error: error.message });
  }
});

// @route   DELETE /api/products/:id
// @desc    Delete product (Admin)
router.delete('/:id', protect, adminOnly, async (req, res) => {
  try {
    const { id } = req.params;
    let deleted;

    if (id.match(/^[0-9a-fA-F]{24}$/)) {
      deleted = await Product.findByIdAndDelete(id);
    } else {
      deleted = await Product.findOneAndDelete({ slug: id });
    }

    if (!deleted) {
      return res.status(404).json({ message: 'Product not found' });
    }

    res.json({ message: 'Product deleted successfully', id });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete product', error: error.message });
  }
});

export default router;
