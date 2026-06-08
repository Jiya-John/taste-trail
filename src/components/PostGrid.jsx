import PostCard from "./PostCard";

function PostGrid({ posts, onPostClick }) {
  return (
    <div className="grid">
      {posts.map((post) => (
        <PostCard
          key={post._id}
          post={post}
          onClick={() => onPostClick(post._id)}
        />
      ))}
    </div>
  );
}
export default PostGrid