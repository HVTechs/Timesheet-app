const Timesheet = require('../models/Timesheet');

exports.submitTimesheet = async (req, res) => {
  const { startTime, endTime, breakMinutes } = req.body;
  if (!startTime || !endTime || breakMinutes == null) {
    return res.status(400).json({ message: 'Missing fields' });
  }

  const start = new Date(startTime);
  const end   = new Date(endTime);
  const diffHours = (end - start) / 36e5;  // ms→hours
  const hoursWorked = parseFloat((diffHours - breakMinutes/60).toFixed(2));

  const newSheet = new Timesheet({
    user: req.user._id,
    startTime:    start,
    endTime:      end,
    breakMinutes,
    hoursWorked
  });

  await newSheet.save();
  res.status(201).json(newSheet);
};

exports.getMyTimesheets = async (req, res) => {
  const list = await Timesheet.find({ user: req.user._id }).sort('-date');
  res.json(list);
};