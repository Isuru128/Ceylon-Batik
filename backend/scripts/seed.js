import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '../.env') });

import { Product } from '../models/Product.js';
import { User } from '../models/User.js';
import { Admin } from '../models/Admin.js';
import { Order } from '../models/Order.js';
import { Testimonial, CraftStep, StoreLocation, FAQ } from '../models/Content.js';

const initialProducts = [
  {
    slug: 'island-bloom-batik-dress-set',
    title: 'Island Bloom Batik Dress Set',
    category: 'dresses',
    categoryName: 'Cotton Dresses',
    price: 6990,
    oldPrice: 8950,
    sku: 'CB-D214',
    stock: 15,
    inStock: true,
    rating: 5,
    reviewCount: 24,
    tags: ['batik dress', 'cotton dress', 'handmade', 'island wear', 'resort wear'],
    images: ['/images/01.jpeg', '/images/02.jpg', '/images/03.jpeg'],
    description: 'A breathable cotton batik dress set with soft movement, vivid island color, and hand-finished pattern work for daytime events, holidays, and warm-weather occasions.',
    specs: {
      fabric: 'Cotton voile',
      length: 'Midi length with coordinated batik finish',
      washCare: 'Hand wash separately in cold water',
      fit: 'Relaxed everyday fit'
    },
    isFeatured: true,
    isSale: true
  },
  {
    slug: 'heritage-wax-art-cotton-saree',
    title: 'Heritage Wax Art Cotton Saree',
    category: 'sarees',
    categoryName: 'Handmade Sarees',
    price: 9450,
    oldPrice: null,
    sku: 'CB-S2147',
    stock: 8,
    inStock: true,
    rating: 4,
    reviewCount: 18,
    tags: ['batik saree', 'cotton saree', 'handmade saree', 'office wear', 'festive wear'],
    images: ['/images/02.jpg', '/images/01.jpeg', '/images/03.jpeg'],
    description: 'This saree is made of lightweight cotton fabric and finished with expressive wax-resist batik motifs. It is comfortable for office, school, festive, parties, outings, and weekend styling.',
    specs: {
      fabric: 'Cotton',
      length: '7 yards, includes coordinated unstitched 1 yard blouse piece',
      washCare: 'Handwash',
      blouse: 'Included'
    },
    isFeatured: true,
    isSale: false
  },
  {
    slug: 'sunset-batik-sarong-couple-set',
    title: 'Sunset Batik Sarong Couple Set',
    category: 'couples',
    categoryName: 'Couple Sets',
    price: 10900,
    oldPrice: 12500,
    sku: 'CB-C110',
    stock: 12,
    inStock: true,
    rating: 5,
    reviewCount: 32,
    tags: ['couple set', 'batik sarong', 'Sri Lankan batik', 'matching outfits'],
    images: ['/images/03.jpeg', '/images/01.jpeg', '/images/02.jpg'],
    description: 'A coordinated couple batik set with easy movement, breathable fabric, and balanced color placement for family events, resort stays, and cultural celebrations.',
    specs: {
      fabric: 'Cotton blend',
      includes: 'Coordinated shirt and sarong styling',
      washCare: 'Gentle hand wash',
      occasion: 'Couple events and resort wear'
    },
    isFeatured: true,
    isSale: true
  },
  {
    slug: 'made-to-measure-batik-look',
    title: 'Made-to-Measure Batik Look',
    category: 'custom',
    categoryName: 'Custom Orders',
    price: 7500,
    oldPrice: null,
    sku: 'CB-MTM',
    stock: 25,
    inStock: true,
    rating: 5,
    reviewCount: 12,
    tags: ['custom batik', 'made to measure', 'handmade', 'bespoke batik'],
    images: ['/images/01.jpeg', '/images/02.jpg', '/images/03.jpeg'],
    description: 'A custom batik order tailored around your preferred color story, garment type, and measurements. Designed for customers who want a more personal Sri Lankan batik look.',
    specs: {
      fabric: 'Selected after consultation',
      timeline: 'Made to order',
      washCare: 'Based on selected fabric',
      sizing: 'Customer measurements required'
    },
    isFeatured: true,
    isSale: false
  },
  {
    slug: 'lagoon-breeze-batik-kaftan',
    title: 'Lagoon Breeze Batik Kaftan',
    category: 'dresses',
    categoryName: 'Resort Wear',
    price: 5850,
    oldPrice: null,
    sku: 'CB-K058',
    stock: 18,
    inStock: true,
    rating: 5,
    reviewCount: 15,
    tags: ['kaftan', 'resort wear', 'batik dress', 'handmade batik'],
    images: ['/images/01.jpeg', '/images/03.jpeg', '/images/02.jpg'],
    description: 'A soft resort kaftan with generous movement and handcrafted batik color, made for relaxed weekends, holidays, poolside styling, and warm Sri Lankan weather.',
    specs: {
      fabric: 'Soft cotton blend',
      length: 'Relaxed kaftan cut',
      washCare: 'Cold hand wash',
      fit: 'Free-flow silhouette'
    },
    isFeatured: true,
    isSale: false
  },
  {
    slug: 'blue-lotus-evening-batik-saree',
    title: 'Blue Lotus Evening Batik Saree',
    category: 'sarees',
    categoryName: 'Silk Sarees',
    price: 11750,
    oldPrice: 14900,
    sku: 'CB-S330',
    stock: 6,
    inStock: true,
    rating: 5,
    reviewCount: 41,
    tags: ['blue saree', 'evening saree', 'batik saree', 'lotus pattern'],
    images: ['/images/02.jpg', '/images/03.jpeg', '/images/01.jpeg'],
    description: 'An evening-ready batik saree with blue lotus-inspired pattern work, refined drape, and a polished finish for dinners, receptions, and formal occasions.',
    specs: {
      fabric: 'Silk blend',
      length: '7 yards',
      washCare: 'Dry clean recommended',
      finish: 'Evening batik finish'
    },
    isFeatured: true,
    isSale: true
  },
  {
    slug: 'temple-flower-shirt-and-sarong',
    title: 'Temple Flower Shirt & Sarong',
    category: 'sarongs',
    categoryName: "Men's Batik",
    price: 8400,
    oldPrice: null,
    sku: 'CB-M084',
    stock: 14,
    inStock: true,
    rating: 4,
    reviewCount: 19,
    tags: ['mens batik', 'sarong', 'batik shirt', 'temple flower'],
    images: ['/images/03.jpeg', '/images/02.jpg', '/images/01.jpeg'],
    description: "A men's batik shirt and sarong look with strong floral pattern language, breathable wear, and a clean finish for gatherings, ceremonies, and resort styling.",
    specs: {
      fabric: 'Cotton blend',
      includes: 'Shirt and sarong styling',
      washCare: 'Hand wash separately',
      fit: "Classic men's fit"
    },
    isFeatured: true,
    isSale: false
  },
  {
    slug: 'celebration-batik-gift-box',
    title: 'Celebration Batik Gift Box',
    category: 'gifts',
    categoryName: 'Gift Ready',
    price: 4950,
    oldPrice: null,
    sku: 'CB-G049',
    stock: 20,
    inStock: true,
    rating: 5,
    reviewCount: 29,
    tags: ['batik gift', 'Sri Lankan souvenir', 'handmade gift', 'celebration box'],
    images: ['/images/01.jpeg', '/images/02.jpg', '/images/03.jpeg'],
    description: 'A curated batik gift selection with color, craft, and presentation in mind. Designed for birthdays, festival gifting, travel souvenirs, and thoughtful local presents.',
    specs: {
      contents: 'Curated batik gift selection',
      packaging: 'Gift-ready presentation',
      washCare: 'Care card included',
      occasion: 'Celebrations and souvenirs'
    },
    isFeatured: true,
    isSale: false
  }
];

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

    // 1. Seed Products if empty
    const productCount = await Product.countDocuments();
    if (productCount === 0) {
      await Product.insertMany(initialProducts);
      console.log(`[Seed] Seeded ${initialProducts.length} products.`);
    } else {
      console.log(`[Seed] Products collection already has ${productCount} items.`);
    }

    // 2. Seed Admin if not exists
    const adminExists = await Admin.findOne({ username: 'admin' });
    if (!adminExists) {
      await Admin.create({
        username: 'admin',
        email: 'admin@ceylonbatik.lk',
        password: 'admin123',
        fullName: 'Ceylon Batik Administrator',
        role: 'ROLE_ADMIN',
        active: true
      });
      console.log('[Seed] Created default admin account (admin / admin123).');
    }

    // 3. Seed Default Customer if not exists
    const userExists = await User.findOne({ email: 'isurudula28@gmail.com' });
    let demoUser = userExists;
    if (!userExists) {
      demoUser = await User.create({
        fullName: 'Isuru Dulanjaya',
        email: 'isurudula28@gmail.com',
        phone: '+94 77 123 4567',
        password: 'isuru123',
        address: 'No 45, Temple Road',
        city: 'Colombo 03',
        role: 'USER',
        ordersCount: 2
      });
      console.log('[Seed] Created default customer account (isurudula28@gmail.com / isuru123).');
    }

    // 4. Seed Content if empty
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

    // 5. Seed sample orders if empty
    const orderCount = await Order.countDocuments();
    if (orderCount === 0) {
      await Order.create([
        {
          orderNumber: 'CB-ORD-8921',
          user: demoUser?._id || null,
          customer: {
            fullName: 'Sanduni Perera',
            email: 'sanduni@example.com',
            phone: '+94 71 456 7890',
            address: '14/2 Park Street',
            city: 'Colombo 02'
          },
          items: [
            {
              id: '2',
              slug: 'heritage-wax-art-cotton-saree',
              title: 'Heritage Wax Art Cotton Saree',
              price: 9450,
              quantity: 1,
              size: 'Standard',
              image: '/images/02.jpg',
              category: 'sarees'
            }
          ],
          subtotal: 9450,
          shipping: 0,
          discountAmount: 0,
          total: 9450,
          paymentMethod: 'kokoPay',
          status: 'Shipped',
          trackingNumber: 'DOM-782910-LK'
        },
        {
          orderNumber: 'CB-ORD-7402',
          user: demoUser?._id || null,
          customer: {
            fullName: 'Isuru Dulanjaya',
            email: 'isurudula28@gmail.com',
            phone: '+94 77 123 4567',
            address: 'No 45, Temple Road',
            city: 'Colombo 03'
          },
          items: [
            {
              id: '3',
              slug: 'sunset-batik-sarong-couple-set',
              title: 'Sunset Batik Sarong Couple Set',
              price: 10900,
              quantity: 1,
              size: 'Standard',
              image: '/images/03.jpeg',
              category: 'couples'
            }
          ],
          subtotal: 10900,
          shipping: 0,
          discountAmount: 0,
          total: 10900,
          paymentMethod: 'cod',
          status: 'Delivered',
          trackingNumber: 'DOM-623419-LK'
        }
      ]);
      console.log('[Seed] Seeded sample orders.');
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
