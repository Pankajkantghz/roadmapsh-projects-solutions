const API_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api/v1";

export async function api(path, options = {}) {
  const token = localStorage.getItem("aarohan.accessToken");
  const headers = new Headers(options.headers || {});
  if (options.body && !(options.body instanceof FormData)) {
    headers.set("Content-Type", "application/json");
  }
  if (token) headers.set("Authorization", `Bearer ${token}`);

  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    headers,
    credentials: "include",
  });
  const payload = await response.json().catch(() => ({}));

  if (response.status === 401 && token && !options.noRefresh) {
    const refresh = await fetch(`${API_URL}/auth/refresh-token`, {
      method: "POST",
      credentials: "include",
    });
    const refreshed = await refresh.json().catch(() => ({}));
    if (refresh.ok && refreshed.data?.accessToken) {
      localStorage.setItem("aarohan.accessToken", refreshed.data.accessToken);
      return api(path, { ...options, noRefresh: true });
    }
    localStorage.removeItem("aarohan.accessToken");
    localStorage.removeItem("aarohan.user");
  }

  if (!response.ok) {
    const detail =
      payload.errors?.join(" ") || payload.message || "Something went wrong.";
    throw new Error(detail);
  }
  return payload;
}

export const imageUrl = (url) => url || "";
