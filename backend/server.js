// backend/server.js
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');

// Load environment variables
dotenv.config();

// Connect to database
connectDB();

// Initialize app
const app = express();

// Middleware
app.use(cors({
  origin: 'http://localhost:5173', // Allow React dev server
  credentials: true,
}));
app.use(express.json()); // Parse JSON bodies

// Serve uploaded files statically
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
app.use('/api/auth', authRoutes);

// Root route (optional)
app.get('/', (req, res) => {
  res.send(`
    <h1>🔐 Backend Running</h1>
    <p>Available routes:</p>
    <ul>
      <li>POST /api/auth/register</li>
      <li>POST /api/auth/login</li>
      <li>GET /api/auth/users</li>
    </ul>
    <p>📁 Uploads: <a href="/uploads">/uploads</a></p>
  `);
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Backend server running at http://localhost:${PORT}`);
});