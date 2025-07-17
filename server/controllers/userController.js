const jwt = require('jsonwebtoken');
const User = require('../models/User');

const generateToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '1d' });

exports.loginUser = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (user && await user.matchPassword(password)) {
    res.json({
      token: generateToken(user._id),
      role:  user.role,
      name:  user.name
    });
  } else {
    res.status(401).json({ message: 'Invalid credentials' });
  }
};

exports.getUserProfile = (req, res) => {
  const { name, email, role } = req.user;
  res.json({ name, email, role });
};