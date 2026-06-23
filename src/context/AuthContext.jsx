import { createContext, useContext, useState, useEffect } from "react";
import { loginUser, signupUser } from "../api/auth";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Load user
  useEffect(() => {
    const stored = localStorage.getItem("user");
    if (stored) {
      const parsed = JSON.parse(stored);
      setUser({ ...parsed, favorites: parsed.favorites || [] });
    }
    setLoading(false);
  }, []);

  // Saves user to state and localStorage
  function handleLoginSuccess(userData) {
    const safeUser = { ...userData, favorites: userData.favorites || [] };
    setUser(safeUser);
    localStorage.setItem("user", JSON.stringify(safeUser));
  }

  // Clears login state
  function logout() {
    setUser(null);
    localStorage.removeItem("user");
  }

  const value = {
    user,
    setUser,
    loading,
    login: (creds) => loginUser(creds).then(handleLoginSuccess),
    signup: (data) => signupUser(data).then(handleLoginSuccess),
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// To access auth state
export function useAuth() {
  return useContext(AuthContext);
}
