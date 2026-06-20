import { apiRequest } from './client';
import type { Client } from '../types';

export interface ApiClient {
  _id: string;
  name: string;
  logoUrl: string;
  cloudinaryPublicId?: string;
  order: number;
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
}

function toClient(c: ApiClient): Client {
  return {
    id: c._id,
    name: c.name,
    logoUrl: c.logoUrl,
    cloudinaryPublicId: c.cloudinaryPublicId,
    order: c.order,
    isActive: c.isActive,
    createdAt: c.createdAt,
    updatedAt: c.updatedAt,
  };
}

// Fetch active clients (public)
export async function fetchClients(): Promise<Client[]> {
  const data = await apiRequest<ApiClient[]>('/api/clients', { skipAuth: true });
  return data.map(toClient);
}

// Fetch all clients (admin)
export async function fetchClientsAll(): Promise<Client[]> {
  const data = await apiRequest<ApiClient[]>('/api/clients/all');
  return data.map(toClient);
}

// Create a new client
export async function createClient(client: Omit<Client, 'id'>): Promise<Client> {
  const data = await apiRequest<ApiClient>('/api/clients', {
    method: 'POST',
    body: JSON.stringify(client),
  });
  return toClient(data);
}

// Update a client
export async function updateClient(id: string, client: Partial<Omit<Client, 'id'>>): Promise<Client> {
  const data = await apiRequest<ApiClient>(`/api/clients/${id}`, {
    method: 'PUT',
    body: JSON.stringify(client),
  });
  return toClient(data);
}

// Delete a client
export async function deleteClient(id: string): Promise<void> {
  await apiRequest(`/api/clients/${id}`, { method: 'DELETE' });
}

// Upload client logo image
export async function uploadClientLogo(id: string, file: File): Promise<Client> {
  const formData = new FormData();
  formData.append('image', file);
  const { API_BASE, getValidToken } = await import('./client');
  const token = await getValidToken();
  const res = await fetch(`${API_BASE}/api/clients/${id}/logo`, {
    method: 'POST',
    credentials: 'include',
    headers: token ? { Authorization: `Bearer ${token}` } : undefined,
    body: formData,
  });
  if (!res.ok) {
    const error = await res.json().catch(() => ({ error: 'Logo upload failed' }));
    throw new Error(error.error || `HTTP ${res.status}`);
  }
  const data: ApiClient = await res.json();
  return toClient(data);
}
