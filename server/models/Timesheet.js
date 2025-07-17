const mongoose = require('mongoose');

const timesheetSchema = new mongoose.Schema({
  user:         { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  startTime:    { type: Date, required: true },
  endTime:      { type: Date, required: true },
  breakMinutes: { type: Number, required: true },
  hoursWorked:  { type: Number, required: true },
  status:       { type: String, enum: ['submitted','approved','rejected'], default: 'submitted' }
}, { timestamps: true });

module.exports = mongoose.model('Timesheet', timesheetSchema);