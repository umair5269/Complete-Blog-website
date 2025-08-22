import React, { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import { Link, useNavigate } from 'react-router-dom';
import DOMPurify from 'dompurify';

const ManagerPostsPage = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = await fetch('http://localhost:5000/api/manager/posts', {
          method: 'GET',
          credentials: "include",
        });
        const data = await res.json();
        setPosts(data);
      } catch (err) {
        console.error(err);
      }
      setLoading(false);
    };
    fetchPosts();
  }, []);

  if (loading) return <p className="text-center mt-10">Loading posts...</p>;

  return (
    <>
      <Navbar />
      <div className="max-w-6xl mx-auto px-6 py-10">
        <h1 className="text-3xl font-bold mb-6">All Posts</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {posts.map((post) => (
            <div key={post._id} className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold mb-2"><Link to={`/post/${post._id}`}>{DOMPurify.sanitize(post.title)}</Link></h2>
              <p className="text-gray-500 mb-2">
                By {DOMPurify.sanitize(post.author?.name || 'Unknown')}
              </p>
              <p className="text-gray-700 mb-4">
                {DOMPurify.sanitize(post.content.slice(0, 100))}...
              </p>
              <div className="flex gap-2">
                <button
                  onClick={() => navigate(`/edit-post/${post._id}`)}
                  className="px-3 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600 transition"
                >
                  Edit
                </button>
                {/* <button
                  onClick={() => handleDelete(post._id)}
                  className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 transition"
                >
                  Delete
                </button> */}
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default ManagerPostsPage;
