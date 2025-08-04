// src/pages/RegisterPage.jsx
import { useState } from 'react';
import { registerUser } from '../services/api';
import { useNavigate } from 'react-router-dom';

// ✅ 1. Toast Styles (moved up)
const toastStyles = {
  success: {
    position: 'fixed',
    top: '20px',
    right: '20px',
    padding: '12px 20px',
    backgroundColor: '#d4edda',
    color: '#155724',
    borderRadius: '6px',
    fontSize: '0.95rem',
    fontWeight: '500',
    zIndex: 1000,
    boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
    transition: 'opacity 0.3s',
    opacity: 1,
  }
};

// ✅ 2. Form Styles (moved up)
const styles = {
  page: {
    padding: '20px',
    maxWidth: '900px',
    margin: '0 auto',
    fontFamily: 'Segoe UI, Arial, sans-serif',
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
  errorText: {
    fontSize: '0.85rem',
    color: 'red',
    marginTop: '4px',
  },
  navLink: {
    marginTop: '1rem',
    textAlign: 'center',
    fontSize: '0.95rem',
    color: '#555',
  },
  link: {
    color: '#0056b3',
    textDecoration: 'none',
    fontWeight: '500',
  },
};

// ✅ 3. Component (now uses styles defined above)
export default function RegisterPage() {
  const [formData, setFormData] = useState({
    name: '', dob: '', place: '', email: '', phone: '', address: '', password: ''
  });
  const [profilePic, setProfilePic] = useState(null);
  const [resume, setResume] = useState(null);
  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.name) newErrors.name = 'Name is required';
    if (!formData.dob) newErrors.dob = 'Date of birth is required';
    if (!formData.email || !/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Valid email';
    if (!formData.phone || !/^[0-9]{10}$/.test(formData.phone)) newErrors.phone = '10-digit phone';
    if (!formData.password || formData.password.length < 6) newErrors.password = 'Min 6 chars';
    if (!profilePic) newErrors.profilePic = 'Profile photo required';
    if (!resume) newErrors.resume = 'Resume required';
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = validate();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setSuccess('');
      return;
    }

    setLoading(true);
    setErrors({});
    setSuccess('');

    const data = new FormData();
    Object.keys(formData).forEach(key => data.append(key, formData[key]));
    if (profilePic) data.append('profilePic', profilePic);
    if (resume) data.append('resume', resume);

    try {
      await registerUser(data);

      setSuccess('✅ Registered successfully! Redirecting to login...');
      setFormData({ name: '', dob: '', place: '', email: '', phone: '', address: '', password: '' });
      setProfilePic(null);
      setResume(null);
      document.getElementById('profilePicInput').value = '';
      document.getElementById('resumeInput').value = '';

      setTimeout(() => {
        navigate('/login');
      }, 2000);

    } catch (err) {
      setErrors({ submit: err.response?.data?.error || 'Registration failed' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* ✅ Toast Notification */}
      {success && (
        <div style={toastStyles.success}>
          {success}
        </div>
      )}

      <div style={styles.page}>
        {errors.submit && <div style={styles.errorMessage}>{errors.submit}</div>}

        <div style={styles.formContainer}>
          <h2 style={styles.heading}>📝 Register New User</h2>

          <form onSubmit={handleSubmit} style={styles.form}>
            <div style={styles.inputGroup}>
              <label>Name *</label>
              <input type="text" name="name" value={formData.name} onChange={handleChange} style={styles.input} />
              {errors.name && <span style={styles.errorText}>{errors.name}</span>}
            </div>

            <div style={styles.inputGroup}>
              <label>Date of Birth *</label>
              <input type="date" name="dob" value={formData.dob} onChange={handleChange} style={styles.input} />
              {errors.dob && <span style={styles.errorText}>{errors.dob}</span>}
            </div>

            <div style={styles.inputGroup}>
              <label>Place</label>
              <input type="text" name="place" value={formData.place} onChange={handleChange} placeholder="City/Town" style={styles.input} />
            </div>

            <div style={styles.inputGroup}>
              <label>Email *</label>
              <input type="email" name="email" value={formData.email} onChange={handleChange} style={styles.input} />
              {errors.email && <span style={styles.errorText}>{errors.email}</span>}
            </div>

            <div style={styles.inputGroup}>
              <label>Phone (10 digits) *</label>
              <input type="tel" name="phone" value={formData.phone} onChange={handleChange} style={styles.input} />
              {errors.phone && <span style={styles.errorText}>{errors.phone}</span>}
            </div>

            <div style={styles.inputGroup}>
              <label>Address *</label>
              <textarea name="address" value={formData.address} onChange={handleChange} rows="3" style={styles.textarea} />
            </div>

            <div style={styles.inputGroup}>
              <label>Password (min 6 chars) *</label>
              <input type="password" name="password" value={formData.password} onChange={handleChange} style={styles.input} />
              {errors.password && <span style={styles.errorText}>{errors.password}</span>}
            </div>

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

            <button
              type="submit"
              className="submit-btn"
              disabled={loading}
            >
              {loading ? '⏳ Uploading...' : 'Register'}
            </button>
          </form>

          <p style={styles.navLink}>
            Already have an account?{' '}
            <a href="/login" style={styles.link}>Login here</a>
          </p>
        </div>
      </div>

      {/* Inline CSS for hover */}
      <style>
        {`
          .submit-btn {
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
          .submit-btn:hover:not(:disabled) {
            background-color: #004494;
          }
          .submit-btn:disabled {
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
    </>
  );
}