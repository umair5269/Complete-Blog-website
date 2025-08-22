import React, { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import { Trash2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import DOMPurify from 'dompurify';

export default function AdminUsersPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await fetch('http://localhost:5000/api/admin/users', {
          method: 'GET',
          credentials: 'include',
        });
        if (res.status === 403) {
          alert('Access denied');
          navigate('/');
          return;
        }
        const data = await res.json();
        setUsers(data);
      } catch (err) {
        console.error(err);
      }
      setLoading(false);
    };

    fetchUsers();
  }, [navigate]);

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this user?')) return;
    try {
      const res = await fetch(`http://localhost:5000/api/admin/users/${id}`, {
        method: 'DELETE',
        credentials: 'include',
      });

      if (res.status === 401) {
        alert("Session expired. Please log in again.");
        navigate("/login");
        return;
      }

      if (res.ok) {
        setUsers(users.filter(user => user._id !== id));
        alert('User deleted successfully');
      } else {
        alert('Failed to delete user');
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleRoleChange = async (id, newRole) => {
    if (!window.confirm(`Change role to "${newRole}"?`)) return;

    try {
      const res = await fetch(`http://localhost:5000/api/admin/users/${id}/role`, {
        method: 'PATCH',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ role: newRole })
      });
      const data = await res.json();

      if (res.status === 401) {
        alert("Session expired. Please log in again.");
        navigate("/login");
        return;
      }

      if (res.ok) {
        setUsers(users.map(user =>
          user._id === id ? { ...user, role: newRole } : user
        ));
        alert('Role updated successfully');
      } else {
        console.log(data)
        alert(data.message);
      }
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) return <p className="text-center mt-10">Loading users...</p>;

  return (
    <>
      <Navbar />
      <div className="max-w-6xl mx-auto px-6 py-10">
        <h1 className="text-3xl font-bold mb-6">Manage Users</h1>
        <div className="overflow-x-auto bg-white rounded-xl shadow-lg">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Email
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Role
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {users.map((user) => (
                <tr key={user._id}>

                  <td className="px-6 py-4">{DOMPurify.sanitize(user.name)}</td>
                  <td className="px-6 py-4">{DOMPurify.sanitize(user.email)}</td>
                  <td className="px-6 py-4 capitalize">
                    <select
                      value={user.role}
                      onChange={(e) => handleRoleChange(user._id, e.target.value)}
                      className="border rounded px-2 py-1"
                    >
                      <option value="user">User</option>
                      <option value="manager">Manager</option>
                    </select>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button
                      onClick={() => handleDelete(user._id)}
                      className="text-red-600 hover:text-red-800 transition"
                    >
                      <Trash2 className="inline h-5 w-5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
