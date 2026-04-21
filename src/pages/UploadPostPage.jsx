// Form for creating a new post.
// Includes photo upload with preview and all restaurant fields.

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createPost } from "../api/posts";
import { useAuth } from "../context/AuthContext";

export default function UploadPostPage() {
  const [form, setForm] = useState({
    restaurantName: "",
    restaurantCity: "",
    dishName: "",
    rating: "",
    comment: "",
  });

  const [photoFile, setPhotoFile] = useState(null); // uploaded file
  const [preview, setPreview] = useState(""); // preview URL
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { user } = useAuth();

  // Update text fields
  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  // Handle photo upload and preview
  function handlePhotoChange(e) {
    const file = e.target.files[0];
    setPhotoFile(file);

    if (file) {
      const url = URL.createObjectURL(file);
      setPreview(url);
    }
  }

  // Submit form to API
  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    if (!photoFile) {
      setError("Please add a photo.");
      return;
    }

    try {
      const fd = new FormData();
      fd.append("userId", user._id);
      fd.append("photo", photoFile);
      fd.append("restaurantName", form.restaurantName);
      fd.append("restaurantCity", form.restaurantCity);
      fd.append("dishName", form.dishName);
      fd.append("rating", form.rating);
      fd.append("comment", form.comment);

      await createPost(fd);
      navigate(`/profile`);
    } catch (err) {
      setError(err.message || "Failed to upload post");
    }
  }

  return (
    <div className="tt-form-page">
      <h1>Upload a new spot</h1>

      <form className="tt-form" onSubmit={handleSubmit}>
        {/* Photo upload */}
        <div className="tt-field">
          <label>Photo</label>
          <input type="file" accept="image/*" onChange={handlePhotoChange} />

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

        <div className="tt-upload-actions">
          <button type="submit" className="tt-auth-submit">
            Post to Taste Trail
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
