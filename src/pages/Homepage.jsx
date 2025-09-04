import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import { Link, useNavigate } from "react-router-dom";
import DOMPurify from "dompurify";
import { useSearchParams } from "react-router-dom";


function HomePage() {
  const [activeIndex, setActiveIndex] = useState(-1);
  const [searchParams, setSearchParams] = useSearchParams();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState(searchParams.get("q") || "");
  const [deBouncedSearch, setDeBouncedSearch] = useState("");
  const navigate = useNavigate();
  const API_URL = import.meta.env.VITE_API_URL;

  const featuredPosts = posts.slice(0, 3);
  const otherPosts = posts.slice(3);

  //  Merge posts into one results array to naviagte with keys
  const results = [...featuredPosts, ...otherPosts];

  // debounce search
  useEffect(() => {
    const timeout = setTimeout(() => {
      setDeBouncedSearch(search);
    }, 1000);
    return () => clearTimeout(timeout);
  }, [search]);

  // fetch posts
  useEffect(() => {
    const controller = new AbortController();
    setLoading(true);

    if (deBouncedSearch) {
      setSearchParams({ q: deBouncedSearch });
    } else {
      setSearchParams({});
    }

    const fetchAllPosts = async () => {
      try {
        const res = await fetch(
          `${API_URL}/api/posts/all?q=${deBouncedSearch}`,
          { signal: controller.signal }
        );
        if (res.ok) {
          const data = await res.json();
          setPosts(data);
        } else {
          console.error("Failed to fetch posts");
        }
      } catch (error) {
        if (error.name !== "AbortError") {
          console.error("Error fetching posts", error);
        }
      }
      setLoading(false);
    };

    fetchAllPosts();

    return () => controller.abort();
  }, [deBouncedSearch, setSearchParams]);

  // ✅ keyboard navigation
  const handleKeyDown = (e) => {
    if (!results.length) return;

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((prev) => (prev + 1) % results.length);
    }
    if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((prev) => (prev <= 0 ? results.length - 1 : prev - 1));
    }
    if (e.key === "Enter" && activeIndex >= 0) {
      navigate(`/post/${results[activeIndex]._id}`);
    }
    if (e.key === "Escape") {
      setSearch("");
      setActiveIndex(-1);
    }
  };

   function HighlightText({ text = "", query = "" }) {
  // sanitize fallback
  if (!query) {
    return (
      <span dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(text) }} />
    );
  }

  // limit query length to avoid ReDoS/personal resource issues
  const q = String(query).slice(0, 100).trim();
  if (!q) {
    return (
      <span dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(text) }} />
    );
  }

  // split into words and escape each
  const parts = q
    .split(/\s+/)
    .map((p) => p.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"))
    .filter(Boolean);

  if (!parts.length) {
    return (
      <span dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(text) }} />
    );
  }

  const regex = new RegExp(`(${parts.join("|")})`, "giu");
  const highlighted = String(text).replace(regex, "<mark>$1</mark>");

  // allow <mark> and some basic formatting tags if you want
  const clean = DOMPurify.sanitize(highlighted, {
    ALLOWED_TAGS: ["mark", "b", "i", "em", "strong", "a"],
    ALLOWED_ATTR: ["href", "target", "rel"]
  });

  return <span dangerouslySetInnerHTML={{ __html: clean }} />;
}

 
  return (
    <>
      <Navbar />
      <div className="flex flex-col min-h-screen bg-gray-100">
        <header className="w-full bg-blue-600 text-white py-8 text-center shadow">
          <h1 className="text-4xl font-bold">Welcome to the Home Page</h1>
          <p className="mt-2 text-lg">Stay updated with the latest posts</p>
        </header>

        <main className="max-w-7xl mx-auto px-4 py-8 flex-1 w-full">
          {/* Search Input */}
          <div className="w-full mx-auto">
            <input
              type="text"
              className="w-full p-2 border border-gray-300 rounded-md mb-5"
              placeholder="Search posts..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={handleKeyDown}
            />
          </div>

          {/* Conditional Rendering for Posts */}
          {loading ? (
            <div className="flex items-center justify-center h-64">
              <p className="text-gray-700 text-lg">Loading posts...</p>
            </div>
          ) : !posts.length ? (
            <div className="flex items-center justify-center h-64">
              <p className="text-gray-700 text-lg">No posts available yet.</p>
            </div>
          ) : (
            <>
              {/* Featured Posts */}
              <section>
                <h2 className="text-2xl font-bold mb-6 text-blue-700">
                  Featured Posts
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {featuredPosts.map((post, i) => {
                    const globalIndex = i; // index in results
                    return (
                      <div
                        key={post._id}
                        className={`bg-white rounded-lg shadow transition p-5 ${
                          globalIndex === activeIndex ? "ring-2 ring-blue-400" : ""
                        }`}
                      >
                        <h3 className="text-lg font-semibold text-blue-600 mb-2">
                          <Link to={`/post/${post._id}`}>
                            <HighlightText text={post.title} query={search} />
                          </Link>
                        </h3>
                        <p className="text-sm text-gray-500 mb-3">
                          By: <HighlightText text={post.author?.name || "Unknown"} query={search} />
                          
                        </p>
                        <p className="text-gray-700 text-sm">
                          <HighlightText
                            text={
                              post.content.length > 100
                                ? post.content.substring(0, 100) + "..."
                                : post.content
                            }
                            query={search}
                          />
                        </p>
                      </div>
                    );
                  })}
                </div>
              </section>

              {/* Other Posts */}
              {otherPosts.length > 0 && (
                <section className="mt-12">
                  <h2 className="text-2xl font-bold mb-6 text-blue-700">
                    All Posts
                  </h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {otherPosts.map((post, i) => {
                      const globalIndex = i + featuredPosts.length; // offset index
                      return (
                        <div
                          key={post._id}
                          className={`bg-white rounded-lg shadow transition p-5 ${
                            globalIndex === activeIndex
                              ? "ring-2 ring-blue-400"
                              : ""
                          }`}
                        >
                          <h3 className="text-lg font-semibold text-blue-600 mb-2">
                            <Link to={`/post/${post._id}`}>
                              <HighlightText text={post.title} query={search} />
                            </Link>
                          </h3>
                          <p className="text-sm text-gray-500 mb-3">
                            By: <HighlightText text={post.author?.name || "Unknown"} query={search} />
                          </p>
                          <p className="text-gray-700 text-sm">
                            <HighlightText
                            text={
                              post.content.length > 100
                                ? post.content.substring(0, 100) + "..."
                                : post.content
                            }
                            query={search}
                          />
                          </p>
                        </div>
                      );
                    })}
                  </div>
                </section>
              )}
            </>
          )}
        </main>

        <footer className="w-full bg-white py-4 text-center text-sm text-gray-500 border-t">
          &copy; {new Date().getFullYear()} My React App
        </footer>
      </div>
    </>
  );
}

export default HomePage;
