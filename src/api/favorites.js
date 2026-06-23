const BASE_URL = import.meta.env.VITE_API_URL;

// Toggle favorite - add or remove button
export async function toggleFavorite(userId, postId) {
  const res = await fetch(`${BASE_URL}/api/favorites/toggle`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ userId, postId }),
  });
  return res.json(); // { favorited: true/false }
}

// Fetch all favorites for a user
export async function fetchFavorites(userId) {
  const res = await fetch(`${BASE_URL}/api/users/${userId}/favorites`);
  if (!res.ok) throw new Error("Failed to load favorites");
  return res.json(); // array of { userId, postId }
}

// Check if saved to favorites
export async function isPostFavorited(userId, postId) {
  const res = await fetch(`${BASE_URL}/api/users/${userId}/favorites`);
  if (!res.ok) throw new Error("Failed to load favorites");
  const favs = await res.json();
  return favs.some(f => f.postId === postId);
}
