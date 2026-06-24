import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useState } from "react";

export default function Layout({ children }) {
  const { user, logout } = useAuth();
  const [showConfirm, setShowConfirm] = useState(false);
  const navigate = useNavigate();

  // Confirms logout
  function handleLogout() {
    logout();
    setShowConfirm(false);
    navigate("/login");
  }

  return (
    <div className="app">
      <header className="header">
        <div className="logo" onClick={() => navigate("/")}>
          <span className="logo-mark">~tt~</span>
          <span className="logo-text">Taste Trail</span>
        </div>

        {/* Avatar opens profile */}
        {user && (
          <div className="header-right">
            <button
              className="avatar"
              onClick={() => navigate("/profile")}
            >
              {user.firstName?.[0] || "U"}
            </button>

            <button className="logout-button" onClick={logout}>
              Logout
            </button>
          </div>
        )}
      </header>

      <main className="main">{children}</main>
      {/* Logout confirmation dialog */}
      {showConfirm && (
        <div className="dialog-backdrop">
          <div className="dialog">
            <p>Are you sure you want to log out?</p>
            <div className="dialog-actions">
              <button onClick={() => setShowConfirm(false)}>Cancel</button>
              <button className="primary" onClick={handleLogout}>
                Log out
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
