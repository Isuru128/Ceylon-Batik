import jwt from 'jsonwebtoken';
import { User } from '../models/User.js';
import { Admin } from '../models/Admin.js';

export const generateToken = (id, role = 'USER') => {
  return jwt.sign({ id, role }, process.env.JWT_SECRET || 'ceylon_batik_secret', {
    expiresIn: '30d',
  });
};

export const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'ceylon_batik_secret');

      if (decoded.role === 'ROLE_ADMIN' || decoded.role === 'ADMIN') {
        req.user = await Admin.findById(decoded.id).select('-password');
      } else {
        req.user = await User.findById(decoded.id).select('-password');
        if (!req.user) {
          req.user = await Admin.findById(decoded.id).select('-password');
        }
      }

      if (!req.user) {
        return res.status(401).json({ message: 'Not authorized, user not found' });
      }

      return next();
    } catch (error) {
      console.error('JWT verification failed:', error.message);
      return res.status(401).json({ message: 'Not authorized, token invalid or expired' });
    }
  }

  if (!token) {
    return res.status(401).json({ message: 'Not authorized, no token provided' });
  }
};

export const adminOnly = (req, res, next) => {
  if (req.user && (req.user.role === 'ROLE_ADMIN' || req.user.role === 'ADMIN')) {
    next();
  } else {
    res.status(403).json({ message: 'Access denied: Admin privileges required' });
  }
};
