import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { fetchPostById, deletePost } from "../api/posts";
import { useAuth } from "../context/AuthContext";
import ConfirmDialog from "../components/ConfirmDialog";


export default function PostDetailPage() {
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const navigate = useNavigate();
  const { user } = useAuth();
  const [showConfirm, setShowConfirm] = useState(false);
  const [favorited, setFavorited] = useState(false);
  const [favLock, setFavLock] = useState(false);

  // Load post on mount
  useEffect(() => {
    async function load() {
      try {
        const data = await fetchPostById(id);
        const BASE_URL = import.meta.env.VITE_API_URL;

        setPost({
          ...data,
          photoUrl: `${BASE_URL}/api/posts/${data._id}/photo`,
        });
      } catch (err) {
        console.error(err);
      }
    }
    load();
  }, [id]);

  useEffect(() => {
    if (post && user) {
      setFavorited(user.favorites?.includes(post._id));
    }
  }, [post, user]);

  // Soft delete- status to inactive
  async function handleDelete() {
    try {
      await deletePost(id);
      navigate("/");
    } catch (err) {
      console.error(err);
    }
  }

  async function handleFavorite() {
    if (!user || favLock) return;
    setFavLock(true);

    const result = await toggleFavorite(user._id, post._id);

    setFavorited(result.favorited);

    // Update user object
    const updatedUser = {
      ...user,
      favorites: result.favorited
        ? [...user.favorites, post._id]
        : user.favorites.filter((id) => id !== post._id)
    };

    // Save to localStorage
    localStorage.setItem("user", JSON.stringify(updatedUser));
    
    setFavLock(false);
  }

  if (!post) return <p>Loading…</p>;

  // Only show edit button if user owns the post
  const isOwner = user && post.userId === user._id;

  return (
    <div className="post-detail">
      <button className="back" onClick={() => navigate(-1)}>
        ← Back
      </button>

      <div className="post-detail-card">
        
        {/* Photo */}
        <div className="post-detail-image-wrapper">
          <img
            src={post.photoUrl || "/placeholder.jpg"}
            alt={post.restaurantName}
            className="post-detail-image"
          />
        </div>

        {/* Text info */}
        <div className="post-detail-body">
          <button
            className={`fav-button ${favorited ? "faved" : ""}`}
            onClick={handleFavorite}
          >
            {favorited ? "⭐" : "☆"}
          </button>

          <h1 className="post-title">{post.restaurantName}</h1>

          <p className="post-address">
            {post.restaurantStreetName}, {post.restaurantCity}, {post.restaurantProvince}, {post.restaurantCountry} {post.restaurantPostalCode}
          </p>

          <div className="post-info">
            {post.dishName && (
              <p><span><strong>Dish: </strong></span> {post.dishName}</p>
            )}

            {post.rating && (
              <p><span><strong>Rating: </strong></span> {post.rating} / 5</p>
            )}

            {post.comment && (
              <p><span><strong>Comment: </strong></span>“{post.comment}”</p>
            )}
          </div>

          {/* Edit button for owner */}
          {isOwner && (
            <div className="post-actions">
              <button className="edit-button" onClick={() => navigate(`/posts/${post._id}/edit`)}>
                Edit Post
              </button>
              {/* Delete button */}
              <button className="delete-button" onClick={() => setShowConfirm(true)}>
                Delete Post
              </button>
            </div>
          )}
        </div>
      </div>
      {showConfirm && (
        <ConfirmDialog
          message="Are you sure you want to delete this post?"
          onCancel={() => setShowConfirm(false)}
          onConfirm={handleDelete}
        />
      )}
    </div>
  );
}
