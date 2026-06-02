import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { fetchPosts } from "../api/posts";

import PostGrid from "../components/PostGrid";

export default function HomePage() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Load posts
  useEffect(() => {
    async function loadPosts() {
      try {
        const BASE_URL = import.meta.env.VITE_API_URL;
        const data = await fetchPosts();

        // Add photoUrl to each post
        const mapped = data.map((p) => ({
          ...p,
          photoUrl: `${BASE_URL}/api/posts/${p._id}/photo`,
        }));

        setPosts(mapped);
      } catch (err) {
        console.error("Failed to load posts", err);
      } finally {
        setLoading(false);
      }
    }

    loadPosts();
  }, []);

  if (loading) return <p>Loading posts…</p>;

  return (
    <div className="home">
      <div className="main">
        <PostGrid
          posts={posts}
          onPostClick={(id) => navigate(`/posts/${id}`)}
        />

        {posts.length === 0 && (
          <p className="home-status">End of Taste Trail.</p>
        )}
      </div>
    </div>
  );
}
