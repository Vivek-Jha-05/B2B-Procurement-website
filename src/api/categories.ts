import { apiRequest } from './client';
import type { Category } from '../types';

export interface ApiCategory {
  _id: string;
  name: string;
  description: string;
  imageUrl: string;
  order: number;
  createdAt: string;
}

function toCategory(c: ApiCategory): Category {
  return {
    id: c._id,
    name: c.name,
    description: c.description,
    imageUrl: c.imageUrl,
    order: c.order,
  };
}

export async function fetchCategories(): Promise<Category[]> {
  const data = await apiRequest<ApiCategory[]>('/api/categories', { skipAuth: true });
  return data.map(toCategory);
}

export async function createCategory(category: Omit<Category, 'id'>): Promise<Category> {
  const data = await apiRequest<ApiCategory>('/api/categories', {
    method: 'POST',
    body: JSON.stringify(category),
  });
  return toCategory(data);
}

export async function updateCategory(id: string, category: Partial<Omit<Category, 'id'>>): Promise<Category> {
  const data = await apiRequest<ApiCategory>(`/api/categories/${id}`, {
    method: 'PUT',
    body: JSON.stringify(category),
  });
  return toCategory(data);
}

export async function deleteCategory(id: string): Promise<void> {
  await apiRequest(`/api/categories/${id}`, { method: 'DELETE' });
}

export async function uploadCategoryImage(id: string, file: File): Promise<Category> {
  const formData = new FormData();
  formData.append('image', file);
  const { API_BASE, getValidToken } = await import('./client');
  const token = await getValidToken();
  const res = await fetch(`${API_BASE}/api/categories/${id}/image`, {
    method: 'POST',
    credentials: 'include',
    headers: token ? { Authorization: `Bearer ${token}` } : undefined,
    body: formData,
  });
  if (!res.ok) {
    const error = await res.json().catch(() => ({ error: 'Image upload failed' }));
    throw new Error(error.error || `HTTP ${res.status}`);
  }
  const data: ApiCategory = await res.json();
  return toCategory(data);
}
