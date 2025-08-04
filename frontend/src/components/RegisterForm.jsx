// src/components/RegisterForm.jsx
import { useState } from 'react';
import { registerUser } from '../services/api';

export default function RegisterForm({ onSuccess }) {
  const [formData, setFormData] = useState({
    name: '',
    dob: '',
    place: '',
    email: '',
    phone: '',
    address: '',
    password: '',
  });
  const [profilePic, setProfilePic] = useState(null);
  const [resume, setResume] = useState(null);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.name) newErrors.name = 'Name is required';
    if (!formData.dob) newErrors.dob = 'DOB is required';
    if (!formData.email || !/\S+@\S+\.\S+/.test(formData.email))
      newErrors.email = 'Valid email is required';
    if (!formData.phone || !/^[0-9]{10}$/.test(formData.phone))
      newErrors.phone = '10-digit phone number required';
    if (!formData.password || formData.password.length < 6)
      newErrors.password = 'Password must be at least 6 characters';
    if (!profilePic) newErrors.profilePic = 'Profile photo is required';
    if (!resume) newErrors.resume = 'Resume is required';
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = validate();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setLoading(true);
    const data = new FormData();
    Object.keys(formData).forEach(key => data.append(key, formData[key]));
    if (profilePic) data.append('profilePic', profilePic);
    if (resume) data.append('resume', resume);

    try {
      await registerUser(data);
      alert('✅ Registration successful! Please login.');
      onSuccess();
    } catch (err) {
      const errorMsg = err.response?.data?.error || 'Registration failed';
      setErrors({ submit: errorMsg });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5 animate-fadeIn">
      {errors.submit && (
        <div className="bg-red-100 text-red-700 p-3 rounded text-sm animate-pulse">
          {errors.submit}
        </div>
      )}

      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <label className="block mb-1 font-medium">Full Name *</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className={`w-full p-3 border ${errors.name ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:ring-blue-500`}
          />
          {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
        </div>

        <div>
          <label className="block mb-1 font-medium">Date of Birth *</label>
          <input
            type="date"
            name="dob"
            value={formData.dob}
            onChange={handleChange}
            className={`w-full p-3 border ${errors.dob ? 'border-red-500' : 'border-gray-300'} rounded-lg`}
          />
          {errors.dob && <p className="text-red-500 text-xs mt-1">{errors.dob}</p>}
        </div>
      </div>

      <div>
        <label className="block mb-1 font-medium">Place</label>
        <input
          type="text"
          name="place"
          value={formData.place}
          onChange={handleChange}
          className="w-full p-3 border border-gray-300 rounded-lg"
        />
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <label className="block mb-1 font-medium">Email *</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className={`w-full p-3 border ${errors.email ? 'border-red-500' : 'border-gray-300'} rounded-lg`}
          />
          {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
        </div>

        <div>
          <label className="block mb-1 font-medium">Phone (10 digits) *</label>
          <input
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            className={`w-full p-3 border ${errors.phone ? 'border-red-500' : 'border-gray-300'} rounded-lg`}
          />
          {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
        </div>
      </div>

      <div>
        <label className="block mb-1 font-medium">Address *</label>
        <textarea
          name="address"
          value={formData.address}
          onChange={handleChange}
          rows="3"
          className="w-full p-3 border border-gray-300 rounded-lg"
          placeholder="Enter full address"
        />
      </div>

      <div>
        <label className="block mb-1 font-medium">Password (min 6 chars) *</label>
        <input
          type="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          className={`w-full p-3 border ${errors.password ? 'border-red-500' : 'border-gray-300'} rounded-lg`}
        />
        {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
      </div>

      <div>
        <label className="block mb-1 font-medium">Profile Photo (JPG/PNG/JPEG) *</label>
        <input
          type="file"
          accept=".jpg,.jpeg,.png"
          onChange={(e) => setProfilePic(e.target.files[0])}
          className="w-full p-3 border border-gray-300 rounded-lg file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-blue-600 file:text-white hover:file:bg-blue-700"
        />
        {errors.profilePic && <p className="text-red-500 text-xs mt-1">{errors.profilePic}</p>}
      </div>

      <div>
        <label className="block mb-1 font-medium">Resume (PDF/DOCX) *</label>
        <input
          type="file"
          accept=".pdf,.docx"
          onChange={(e) => setResume(e.target.files[0])}
          className="w-full p-3 border border-gray-300 rounded-lg file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-green-600 file:text-white hover:file:bg-green-700"
        />
        {errors.resume && <p className="text-red-500 text-xs mt-1">{errors.resume}</p>}
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 disabled:opacity-70 text-white font-bold py-3 rounded-lg text-lg transition transform animate-pulseSlow"
      >
        {loading ? 'Registering...' : 'Register Now'}
      </button>
    </form>
  );
}