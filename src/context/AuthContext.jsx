// Manages authentication state

import { createContext, useContext, useState, useEffect } from "react";
import { loginUser, signupUser } from "../api/auth";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  // Load user from localStorage on refresh
  useEffect(() => {
    const stored = localStorage.getItem("tt_user");
    if (stored) setUser(JSON.parse(stored));
  }, []);

  // Saves user to state + localStorage
  function handleLoginSuccess(userData) {
    setUser(userData);
    localStorage.setItem("tt_user", JSON.stringify(userData));
  }

  // Clears login state
  function logout() {
    setUser(null);
    localStorage.removeItem("tt_user");
  }

  const value = {
    user,
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
