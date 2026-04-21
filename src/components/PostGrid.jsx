import PostCard from "./PostCard";

function PostGrid({ posts, onPostClick }) {
  return (
    <div className="tt-grid">
      {posts.map((post) => (
        <PostCard
          key={post._id}
          post={post}
          onClick={() => onPostClick(post._id)}
        />
      ))}

      {posts.length === 0 && (
        <p style={{ fontSize: "0.9rem" }}>No posts found.</p>
      )}
    </div>
  );
}
export default PostGrid