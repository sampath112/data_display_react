// backend/models/User.js
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  dob: { type: Date, required: true },
  place: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String, required: true, match: [/^[0-9]{10}$/, 'Phone must be 10 digits'] },
  address: { type: String, required: true },
  profilePic: { type: String }, // filename only
  resume: { type: String },    // filename only
  password: { type: String, required: true },
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);