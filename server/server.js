require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./db');

const userRoutes      = require('./routes/userRoutes');
const timesheetRoutes = require('./routes/timesheetRoutes');
const adminRoutes     = require('./routes/adminRoutes');

const app = express();
connectDB();

// ✅ CORS settings — allow localhost + your deployed frontend
const allowedOrigins = [
  'http://localhost:3000',
  'https://timesheet-app-hemanth.vercel.app'
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('❌ Not allowed by CORS'));
    }
  },
  credentials: true
}));

app.use(express.json());

app.use('/api/users',      userRoutes);
app.use('/api/timesheets', timesheetRoutes);
app.use('/api/admin',      adminRoutes);

app.get('/', (req, res) => res.send('🟢 API is running...'));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log('🚀 Server running on port ${PORT}'));