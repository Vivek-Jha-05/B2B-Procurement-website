import { apiRequest, setToken, clearToken, API_BASE } from './client';

export interface LoginResponse {
  token: string;
  expiresIn: number;
  user: { email: string; role: string };
}

export async function loginApi(email: string, password: string): Promise<LoginResponse> {
  const res = await fetch(`${API_BASE}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify({ email, password }),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ message: 'Login failed' }));
    throw new Error(err.message || 'Invalid credentials');
  }
  const data: LoginResponse = await res.json();
  setToken(data.token, data.expiresIn);
  return data;
}

export async function logoutApi(): Promise<void> {
  await apiRequest('/api/auth/logout', { method: 'POST' }).catch(() => {});
  clearToken();
}
