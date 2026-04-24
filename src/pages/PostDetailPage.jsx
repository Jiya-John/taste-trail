// Displays a single post in full detail.
// Includes restaurant info, dish, rating, comment, and edit button for owner.

import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { fetchPostById } from "../api/posts";
import { useAuth } from "../context/AuthContext";
import { deletePost } from "../api/posts";
import ConfirmDialog from "../components/ConfirmDialog";

export default function PostDetailPage() {
  const { id } = useParams();  // post ID from URL
  const [post, setPost] = useState(null);
  const navigate = useNavigate();
  const { user } = useAuth();
  const [showConfirm, setShowConfirm] = useState(false);

  // Delete post handling
  async function handleDelete() {
    try {
      await deletePost(id);
      navigate("/");
    } catch (err) {
      console.error(err);
    }
  }

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

  if (!post) return <p>Loading…</p>;

  // Only show edit button if logged-in user owns the post
  const isOwner = user && post.userId === user._id;

  return (
    <div className="tt-post-detail">
      <button className="tt-back" onClick={() => navigate(-1)}>
        ← Back
      </button>

      <div className="tt-post-detail-card">
        {/* Large photo */}
        <div className="tt-post-detail-image-wrapper">
          <img
            src={post.photoUrl || "/placeholder.jpg"}
            alt={post.restaurantName}
            className="tt-post-detail-image"
          />
        </div>

        {/* Text info */}
        <div className="tt-post-detail-body">
          <h1 className="tt-post-title">{post.restaurantName}</h1>
          <p className="tt-post-city">{post.restaurantCity}</p>

          <div className="tt-post-info">
            {post.dishName && (
              <p><span>Dish: </span> {post.dishName}</p>
            )}

            {post.rating && (
              <p><span>Rating: </span> {post.rating} / 5</p>
            )}

            {post.comment && (
              <p className="tt-post-comment">“{post.comment}”</p>
            )}
          </div>

          {/* Edit button for owner */}
          {isOwner && (
            <div className="tt-post-actions">
              <button
                className="tt-edit-btn"
                onClick={() => navigate(`/posts/${post._id}/edit`)}
              >
                Edit Post
              </button>

              <button
                className="tt-delete-btn"
                onClick={() => setShowConfirm(true)}
              >
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
