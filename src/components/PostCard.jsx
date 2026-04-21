// Card component for displaying a single post in the feed.
// Shows the photo, restaurant name, and city.

export default function PostCard({ post, onClick }) {
  return (
    <article className="tt-post-card" onClick={onClick}>
      {/* Photo */}
      <div className="tt-post-image-wrapper">
        <img
          src={post.photoUrl || "/placeholder.jpg"}
          alt={post.restaurantName}
          className="tt-post-image"
        />
      </div>

      {/* Text info */}
      <div className="tt-post-meta">
        <h3>{post.restaurantName}</h3>
        <p>{post.restaurantCity}</p>
      </div>
    </article>
  );
}
