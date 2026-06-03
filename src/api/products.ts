import { apiRequest } from './client';
import type { Product } from '../types';

export interface ApiProduct {
  _id: string;
  name: string;
  category: string;
  description: string;
  imageUrl: string;
  createdAt: string;
}

function toProduct(p: ApiProduct): Product {
  return {
    id: p._id,
    name: p.name,
    category: p.category,
    description: p.description,
    imageUrl: p.imageUrl,
    createdAt: new Date(p.createdAt).toISOString().split('T')[0],
  };
}

export async function fetchProducts(): Promise<Product[]> {
  const data = await apiRequest<ApiProduct[]>('/api/products');
  return data.map(toProduct);
}

export async function createProduct(product: Omit<Product, 'id' | 'createdAt'>): Promise<Product> {
  const data = await apiRequest<ApiProduct>('/api/products', {
    method: 'POST',
    body: JSON.stringify(product),
  });
  return toProduct(data);
}

export async function updateProduct(id: string, product: Partial<Omit<Product, 'id' | 'createdAt'>>): Promise<Product> {
  const data = await apiRequest<ApiProduct>(`/api/products/${id}`, {
    method: 'PUT',
    body: JSON.stringify(product),
  });
  return toProduct(data);
}

export async function deleteProduct(id: string): Promise<void> {
  await apiRequest(`/api/products/${id}`, { method: 'DELETE' });
}

export async function uploadProductImage(id: string, file: File): Promise<Product> {
  const formData = new FormData();
  formData.append('image', file);
  const { API_BASE, getValidToken } = await import('./client');
  const token = await getValidToken();
  const res = await fetch(`${API_BASE}/api/products/${id}/image`, {
    method: 'POST',
    credentials: 'include',
    headers: token ? { Authorization: `Bearer ${token}` } : undefined,
    body: formData,
  });
  if (!res.ok) {
    const error = await res.json().catch(() => ({ error: 'Image upload failed' }));
    throw new Error(error.error || `HTTP ${res.status}`);
  }
  const data: ApiProduct = await res.json();
  return {
    id: data._id,
    name: data.name,
    category: data.category,
    description: data.description,
    imageUrl: data.imageUrl,
    createdAt: data.createdAt,
  };
}
