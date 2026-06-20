import { apiRequest } from './client';
import type { Certification } from '../types';

export interface ApiCertification {
  _id: string;
  title: string;
  imageUrl: string;
  issuer: string;
  year: string;
  order: number;
}

function toCert(c: ApiCertification): Certification {
  return { id: c._id, title: c.title, imageUrl: c.imageUrl, issuer: c.issuer, year: c.year };
}

export async function fetchCertifications(): Promise<Certification[]> {
  const data = await apiRequest<ApiCertification[]>('/api/certifications', { skipAuth: true });
  return data.map(toCert);
}

export async function createCertification(cert: Omit<Certification, 'id'>): Promise<Certification> {
  const data = await apiRequest<ApiCertification>('/api/certifications', {
    method: 'POST',
    body: JSON.stringify(cert),
  });
  return toCert(data);
}

export async function deleteCertificationApi(id: string): Promise<void> {
  await apiRequest(`/api/certifications/${id}`, { method: 'DELETE' });
}
