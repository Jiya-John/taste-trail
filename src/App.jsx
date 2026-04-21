import './App.css'
// Defines all routes and wraps the app in AuthProvider for login state.
import { Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import Layout from "./components/Layout";
// Import pages
import LoginPage from "./pages/LoginPage";
import HomePage from "./pages/HomePage";
import UploadPostPage from "./pages/UploadPostPage";
import EditPostPage from "./pages/EditPostPage";
import PostDetailPage from "./pages/PostDetailPage";
import ProfilePage from "./pages/ProfilePage";

// Protects routes so only logged-in users can access them
function PrivateRoute({ children }) {
  const { user } = useAuth();
  return user ? children : <Navigate to="/login" replace />;
}


function App() {
  return (
    // Provides login state to the entire app
    <AuthProvider>
      <Layout>
        <Routes>
          {/* Public route */}
          <Route path="/login" element={<LoginPage />} />

          {/* Protected routes */}
          <Route
            path="/"
            element={
              <PrivateRoute>
                <HomePage />
              </PrivateRoute>
            }
          />

          <Route
            path="/upload"
            element={
              <PrivateRoute>
                <UploadPostPage />
              </PrivateRoute>
            }
          />

          <Route
            path="/posts/:id"
            element={
              <PrivateRoute>
                <PostDetailPage />
              </PrivateRoute>
            }
          />

          <Route
            path="/posts/:id/edit"
            element={
              <PrivateRoute>
                <EditPostPage />
              </PrivateRoute>
            }
          />

          <Route
            path="/profile"
            element={
              <PrivateRoute>
                <ProfilePage />
              </PrivateRoute>
            }
          />
        </Routes>
      </Layout>
    </AuthProvider>
  );
}

export default App
