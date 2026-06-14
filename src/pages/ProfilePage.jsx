import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { fetchUserById, updateUser } from "../api/users";
import { fetchPosts } from "../api/posts";
import PostCard from "../components/PostCard";
import { useNavigate } from "react-router-dom";

export default function ProfilePage() {
  const {user, logout} = useAuth();
  const [profile, setProfile] = useState(null); // loaded user data
  const [editing, setEditing] = useState(false); // edit mode toggle
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    username: "",
    email: "",
    streetName: "",
    city: "",
    province: "",
    country: "",
    postalCode: "",
  });
  const [posts, setPosts] = useState([]); // user's posts
  const [error, setError] = useState("");
  const [showConfirm, setShowConfirm] = useState(false); // logout dialog
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  // Load profile and user's posts
  useEffect(() => {
    async function load() {
      if (!user) return; // wait until user loaded
      
      try {
        const u = await fetchUserById(user._id);
        setProfile(u);

        setForm({
          firstName: u.firstName || "",
          lastName: u.lastName || "",
          username: u.username || "",
          email: u.email || "",
          streetName: u.streetName || "",
          city: u.city || "",
          province: u.province || "",
          country: u.country || "",
          postalCode: u.postalCode || "",
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
      } finally {
        setLoading(false); 
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
    <div className="profile">
      {/* Profile header */}
      <div className="profile-header">
        <div className="profile-avatar">
          {profile.firstName?.[0] || "U"}
        </div>

        <div>
          <h1>{profile.firstName} {profile.lastName}</h1>
          <p>@{profile.username}</p>
          <p>{profile.city}, {profile.country}</p>
        </div>
      </div>

      {/* Actions - Edit profile or Upload post */}
      <div className="profile-actions">
        <button className="profile-button" onClick={() => setEditing((v) => !v)}>
          {editing ? "Cancel" : "Edit profile"}
        </button>

        <button className="profile-button" onClick={() => navigate("/upload")}>
          Upload post
        </button>
      </div>

      {/* Edit form */}
      {editing && (
        <form className="form" onSubmit={handleSave}>
          <div className="form-field">
            <label>First Name</label>
            <input name="firstName" value={form.firstName} onChange={handleChange} required />
          </div>

          <div className="form-field">
            <label>Last Name</label>
            <input name="lastName" value={form.lastName} onChange={handleChange} required />
          </div>

          <div className="form-field">
            <label>Username</label>
            <input name="username" value={form.username} onChange={handleChange} required />
          </div>

          <div className="form-field">
            <label>Email (read-only)</label>
            <input name="email" value={form.email} readOnly />
          </div>

          <div className="form-field">
            <label>Street Name</label>
            <input name="streetName" value={form.streetName} onChange={handleChange} />
          </div>

          <div className="form-field">
            <label>City</label>
            <input name="city" value={form.city} onChange={handleChange} required />
          </div>

          <div className="form-field">
            <label>Province</label>
            <input name="province" value={form.province} onChange={handleChange} />
          </div>

          <div className="form-field">
            <label>Country</label>
            <input name="country" value={form.country} onChange={handleChange} />
          </div>

          <div className="form-field">
            <label>Postal Code</label>
            <input name="postalCode" value={form.postalCode} onChange={handleChange} />
          </div>

          {error && <p className="error">{error}</p>}

          <button type="submit" className="auth-submit">
            Save profile
          </button>
        </form>
      )}

      {/* User posts */}
      <h2>Your posts</h2>

      {loading ? (
        <p>Loading...</p>
      ) : posts.length === 0 ? (
        <p>You haven’t shared any food spots yet.</p>
      ) : (
        <div className="grid">
          {posts.map((post) => (
            <PostCard
              key={post._id}
              post={post}
              onClick={() => navigate(`/posts/${post._id}`)}
            />
          ))}
        </div>
      )}
    </div>
  );
}