import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';

export default function UserDashboard() {
  const [user, setUser] = useState(null);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
  
      try {
        const res = await fetch('http://localhost:5000/api/auth/profile', {
          method: 'GET',
          credentials: 'include',
        });

        if (res.status === 401) {
          // not logged in, redirect
          navigate('/login');
          return;
        }

        const data = await res.json();
        console.log('Profile data:', data);

        if (!res.ok) {
          setError(data.message || 'Failed to load profile');
        } else {
          setUser(data);
        }
      } catch (err) {
        setError('An error occurred');
      }
    };

    fetchProfile();
  }, [navigate]);

  return (
    <>
      <Navbar />
      <div className="max-w-4xl mx-auto px-6 py-12">
        <h2 className="text-3xl font-bold mb-8 text-gray-800">
          User Dashboard
        </h2>

        {error && (
          <div className="bg-red-100 text-red-700 px-4 py-3 rounded-lg mb-6 shadow">
            {error}
          </div>
        )}

        {user ? (
          <div className="bg-white rounded-xl shadow-lg p-8">
            <h3 className="text-2xl font-semibold text-gray-700 mb-6">
              Welcome, {user.name}!
            </h3>

            <div className="space-y-4">
              <div className="flex justify-between border-b pb-2">
                <span className="text-gray-500 font-medium">Email:</span>
                <span className="text-gray-800">{user.email}</span>
              </div>
              <div className="flex justify-between border-b pb-2">
                <span className="text-gray-500 font-medium">Role:</span>
                <span className="capitalize text-gray-800">{user.role}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500 font-medium">Member Since:</span>
                <span className="text-gray-800">
                  {new Date(user.createdAt).toLocaleDateString()}
                </span>
              </div>
            </div>
          </div>
        ) : (
          !error && (
            <div className="bg-gray-50 text-gray-500 px-4 py-6 rounded-lg shadow text-center">
              Loading user info...
            </div>
          )
        )}
      </div>
    </>
  );
}
