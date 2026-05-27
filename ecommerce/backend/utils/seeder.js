const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const Category = require('../models/Category');
const Product = require('../models/Product');

dotenv.config();

const connectDB = async () => {
  await mongoose.connect(process.env.MONGO_URI);
  console.log('MongoDB connected for seeding...');
};

const categories = [
  { name: 'Electronics', description: 'Gadgets and electronic devices' },
  { name: 'Clothing', description: 'Fashion and apparel' },
  { name: 'Books', description: 'Books and literature' },
  { name: 'Home & Kitchen', description: 'Home appliances and kitchen products' },
  { name: 'Sports', description: 'Sports and fitness equipment' },
  { name: 'Beauty', description: 'Beauty and personal care' },
];

const seedDatabase = async () => {
  await connectDB();

  try {
    // Clear existing data
    await User.deleteMany();
    await Category.deleteMany();
    await Product.deleteMany();
    console.log('Existing data cleared...');

    // Create categories
    const createdCategories = await Category.insertMany(categories);
    console.log(`${createdCategories.length} categories created`);

    const electronics = createdCategories.find((c) => c.name === 'Electronics')._id;
    const clothing = createdCategories.find((c) => c.name === 'Clothing')._id;
    const books = createdCategories.find((c) => c.name === 'Books')._id;
    const home = createdCategories.find((c) => c.name === 'Home & Kitchen')._id;
    const sports = createdCategories.find((c) => c.name === 'Sports')._id;
    const beauty = createdCategories.find((c) => c.name === 'Beauty')._id;

    // Create admin user
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('admin123', salt);

    const adminUser = await User.create({
      name: 'Admin User',
      email: 'admin@shopwave.com',
      password: hashedPassword,
      role: 'admin',
      phone: '9876543210',
    });

    // Create test user
    const testUser = await User.create({
      name: 'John Doe',
      email: 'john@example.com',
      password: hashedPassword,
      role: 'user',
      phone: '9876543211',
    });

    console.log('Users created (admin@shopwave.com / admin123)');

    // Create products
    const products = [
      {
        name: 'Apple iPhone 15 Pro',
        description: 'The latest iPhone with A17 Pro chip, titanium design, and advanced camera system. Features 48MP main camera, USB-C, and Action Button.',
        price: 1299,
        originalPrice: 1399,
        category: electronics,
        stock: 25,
        brand: 'Apple',
        isFeatured: true,
        rating: 4.8,
        numReviews: 124,
        images: ['https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=500'],
        tags: ['smartphone', 'apple', 'iphone'],
      },
      {
        name: 'Samsung Galaxy S24 Ultra',
        description: 'Samsung\'s flagship with S Pen, 200MP camera, and Snapdragon 8 Gen 3. The ultimate Android experience.',
        price: 1199,
        originalPrice: 1299,
        category: electronics,
        stock: 18,
        brand: 'Samsung',
        isFeatured: true,
        rating: 4.7,
        numReviews: 98,
        images: ['https://images.unsplash.com/photo-1610945264803-c22b62d2a7b3?w=500'],
        tags: ['smartphone', 'samsung', 'android'],
      },
      {
        name: 'Sony WH-1000XM5 Headphones',
        description: 'Industry-leading noise cancellation with exceptional sound quality. 30-hour battery life and multipoint connection.',
        price: 349,
        originalPrice: 399,
        category: electronics,
        stock: 40,
        brand: 'Sony',
        isFeatured: true,
        rating: 4.9,
        numReviews: 312,
        images: ['https://images.unsplash.com/photo-1545127398-14699f92334b?w=500'],
        tags: ['headphones', 'audio', 'sony'],
      },
      {
        name: 'MacBook Pro 14-inch M3',
        description: 'Supercharged by M3 Pro chip. With up to 22 hours of battery life and stunning Liquid Retina XDR display.',
        price: 1999,
        originalPrice: 2099,
        category: electronics,
        stock: 12,
        brand: 'Apple',
        isFeatured: true,
        rating: 4.9,
        numReviews: 87,
        images: ['https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=500'],
        tags: ['laptop', 'apple', 'macbook'],
      },
      {
        name: 'Nike Air Max 270',
        description: 'The Nike Air Max 270 delivers an iconic look with Max Air cushioning. Lightweight mesh upper for breathability.',
        price: 149,
        originalPrice: 179,
        category: clothing,
        stock: 60,
        brand: 'Nike',
        isFeatured: false,
        rating: 4.6,
        numReviews: 445,
        images: ['https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500'],
        tags: ['shoes', 'nike', 'running'],
      },
      {
        name: 'Levi\'s 511 Slim Jeans',
        description: 'The iconic Levi\'s 511 slim fit jeans. Sits below waist with slim fit through thigh and leg.',
        price: 69,
        originalPrice: 89,
        category: clothing,
        stock: 80,
        brand: "Levi's",
        isFeatured: false,
        rating: 4.5,
        numReviews: 567,
        images: ['https://images.unsplash.com/photo-1542272454315-4c01d7abdf4a?w=500'],
        tags: ['jeans', 'denim', 'levis'],
      },
      {
        name: 'Atomic Habits - James Clear',
        description: 'An easy and proven way to build good habits and break bad ones. #1 New York Times bestseller.',
        price: 18,
        originalPrice: 25,
        category: books,
        stock: 150,
        brand: 'Penguin',
        isFeatured: true,
        rating: 4.8,
        numReviews: 2341,
        images: ['https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=500'],
        tags: ['self-help', 'habits', 'productivity'],
      },
      {
        name: 'Instant Pot Duo 7-in-1',
        description: 'Replaces 7 kitchen appliances: pressure cooker, slow cooker, rice cooker, steamer, sauté pan, yogurt maker, and warmer.',
        price: 89,
        originalPrice: 129,
        category: home,
        stock: 35,
        brand: 'Instant Pot',
        isFeatured: false,
        rating: 4.7,
        numReviews: 1892,
        images: ['https://images.unsplash.com/photo-1585515320310-259814833e62?w=500'],
        tags: ['kitchen', 'cooking', 'appliance'],
      },
      {
        name: 'Yoga Mat Premium',
        description: 'Non-slip premium yoga mat with alignment lines. 6mm thick for joint support. Eco-friendly TPE material.',
        price: 45,
        originalPrice: 65,
        category: sports,
        stock: 55,
        brand: 'Gaiam',
        isFeatured: false,
        rating: 4.6,
        numReviews: 723,
        images: ['https://images.unsplash.com/photo-1601925228008-1d4b5d4b8d6e?w=500'],
        tags: ['yoga', 'fitness', 'exercise'],
      },
      {
        name: 'L\'Oreal Revitalift Serum',
        description: 'Pure 1.5% hyaluronic acid + 3.5% glycerin formula. Visibly plumps skin and reduces wrinkles in just 1 week.',
        price: 32,
        originalPrice: 45,
        category: beauty,
        stock: 90,
        brand: "L'Oreal",
        isFeatured: false,
        rating: 4.5,
        numReviews: 1024,
        images: ['https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=500'],
        tags: ['skincare', 'serum', 'anti-aging'],
      },
      {
        name: 'iPad Air M2',
        description: 'Supercharged by M2 chip. Beautiful 10.9-inch Liquid Retina display. All-day battery. Works with Apple Pencil.',
        price: 749,
        originalPrice: 799,
        category: electronics,
        stock: 20,
        brand: 'Apple',
        isFeatured: true,
        rating: 4.8,
        numReviews: 234,
        images: ['https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=500'],
        tags: ['tablet', 'apple', 'ipad'],
      },
      {
        name: 'Adidas Ultra Boost 22',
        description: 'Responsive Boost cushioning with Primeknit+ upper. The ultimate running shoe for long distances.',
        price: 189,
        originalPrice: 219,
        category: clothing,
        stock: 45,
        brand: 'Adidas',
        isFeatured: false,
        rating: 4.7,
        numReviews: 334,
        images: ['https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=500'],
        tags: ['shoes', 'adidas', 'running'],
      },
    ];

    await Product.insertMany(products);
    console.log(`${products.length} products created`);

    console.log('\n✅ Database seeded successfully!');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('Admin Login: admin@shopwave.com / admin123');
    console.log('User Login:  john@example.com / admin123');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

    process.exit(0);
  } catch (error) {
    console.error('Seeding error:', error);
    process.exit(1);
  }
};

seedDatabase();
