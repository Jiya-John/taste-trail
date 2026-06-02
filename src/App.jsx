import { Routes, Route, Navigate } from "react-router-dom";
import Layout from "./components/Layout";

import HomePage from "./pages/HomePage";
import PostDetailPage from "./pages/PostDetailPage";
import UploadPostPage from "./pages/UploadPostPage";
import EditPostPage from "./pages/EditPostPage";
//import ProfilePage from "./pages/ProfilePage";

function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/posts/:id" element={<PostDetailPage />} />
        <Route path="/upload" element={<UploadPostPage />} /> 
        <Route path="/posts/:id/edit" element={<EditPostPage />} />
        {/* <Route path="/profile" element={<ProfilePage />} /> */}
      </Routes>
    </Layout>
    
  );
}

export default App
