// ✅ adduser.js
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');
dotenv.config();

const User = require('./models/User');
const connectDB = require('./db');

const addUser = async () => {
  try {
    await connectDB();

    const email = 'test@example.com';
    const password = 'test1234';
    const hashedPassword = await bcrypt.hash(password, 10);

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      console.log('⚠️ User already exists');
      process.exit(0);
    }

    const user = new User({
      name: 'Test User',
      email,
      password: hashedPassword, // ✅ Manually hashed
      role: 'admin'
    });

    await user.save();
    console.log('✅ User added successfully');
    process.exit();
  } catch (err) {
    console.error('❌ Error adding user:', err.message);
    process.exit(1);
  }
};

addUser();