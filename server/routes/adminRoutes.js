const express = require('express');
const router = express.Router();

const { protect } = require('../middleware/authMiddleware');
const { admin } = require('../middleware/adminMiddleware');

const {
getAllUsers,
addUser,
deleteUser,
resetPassword
} = require('../controllers/adminUserController');

const {
getAllTimesheets,
approveTimesheet,
rejectTimesheet,
enterTimesheetForUser,
deleteTimesheet
} = require('../controllers/adminTimesheetController');

// Apply authentication and admin-only authorization
router.use(protect, admin);

// User management routes
router.get('/users', getAllUsers);
router.post('/users', addUser);
router.delete('/users/:id', deleteUser);
router.put('/users/:id/reset-password', resetPassword);

// Timesheet management routes
router.get('/timesheets', getAllTimesheets);
router.post('/timesheets/enter', enterTimesheetForUser);
router.put('/timesheets/:id/approve', approveTimesheet);
router.put('/timesheets/:id/reject', rejectTimesheet);
router.delete('/timesheets/:id', deleteTimesheet);

module.exports = router;
