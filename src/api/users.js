// Contains API calls related to user accounts and profiles.

const BASE_URL = import.meta.env.VITE_API_URL;

// Fetch a single user by ID
export async function fetchUserById(id) {
  const res = await fetch(`${BASE_URL}/api/users/${id}`);
  if (!res.ok) throw new Error("Failed to load user");
  return res.json();
}

// Update user profile fields
export async function updateUser(id, data) {
  const res = await fetch(`${BASE_URL}/api/users/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Failed to update profile");
  return res.json();
}
