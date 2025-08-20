// src/pages/CreatePostPage.js
import React, { useState } from 'react';
import Navbar from '../components/Navbar';

function CreatePostPage() {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [status, setStatus] = useState('draft'); // draft or published

  const handleSubmit = async (e) => {
    e.preventDefault();

    const postData = {
      title,
      content,
      status,
    };


    try {
      // Example: send to API (adjust URL as needed)
      const res = await fetch('http://localhost:5000/api/posts/create', {
        method: 'POST',
        credentials: 'include',
        headers: {
             'Content-Type': 'application/json',
            },
        body: JSON.stringify(postData),
      });

      if (!res.ok) throw new Error('Failed to create post');

      const data = await res.json();
      console.log(data)
      alert('Post created successfully!');
      // Reset form
      setTitle('');
      setContent('');
      setStatus('draft');
    } catch (err) {
      console.error(err);
      alert(err.message);
    }
  };

  return (
    <>
    <Navbar />
    <div className="max-w-2xl mx-auto mt-10 p-6 bg-white rounded-lg shadow">
      <h1 className="text-2xl font-bold mb-4">Create New Post</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium">Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full mt-1 p-2 border rounded"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium">Content</label>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="w-full mt-1 p-2 border rounded"
            rows="6"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium">Status</label>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="w-full mt-1 p-2 border rounded"
          >
            <option value="draft">Draft</option>
            <option value="published">Published</option>
          </select>
        </div>

        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
        >
          Create Post
        </button>
      </form>
    </div>
    </>
  );
}

export default CreatePostPage;
