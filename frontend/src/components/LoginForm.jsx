// src/components/LoginForm.jsx
import { useState } from 'react';
import { loginUser } from '../services/api';

export default function LoginForm({ onLogin }) {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await loginUser(formData);
      onLogin();
    } catch (err) {
      setError(err.response?.data?.error || 'Login failed');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5 bg-white p-8 rounded-xl shadow-lg animate-slideUp max-w-md w-full mx-auto">
      <h2 className="text-3xl font-bold text-center text-gray-800">🔐 Login</h2>
      {error && <p className="text-red-600 text-center bg-red-50 p-3 rounded">{error}</p>}

      <div>
        <label className="block mb-1 font-medium">Email</label>
        <input
          type="email"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          placeholder="you@example.com"
          required
        />
      </div>

      <div>
        <label className="block mb-1 font-medium">Password</label>
        <input
          type="password"
          value={formData.password}
          onChange={(e) => setFormData({ ...formData, password: e.target.value })}
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          placeholder="••••••••"
          required
        />
      </div>

      <button
        type="submit"
        className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-semibold py-3 rounded-lg text-lg transform transition"
      >
        Login
      </button>
    </form>
  );
}