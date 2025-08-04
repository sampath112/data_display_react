// src/pages/LoginPage.jsx
import { useState } from 'react';
import { loginUser } from '../services/api';
import { useNavigate } from 'react-router-dom';

// ✅ Styles defined first
const styles = {
  page: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '80vh',
    padding: '20px',
    backgroundColor: '#f8f9fa',
  },
  formContainer: {
    width: '100%',
    maxWidth: '400px',
    padding: '2rem',
    border: '1px solid #ddd',
    borderRadius: '8px',
    backgroundColor: 'white',
    boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
  },
  heading: {
    fontSize: '1.8rem',
    textAlign: 'center',
    marginBottom: '1.5rem',
    color: '#333',
  },
  error: {
    backgroundColor: '#f8d7da',
    color: '#721c24',
    padding: '0.75rem',
    borderRadius: '4px',
    marginBottom: '1rem',
    fontSize: '0.9rem',
    textAlign: 'center',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
  },
  inputGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.5rem',
  },
  input: {
    padding: '0.75rem',
    border: '1px solid #ccc',
    borderRadius: '4px',
    fontSize: '1rem',
  },
  button: {
    padding: '0.75rem',
    backgroundColor: '#28a745',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    fontSize: '1rem',
    fontWeight: 'bold',
    cursor: 'pointer',
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

// ✅ Correct: Destructure { onLogin }
export default function LoginPage({ onLogin }) {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Submitting login:", formData);

    try {
      const res = await loginUser(formData);
      console.log("Login success:", res.data);

      // ✅ 1. Save to localStorage
      localStorage.setItem('isLoggedIn', 'true');

      // ✅ 2. Update parent state
      if (onLogin) onLogin();

      // ✅ 3. Navigate to home
      navigate('/home');
    } catch (err) {
      console.error("Login error:", err);
      const errorMsg = err.response?.data?.error || err.message || 'Login failed';
      setError(errorMsg);
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.formContainer}>
        <h2 style={styles.heading}>🔐 Login</h2>
        {error && <p style={styles.error}>{error}</p>}

        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.inputGroup}>
            <label>Email</label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
              style={styles.input}
            />
          </div>
          <div style={styles.inputGroup}>
            <label>Password</label>
            <input
              type="password"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              required
              style={styles.input}
            />
          </div>
          <button type="submit" style={styles.button}>
            Login
          </button>
        </form>

        <p style={styles.navLink}>
          Don't have an account?{' '}
          <a href="/register" style={styles.link}>Register here</a>
        </p>
      </div>
    </div>
  );
}