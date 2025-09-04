import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import DOMPurify from 'dompurify';
import LoadingPage from '../components/LoadingPage';



export default function EditPostPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [status, setStatus] = useState('draft');
  const [loading, setLoading] = useState(true);
  const API_URL = import.meta.env.VITE_API_URL;

  // Load the current post data
  useEffect(() => {
    const fetchPost = async () => {
      try {
        const res = await fetch(`${API_URL}/api/posts/${id}`, {
          method: 'GET',
          credentials: 'include',
        });
        if (!res.ok) throw new Error('Failed to load post');
        const data = await res.json();
        setTitle(data.title || '');
        setContent(data.content || '');
        setStatus(data.status || 'draft');
      } catch (err) {
        console.error(err);
        alert('Error loading post');
      } finally {
        setLoading(false);
      }
    };
    fetchPost();
  }, [id]);

  // Save changes
  const handleUpdate = async (e) => {
    e.preventDefault();

    const cleanTitle = DOMPurify.sanitize(title);
    const cleanContent = DOMPurify.sanitize(content);
    try {
      const res = await fetch(`${API_URL}/api/posts/${id}`, {
        method: 'PUT',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ title: cleanTitle, content: cleanContent, status }),
      });

      if (res.ok) {
        navigate("/showposts");
      } else {
        const errorData = await res.json();
        alert(errorData.message || 'Failed to update post');
      }
    } catch (err) {
      console.error(err);
      alert('Error updating post');
    }
  };

  if (loading) {
    // return <p className="text-center text-lg mt-12">Loading post...</p>;
    return <LoadingPage />;
  }

  return (
    <>
      <Navbar />
      <div className="max-w-3xl mx-auto px-6 py-10">
        <div className="bg-white rounded-xl shadow-lg p-8 border border-gray-100">
          <h1 className="text-2xl font-bold text-gray-800 mb-6">
            ✏ Edit Post
          </h1>

          <form onSubmit={handleUpdate} className="space-y-6">
            {/* Title */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Post Title
              </label>
              <input
                type="text"
                className="w-full px-4 py-2 border rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter post title"
                required
              />
            </div>

            {/* Content */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Content
              </label>
              <textarea
                className="w-full px-4 py-2 border rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none min-h-[200px]"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Write your post content here..."
                required
              />
            </div>

            {/* Status */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Status
              </label>
              <select
                className="w-full px-4 py-2 border rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                value={status}
                onChange={(e) => setStatus(e.target.value)}
              >
                <option value="draft">Draft</option>
                <option value="published">Published</option>
              </select>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-end gap-4">
              <button
                type="button"
                onClick={() => navigate(-1)}
                className="px-4 py-2 rounded-lg border border-gray-300 hover:bg-gray-100"
              >
                Cancel
              </button>
              <button
                type="submit"

                className="px-6 py-2 rounded-lg bg-blue-600 text-white font-semibold shadow hover:bg-blue-700 transition"
              >
                Save Changes
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
