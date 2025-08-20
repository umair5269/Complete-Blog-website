import React, { useEffect, useState, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { AuthContext } from '@/context/AuthContext';

function SinglePostPage() {
   const { user } = useContext(AuthContext);
  const { id } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);

  // fetch the post
  useEffect(() => {
    const fetchPost = async () => {
      setLoading(true);
      try {
        const res = await fetch(`http://localhost:5000/api/posts/${id}`);
        if (!res.ok) {
          console.error('Failed to fetch post', res.status);
          setPost(null);
        } else {
          const data = await res.json();
          setPost(data);
        }
      } catch (err) {
        console.error('Error fetching post', err);
        setPost(null);
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [id]);


  // helper to return author id no matter the shape
  const getAuthorId = () => {
    if (!post) return null;
    if (!post.author) return null;
    // author might be an object { _id: '...' } or a string '...'
    return String(post.author._id ?? post.author);
  };

  // normalized current user id
  const getuserId = () => {
    if (!user) return null;
    return String(user._id ?? user.id ?? '');
  };


  // permissions
  const authorRole = post?.author?.role;
  const authorId = getAuthorId();
  const userId = getuserId();

  // EDIT: admin, author, manager (but manager can't edit admin's posts)
  const canEdit =
    user?.role === 'admin' ||
    (user?.role === 'manager' && authorRole !== 'admin') ||
    (authorId === userId);

  // DELETE: only admin and author
  const canDelete =
    user?.role === 'admin' ||
    (authorId === userId);


  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this post?')) return;
    try {
      const res = await fetch(`http://localhost:5000/api/posts/${id}`, {
        method: 'DELETE',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      if (res.ok) {
        alert('Post deleted');
        navigate(-1);
      } else {
        const text = await res.text();
        console.error('Delete failed:', res.status, text);
        alert('Failed to delete post');
      }
    } catch (err) {
      console.error(err);
      alert('Error deleting post');
    }
  };

  const handleEdit = () => {
    navigate(`/edit-post/${id}`);
  };

  if (loading) return <p className="text-center text-lg mt-12">Loading post...</p>;
  if (!post) return <p className="text-center text-lg mt-12">Post not found</p>;

  return (
    <>
      <Navbar />
      <div className="max-w-4xl mx-auto px-6 py-10">
        <div className="rounded-xl shadow-lg overflow-hidden bg-white">
          {/* header */}
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-6 text-white">
            <h1 className="text-3xl md:text-4xl font-extrabold">{post.title}</h1>
            <p className="mt-2 text-sm opacity-95">
              By <span className="font-semibold">{post.author?.name || 'Unknown'}</span> •{' '}
              {new Date(post.createdAt).toLocaleString()}
            </p>
          </div>

          {/* content */}
          <div className="p-8">
            <div className="prose prose-lg max-w-none text-gray-800">
              {post.content}
            </div>

            <div className="mt-6 flex items-center gap-3">
              {canEdit && (
                <button
                  onClick={handleEdit}
                  className="inline-flex items-center gap-2 bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded-lg shadow"
                >
                  ✏ Edit
                </button>
              )}

              {canDelete && (
                <button
                  onClick={handleDelete}
                  className="inline-flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg shadow"
                >
                  🗑 Delete
                </button>
              )}

              <button
                onClick={() => navigate(-1)}
                className="ml-auto text-blue-600 hover:underline"
              >
                ← Back
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default SinglePostPage;
