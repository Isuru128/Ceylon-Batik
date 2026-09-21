import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import dns from 'node:dns';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '../.env') });

try {
  dns.setServers(['8.8.8.8', '1.1.1.1']);
} catch {}

import { Product } from '../models/Product.js';
import { Admin } from '../models/Admin.js';
import { Testimonial, CraftStep, StoreLocation, FAQ } from '../models/Content.js';


const initialLocations = [
  {
    id: 'colombo',
    name: 'Colombo Flagship Gallery',
    sinhala: 'කොළඹ ප්‍රධාන ප්‍රදර්ශනාගාරය',
    address: '42 Galle Road, Colombo 03, Sri Lanka',
    phone: '+94 11 258 4930',
    hours: 'Mon - Sun: 9:30 AM - 8:00 PM',
    email: 'colombo@ceylonbatik.lk',
    mapQuery: 'Galle Road, Colombo 03, Sri Lanka'
  },
  {
    id: 'galle',
    name: 'Galle Fort Boutique',
    sinhala: 'ගාල්ල කොටුව ශාඛාව',
    address: '18 Church Street, Galle Fort, Sri Lanka',
    phone: '+94 91 224 8110',
    hours: 'Mon - Sun: 10:00 AM - 7:30 PM',
    email: 'galle@ceylonbatik.lk',
    mapQuery: 'Church Street, Galle Fort, Sri Lanka'
  },
  {
    id: 'kandy',
    name: 'Kandy Heritage Studio',
    sinhala: 'මහනුවර කලාගාරය',
    address: '125 Dalada Veediya, Kandy, Sri Lanka',
    phone: '+94 81 220 5432',
    hours: 'Tue - Sun: 9:00 AM - 7:00 PM',
    email: 'kandy@ceylonbatik.lk',
    mapQuery: 'Dalada Veediya, Kandy, Sri Lanka'
  }
];

const initialCraftSteps = [
  {
    step: '01',
    title: 'Wax Resist Drawing',
    sinhala: 'ඉටි ඇඳීම',
    desc: 'Molten beeswax and paraffin are carefully applied to pure cotton or silk with traditional copper canting pens.'
  },
  {
    step: '02',
    title: 'Hand Dyeing',
    sinhala: 'වර්ණ ගැන්වීම',
    desc: 'The fabric is immersed in vibrant dye baths, layering hues from lightest to darkest with intense color saturation.'
  },
  {
    step: '03',
    title: 'Tropical Sun Curing',
    sinhala: 'හිරු එළියෙන් වියළීම',
    desc: 'Dyed textiles are air-dried under natural Sri Lankan sunshine to lock in the rich tropical pigment stability.'
  },
  {
    step: '04',
    title: 'Dewaxing & Washing',
    sinhala: 'ඉටි ඉවත් කර සේදීම',
    desc: 'The textiles are submerged in boiling water to lift the wax, revealing stunning crackled and crisp white contours.'
  }
];

const initialFaqs = [
  {
    q: 'How do I take care of handcrafted batik clothing?',
    a: 'We recommend gentle hand-washing in cold water with mild liquid detergent. Never machine dry or wring vigorously; dry in shade to preserve color brilliance.'
  },
  {
    q: "How does the 'Fit on me' AI feature work?",
    a: 'Upload a clear portrait or full-body photo on any product page. The AI creates a realistic preview showing you wearing that batik outfit in natural posture.'
  },
  {
    q: 'Do you offer islandwide cash on delivery?',
    a: 'Yes! Cash on delivery (COD) is available across all 25 districts in Sri Lanka with courier tracking.'
  },
  {
    q: 'How do KokoPay and MintPay installment payments work?',
    a: 'You can split your order into 3 interest-free monthly installments. Select KokoPay or MintPay at checkout and your first installment will be charged immediately.'
  },
  {
    q: 'Can I request custom sizes or made-to-measure orders?',
    a: 'Absolutely. Choose our Made-to-Measure Batik Look product or message us through WhatsApp/Contact form with your specific dimensions and color preferences.'
  }
];

const initialTestimonials = [
  {
    name: 'Sanduni Perera',
    city: 'Colombo',
    comment: "The Blue Lotus saree was the showstopper at my brother's wedding! The cotton is so light and the wax crackle motifs look truly royal.",
    rating: 5,
    date: 'August 2026'
  },
  {
    name: 'Kasun & Nimalka',
    city: 'Kandy',
    comment: 'We ordered the Sunset Sarong couple set for our beach holiday in Mirissa. Beautiful colors, breezy fabric, and very fast islandwide delivery.',
    rating: 5,
    date: 'July 2026'
  },
  {
    name: 'Dr. Anoma Jayawardena',
    city: 'Galle',
    comment: 'I love supporting authentic Sri Lankan craftsmen. You can feel the dedication in every stitch and hand-painted wax line.',
    rating: 5,
    date: 'August 2026'
  }
];

export const seedDatabase = async () => {
  try {
    const connUri = process.env.MONGODB_URI;
    const dbName = process.env.MONGODB_DATABASE || 'ceylonBatik';

    if (!connUri) {
      console.error('MONGODB_URI missing in .env');
      return;
    }

    if (mongoose.connection.readyState === 0) {
      await mongoose.connect(connUri, { dbName });
    }

    console.log('[Seed] Connected to MongoDB Atlas...');

    // 1. Products collection is managed by Admin (no automatic mock products)
    const productCount = await Product.countDocuments();
    console.log(`[Seed] Products collection currently has ${productCount} item(s).`);

    // 2. Seed Admin account if none exists, or rotate default password
    const adminExists = await Admin.findOne({ username: 'admin' });
    const adminPassword = process.env.ADMIN_PASSWORD;
    if (!adminExists) {
      if (!adminPassword) {
        console.warn('[Seed] WARNING: ADMIN_PASSWORD is not set in .env — skipping admin account creation.');
        console.warn('[Seed] Set ADMIN_PASSWORD in your .env file and restart the server to create the admin account.');
      } else {
        await Admin.create({
          username: 'admin',
          email: process.env.ADMIN_EMAIL || 'admin@ceylonbatik.lk',
          password: adminPassword,
          fullName: 'Ceylon Batik Administrator',
          role: 'ROLE_ADMIN',
          active: true
        });
        console.log('[Seed] Created admin account (username: admin).');
      }
    } else if (adminPassword) {
      // Rotate password if the account still uses the old default
      const isDefaultPassword = await adminExists.matchPassword('admin123');
      if (isDefaultPassword) {
        adminExists.password = adminPassword;
        await adminExists.save();
        console.log('[Seed] Admin password rotated from default to ADMIN_PASSWORD env value.');
      }
    }

    // 3. Seed Content if empty
    const testCount = await Testimonial.countDocuments();
    if (testCount === 0) {
      await Testimonial.insertMany(initialTestimonials);
      console.log(`[Seed] Seeded ${initialTestimonials.length} testimonials.`);
    }

    const stepCount = await CraftStep.countDocuments();
    if (stepCount === 0) {
      await CraftStep.insertMany(initialCraftSteps);
      console.log(`[Seed] Seeded ${initialCraftSteps.length} craft steps.`);
    }

    const locCount = await StoreLocation.countDocuments();
    if (locCount === 0) {
      await StoreLocation.insertMany(initialLocations);
      console.log(`[Seed] Seeded ${initialLocations.length} store locations.`);
    }

    const faqCount = await FAQ.countDocuments();
    if (faqCount === 0) {
      await FAQ.insertMany(initialFaqs);
      console.log(`[Seed] Seeded ${initialFaqs.length} FAQs.`);
    }

    console.log('[Seed] Database initialization completed successfully.');
  } catch (error) {
    console.error('[Seed] Error seeding database:', error);
  }
};

// Execute if run directly
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  seedDatabase().then(() => {
    mongoose.connection.close();
    process.exit(0);
  });
}
