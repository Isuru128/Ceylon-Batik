import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { connectDB } from './config/db.js';
import { seedDatabase } from './scripts/seed.js';

import productRoutes from './routes/productRoutes.js';
import authRoutes from './routes/authRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import orderRoutes from './routes/orderRoutes.js';
import contentRoutes from './routes/contentRoutes.js';
import fitOnMeRoutes from './routes/fitOnMeRoutes.js';
import uploadRoutes from './routes/uploadRoutes.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

// Enable CORS for frontend development
app.use(cors({
  origin: true,
  credentials: true
}));

// Body parsers
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Ensure database connection for all incoming requests (essential for Vercel serverless)
app.use(async (req, res, next) => {
  if (req.path === '/' || req.path === '/api/health') {
    return next();
  }
  try {
    await connectDB();
    next();
  } catch (err) {
    console.error('[Database Middleware Error]:', err.message);
    res.status(500).json({
      message: 'Database connection failed',
      error: err.message,
      hint: 'Verify MONGODB_URI in Vercel Environment Variables and ensure MongoDB Atlas IP Access allows 0.0.0.0/0'
    });
  }
});

// Serve uploaded product images as static files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Root endpoint — displays clean service status instead of "Cannot GET /"
app.get('/', (req, res) => {
  res.json({
    status: 'ONLINE',
    service: 'Ceylon Batik REST API',
    version: '1.0.0',
    endpoints: {
      health: '/api/health',
      products: '/api/products',
      auth: '/api/auth',
      orders: '/api/orders',
      admin: '/api/admin',
      content: '/api/content',
      fitOnMe: '/api/fit-on-me',
      upload: '/api/upload'
    },
    message: 'Welcome to Ceylon Batik API. All endpoints are operational.',
    timestamp: new Date().toISOString()
  });
});

// Health check
app.get('/api/health', async (req, res) => {
  let dbStatus = 'disconnected';
  try {
    const { default: mongoose } = await import('mongoose');
    dbStatus = mongoose.connection.readyState === 1 ? 'connected' : 'connecting_or_idle';
  } catch (e) {
    dbStatus = 'unknown';
  }

  res.json({
    status: 'OK',
    service: 'Ceylon Batik REST API',
    database: dbStatus,
    time: new Date().toISOString()
  });
});

// Mount API Routes
app.use('/api/products', productRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/content', contentRoutes);
app.use('/api/fit-on-me', fitOnMeRoutes);
app.use('/api/upload', uploadRoutes);

// 404 handler for API routes
app.use('/api/*', (req, res) => {
  res.status(404).json({ message: `API endpoint ${req.originalUrl} not found` });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error('[Error]', err.stack);
  res.status(err.status || 500).json({
    message: err.message || 'Internal Server Error',
    error: process.env.NODE_ENV === 'production' ? {} : err.stack
  });
});

// Connect to DB and Start Server for local development
const startServer = async () => {
  try {
    await connectDB();
    await seedDatabase();

    app.listen(PORT, () => {
      console.log(`=========================================`);
      console.log(`Ceylon Batik Server running on port ${PORT}`);
      console.log(`API Base URL: http://localhost:${PORT}/api`);
      console.log(`=========================================`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

// In Vercel serverless functions, startServer() should NOT be called directly
if (!process.env.VERCEL) {
  startServer();
}

export default app;

