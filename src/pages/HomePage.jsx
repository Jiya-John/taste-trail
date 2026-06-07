import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { fetchPosts } from "../api/posts";

import PostGrid from "../components/PostGrid";
import SearchBar from "../components/SearchBar";

export default function HomePage() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [q, setQ] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  const navigate = useNavigate();

  // Load posts when search query changes
  useEffect(() => {
    async function loadPosts() {
      try {
        const BASE_URL = import.meta.env.VITE_API_URL;
        const data = await fetchPosts({ q });

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
  }, [q]);

  if (loading) return <p>Loading posts…</p>;

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

        {posts.length === 0 && (
          <p className="home-status">End of Taste Trail.</p>
        )}
      </div>
    </div>
  );
}
