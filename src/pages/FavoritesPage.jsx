import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { fetchFavorites } from "../api/favorites";
import { fetchPostById } from "../api/posts";
import PostGrid from "../components/PostGrid";
import { useAuth } from "../context/AuthContext";

export default function FavoritesPage() {
  const { user } = useAuth();
  const [posts, setPosts] = useState([]);
  const [skip, setSkip] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const loaderRef = useRef(null);
  const navigate = useNavigate();

  // Load favorites and enable infinite scroll
  useEffect(() => {
    loadFavorites(true);
  }, []);

  async function loadFavorites(reset = false) {
    if (loading) return;
    setLoading(true);

    try {
      const nextSkip = reset ? 0 : skip;
      const favs = await fetchFavorites(user._id);
      const limited = favs.slice(nextSkip, nextSkip + 8); // paginate manually

      const postPromises = limited.map(f => fetchPostById(f.postId));
      const favPosts = await Promise.all(postPromises);

      const BASE_URL = import.meta.env.VITE_API_URL;
      const mapped = favPosts.map(p => ({
        ...p,
        photoUrl: `${BASE_URL}/api/posts/${p._id}/photo`,
      }));

      const newPosts = reset ? mapped : [...posts, ...mapped];
      setPosts(newPosts);
      setSkip(nextSkip + limited.length);
      setHasMore(limited.length === 8);
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
        if (entries[0].isIntersecting) loadFavorites();
      },
      { threshold: 1 }
    );

    observer.observe(loaderRef.current);
    return () => observer.disconnect();
  }, [loaderRef.current, hasMore, posts]);

  return (
    <div className="home">
      <button className="back" onClick={() => navigate(-1)}>
        ← Back
      </button>
      
      <div className="main">
        <h1 className="favorites-title">Your Saved Favorites</h1>

        <PostGrid
          posts={posts}
          onPostClick={(id) => navigate(`/posts/${id}`)}
        />

        <div ref={loaderRef} className="infinite-loader" />

        {loading && <p className="home-status">Loading…</p>}
        {!loading && posts.length === 0 && <p>No favorites yet.</p>}
        {!hasMore && posts.length > 0 && (
          <p className="home-status">-~-End of Favorites-~-</p>
        )}
      </div>
    </div>
  );
}
