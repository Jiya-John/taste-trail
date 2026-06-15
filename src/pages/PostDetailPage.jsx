import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { fetchPostById, deletePost } from "../api/posts";
import { useAuth } from "../context/AuthContext";

export default function PostDetailPage() {
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const navigate = useNavigate();
  const { user } = useAuth();

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

  // Soft delete- status to inactive
  async function handleDelete() {
    try {
      await deletePost(id);
      navigate("/");
    } catch (err) {
      console.error(err);
    }
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
              <button className="delete-button" onClick={handleDelete}>
                Delete Post
              </button>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
