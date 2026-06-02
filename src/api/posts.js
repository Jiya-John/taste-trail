const BASE_URL = import.meta.env.API_URL;

// Fetch posts with pagination
export async function fetchPosts({ skip = 0, limit = 10 } = {}) {
  const params = new URLSearchParams();
  params.set("skip", skip);
  params.set("limit", limit);

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
    body: formData,
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
  const res = await fetch(`${BASE_URL}/api/posts/${id}`, {
    method: "DELETE",
  });

  if (!res.ok) throw new Error("Failed to delete post");
  return res.json();
}
