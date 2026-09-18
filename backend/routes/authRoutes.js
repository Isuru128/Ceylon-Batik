import express from 'express';
import { User } from '../models/User.js';
import { generateToken, protect } from '../middleware/auth.js';

const router = express.Router();

// @route   POST /api/auth/register
// @desc    Register a new customer
router.post('/register', async (req, res) => {
  try {
    const { fullName, email, contact, phone, password, address, city } = req.body;
    const userEmail = (email || contact || '').trim().toLowerCase();
    const userPhone = phone || (contact && !contact.includes('@') ? contact : '');

    if (!userEmail || !password) {
      return res.status(400).json({ message: 'Email/Contact and password are required' });
    }

    const userExists = await User.findOne({ email: userEmail });
    if (userExists) {
      return res.status(400).json({ message: 'A customer account with this email already exists' });
    }

    const user = await User.create({
      fullName: fullName || userEmail.split('@')[0],
      email: userEmail,
      phone: userPhone,
      password,
      address: address || '',
      city: city || 'Colombo',
      role: 'USER'
    });

    const token = generateToken(user._id, user.role);

    res.status(201).json({
      token,
      id: user._id.toString(),
      fullName: user.fullName,
      email: user.email,
      contact: user.phone || user.email,
      role: user.role,
      address: user.address,
      city: user.city
    });
  } catch (error) {
    res.status(400).json({ message: error.message || 'Registration failed' });
  }
});

// @route   POST /api/auth/login
// @desc    Authenticate customer & get token
router.post('/login', async (req, res) => {
  try {
    const { contact, email, password } = req.body;
    const identifier = (email || contact || '').trim().toLowerCase();

    if (!identifier || !password) {
      return res.status(400).json({ message: 'Please provide email and password' });
    }

    const user = await User.findOne({
      $or: [{ email: identifier }, { phone: identifier }]
    });

    if (user && (await user.matchPassword(password))) {
      const token = generateToken(user._id, user.role);
      return res.json({
        token,
        id: user._id.toString(),
        fullName: user.fullName,
        email: user.email,
        contact: user.phone || user.email,
        role: user.role,
        address: user.address,
        city: user.city
      });
    }

    res.status(401).json({ message: 'Invalid email or password' });
  } catch (error) {
    res.status(500).json({ message: 'Server error during login', error: error.message });
  }
});

// @route   GET /api/auth/profile
// @desc    Get logged in user profile
router.get('/profile', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json({
      id: user._id.toString(),
      fullName: user.fullName,
      email: user.email,
      contact: user.phone || user.email,
      phone: user.phone,
      address: user.address,
      city: user.city,
      role: user.role,
      ordersCount: user.ordersCount
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   PUT /api/auth/profile
// @desc    Update user profile
router.put('/profile', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.fullName = req.body.fullName || user.fullName;
    user.phone = req.body.phone !== undefined ? req.body.phone : user.phone;
    user.address = req.body.address !== undefined ? req.body.address : user.address;
    user.city = req.body.city !== undefined ? req.body.city : user.city;

    if (req.body.password) {
      user.password = req.body.password;
    }

    const updated = await user.save();
    res.json({
      id: updated._id.toString(),
      fullName: updated.fullName,
      email: updated.email,
      contact: updated.phone || updated.email,
      address: updated.address,
      city: updated.city,
      role: updated.role
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

export default router;
