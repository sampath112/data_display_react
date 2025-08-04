// backend/controllers/authController.js
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const fs = require('fs');
const path = require('path');

// ✅ Register User
exports.register = async (req, res) => {
  const {
    name,
    dob,
    place,
    email,
    phone,
    address,
    password,
  } = req.body;

  try {
    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: 'Email already registered' });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Handle file uploads
    let profilePic = '';
    let resume = '';

    // Validate and save profile picture
    if (req.files && req.files.profilePic) {
      const file = req.files.profilePic[0];
      const ext = path.extname(file.originalname).toLowerCase();
      const allowedImageTypes = ['.jpg', '.jpeg', '.png'];
      if (!allowedImageTypes.includes(ext)) {
        return res.status(400).json({ error: 'Only JPG, JPEG, PNG allowed for profile photo' });
      }
      profilePic = Date.now() + '-profile' + ext;
      fs.writeFileSync(
        path.join(__dirname, '..', 'uploads/profile-pics', profilePic),
        file.buffer
      );
    }

    // Validate and save resume
    if (req.files && req.files.resume) {
      const file = req.files.resume[0];
      const ext = path.extname(file.originalname).toLowerCase();
      if (ext !== '.pdf' && ext !== '.docx') {
        return res.status(400).json({ error: 'Only PDF or DOCX files allowed for resume' });
      }
      resume = Date.now() + '-resume' + ext;
      fs.writeFileSync(
        path.join(__dirname, '..', 'uploads/resumes', resume),
        file.buffer
      );
    }

    // Create new user
    const newUser = new User({
      name,
      dob,
      place,
      email,
      phone,
      address,
      password: hashedPassword,
      profilePic,
      resume,
    });

    await newUser.save();
    res.status(201).json({ message: 'User registered successfully!' });

  } catch (err) {
    console.error('Registration error:', err);
    res.status(500).json({ error: 'Server error during registration' });
  }
};

// ✅ Login User
exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    res.json({
      message: 'Login successful',
      userId: user._id,
      name: user.name,
    });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ error: 'Server error during login' });
  }
};
// DELETE /api/auth/users/:id
exports.deleteUserController = async (req, res) => {
    try {
      const User = require('../models/User');
      const fs = require('fs');
      const path = require('path');
  
      const user = await User.findByIdAndDelete(req.params.id);
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }
  
      // Delete profile picture from disk
      if (user.profilePic) {
        const picPath = path.join(__dirname, '..', 'uploads', 'profile-pics', user.profilePic);
        if (fs.existsSync(picPath)) {
          fs.unlinkSync(picPath); // Delete file
        }
      }
  
      // Delete resume from disk
      if (user.resume) {
        const resumePath = path.join(__dirname, '..', 'uploads', 'resumes', user.resume);
        if (fs.existsSync(resumePath)) {
          fs.unlinkSync(resumePath); // Delete file
        }
      }
  
      res.json({ message: 'User deleted successfully' });
    } catch (err) {
      console.error('Delete error:', err);
      res.status(500).json({ error: 'Failed to delete user' });
    }
  };

// ✅ Get All Users
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find({});
    res.json(users);
  } catch (err) {
    console.error('Fetch users error:', err);
    res.status(500).json({ error: 'Failed to retrieve users' });
  }
};