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
  'http://localhost:5173',
  'https://timesheet-app-hemanth.vercel.app'
];

app.use(cors({
  origin: function (origin, callback) {
    if (
      !origin ||
      allowedOrigins.includes(origin) ||
      /\.vercel\.app$/.test(origin) // ✅ allow any *.vercel.app subdomain
    ) {
      callback(null, true);
    } else {
      callback(new Error('❌ Not allowed by CORS: ' + origin));
    }
  },
  credentials: true
}));

app.use(express.json());

app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/users',      userRoutes);
app.use('/api/timesheets', timesheetRoutes);
app.use('/api/admin',      adminRoutes);

app.get('/', (req, res) => res.send('🟢 API is running...'));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log('🚀 Server running on port ${PORT}'));
