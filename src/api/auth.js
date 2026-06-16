const BASE_URL = import.meta.env.VITE_API_URL;

// Logs in a user
export async function loginUser({ email, password }) {
  const res = await fetch(`${BASE_URL}/api/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  const data = await res.json();

  if (!res.ok) throw new Error(data.error || "Login failed. Email or Password is incorrect.");
  return data;
}

// Creates a new user
export async function signupUser(data) {
  const res = await fetch(`${BASE_URL}/api/signup`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Signup failed");
  return res.json();
}
