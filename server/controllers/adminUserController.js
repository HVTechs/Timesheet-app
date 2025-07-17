const User = require('../models/User');
const bcrypt = require('bcryptjs');

// Fetch all users (excluding passwords)
exports.getAllUsers = async (req, res) => {
try {
const users = await User.find().select('-password');
res.json(users);
} catch (err) {
console.error('Error fetching users:', err.message);
res.status(500).json({ message: 'Server error' });
}
};

// Add a new user
exports.addUser = async (req, res) => {
const { name, email, password, role } = req.body;
if (!name || !email || !password || !role) {
return res.status(400).json({ message: 'All fields are required' });
}

try {
const exists = await User.findOne({ email });
if (exists) {
return res.status(400).json({ message: 'User already exists' });
}

const user = new User({ name, email, password, role });
await user.save();
res.status(201).json({ message: 'User added successfully' });
} catch (err) {
console.error('Error adding user:', err.message);
res.status(500).json({ message: 'Server error' });
}
};

// Delete a user
exports.deleteUser = async (req, res) => {
try {
const user = await User.findById(req.params.id);
if (!user) return res.status(404).json({ message: 'User not found' });

await user.deleteOne();
res.json({ message: 'User deleted successfully' });
} catch (err) {
console.error('Error deleting user:', err.message);
res.status(500).json({ message: 'Server error' });
}
};

// Reset or change a user's password
exports.resetPassword = async (req, res) => {
const { newPassword } = req.body;
if (!newPassword || newPassword.length < 6) {
return res
.status(400)
.json({ message: 'Password must be at least 6 characters' });
}

try {
const user = await User.findById(req.params.id);
if (!user) return res.status(404).json({ message: 'User not found' });

user.password = newPassword; // Set plain password
await user.save(); // Let the model hash it

res.json({ message: 'Password reset successfully' });
} catch (err) {
console.error('Error resetting password:', err.message);
res.status(500).json({ message: 'Server error' });
}
};