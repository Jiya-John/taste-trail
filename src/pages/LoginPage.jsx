import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function LoginPage() {
    const [mode, setMode] = useState("login"); // toggles login or signup
    const [form, setForm] = useState({
        firstName: "",
        lastName: "",
        username: "",
        email: "",
        city: "",
        password: ""
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
      <div className="auth-wrapper">
        <div className="auth-card">
            <h1 className="auth-title">Taste Trail</h1>
            <p className="auth-subtitle">
                Discover and share the places that taste like you.
            </p>

            {/* Toggle buttons */}
            <div className="auth-toggle">
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
            <form className="auth-form" onSubmit={handleSubmit}>
                {/* Extra fields only for signup */}
                {mode === "signup" && (
                    <>
                    <div className="form-field">
                        <label>First name</label>
                        <input name="firstName" value={form.firstName} onChange={handleChange} required />
                    </div>

                    <div className="form-field">
                        <label>Last name</label>
                        <input name="lastName" value={form.lastName} onChange={handleChange} required />
                    </div>

                    <div className="form-field">
                        <label>Username</label>
                        <input name="username" value={form.username} onChange={handleChange} required />
                    </div>

                    <div className="form-field">
                        <label>City</label>
                        <input name="city" value={form.city} onChange={handleChange} required />
                    </div>

                    </>
                )}

                {/* Shared fields */}
                <div className="form-field">
                    <label>Email</label>
                    <input type="email" name="email" value={form.email} onChange={handleChange} required />
                </div>

                <div className="form-field">
                    <label>Password</label>
                    <input type="password" name="password" value={form.password} onChange={handleChange} required />
                </div>

                {error && <p className="error">{error}</p>}

                <button type="submit" className="auth-submit">
                    {mode === "login" ? "Log in" : "Create account"}
                </button>
            </form>
        </div>
      </div>
    );
}