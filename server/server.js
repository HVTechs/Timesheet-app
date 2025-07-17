require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./db');

const userRoutes      = require('./routes/userRoutes');
const timesheetRoutes = require('./routes/timesheetRoutes');
const adminRoutes     = require('./routes/adminRoutes');

const app = express();
connectDB();

app.use(cors({ origin: process.env.FRONTEND_URL }));
app.use(express.json());

app.use('/api/users',      userRoutes);
app.use('/api/timesheets', timesheetRoutes);
app.use('/api/admin',      adminRoutes);

app.get('/', (req, res) => res.send('🟢 API is running...'));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log('🚀 Server running on port ${PORT}'));