import { Routes, Route, Navigate } from "react-router-dom";
import Layout from "./components/Layout";

import HomePage from "./pages/HomePage";
//import ProfilePage from "./pages/ProfilePage";
//import UploadPostPage from "./pages/UploadPostPage";
//import EditPostPage from "./pages/EditPostPage";
//import PostDetailPage from "./pages/PostDetailPage";

function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<HomePage />} />
        {/* <Route path="/profile" element={<ProfilePage />} /> */}
        {/* <Route path="/upload" element={<UploadPostPage />} /> */}
        {/* <Route path="/posts/:id/edit" element={<EditPostPage />} /> */}
        {/* <Route path="/posts/:id" element={<PostDetailPage />} /> */}
      </Routes>
    </Layout>
    
  );
}

export default App
