// src/App.jsx
import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

import RegisterPage from './pages/RegisterPage';
import LoginPage from './pages/LoginPage';
import HomePage from './pages/HomePage';

export default function App() {
  const [darkMode, setDarkMode] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Load from localStorage
  useEffect(() => {
    const savedMode = localStorage.getItem('darkMode') === 'true';
    const savedLogin = localStorage.getItem('isLoggedIn') === 'true';
    setDarkMode(savedMode);
    setIsLoggedIn(savedLogin);
  }, []);

  const toggleDarkMode = () => {
    const newMode = !darkMode;
    setDarkMode(newMode);
    localStorage.setItem('darkMode', newMode);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    localStorage.setItem('isLoggedIn', 'false');
    // We'll use navigate below
  };

  return (
    
      <div style={darkMode ? darkStyles.container : styles.container}>
        <header style={darkMode ? darkStyles.header : styles.header}>
          <h1 style={darkMode ? darkStyles.title : styles.title}>
            User Registration Portal
          </h1>

          <div style={styles.headerRight}>
            <button onClick={toggleDarkMode} style={styles.toggleBtn}>
              {darkMode ? '☀️ Light' : '🌙 Dark'}
            </button>

            {isLoggedIn && (
              <button onClick={handleLogout} style={styles.logoutBtn}>
                🔐 Logout
              </button>
            )}
          </div>
        </header>

        <main style={darkMode ? darkStyles.main : styles.main}>
          <Routes>
            <Route path="/" element={<Navigate to="/register" />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route
              path="/login"
              element={<LoginPage onLogin={() => setIsLoggedIn(true)} />}
            />
            <Route
              path="/home"
              element={isLoggedIn ? <HomePage darkMode={darkMode} /> : <Navigate to="/login" />}
            />
          </Routes>
        </main>

        <footer style={darkMode ? darkStyles.footer : styles.footer}>
          © {new Date().getFullYear()} UserRegPortal
        </footer>
      </div>
   
  );
}

// ✅ Light Mode Styles
const styles = {
  container: {
    minHeight: '100vh',
    backgroundColor: '#f8f9fa',
    color: '#333',
    fontFamily: 'Segoe UI, Arial, sans-serif',
  },
  header: {
    backgroundColor: 'white',
    padding: '1rem 2rem',
    borderBottom: '1px solid #ddd',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    fontSize: '1.5rem',
    fontWeight: 'bold',
    color: '#0056b3',
  },
  headerRight: {
    display: 'flex',
    gap: '12px',
    alignItems: 'center',
  },
  main: {
    flex: 1,
    padding: '2rem',
  },
  footer: {
    textAlign: 'center',
    padding: '1rem',
    backgroundColor: 'white',
    borderTop: '1px solid #ddd',
    fontSize: '0.9rem',
    color: '#666',
  },
  toggleBtn: {
    padding: '8px 12px',
    backgroundColor: '#6c757d',
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '0.9rem',
  },
  logoutBtn: {
    padding: '8px 12px',
    backgroundColor: '#dc3545',
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '0.9rem',
    fontWeight: '500',
  },
};

// ✅ Dark Mode Styles
const darkStyles = {
  container: {
    minHeight: '100vh',
    backgroundColor: '#121212',
    color: '#e0e0e0',
  },
  header: {
    backgroundColor: '#1f1f1f',
    padding: '1rem 2rem',
    borderBottom: '1px solid #444',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    fontSize: '1.5rem',
    fontWeight: 'bold',
    color: '#4dabf7',
  },
  main: {
    flex: 1,
    padding: '2rem',
  },
  footer: {
    textAlign: 'center',
    padding: '1rem',
    backgroundColor: '#1f1f1f',
    borderTop: '1px solid #444',
    fontSize: '0.9rem',
    color: '#aaa',
  },
  logoutBtn: {
    padding: '8px 12px',
    backgroundColor: '#c82333',
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '0.9rem',
    fontWeight: '500',
  },
};