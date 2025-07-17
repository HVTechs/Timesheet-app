const User = require("../models/User");
const Timesheet = require("../models/Timesheet");
const bcrypt = require("bcryptjs");

// Get all users
exports.getAllUsers = async (req, res) => {
try {
const users = await User.find().select("-password");
res.json(users);
} catch (err) {
res.status(500).json({ message: "Failed to fetch users" });
}
};

// Add a new user
exports.addUser = async (req, res) => {
const { name, email, password, role } = req.body;

try {
const existing = await User.findOne({ email });
if (existing) {
return res.status(400).json({ message: "User already exists" });
}

const hashed = await bcrypt.hash(password, 10);

const user = await User.create({ name, email, password: hashed, role });
res.status(201).json({ message: "User created", user });
} catch (err) {
res.status(500).json({ message: "User creation failed" });
}
};

// Submit a timesheet with "approved" status
exports.submitApprovedTimesheet = async (req, res) => {
const { userId, date, startTime, endTime, breakMinutes, notes } = req.body;

if (!userId || !date || !startTime || !endTime || breakMinutes == null) {
return res.status(400).json({ message: "Missing required fields" });
}

const hoursWorked =
(new Date(`1970-01-01T${endTime}`) - new Date(`1970-01-01T${startTime}`)) /
3600000 -
breakMinutes / 60;

if (hoursWorked <= 0 || isNaN(hoursWorked)) {
return res.status(400).json({ message: "Invalid time or break" });
}

try {
const timesheet = await Timesheet.create({
user: userId,
date,
startTime,
endTime,
breakMinutes,
hoursWorked,
notes,
status: "approved"
});

res.status(201).json(timesheet);
} catch (err) {
res.status(500).json({ message: "Timesheet submission failed" });
}
};

// Get all timesheets (optionally filter)
exports.getAllTimesheets = async (req, res) => {
const { status, userId, fromDate, toDate } = req.query;

let filter = {};
if (status) filter.status = status;
if (userId) filter.user = userId;
if (fromDate || toDate) {
filter.date = {};
if (fromDate) filter.date.$gte = new Date(fromDate);
if (toDate) filter.date.$lte = new Date(toDate);
}

try {
const timesheets = await Timesheet.find(filter).populate("user", "name email");
res.json(timesheets);
} catch (err) {
res.status(500).json({ message: "Failed to fetch timesheets" });
}
};

// Approve or reject a timesheet
exports.updateTimesheetStatus = async (req, res) => {
const { id } = req.params;
const { status } = req.body;

if (!["approved", "rejected"].includes(status)) {
return res.status(400).json({ message: "Invalid status" });
}

try {
const ts = await Timesheet.findById(id);
if (!ts) return res.status(404).json({ message: "Timesheet not found" });

ts.status = status;
await ts.save();

res.json({ message: "Status updated", timesheet: ts });
} catch (err) {
res.status(500).json({ message: "Failed to update status" });
}
};