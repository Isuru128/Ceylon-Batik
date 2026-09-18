import express from 'express';
import { Order } from '../models/Order.js';
import { User } from '../models/User.js';
import jwt from 'jsonwebtoken';

const router = express.Router();

// Helper to extract user ID optionally from token
const getOptionalUserId = (req) => {
  try {
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      const token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'ceylon_batik_secret');
      return decoded.id;
    }
  } catch {}
  return null;
};

// @route   POST /api/orders
// @desc    Create new order
router.post('/', async (req, res) => {
  try {
    const {
      customer,
      items,
      subtotal,
      shipping,
      discountAmount,
      couponCode,
      total,
      paymentMethod
    } = req.body;

    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ message: 'Cart items cannot be empty' });
    }

    if (!customer || !customer.fullName || !customer.phone || !customer.address) {
      return res.status(400).json({ message: 'Recipient name, phone, and delivery address are required' });
    }

    const orderNumber = 'CB-ORD-' + Math.floor(1000 + Math.random() * 9000);
    const userId = getOptionalUserId(req);

    const order = new Order({
      orderNumber,
      user: userId || null,
      customer: {
        fullName: customer.fullName,
        email: customer.email || '',
        phone: customer.phone,
        address: customer.address,
        city: customer.city || 'Colombo'
      },
      items: items.map(i => ({
        id: String(i.id),
        slug: i.slug,
        title: i.title,
        price: Number(i.price),
        quantity: Number(i.quantity) || 1,
        size: i.size || 'Standard',
        image: i.image || '/images/01.jpeg',
        category: i.category || ''
      })),
      subtotal: Number(subtotal),
      shipping: Number(shipping) || 0,
      discountAmount: Number(discountAmount) || 0,
      couponCode: couponCode || '',
      total: Number(total),
      paymentMethod: paymentMethod || 'cod',
      status: 'Processing'
    });

    const savedOrder = await order.save();

    if (userId) {
      await User.findByIdAndUpdate(userId, { $inc: { ordersCount: 1 } });
    }

    res.status(201).json(savedOrder);
  } catch (error) {
    console.error('Order creation error:', error);
    res.status(500).json({ message: 'Failed to place order', error: error.message });
  }
});

// @route   GET /api/orders/my-orders
// @desc    Get orders for current user
router.get('/my-orders', async (req, res) => {
  try {
    const userId = getOptionalUserId(req);
    const userEmail = req.query.email;

    let query = {};
    if (userId) {
      query.user = userId;
    } else if (userEmail) {
      query['customer.email'] = userEmail.toLowerCase();
    } else {
      return res.json([]);
    }

    const orders = await Order.find(query).sort({ createdAt: -1 });
    const formatted = orders.map(o => ({
      id: o.orderNumber,
      date: new Date(o.createdAt).toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' }),
      status: o.status,
      items: o.items.map(i => ({
        title: i.title,
        qty: i.quantity,
        price: i.price,
        size: i.size,
        image: i.image
      })),
      total: o.total,
      paymentMethod: o.paymentMethod === 'cod' ? 'Cash on Delivery' : (o.paymentMethod === 'kokoPay' ? 'KokoPay (3 installments)' : (o.paymentMethod === 'mintPay' ? 'MintPay (3 installments)' : 'Credit / Debit Card')),
      trackingNumber: o.trackingNumber
    }));

    res.json(formatted);
  } catch (error) {
    res.status(500).json({ message: 'Failed to retrieve orders', error: error.message });
  }
});

// @route   GET /api/orders/:id
// @desc    Get order details
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const order = await Order.findOne({
      $or: [{ orderNumber: id }, { _id: id.match(/^[0-9a-fA-F]{24}$/) ? id : null }]
    });

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    res.json(order);
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving order', error: error.message });
  }
});

export default router;
