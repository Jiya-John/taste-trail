import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { fetchPostById, updatePost } from "../api/posts";
import { useAuth } from "../context/AuthContext";

export default function EditPostPage() {
  const { id } = useParams();
  const [form, setForm] = useState(null);
  const [photoFile, setPhotoFile] = useState(null);
  const [preview, setPreview] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();
  const { user } = useAuth();

  // Load post data
  useEffect(() => {
    async function load() {
      try {
        const data = await fetchPostById(id);
        const BASE_URL = import.meta.env.VITE_API_URL;

        // Pre-fill form with existing values
        setForm({
          restaurantName: data.restaurantName || "",
          restaurantStreetName: data.restaurantStreetName || "",
          restaurantCity: data.restaurantCity || "",
          restaurantProvince: data.restaurantProvince || "",
          restaurantCountry: data.restaurantCountry || "",
          restaurantPostalCode: data.restaurantPostalCode || "",
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

  // update text field
  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  // update new photo
  function handlePhotoChange(e) {
    const file = e.target.files[0];
    setPhotoFile(file);

    if (file) {
      const url = URL.createObjectURL(file);
      setPreview(url);
    }
  }

  // Submit edited post
  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setSuccess("");

    try {
      const fd = new FormData();
      // Required fields
      fd.append("userId", user._id);
      fd.append("restaurantName", form.restaurantName);
      fd.append("restaurantStreetName", form.restaurantStreetName);
      fd.append("restaurantCity", form.restaurantCity);
      fd.append("restaurantProvince", form.restaurantProvince);
      fd.append("restaurantCountry", form.restaurantCountry);
      fd.append("restaurantPostalCode", form.restaurantPostalCode);
      fd.append("dishName", form.dishName);
      fd.append("rating", form.rating);
      fd.append("comment", form.comment);

      // if new photo
      if (photoFile) {
        fd.append("photo", photoFile);
      }

      await updatePost(id, fd);

      setSuccess("Post updated successfully");
      setTimeout(() => {navigate(`/posts/${id}`);}, 1500);

    } catch (err) {
      setError(err.message || "Failed to update post");
    }
  }

  return (
    <div className="form-page">
      <h1>Edit post</h1>

      <form className="form" onSubmit={handleSubmit}>

        {/* Photo */}
        <div className="form-field">
          <label>Photo</label>
          <input type="file" accept="image/*" onChange={handlePhotoChange} />

          {preview && (
            <div className="photo-preview">
              <img src={preview} alt="Preview" />
            </div>
          )}
        </div>

        {/* Restaurant Name */}
        <div className="form-field">
          <label>Restaurant name</label>
          <input
            name="restaurantName"
            value={form.restaurantName}
            onChange={handleChange}
            required
          />
        </div>

        {/* Street Name */}
        <div className="form-field">
          <label>Street name</label>
          <input
            name="restaurantStreetName"
            value={form.restaurantStreetName}
            onChange={handleChange}
            required
          />
        </div>

        {/* City */}
        <div className="form-field">
          <label>City</label>
          <input
            name="restaurantCity"
            value={form.restaurantCity}
            onChange={handleChange}
            required
          />
        </div>

        {/* Province */}
        <div className="form-field">
          <label>Province</label>
          <input
            name="restaurantProvince"
            value={form.restaurantProvince}
            onChange={handleChange}
            required
          />
        </div>

        {/* Country */}
        <div className="form-field">
          <label>Country</label>
          <input
            name="restaurantCountry"
            value={form.restaurantCountry}
            onChange={handleChange}
            required
          />
        </div>

        {/* Postal Code */}
        <div className="form-field">
          <label>Postal Code</label>
          <input
            name="restaurantPostalCode"
            value={form.restaurantPostalCode}
            onChange={handleChange}
            required
          />
        </div>

        {/* Dish */}
        <div className="form-field">
          <label>Dish name</label>
          <input
            name="dishName"
            value={form.dishName}
            onChange={handleChange}
          />
        </div>

        {/* Rating */}
        <div className="form-field">
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

        {/* Comment */}
        <div className="form-field">
          <label>Comment</label>
          <textarea
            name="comment"
            rows="3"
            value={form.comment}
            onChange={handleChange}
          />
        </div>

        {error && <p className="error">{error}</p>}
        {success && <p className="success">{success}</p>}

        <div className="edit-actions">
          <button type="submit" className="submit-button">
            Save changes
          </button>
        </div>
      </form>
    </div>
  );
}
