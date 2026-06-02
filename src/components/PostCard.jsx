export default function PostCard({ post, onClick }) {
  return (
    <article className="post-card" onClick={onClick}>
      {/* Photo */}
      <div className="post-image-wrapper">
        <img
          src={post.photoUrl || "/placeholder.jpg"}
          alt={post.restaurantName}
          className="post-image"
        />
      </div>

      {/* Text info */}
      <div className="post-data">
        <h3>{post.restaurantName}</h3>
        <p>{post.restaurantCity}</p>
      </div>
    </article>
  );
}
