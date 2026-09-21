import mongoose from 'mongoose';
import dns from 'node:dns';

// Resolve MongoDB Atlas SRV records reliably when local ISP/router DNS fails
try {
  dns.setServers(['8.8.8.8', '1.1.1.1']);
} catch (dnsErr) {
  console.warn('[MongoDB] Note: Custom DNS server configuration skipped:', dnsErr.message);
}

let cachedConnection = null;

export const connectDB = async (retries = 3, delay = 1500) => {
  // If already connected, reuse connection (essential for Vercel serverless)
  if (mongoose.connection.readyState >= 1) {
    return mongoose.connection;
  }

  const connUri = process.env.MONGODB_URI;
  const dbName = process.env.MONGODB_DATABASE || 'ceylonBatik';

  if (!connUri) {
    throw new Error('MONGODB_URI is not defined in environment variables');
  }

  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      const conn = await mongoose.connect(connUri, {
        dbName: dbName,
        serverSelectionTimeoutMS: 5000
      });

      console.log(`[MongoDB] Connected successfully to host: ${conn.connection.host}, database: ${conn.connection.name}`);
      return conn;
    } catch (error) {
      console.warn(`[MongoDB] Connection attempt ${attempt}/${retries} failed: ${error.message}`);
      if (attempt === retries) {
        throw new Error(`[MongoDB] Max connection retries reached: ${error.message}`);
      }
      await new Promise((resolve) => setTimeout(resolve, delay));
    }
  }
};

