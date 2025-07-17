const Timesheet = require('../models/Timesheet');

// Fetch all timesheets (admin)
exports.getAllTimesheets = async (req, res) => {
try {
const sheets = await Timesheet.find()
.populate('user', 'name email')
.sort('-createdAt');
res.json(sheets);
} catch (err) {
console.error('Error fetching timesheets:', err.message);
res.status(500).json({ message: 'Server error' });
}
};

// Approve a timesheet
exports.approveTimesheet = async (req, res) => {
try {
const ts = await Timesheet.findById(req.params.id);
if (!ts) return res.status(404).json({ message: 'Timesheet not found' });
ts.status = 'approved';
await ts.save();
res.json({ message: 'Timesheet approved' });
} catch (err) {
console.error('Error approving timesheet:', err.message);
res.status(500).json({ message: 'Server error' });
}
};

// Reject a timesheet
exports.rejectTimesheet = async (req, res) => {
try {
const ts = await Timesheet.findById(req.params.id);
if (!ts) return res.status(404).json({ message: 'Timesheet not found' });
ts.status = 'rejected';
await ts.save();
res.json({ message: 'Timesheet rejected' });
} catch (err) {
console.error('Error rejecting timesheet:', err.message);
res.status(500).json({ message: 'Server error' });
}
};

// Enter a timesheet for a user (auto-approved)
exports.enterTimesheetForUser = async (req, res) => {
try {
const { userId, startTime, endTime, breakMinutes } = req.body;
const st = new Date(startTime);
const et = new Date(endTime);
const diffHrs = (et - st) / (1000 * 60 * 60);
const hoursWorked = parseFloat((diffHrs - breakMinutes / 60).toFixed(2));

const newTs = new Timesheet({
user: userId,
startTime: st,
endTime: et,
breakMinutes,
hoursWorked,
status: 'approved'
});
await newTs.save();
res.status(201).json(newTs);
} catch (err) {
console.error('Error entering timesheet:', err.message);
res.status(500).json({ message: 'Server error' });
}
};

// Delete a timesheet
exports.deleteTimesheet = async (req, res) => {
try {
const ts = await Timesheet.findById(req.params.id);
if (!ts) return res.status(404).json({ message: 'Timesheet not found' });
await ts.deleteOne();
res.json({ message: 'Timesheet deleted' });
} catch (err) {
console.error('Error deleting timesheet:', err.message);
res.status(500).json({ message: 'Server error' });
}
};
