const API_BASE = `${(import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api").replace(/\/$/, "")}/v1`;
export const SHORT_URL_BASE = (import.meta.env.VITE_SHORT_URL_BASE || "http://localhost:5000").replace(/\/$/, "");

export async function apiRequest<T>(path: string, init: RequestInit = {}): Promise<T> {
  const headers = new Headers(init.headers);
  if (init.body && !headers.has("Content-Type")) headers.set("Content-Type", "application/json");
  const token = localStorage.getItem("token");
  if (token) headers.set("Authorization", `Bearer ${token}`);

  let response = await fetch(`${API_BASE}${path}`, { ...init, headers, credentials: "include" });
  if (response.status === 401 && !["/auth/login", "/auth/register", "/auth/refresh"].includes(path)) {
    const refreshResponse = await fetch(`${API_BASE}/auth/refresh`, { method: "POST", credentials: "include" });
    const refreshed = await refreshResponse.json().catch(() => null);
    const freshToken = refreshed?.data?.accessToken as string | undefined;
    if (refreshResponse.ok && freshToken) {
      localStorage.setItem("token", freshToken);
      headers.set("Authorization", `Bearer ${freshToken}`);
      response = await fetch(`${API_BASE}${path}`, { ...init, headers, credentials: "include" });
    }
  }
  const payload = response.status === 204 ? null : await response.json().catch(() => null);
  if (!response.ok) throw new Error(payload?.message || `Request failed (${response.status})`);
  return payload as T;
}

export interface ShortUrl {
  _id?: string;
  id?: string;
  originalUrl: string;
  shortCode: string;
  shortUrl?: string;
  clicks: number;
  tags?: string[];
  isFavorite?: boolean;
  isArchived?: boolean;
  expiresAt?: string | null;
  createdAt: string;
}
