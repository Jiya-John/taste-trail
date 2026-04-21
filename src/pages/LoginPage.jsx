// Login and signup

import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function LoginPage() {
  const [mode, setMode] = useState("login"); // toggles login or signup
  const [form, setForm] = useState({
    fullName: "",
    username: "",
    email: "",
    password: "",
    city: "",
  });
  const [error, setError] = useState("");
  const { login, signup } = useAuth();
  const navigate = useNavigate();

  // Updates form fields
  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  // Handles login or signup
  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    try {
      if (mode === "login") {
        await login({ email: form.email, password: form.password });
      } else {
        await signup(form);
      }
      navigate("/");
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <div className="tt-auth-wrapper">
      <div className="tt-auth-card">
        <h1 className="tt-auth-title">Taste Trail</h1>
        <p className="tt-auth-subtitle">
          Discover and share the places that taste like you.
        </p>

        {/* Toggle buttons */}
        <div className="tt-auth-toggle">
          <button
            className={mode === "login" ? "active" : ""}
            onClick={() => setMode("login")}
          >
            Log in
          </button>
          <button
            className={mode === "signup" ? "active" : ""}
            onClick={() => setMode("signup")}
          >
            Sign up
          </button>
        </div>

        {/* Form */}
        <form className="tt-auth-form" onSubmit={handleSubmit}>
          {/* Extra fields only for signup */}
          {mode === "signup" && (
            <>
              <div className="tt-field">
                <label>Full name</label>
                <input name="fullName" value={form.fullName} onChange={handleChange} required />
              </div>

              <div className="tt-field">
                <label>Username</label>
                <input name="username" value={form.username} onChange={handleChange} required />
              </div>

              <div className="tt-field">
                <label>City</label>
                <input name="city" value={form.city} onChange={handleChange} required />
              </div>
            </>
          )}

          {/* Shared fields */}
          <div className="tt-field">
            <label>Email</label>
            <input type="email" name="email" value={form.email} onChange={handleChange} required />
          </div>

          <div className="tt-field">
            <label>Password</label>
            <input type="password" name="password" value={form.password} onChange={handleChange} required />
          </div>

          {error && <p className="tt-error">{error}</p>}

          <button type="submit" className="tt-auth-submit">
            {mode === "login" ? "Log in" : "Create account"}
          </button>
        </form>
      </div>
    </div>
  );
}
