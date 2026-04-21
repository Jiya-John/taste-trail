// Contains all API calls related to posts
// These functions communicate with Express backend

const BASE_URL = import.meta.env.VITE_API_URL;

// Fetch posts with pagination and search query
export async function fetchPosts({ skip = 0, limit = 10, q = "" } = {}) {
  const params = new URLSearchParams();
  params.set("skip", skip);
  params.set("limit", limit);
  if (q) params.set("q", q); // search by restaurant/city/dish

  const res = await fetch(`${BASE_URL}/api/posts?${params.toString()}`);
  if (!res.ok) throw new Error("Failed to load posts");
  return res.json();
}

// Fetch a single post by ID
export async function fetchPostById(id) {
  const res = await fetch(`${BASE_URL}/api/posts/${id}`);
  if (!res.ok) throw new Error("Failed to load post");
  return res.json();
}

// Create a new post 
export async function createPost(formData) {
  const res = await fetch(`${BASE_URL}/api/posts`, {
    method: "POST",
    body: formData, // includes photo and fields
  });
  if (!res.ok) throw new Error("Failed to create post");
  return res.json();
}

// Update an existing post
export async function updatePost(id, formData) {
  const res = await fetch(`${BASE_URL}/api/posts/${id}`, {
    method: "PUT",
    body: formData,
  });
  if (!res.ok) throw new Error("Failed to update post");
  return res.json();
}

// Delete the post
export async function deletePost(id) {
  const BASE_URL = import.meta.env.VITE_API_URL;

  const res = await fetch(`${BASE_URL}/api/posts/${id}`, {
    method: "DELETE",
  });

  if (!res.ok) throw new Error("Failed to delete post");
  return res.json();
}
