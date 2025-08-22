import React, { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import { Link } from 'react-router-dom';
import DOMPurify from 'dompurify';

function HomePage() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAllPosts = async () => {
      try {
        const res = await fetch('http://localhost:5000/api/posts/all');
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

    fetchAllPosts();
  }, []);

  if (loading) return <p className="text-center mt-8">Loading posts...</p>;

  if (!posts.length) {
    return (
      <>
        <Navbar />
        <div className="flex flex-col min-h-screen bg-gray-100">
          <header className="w-full bg-blue-600 text-white py-8 text-center shadow">
            <h1 className="text-4xl font-bold">Welcome to the Home Page</h1>
          </header>
          <main className="flex-1 flex items-center justify-center">
            <p className="text-gray-700">No posts available yet.</p>
          </main>
          <footer className="w-full bg-white py-4 text-center text-sm text-gray-500 border-t">
            &copy; {new Date().getFullYear()} My React App
          </footer>
        </div>
      </>
    );
  }

  const featuredPosts = posts.slice(0, 3);
  const otherPosts = posts.slice(3);

  return (
    <>
      <Navbar />
      <div className="flex flex-col min-h-screen bg-gray-100">
        {/* Content Wrapper */}
        <div className="flex-1">
          {/* Hero / Featured Section */}
          <header className="w-full bg-blue-600 text-white py-8 text-center shadow">
            <h1 className="text-4xl font-bold">Welcome to the Home Page</h1>
            <p className="mt-2 text-lg">Stay updated with the latest posts</p>
          </header>

          <main className="max-w-7xl mx-auto px-4 py-8">
            {/* Featured Posts */}
            <section>
              <h2 className="text-2xl font-bold mb-6 text-blue-700">Featured Posts</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {featuredPosts.map(post => (
                  <div
                    key={post._id}
                    className="bg-white rounded-lg shadow hover:shadow-lg transition p-5"
                  >
                    <h3 className="text-lg font-semibold text-blue-600 mb-2">
                      <Link to={`/post/${post._id}`}>{DOMPurify.sanitize(post.title)}</Link>
                    </h3>
                    <p className="text-sm text-gray-500 mb-3">
                      By: {DOMPurify.sanitize(post.author?.name || 'Unknown')}
                    </p>
                    <p className="text-gray-700 text-sm">
                      {DOMPurify.sanitize(
                        post.content.length > 100
                          ? post.content.substring(0, 100) + '...'
                          : post.content
                      )}
                    </p>
                  </div>
                ))}
              </div>
            </section>

            {/* Other Posts */}
            {otherPosts.length > 0 && (
              <section className="mt-12">
                <h2 className="text-2xl font-bold mb-6 text-blue-700">All Posts</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {otherPosts.map(post => (
                    <div
                      key={post._id}
                      className="bg-white rounded-lg shadow hover:shadow-lg transition p-5"
                    >
                      <h3 className="text-lg font-semibold text-blue-600 mb-2">
                        <Link to={`/post/${post._id}`}>{DOMPurify.sanitize(post.title)}</Link>
                      </h3>
                      <p className="text-sm text-gray-500 mb-3">
                        By: {DOMPurify.sanitize(post.author?.name || 'Unknown')}
                      </p>
                      <p className="text-gray-700 text-sm">
                        {DOMPurify.sanitize(
                          post.content.length > 100
                            ? post.content.substring(0, 100) + '...'
                            : post.content
                        )}
                      </p>
                    </div>
                  ))}
                </div>
              </section>
            )}
          </main>
        </div>

        {/* Footer always at bottom */}
        <footer className="w-full bg-white py-4 text-center text-sm text-gray-500 border-t">
          &copy; {new Date().getFullYear()} My React App
        </footer>
      </div>
    </>
  );
}

export default HomePage;
