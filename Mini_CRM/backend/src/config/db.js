const mongoose = require('mongoose');
const User = require('../models/User');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
    
    // Seed demo user
    const demoEmail = 'demo@gmail.com';
    const demoExists = await User.findOne({ email: demoEmail });
    if (!demoExists) {
      await User.create({
        name: 'Demo User',
        email: demoEmail,
        password: 'Demo123@',
      });
      console.log('Seeded demo credentials successfully.');
    }
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;
