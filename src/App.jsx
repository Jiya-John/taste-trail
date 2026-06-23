import { Routes, Route, Navigate } from "react-router-dom";
import Layout from "./components/Layout";
import { AuthProvider, useAuth } from "./context/AuthContext";

import LoginPage from "./pages/LoginPage";
import HomePage from "./pages/HomePage";
import PostDetailPage from "./pages/PostDetailPage";
import UploadPostPage from "./pages/UploadPostPage";
import EditPostPage from "./pages/EditPostPage";
import ProfilePage from "./pages/ProfilePage";
import FavoritesPage from "./pages/FavoritesPage";

// Protects routes so only logged-in users can access them
function PrivateRoute({ children }) {
  const { user, loading } = useAuth();
  // if user already logged in, then loading message
  if (loading) {
    return <p>Loading...</p>; 
  }
  //if user haven't logged in, then login page
  return user ? children : <Navigate to="/login" replace />;
}

function App() {
  return (
    // Provides login state to the entire app
    <AuthProvider>
      <Layout>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/" element={<PrivateRoute><HomePage /></PrivateRoute>} />
          <Route path="/posts/:id" element={<PrivateRoute><PostDetailPage /></PrivateRoute>} />
          <Route path="/upload" element={<PrivateRoute><UploadPostPage /></PrivateRoute>} /> 
          <Route path="/posts/:id/edit" element={<PrivateRoute><EditPostPage /></PrivateRoute>} />
          <Route path="/profile" element={<PrivateRoute><ProfilePage /></PrivateRoute>} />
          <Route path="/favorites" element={<PrivateRoute><FavoritesPage /></PrivateRoute>} />
        </Routes>
      </Layout>
    </AuthProvider>
  );
}

export default App
