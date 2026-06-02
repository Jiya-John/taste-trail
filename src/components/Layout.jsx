import { useNavigate } from "react-router-dom";

export default function Layout({ children }) {
  const navigate = useNavigate();

  return (
    <div className="app">
      <header className="header">
        <div className="logo" onClick={() => navigate("/")}>
          Taste Trail
        </div>
        <div>
          <button className="upload-button" onClick={() => navigate("/upload")}>
            Upload Post
          </button>
        </div>
      </header>

      <main className="main">
        {children}
      </main>
    </div>
  );
}
