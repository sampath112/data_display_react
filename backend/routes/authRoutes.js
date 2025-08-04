// backend/routes/authRoutes.js
const express = require('express');
const router = express.Router();
const { uploadFields } = require('../middleware/upload');
const {
  register,
  login,
  deleteUserController,
  getAllUsers,
} = require('../controllers/authController');

// POST /api/auth/register - Register user with files
router.post('/register', uploadFields, register);
// Add this line
router.delete('/users/:id', deleteUserController);

// POST /api/auth/login - Login user
router.post('/login', login);

// GET /api/auth/users - Get all registered users
router.get('/users', getAllUsers);

module.exports = router;