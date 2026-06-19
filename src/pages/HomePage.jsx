import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { fetchPosts } from "../api/posts";

import PostGrid from "../components/PostGrid";
import SearchBar from "../components/SearchBar";

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
    loadPosts(true);
  }, [q]);

  async function loadPosts(reset = false) {
    if (loading) return;
    setLoading(true);

    try {
      const nextSkip = reset ? 0 : skip;
      const BASE_URL = import.meta.env.VITE_API_URL;

      const data = await fetchPosts({skip: nextSkip, limit: 8, q });

      // Add photoUrl to each post
      const mapped = data.map((p) => ({
        ...p,
        photoUrl: `${BASE_URL}/api/posts/${p._id}/photo`,
      }));

      const newPosts = reset ? mapped : [...posts, ...mapped];
      setPosts(newPosts);
      setSkip(nextSkip + data.length);
      setHasMore(data.length === 8);
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
        if (entries[0].isIntersecting) loadPosts();
      },
      { threshold: 1 }
    );

    observer.observe(loaderRef.current);
    return () => observer.disconnect();
  }, [loaderRef.current, hasMore, posts, q]);


  return (
    <div className="home">
      <div className="main">
        <SearchBar
          value={searchTerm}
          onChange={setSearchTerm}
          onSubmit={() => setQ(searchTerm.trim())}
        />
        <PostGrid
          posts={posts}
          onPostClick={(id) => navigate(`/posts/${id}`)}
        />

        <div ref={loaderRef} className="infinite-loader" />

        {loading && <p className="home-status">Loading…</p>}
        
        {!loading && posts.length === 0 && (<p>No posts found.</p>)}
        
        {!hasMore && posts.length > 0 && (
          <p className="home-status">-~-End of Taste Trail-~-</p>
        )}
      </div>
    </div>
  );
}
