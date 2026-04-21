// Main feed of posts with search bar

import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { fetchPosts } from "../api/posts";
import PostGrid from "../components/PostGrid";

const PAGE_SIZE = 8;

export default function HomePage() {
  const [posts, setPosts] = useState([]);
  const [skip, setSkip] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const [q, setQ] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const loaderRef = useRef(null);
  const navigate = useNavigate();

  // Load posts when search query changes
  useEffect(() => {
    loadMore(true);
  }, [q]);

  async function loadMore(reset = false) {
    if (loading) return;
    setLoading(true);

    try {
      const nextSkip = reset ? 0 : skip;
      const BASE_URL = import.meta.env.VITE_API_URL;

      const data = await fetchPosts({ skip: nextSkip, limit: PAGE_SIZE, q });

      // Add photoUrl to each post
      const mapped = data.map((p) => ({
        ...p,
        photoUrl: `${BASE_URL}/api/posts/${p._id}/photo`,
      }));

      const newPosts = reset ? mapped : [...posts, ...mapped];
      setPosts(newPosts);

      setSkip(nextSkip + data.length);
      setHasMore(data.length === PAGE_SIZE);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  // Infinite scroll
  useEffect(() => {
    if (!hasMore || !loaderRef.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) loadMore();
      },
      { threshold: 1 }
    );

    observer.observe(loaderRef.current);
    return () => observer.disconnect();
  }, [loaderRef.current, hasMore, posts, q]);

  function handleSearchSubmit(e) {
    e.preventDefault();
    setQ(searchTerm.trim());
  }

  return (
    <div className="tt-home">
      <div className="tt-main">
        {/* Search */}
        <div className="tt-home-top">
          <form onSubmit={handleSearchSubmit} className="tt-home-search-form">
            <input
              className="tt-search"
              placeholder="Search by restaurant, city, or dish…"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <button type="submit" className="tt-search-btn">
              Search
            </button>
          </form>
        </div>

        {/* Grid of posts */}
        <PostGrid
          posts={posts}
          onPostClick={(id) => navigate(`/posts/${id}`)}
        />

        {/* Infinite scroll sentinel */}
        <div ref={loaderRef} className="tt-loader-sentinel" />

        {/* Loading and end messages */}
        {loading && <p className="tt-home-status">Loading…</p>}
        {!hasMore && posts.length > 0 && (
          <p className="tt-home-status">You’ve reached the end of the trail.</p>
        )}
      </div>
    </div>
  );
}
