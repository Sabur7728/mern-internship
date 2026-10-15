const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

export async function apiRequest(path, options = {}) {
  const token = localStorage.getItem("token");

  let response;
  try {
    response = await fetch(`${BASE_URL}${path}`, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...(token && { Authorization: `Bearer ${token}` }),
        ...options.headers,
      },
    });
  } catch {
    // network failure / backend unavailable
    throw Object.assign(new Error("Cannot reach the server. Please try again."), { status: 0 });
  }

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    const messages = {
      401: "Please log in again.",
      403: "You do not have permission to do this.",
      404: "The resource no longer exists.",
    };
    throw Object.assign(
      new Error(data.message || messages[response.status] || "Something went wrong"),
      { status: response.status, fieldErrors: data.errors }
    );
  }
  return data;
}