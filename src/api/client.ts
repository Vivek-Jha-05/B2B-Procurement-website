const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001';

let accessToken: string | null = null;
let tokenExpiry: number | null = null;

export function setToken(token: string, expiresIn: number) {
  accessToken = token;
  tokenExpiry = Date.now() + expiresIn * 1000 - 30000; // 30s buffer
}

export function clearToken() {
  accessToken = null;
  tokenExpiry = null;
}

async function refreshAccessToken(): Promise<string | null> {
  try {
    const res = await fetch(`${API_BASE}/api/auth/refresh`, {
      method: 'POST',
      credentials: 'include',
    });
    if (!res.ok) return null;
    const data = await res.json();
    setToken(data.token, data.expiresIn);
    return data.token;
  } catch {
    return null;
  }
}

export async function getValidToken(): Promise<string | null> {
  // If we don't have a token, or it's expired, try to refresh it
  if (!accessToken || (tokenExpiry && Date.now() > tokenExpiry)) {
    return await refreshAccessToken();
  }
  return accessToken;
}

export async function apiRequest<T>(
  path: string,
  options: RequestInit = {}
): Promise<T> {
  const token = await getValidToken();
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  };

  const res = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers,
    credentials: 'include',
  });

  if (!res.ok) {
    const error = await res.json().catch(() => ({ message: 'Request failed' }));
    throw new Error(error.message || `HTTP ${res.status}`);
  }

  if (res.status === 204) return undefined as T;
  return res.json();
}

export { API_BASE };
