import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { Users, FileText } from 'lucide-react'; // Icons

const Manager = () => {
  const token = localStorage.getItem('token');
  const navigate = useNavigate();

  useEffect(() => {
    const managerData = async () => {
      const res = await fetch('http://localhost:5000/api/auth/manager-data', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (res.status === 403) {
        alert('Access denied');
        navigate('/');
      } else {
        const data = await res.json();
        console.log(data);
      }
    };

    managerData();
  }, [token, navigate]);

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-100 py-12 px-6">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-800 text-center mb-10">
            Manager Dashboard
          </h1>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
            {/* Manage Users Card */}
            <div
              onClick={() => navigate('/manager/users')}
              className="bg-white rounded-2xl shadow-lg p-6 flex flex-col items-center cursor-pointer hover:shadow-xl transition"
            >
              <div className="bg-blue-100 p-4 rounded-full mb-4">
                <Users className="h-10 w-10 text-blue-600" />
              </div>
              <h2 className="text-xl font-semibold text-gray-800 mb-2">
                Manage Users
              </h2>
              <p className="text-gray-500 text-center">
                View users from the system.
              </p>
            </div>

            {/* Manage Posts Card */}
            <div
              onClick={() => navigate('/manager/posts')}
              className="bg-white rounded-2xl shadow-lg p-6 flex flex-col items-center cursor-pointer hover:shadow-xl transition"
            >
              <div className="bg-green-100 p-4 rounded-full mb-4">
                <FileText className="h-10 w-10 text-green-600" />
              </div>
              <h2 className="text-xl font-semibold text-gray-800 mb-2">
                Manage Posts
              </h2>
              <p className="text-gray-500 text-center">
                Review, edit, or delete posts from all authors.
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Manager;
