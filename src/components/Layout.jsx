// Shared layout

import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
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
    <div className="tt-app">
      <header className="tt-header">
        <div className="tt-logo" onClick={() => navigate("/")}>
          Taste Trail
        </div>

        {/* Avatar opens profile */}
        {user && (
          <div className="tt-header-right">
            <button
              className="tt-avatar"
              onClick={() => navigate("/profile")}
            >
              {user.fullName?.[0] || "U"}
            </button>

            <button className="tt-logout-btn" onClick={logout}>
              Logout
            </button>
          </div>
        )}

      </header>

      {/* Page content */}
      <main className="tt-main">{children}</main>

      {/* Logout confirmation dialog */}
      {showConfirm && (
        <div className="tt-dialog-backdrop">
          <div className="tt-dialog">
            <p>Are you sure you want to log out?</p>
            <div className="tt-dialog-actions">
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
