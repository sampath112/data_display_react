// src/pages/HomePage.jsx
import { useState, useEffect } from 'react';
import { getAllUsers, deleteUser } from '../services/api';

export default function HomePage({ darkMode }) {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [deletingId, setDeletingId] = useState(null);
  const [toast, setToast] = useState(null); // ✅ Toast message

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await getAllUsers();
        setUsers(res.data);
      } catch (err) {
        console.error('Failed to fetch users:', err);
        setToast('⚠️ Could not load user data. Is backend running?');
        setTimeout(() => setToast(null), 4000);
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this user? This cannot be undone.")) {
      return;
    }

    setDeletingId(id);
    try {
      await deleteUser(id);
      setUsers(users.filter((u) => u._id !== id));
      setToast('✅ User deleted successfully');
      setTimeout(() => setToast(null), 3000);
    } catch (err) {
      setToast('❌ Failed: ' + (err.response?.data?.error || 'Network error'));
      setTimeout(() => setToast(null), 4000);
    } finally {
      setDeletingId(null);
    }
  };

  // 🔍 Filter users
  const filteredUsers = users.filter((user) =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.place.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <>
      {/* ✅ Toast Notification */}
      {toast && (
        <div style={toastStyles.success}>
          {toast}
        </div>
      )}

      <div style={styles.page(darkMode)}>
        {/* Page Header */}
        <div style={styles.header(darkMode)}>
          <h2 style={styles.heading(darkMode)}>📋 All Registered Users</h2>

          {/* Search Input */}
          <div style={styles.searchContainer}>
            <input
              type="text"
              placeholder="🔍 Search by name, email, or place..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={styles.searchInput(darkMode)}
            />
          </div>
        </div>

        {/* Loading State */}
        {loading ? (
          <p style={styles.loading(darkMode)}>Loading user data...</p>
        ) : filteredUsers.length === 0 ? (
          <p style={styles.noResults(darkMode)}>
            {searchTerm ? 'No users match your search.' : 'No users registered yet.'}
          </p>
        ) : (
          /* User Table */
          <table style={styles.table(darkMode)}>
            <thead>
              <tr>
                <th style={styles.th(darkMode)}>Name</th>
                <th style={styles.th(darkMode)}>DOB</th>
                <th style={styles.th(darkMode)}>Place</th>
                <th style={styles.th(darkMode)}>Email</th>
                <th style={styles.th(darkMode)}>Phone</th>
                <th style={styles.th(darkMode)}>Address</th>
                <th style={styles.th(darkMode)}>Photo</th>
                <th style={styles.th(darkMode)}>Resume</th>
                <th style={styles.th(darkMode)}>Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((user) => (
                <tr key={user._id} style={styles.tr(darkMode)}>
                  <td style={styles.td(darkMode)}>{user.name}</td>
                  <td style={styles.td(darkMode)}>{new Date(user.dob).toLocaleDateString()}</td>
                  <td style={styles.td(darkMode)}>{user.place}</td>
                  <td style={styles.td(darkMode)}>{user.email}</td>
                  <td style={styles.td(darkMode)}>{user.phone}</td>
                  <td style={styles.td(darkMode)}>{user.address}</td>

                  {/* Profile Picture */}
                  <td style={styles.td(darkMode)}>
                    {user.profilePic ? (
                      <a
                        href={`/uploads/profile-pics/${user.profilePic}`}
                        target="_blank"
                        rel="noreferrer"
                        style={styles.link}
                      >
                        <img
                          src={`/uploads/profile-pics/${user.profilePic}`}
                          alt={user.name}
                          style={styles.thumbnail}
                        />
                      </a>
                    ) : (
                      <span style={styles.muted(darkMode)}>—</span>
                    )}
                  </td>

                  {/* Resume */}
                  <td style={styles.td(darkMode)}>
                    {user.resume ? (
                      <a
                        href={`/uploads/resumes/${user.resume}`}
                        target="_blank"
                        download
                        style={styles.downloadBtn(darkMode)}
                      >
                        Download
                      </a>
                    ) : (
                      <span style={styles.muted(darkMode)}>—</span>
                    )}
                  </td>

                  {/* Delete Button */}
                  <td style={styles.td(darkMode)}>
                    {deletingId === user._id ? (
                      <span style={styles.deleting(darkMode)}>Deleting...</span>
                    ) : (
                      <button
                        onClick={() => handleDelete(user._id)}
                        style={styles.deleteBtn(darkMode)}
                      >
                        🗑️ Delete
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </>
  );
}

// ✅ Toast Styles
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

// ✅ Dynamic Styles
const styles = {
  page: (darkMode) => ({
    padding: '20px',
    maxWidth: '1200px',
    margin: '0 auto',
    fontFamily: 'Segoe UI, Arial, sans-serif',
    backgroundColor: darkMode ? '#121212' : '#f8f9fa',
    color: darkMode ? '#e0e0e0' : '#333',
  }),
  header: (darkMode) => ({
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: '16px',
    marginBottom: '24px',
    padding: '10px 0',
    backgroundColor: darkMode ? '#1f1f1f' : 'white',
    color: darkMode ? '#fff' : '#333',
  }),
  heading: (darkMode) => ({
    fontSize: '1.8rem',
    fontWeight: '600',
    color: darkMode ? '#fff' : '#333',
  }),
  searchContainer: {
    flex: 1,
    maxWidth: '400px',
  },
  searchInput: (darkMode) => ({
    width: '100%',
    padding: '10px 14px',
    fontSize: '1rem',
    border: '1px solid #ccc',
    borderRadius: '6px',
    outline: 'none',
    backgroundColor: darkMode ? '#333' : 'white',
    color: darkMode ? '#fff' : '#000',
  }),
  loading: (darkMode) => ({
    textAlign: 'center',
    padding: '20px',
    fontSize: '1.1rem',
    color: darkMode ? '#aaa' : '#666',
  }),
  noResults: (darkMode) => ({
    textAlign: 'center',
    padding: '20px',
    fontSize: '1.1rem',
    color: darkMode ? '#888' : '#999',
    fontStyle: 'italic',
  }),
  table: (darkMode) => ({
    width: '100%',
    borderCollapse: 'collapse',
    backgroundColor: darkMode ? '#1f1f1f' : 'white',
    boxShadow: darkMode ? '0 2px 8px rgba(255,255,255,0.1)' : '0 2px 8px rgba(0,0,0,0.1)',
    borderRadius: '8px',
    overflow: 'hidden',
  }),
  th: (darkMode) => ({
    textAlign: 'left',
    padding: '12px 16px',
    backgroundColor: darkMode ? '#333' : '#f1f1f1',
    color: darkMode ? '#fff' : '#333',
    fontWeight: '600',
    fontSize: '0.95rem',
    border: darkMode ? '1px solid #555' : '1px solid #ddd',
  }),
  tr: (darkMode) => ({
    borderBottom: darkMode ? '1px solid #444' : '1px solid #eee',
    backgroundColor: darkMode ? '#252525' : 'white',
  }),
  td: (darkMode) => ({
    padding: '12px 16px',
    border: darkMode ? '1px solid #444' : '1px solid #eee',
    color: darkMode ? '#ddd' : '#333',
    fontSize: '0.95rem',
  }),
  link: {
    textDecoration: 'none',
  },
  thumbnail: {
    width: '50px',
    height: '50px',
    borderRadius: '50%',
    objectFit: 'cover',
    border: '2px solid #0056b3',
    transition: 'transform 0.2s',
  },
  downloadBtn: () => ({
    display: 'inline-block',
    padding: '6px 12px',
    backgroundColor: '#28a745',
    color: 'white',
    fontSize: '0.9rem',
    fontWeight: '500',
    textDecoration: 'none',
    borderRadius: '4px',
    textAlign: 'center',
  }),
  deleteBtn: () => ({
    padding: '6px 10px',
    backgroundColor: '#dc3545',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    fontSize: '0.85rem',
    cursor: 'pointer',
    fontWeight: '500',
  }),
  deleting: (darkMode) => ({
    fontSize: '0.85rem',
    color: darkMode ? '#aaa' : '#666',
    fontStyle: 'italic',
  }),
  muted: (darkMode) => ({
    color: darkMode ? '#777' : '#aaa',
    fontSize: '0.9rem',
  }),
};