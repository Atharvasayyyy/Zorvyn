const dotenv = require('dotenv');
const connectDB = require('./config/db');
const User = require('./models/User');

dotenv.config();

const seedAdmin = async () => {
  try {
    await connectDB();

    const adminEmail = process.env.SEED_ADMIN_EMAIL || 'admin@finance.local';
    const adminPassword = process.env.SEED_ADMIN_PASSWORD || 'Admin@123';

    const existing = await User.findOne({ email: adminEmail });

    if (existing) {
      console.log('Admin user already exists:', adminEmail);
      process.exit(0);
    }

    await User.create({
      name: 'System Admin',
      email: adminEmail,
      password: adminPassword,
      role: 'admin',
      status: 'active'
    });

    console.log('Admin user created successfully');
    console.log('Email:', adminEmail);
    console.log('Password:', adminPassword);

    process.exit(0);
  } catch (error) {
    console.error('Seed failed:', error.message);
    process.exit(1);
  }
};

seedAdmin();
