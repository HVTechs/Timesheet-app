const User = require("../models/User");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

const generateToken = (user) => {
  return jwt.sign(
    { id: user._id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );
};

// POST /api/auth/register
exports.registerUser = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    console.log('Register attempt:', { email });
    const existing = await User.findOne({ email });
    if (existing) {
      console.log('User already exists:', email);
      return res.status(400).json({ message: "User already exists" });
    }

    const user = await User.create({ name, email, password, role });
    console.log('User registered:', { email, userId: user._id });
    const token = generateToken(user);

    res.status(201).json({
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      },
      token
    });
  } catch (err) {
    console.error('Registration error:', err.message);
    res.status(500).json({ message: "Registration failed", error: err.message });
  }
};

// POST /api/auth/login
exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log('Login attempt:', { email });
    const user = await User.findOne({ email });
    if (!user) {
      console.log('User not found:', email);
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const match = await user.matchPassword(password);
    console.log('Password match:', { email, match });
    if (!match) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = generateToken(user);
    console.log('Login successful:', { email, userId: user._id });
    res.status(200).json({
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      },
      token
    });
  } catch (err) {
    console.error('Login error:', err.message);
    res.status(500).json({ message: "Login failed", error: err.message });
  }
};