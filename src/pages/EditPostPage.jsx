// Allows the user to edit an existing post.
// Loads the post data, pre-fills the form, and updates via API.

import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { fetchPostById, updatePost } from "../api/posts";
import { useAuth } from "../context/AuthContext";

export default function EditPostPage() {
  const { id } = useParams(); // post ID from URL
  const [form, setForm] = useState(null); // form fields
  const [photoFile, setPhotoFile] = useState(null); // new photo file
  const [preview, setPreview] = useState(""); // preview image
  const { user } = useAuth();
  const [error, setError] = useState("");
  const navigate = useNavigate();

  // Load post data
  useEffect(() => {
    async function load() {
      try {
        const data = await fetchPostById(id);

        // Pre-fill form with existing values
        setForm({
          restaurantName: data.restaurantName || "",
          restaurantCity: data.restaurantCity || "",
          dishName: data.dishName || "",
          rating: data.rating || "",
          comment: data.comment || "",
        });

        // Existing photo preview
        setPreview(data.photoUrl || "");
      } catch (err) {
        console.error(err);
      }
    }
    load();
  }, [id]);

  if (!form) return <p>Loading…</p>;

  // Update text fields
  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  // Handle new photo upload
  function handlePhotoChange(e) {
    const file = e.target.files[0];
    setPhotoFile(file);

    if (file) {
      const url = URL.createObjectURL(file);
      setPreview(url);
    }
  }

  // Submit updated post
  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    try {
      const fd = new FormData();
      fd.append("userId", user._id);
      fd.append("restaurantName", form.restaurantName);
      fd.append("restaurantCity", form.restaurantCity);
      fd.append("dishName", form.dishName);
      fd.append("rating", form.rating);
      fd.append("comment", form.comment);
      


      // Only append photo if user selected a new one
      if (photoFile) fd.append("photo", photoFile);

      await updatePost(id, fd);
      navigate(`/posts/${id}`); // go back to detail page
    } catch (err) {
      setError(err.message || "Failed to update post");
    }
  }

  return (
    <div className="tt-form-page">
      <h1>Edit post</h1>

      <form className="tt-form" onSubmit={handleSubmit}>
        {/* Photo */}
        <div className="tt-field">
          <label>Photo</label>
          <div className="tt-file-input">
             <input type="file" accept="image/*" onChange={handlePhotoChange} />
          </div>
         
          {preview && (
            <div className="tt-photo-preview">
              <img src={preview} alt="Preview" />
            </div>
          )}
        </div>

        {/* Text fields */}
        <div className="tt-field">
          <label>Restaurant name</label>
          <input
            name="restaurantName"
            value={form.restaurantName}
            onChange={handleChange}
            required
          />
        </div>

        <div className="tt-field">
          <label>City</label>
          <input
            name="restaurantCity"
            value={form.restaurantCity}
            onChange={handleChange}
            required
          />
        </div>

        <div className="tt-field">
          <label>Dish name</label>
          <input
            name="dishName"
            value={form.dishName}
            onChange={handleChange}
          />
        </div>

        <div className="tt-field">
          <label>Rating (1–5)</label>
          <input
            name="rating"
            type="number"
            min="1"
            max="5"
            value={form.rating}
            onChange={handleChange}
          />
        </div>

        <div className="tt-field">
          <label>Comment</label>
          <textarea
            name="comment"
            rows="3"
            value={form.comment}
            onChange={handleChange}
          />
        </div>

        {error && <p className="tt-error">{error}</p>}
        <div className="tt-edit-actions">
          <button type="submit" className="tt-auth-submit">
            Save changes
          </button>

          <button
            type="button"
            className="tt-auth-submit"
            onClick={() => navigate(`/profile`)}
          >
            Back
          </button>
        </div>
      </form>
    </div>
  );
}
