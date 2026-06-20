import { useState } from "react";
import { likePost } from "../api/posts";
import { useAuth } from "../context/AuthContext";

export default function PostCard({ post, onClick }) {
  const { user } = useAuth();
  const [likes, setLikes] = useState(post.likesCount || 0);
  const [liked, setLiked] = useState(post.likedBy?.includes(user?._id));
  const [likeLock, setLikeLock] = useState(false);
  
  async function handleLike(e) {
    e.stopPropagation(); // prevent opening post

    if (!user) return; // not allow if user not logged in
    if (likeLock) return;
    setLikeLock(true);

    try {
      const result = await likePost(post._id, user._id);

      if (result.liked) {
        setLiked(true);
        setLikes((l) => l + 1);
      } else {
        setLiked(false);
        setLikes((l) => l - 1);
      }
    }
    finally {
      setLikeLock(false); // unlock after API finishes
    }
  }
  return (
    <article className="post-card" onClick={onClick}>
      {/* Photo */}
      <div className="post-image-wrapper">
        <img
          src={post.photoUrl || "/placeholder.jpg"}
          alt={post.restaurantName}
          className="post-image"
        />
      </div>

      {/* Text info */}
      <div className="post-data">
        <h3>{post.restaurantName}</h3>
        <p>{post.restaurantCity}</p>

        <button
          className={'like-button ${liked ? "liked" : ""}'}
          onClick={handleLike}
        >
          {liked ? "❤️" : "🤍"} {likes}
        </button>
      </div>
    </article>
  );
}
