import express from 'express';
import { Admin } from '../models/Admin.js';
import { User } from '../models/User.js';
import { Product } from '../models/Product.js';
import { Order } from '../models/Order.js';
import { generateToken, protect, adminOnly } from '../middleware/auth.js';

const router = express.Router();

// @route   POST /api/admin/create
// @desc    Create the admin account (only if no admin exists yet — first-time setup)
// @access  Public (blocked once an admin already exists)
router.post('/create', async (req, res) => {
  try {
    const adminCount = await Admin.countDocuments();
    if (adminCount > 0) {
      return res.status(403).json({
        message: 'Admin account already exists. Use POST /api/admin/login to authenticate.'
      });
    }

    const { username, email, password, fullName } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({ message: 'username, email and password are required' });
    }

    const admin = await Admin.create({
      username: username.trim().toLowerCase(),
      email: email.trim().toLowerCase(),
      password,
      fullName: fullName || username,
      role: 'ROLE_ADMIN',
      active: true
    });

    const token = generateToken(admin._id, admin.role);

    res.status(201).json({
      message: 'Admin account created successfully',
      token,
      id: admin._id,
      username: admin.username,
      email: admin.email,
      fullName: admin.fullName,
      role: admin.role
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to create admin account', error: error.message });
  }
});

// @route   POST /api/admin/login
// @desc    Admin login — returns JWT
// @access  Public
router.post('/login', async (req, res) => {
  try {
    const { contact, username, password } = req.body;
    const identifier = (contact || username || '').trim().toLowerCase();

    if (!identifier || !password) {
      return res.status(400).json({ message: 'Please provide admin username/email and password' });
    }

    const admin = await Admin.findOne({
      $or: [{ username: identifier }, { email: identifier }]
    });

    if (admin && (await admin.matchPassword(password))) {
      const token = generateToken(admin._id, admin.role || 'ROLE_ADMIN');
      return res.json({
        token,
        id: admin._id,
        username: admin.username,
        fullName: admin.fullName,
        email: admin.email,
        role: admin.role || 'ROLE_ADMIN'
      });
    }

    res.status(401).json({ message: 'Invalid admin credentials' });
  } catch (error) {
    res.status(500).json({ message: 'Server error during admin login', error: error.message });
  }
});

// @route   GET /api/admin/me
// @desc    Get current admin profile
// @access  Private (admin JWT required)
router.get('/me', protect, adminOnly, async (req, res) => {
  try {
    const admin = await Admin.findById(req.user._id).select('-password');
    if (!admin) return res.status(404).json({ message: 'Admin not found' });

    res.json({
      id: admin._id,
      username: admin.username,
      email: admin.email,
      fullName: admin.fullName,
      role: admin.role,
      active: admin.active,
      createdAt: admin.createdAt
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch admin profile', error: error.message });
  }
});

// @route   GET /api/admin/stats
// @desc    Aggregated dashboard analytics
// @access  Private (admin JWT required)
router.get('/stats', protect, adminOnly, async (req, res) => {
  try {
    const [productCount, userCount, orders] = await Promise.all([
      Product.countDocuments({ active: true }),
      User.countDocuments(),
      Order.find()
    ]);

    const totalRevenue = orders.reduce((sum, ord) => sum + (ord.total || 0), 0);
    const pendingOrders = orders.filter(o => o.status !== 'Delivered' && o.status !== 'Cancelled').length;

    res.json({
      totalRevenue,
      activeProducts: productCount,
      totalOrders: orders.length,
      totalCustomers: userCount,
      pendingOrders
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to retrieve stats', error: error.message });
  }
});

// @route   GET /api/admin/users
// @desc    List all registered customers
// @access  Private (admin JWT required)
router.get('/users', protect, adminOnly, async (req, res) => {
  try {
    const users = await User.find().select('-password').sort({ createdAt: -1 });
    const formatted = users.map((u) => ({
      id: u._id.toString(),
      name: u.fullName,
      email: u.email,
      phone: u.phone || '',
      role: u.role === 'ROLE_ADMIN' ? 'Admin' : 'Customer',
      orders: u.ordersCount || 0,
      status: u.status || 'Active',
      createdAt: u.createdAt
    }));
    res.json(formatted);
  } catch (error) {
    res.status(500).json({ message: 'Failed to retrieve users', error: error.message });
  }
});

// @route   GET /api/admin/orders
// @desc    List all customer orders
// @access  Private (admin JWT required)
router.get('/orders', protect, adminOnly, async (req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 });
    const formatted = orders.map((o) => ({
      id: o.orderNumber,
      orderId: o._id.toString(),
      customer: o.customer?.fullName || 'Guest Customer',
      email: o.customer?.email,
      phone: o.customer?.phone,
      address: `${o.customer?.address || ''}, ${o.customer?.city || ''}`,
      items: o.items.map(i => `${i.quantity}x ${i.title} (${i.size || 'Standard'})`).join(', '),
      itemsList: o.items,
      total: o.total,
      subtotal: o.subtotal,
      shipping: o.shipping,
      method: o.paymentMethod === 'cod'
        ? 'Cash on Delivery'
        : o.paymentMethod === 'kokoPay'
          ? 'KokoPay'
          : o.paymentMethod === 'mintPay'
            ? 'MintPay'
            : 'Card',
      status: o.status,
      date: new Date(o.createdAt).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' }),
      trackingNumber: o.trackingNumber
    }));
    res.json(formatted);
  } catch (error) {
    res.status(500).json({ message: 'Failed to retrieve orders', error: error.message });
  }
});

// @route   PUT /api/admin/orders/:id/status
// @desc    Update order fulfillment status
// @access  Private (admin JWT required)
router.put('/orders/:id/status', protect, adminOnly, async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const order = await Order.findOne({
      $or: [{ orderNumber: id }, { _id: id.match(/^[0-9a-fA-F]{24}$/) ? id : null }]
    });

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    order.status = status;
    await order.save();

    res.json({
      message: 'Order status updated successfully',
      orderNumber: order.orderNumber,
      status: order.status
    });
  } catch (error) {
    res.status(400).json({ message: 'Failed to update order status', error: error.message });
  }
});

export default router;