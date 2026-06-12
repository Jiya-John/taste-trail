import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createPost } from "../api/posts";
import { useAuth } from "../context/AuthContext";

// Upload new post function
export default function UploadPostPage() {
  const [form, setForm] = useState({
    restaurantName: "",
    restaurantStreetName: "",
    restaurantCity: "",
    restaurantProvince: "",
    restaurantCountry: "",
    restaurantPostalCode: "",
    dishName: "",
    rating: "",
    comment: "",
  });

  const [photoFile, setPhotoFile] = useState(null); // upload file
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
      setError("Please upload a photo.");
      return;
    }

    try {
      const fd = new FormData();

      // Photo
      fd.append("photo", photoFile);

      // Text fields
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

      await createPost(fd);
      navigate("/");
    } catch (err) {
      setError(err.message || "Failed to upload post");
    }
  }

  return (
    <div className="form-page">
      <h1>Upload a New Spot</h1>

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

        {/* Text Fields */}
        <div className="form-field">
          <label>Restaurant Name</label>
          <input
            name="restaurantName"
            value={form.restaurantName}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-field">
          <label>Street Name</label>
          <input
            name="restaurantStreetName"
            value={form.restaurantStreetName}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-field">
          <label>City</label>
          <input
            name="restaurantCity"
            value={form.restaurantCity}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-field">
          <label>Province</label>
          <input
            name="restaurantProvince"
            value={form.restaurantProvince}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-field">
          <label>Country</label>
          <input
            name="restaurantCountry"
            value={form.restaurantCountry}
            onChange={handleChange}
            required
          />
        </div>

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
          <label>Dish Name</label>
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

        <button type="submit" className="submit-button">
          Upload Post
        </button>
      </form>
    </div>
  );
}
