// src/pages/RegisterPage.jsx
import { useState } from 'react';
import { registerUser } from '../services/api';

export default function RegisterPage({ onSuccess }) {
  // Form state
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
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false); // For loading feedback

  // Handle text input changes
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Validate form
  const validate = () => {
    const newErrors = {};
    if (!formData.name) newErrors.name = 'Name is required';
    if (!formData.dob) newErrors.dob = 'Date of birth is required';
    if (!formData.email || !/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Valid email is required';
    }
    if (!formData.phone || !/^[0-9]{10}$/.test(formData.phone)) {
      newErrors.phone = 'Phone must be 10 digits';
    }
    if (!formData.password || formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    if (!profilePic) newErrors.profilePic = 'Profile photo is required';
    if (!resume) newErrors.resume = 'Resume is required';
    return newErrors;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    const newErrors = validate();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setSuccess('');
      return;
    }

    // ✅ File size validation
    if (profilePic && profilePic.size > 2 * 1024 * 1024) {
      setErrors({ profilePic: 'Profile photo must be under 2MB' });
      return;
    }
    if (resume && resume.size > 5 * 1024 * 1024) {
      setErrors({ resume: 'Resume must be under 5MB' });
      return;
    }

    // ✅ Prepare data
    setLoading(true);
    setErrors({});
    setSuccess('');

    const data = new FormData();
    Object.keys(formData).forEach(key => data.append(key, formData[key]));
    if (profilePic) data.append('profilePic', profilePic);
    if (resume) data.append('resume', resume);

    try {
      await registerUser(data);

      // ✅ Success: Show message
      setSuccess('✅ Registered successfully!');

      // Reset form
      setFormData({
        name: '', dob: '', place: '', email: '', phone: '', address: '', password: ''
      });
      setProfilePic(null);
      setResume(null);
      document.getElementById('profilePicInput').value = '';
      document.getElementById('resumeInput').value = '';

      // Auto-hide success after 3 seconds
      setTimeout(() => {
        setSuccess('');
        if (onSuccess) onSuccess();
      }, 3000);

    } catch (err) {
      setErrors({ submit: err.response?.data?.error || 'Registration failed' });
    } finally {
      setLoading(false); // Stop loading
    }
  };

  return (
    <>
      {/* Inline CSS for hover effect (not supported in React inline style) */}
      <style>
        {`
          .register-submit-btn {
            padding: 14px;
            background-color: #0056b3;
            color: white;
            border: none;
            border-radius: 6px;
            font-size: 1.1rem;
            font-weight: bold;
            cursor: pointer;
            grid-column: 1 / -1;
            width: 100%;
            transition: background 0.2s;
          }
          .register-submit-btn:hover:not(:disabled) {
            background-color: #004494;
          }
          .register-submit-btn:disabled {
            opacity: 0.7;
            cursor: not-allowed;
          }

          .file-input {
            padding: 8px;
            border: 1px dashed #0056b3;
            border-radius: 6px;
            background-color: #f0f8ff;
            font-size: 1rem;
            width: 100%;
          }

          .error-text {
            font-size: 0.85rem;
            color: red;
            margin-top: 4px;
          }
        `}
      </style>

      <div style={styles.page}>
        {/* Success Message */}
        {success && (
          <div style={styles.successMessage}>{success}</div>
        )}

        {/* Error Message */}
        {errors.submit && (
          <div style={styles.errorMessage}>{errors.submit}</div>
        )}

        <div style={styles.formContainer}>
          <h2 style={styles.heading}>📝 Register New User</h2>

          <form onSubmit={handleSubmit} style={styles.form}>

            {/* Name */}
            <div style={styles.inputGroup}>
              <label>Name *</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                style={styles.input}
              />
              {errors.name && <span className="error-text">{errors.name}</span>}
            </div>

            {/* DOB */}
            <div style={styles.inputGroup}>
              <label>Date of Birth *</label>
              <input
                type="date"
                name="dob"
                value={formData.dob}
                onChange={handleChange}
                style={styles.input}
              />
              {errors.dob && <span className="error-text">{errors.dob}</span>}
            </div>

            {/* Place */}
            <div style={styles.inputGroup}>
              <label>Place</label>
              <input
                type="text"
                name="place"
                value={formData.place}
                onChange={handleChange}
                placeholder="City/Town"
                style={styles.input}
              />
            </div>

            {/* Email */}
            <div style={styles.inputGroup}>
              <label>Email *</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                style={styles.input}
              />
              {errors.email && <span className="error-text">{errors.email}</span>}
            </div>

            {/* Phone */}
            <div style={styles.inputGroup}>
              <label>Phone (10 digits) *</label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                style={styles.input}
              />
              {errors.phone && <span className="error-text">{errors.phone}</span>}
            </div>

            {/* Address */}
            <div style={styles.inputGroup}>
              <label>Address *</label>
              <textarea
                name="address"
                value={formData.address}
                onChange={handleChange}
                rows="3"
                style={styles.textarea}
              />
            </div>

            {/* Password */}
            <div style={styles.inputGroup}>
              <label>Password (min 6 chars) *</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                style={styles.input}
              />
              {errors.password && <span className="error-text">{errors.password}</span>}
            </div>

            {/* Profile Picture */}
            <div style={styles.inputGroup}>
              <label>Profile Photo (JPG/PNG, max 2MB) *</label>
              <input
                type="file"
                accept=".jpg,.jpeg,.png"
                onChange={(e) => setProfilePic(e.target.files[0])}
                id="profilePicInput"
                className="file-input"
              />
              {errors.profilePic && <span className="error-text">{errors.profilePic}</span>}
            </div>

            {/* Resume */}
            <div style={styles.inputGroup}>
              <label>Resume (PDF/DOCX, max 5MB) *</label>
              <input
                type="file"
                accept=".pdf,.docx"
                onChange={(e) => setResume(e.target.files[0])}
                id="resumeInput"
                className="file-input"
              />
              {errors.resume && <span className="error-text">{errors.resume}</span>}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="register-submit-btn"
              disabled={loading}
            >
              {loading ? '⏳ Uploading...' : 'Register'}
            </button>

          </form>
        </div>
      </div>
    </>
  );
}

// ✅ Inline Styles (non-interactive parts)
const styles = {
  page: {
    padding: '20px',
    maxWidth: '900px',
    margin: '0 auto',
    fontFamily: 'Segoe UI, Arial, sans-serif',
  },

  successMessage: {
    padding: '12px 16px',
    backgroundColor: '#d4edda',
    color: '#155724',
    borderRadius: '6px',
    fontSize: '1rem',
    textAlign: 'center',
    fontWeight: '500',
    marginBottom: '16px',
    border: '1px solid #c3e6cb',
  },

  errorMessage: {
    padding: '12px',
    backgroundColor: '#f8d7da',
    color: '#721c24',
    borderRadius: '6px',
    fontSize: '0.95rem',
    textAlign: 'center',
    marginBottom: '16px',
    border: '1px solid #f5c6cb',
  },

  formContainer: {
    backgroundColor: 'white',
    padding: '30px',
    borderRadius: '10px',
    boxShadow: '0 4px 10px rgba(0,0,0,0.1)',
    border: '1px solid #e0e0e0',
  },

  heading: {
    fontSize: '1.8rem',
    fontWeight: '600',
    marginBottom: '24px',
    textAlign: 'center',
    color: '#333',
  },

  form: {
    display: 'grid',
    gap: '16px',
    gridTemplateColumns: '1fr 1fr',
    gridAutoFlow: 'dense',
  },

  inputGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '6px',
  },

  input: {
    padding: '12px',
    border: '1px solid #ccc',
    borderRadius: '6px',
    fontSize: '1rem',
  },

  textarea: {
    padding: '12px',
    border: '1px solid #ccc',
    borderRadius: '6px',
    fontSize: '1rem',
    resize: 'vertical',
  },
};