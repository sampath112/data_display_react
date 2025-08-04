// backend/middleware/upload.js
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Create upload directories if they don't exist
const ensureDir = (dir) => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
};
ensureDir('./uploads/profile-pics');
ensureDir('./uploads/resumes');

// Configure multer to accept two fields
const uploadFields = multer().fields([
  { name: 'profilePic', maxCount: 1 },  // Must match frontend field name
  { name: 'resume', maxCount: 1 }       // Must match frontend field name
]);

module.exports = { uploadFields };