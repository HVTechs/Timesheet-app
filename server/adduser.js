// addUser.js

require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// Replace with your actual User model path
const User = require('./models/User');

// Replace these with the user details you want to add
const name     = 'Admin';
const email    = 'admin@example.com';
const password = 'admin123';
const role     = 'admin';

const MONGO_URI = process.env.MONGO_URI;

async function addUser() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('✅ Connected to MongoDB');

    const existing = await User.findOne({ email });
    if (existing) {
      console.log('⚠️ User already exists with this email.');
      return;
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({ name, email, password: hashedPassword, role });
    await user.save();

    console.log('✅ User added successfully');
  } catch (err) {
    console.error('❌ Error adding user:', err);
  } finally {
    mongoose.disconnect();
  }
}

addUser();