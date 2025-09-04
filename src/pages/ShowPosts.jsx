import React, { useEffect, useState, useContext } from 'react';
import Navbar from '../components/Navbar';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { AuthContext } from '@/context/AuthContext';
import DOMPurify from 'dompurify';
import LoadingPage from '../components/LoadingPage';

function MyPostsPage() {
  const { user } = useContext(AuthContext);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  // const isOwner= (post) => post.author._id === user?._id;
  const API_URL = import.meta.env.VITE_API_URL;

  const userRole = user?.role
  const userId = user?.id

  useEffect(() => {
    const fetchMyPosts = async () => {
      try {
        const res = await fetch(`${API_URL}/api/posts/my-posts`, {
          method: "GET",
          credentials: "include",
          headers: {
            'Content-Type': 'application/json',
          }
        });

        if (res.ok) {
          const data = await res.json();
          setPosts(data);
        } else {
          console.error('Failed to fetch posts');
        }
      } catch (error) {
        console.error('Error fetching posts', error);
      }
      setLoading(false);
    };

    fetchMyPosts();
  }, [navigate]);


  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this post?')) return;
    try {
      const res = await fetch(`http://localhost:5000/api/posts/${id}`, {
        method: 'DELETE',
        credentials: "include",
        headers: {
          "Content-Type": "application/json"
        }
      });

      if (res.ok) {
        setPosts(posts.filter(post => post._id !== id));
      } else {
        console.error('Failed to delete post');
      }
    } catch (error) {
      console.error('Error deleting post', error);
    }
  };

  const handleEdit = (id) => {
    navigate(`/edit-post/${id}`);
  };

  // if (loading) return <p className="text-center mt-8">Loading your posts...</p>;
  if (loading) return <LoadingPage/>;

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-100 py-8 px-4">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold mb-6 text-blue-700">My Posts</h2>
          {posts.length === 0 ? (
            <p className="text-gray-600">You haven't created any posts yet.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {posts.map(post => (
                <div
                  key={post._id}
                  className="bg-white rounded-lg shadow hover:shadow-lg transition p-5 flex flex-col justify-between"
                >
                  <div>

                    <Link to={`/post/${post._id}`} className="text-blue-600 hover:underline">

                      <h3 className="text-xl font-semibold text-blue-600 mb-2">{DOMPurify.sanitize(post.title)}</h3>
                    </Link>
                    <p className="text-gray-700 text-sm mb-3">
                      {DOMPurify.sanitize(
                        post.content.length > 100
                          ? post.content.substring(0, 100) + '...'
                          : post.content
                      )}
                    </p>
                    <p className="text-xs text-gray-500">
                      Status: {post.status} | {new Date(post.createdAt).toLocaleString()}
                    </p>
                  </div>

                  <div className="mt-4 flex gap-2">
                    {(userRole === 'admin' || userId === post.author) && (
                      <>
                        <button
                          onClick={() => handleEdit(post._id)}
                          className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600 transition"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(post._id)}
                          className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition"
                        >
                          Delete
                        </button>
                      </>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default MyPostsPage;
