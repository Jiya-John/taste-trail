// Displays the logged-in user profile
// Allows editing profile fields and shows all posts created by the user.

import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { fetchUserById, updateUser } from "../api/users";
import { fetchPosts } from "../api/posts";
import PostCard from "../components/PostCard";
import { useNavigate } from "react-router-dom";

export default function ProfilePage() {
  const { user, logout } = useAuth();
  const [profile, setProfile] = useState(null); // loaded user data
  const [editing, setEditing] = useState(false); // edit mode toggle
  const [form, setForm] = useState({ fullName: "", username: "", city: "", phone: "" });
  const [posts, setPosts] = useState([]); // user's posts
  const [error, setError] = useState("");
  const [showConfirm, setShowConfirm] = useState(false); // logout dialog
  const navigate = useNavigate();

  // Load profile and user's posts
  useEffect(() => {
    async function load() {
      try {
        const u = await fetchUserById(user._id);
        setProfile(u);

        // Pre-fill edit form
        setForm({
          fullName: u.fullName || "",
          username: u.username || "",
          city: u.city || "",
          phone: u.phone || "",
        });

        // Load all posts and filter by user
        const p = await fetchPosts({ skip: 0, limit: 100 });
        const BASE_URL = import.meta.env.VITE_API_URL;

        const userPosts = p
          .filter((post) => post.userId === user._id)
          .map((post) => ({
            ...post,
            photoUrl: `${BASE_URL}/api/posts/${post._id}/photo`,
          }));

        setPosts(userPosts);

      } catch (err) {
        console.error(err);
      }
    }
    load();
  }, [user]);

  // Update form fields
  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  // Save profile changes
  async function handleSave(e) {
    e.preventDefault();
    setError("");

    try {
      const updated = await updateUser(user._id, form);
      setProfile(updated);
      setEditing(false);
    } catch (err) {
      setError(err.message || "Failed to update profile");
    }
  }

  if (!profile) return <p>Loading…</p>;

  return (
    <div className="tt-profile">
      {/* Profile header */}
      <div className="tt-profile-header">
        <div className="tt-profile-avatar">
          {profile.fullName?.[0] || "U"}
        </div>

        <div>
          <h1>{profile.fullName}</h1>
          <p>@{profile.username}</p>
          <p>{profile.city}</p>
        </div>
      </div>

      {/* Buttons for edit profile and upload post*/}
      <div className="tt-profile-actions">
        <button className="tt-profile-buttons" onClick={() => setEditing((v) => !v)}>
          {editing ? "Cancel" : "Edit profile"}
        </button>

        <button className="tt-profile-buttons" onClick={() => navigate("/upload")}>
          Upload post
        </button>
      </div>

      {/* Edit profile form */}
      {editing && (
        <form className="tt-form" onSubmit={handleSave}>
          <div className="tt-field">
            <label>Full name</label>
            <input
              name="fullName"
              value={form.fullName}
              onChange={handleChange}
              required
            />
          </div>

          <div className="tt-field">
            <label>Username</label>
            <input
              name="username"
              value={form.username}
              onChange={handleChange}
              required
            />
          </div>

          <div className="tt-field">
            <label>City</label>
            <input
              name="city"
              value={form.city}
              onChange={handleChange}
              required
            />
          </div>

          <div className="tt-field">
            <label>Phone</label>
            <input
              name="phone"
              value={form.phone}
              onChange={handleChange}
              placeholder="Optional"
            />
          </div>


          {error && <p className="tt-error">{error}</p>}

          <button type="submit" className="tt-auth-submit">
            Save profile
          </button>
        </form>
      )}

      {/* User's posts */}
      <h2>Your posts</h2>

      <div className="tt-grid">
        {posts.map((post) => (
          <PostCard
            key={post._id}
            post={post}
            onClick={() => navigate(`/posts/${post._id}`)}
          />
        ))}

        {posts.length === 0 && (
          <p>
            You haven’t shared any spots yet.
          </p>
        )}
      </div>
      
      {/* Logout confirmation dialog */}
      {showConfirm && (
        <div className="tt-dialog-backdrop">
          <div className="tt-dialog">
            <p>Are you sure you want to log out?</p>

            <div className="tt-dialog-actions">
              <button onClick={() => setShowConfirm(false)}>Cancel</button>
              <button className="primary" onClick={confirmLogout}>
                Log out
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
