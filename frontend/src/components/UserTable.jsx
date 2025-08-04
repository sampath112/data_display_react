// src/components/UserTable.jsx
import { useEffect, useState } from 'react';
import { getAllUsers } from '../services/api';

export default function UserTable() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await getAllUsers();
        setUsers(res.data);
      } catch (err) {
        alert('Failed to load users: ' + (err.response?.data?.error || 'Network error'));
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  if (loading) return <p className="text-center py-10 text-gray-500">Loading user data...</p>;

  return (
    <div className="overflow-x-auto animate-fadeIn">
      <table className="min-w-full bg-white border border-gray-200 rounded-lg shadow">
        <thead className="bg-gray-50">
          <tr>
            <th className="py-3 px-4 border-b text-left text-sm font-semibold text-gray-700">Name</th>
            <th className="py-3 px-4 border-b text-left text-sm font-semibold text-gray-700">DOB</th>
            <th className="py-3 px-4 border-b text-left text-sm font-semibold text-gray-700">Place</th>
            <th className="py-3 px-4 border-b text-left text-sm font-semibold text-gray-700">Email</th>
            <th className="py-3 px-4 border-b text-left text-sm font-semibold text-gray-700">Phone</th>
            <th className="py-3 px-4 border-b text-left text-sm font-semibold text-gray-700">Address</th>
            <th className="py-3 px-4 border-b text-center text-sm font-semibold text-gray-700">Photo</th>
            <th className="py-3 px-4 border-b text-center text-sm font-semibold text-gray-700">Resume</th>
          </tr>
        </thead>
        <tbody>
          {users.length === 0 ? (
            <tr>
              <td colSpan="8" className="py-5 text-center text-gray-500">No users registered yet.</td>
            </tr>
          ) : (
            users.map((user) => (
              <tr key={user._id} className="hover:bg-gray-25 transition duration-100">
                <td className="py-3 px-4 border-b">{user.name}</td>
                <td className="py-3 px-4 border-b">{new Date(user.dob).toLocaleDateString()}</td>
                <td className="py-3 px-4 border-b">{user.place}</td>
                <td className="py-3 px-4 border-b">{user.email}</td>
                <td className="py-3 px-4 border-b">{user.phone}</td>
                <td className="py-3 px-4 border-b">{user.address}</td>
                <td className="py-3 px-4 border-b text-center">
                  {user.profilePic ? (
                    <a
                      href={`/uploads/profile-pics/${user.profilePic}`}
                      target="_blank"
                      rel="noreferrer"
                      className="text-blue-600 hover:underline font-medium"
                    >
                      View
                    </a>
                  ) : (
                    '—'
                  )}
                </td>
                <td className="py-3 px-4 border-b text-center">
                  {user.resume ? (
                    <a
                      href={`/uploads/resumes/${user.resume}`}
                      target="_blank"
                      rel="noreferrer"
                      className="text-green-600 hover:underline font-medium"
                    >
                      Download
                    </a>
                  ) : (
                    '—'
                  )}
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}