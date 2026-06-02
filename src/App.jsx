import { Routes, Route, Navigate } from "react-router-dom";
import Layout from "./components/Layout";

import HomePage from "./pages/HomePage";
import PostDetailPage from "./pages/PostDetailPage";
//import ProfilePage from "./pages/ProfilePage";
//import UploadPostPage from "./pages/UploadPostPage";
//import EditPostPage from "./pages/EditPostPage";


function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/posts/:id" element={<PostDetailPage />} />
        {/* <Route path="/profile" element={<ProfilePage />} /> */}
        {/* <Route path="/upload" element={<UploadPostPage />} /> */}
        {/* <Route path="/posts/:id/edit" element={<EditPostPage />} /> */}
      </Routes>
    </Layout>
    
  );
}

export default App
