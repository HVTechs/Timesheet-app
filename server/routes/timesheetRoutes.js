const express = require('express');
const router = express.Router();
const { submitTimesheet, getMyTimesheets } = require('../controllers/timesheetController');
const { protect } = require('../middleware/authMiddleware');

router.post('/', protect, submitTimesheet);
router.get('/my', protect, getMyTimesheets);

module.exports = router;