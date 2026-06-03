import { apiRequest } from './client';
import type { ContactLead } from '../types';

export interface ApiLead {
  _id: string;
  name: string;
  company: string;
  email: string;
  phone: string;
  message: string;
  status: 'new' | 'contacted' | 'closed';
  createdAt: string;
}

export interface LeadsPaginatedResponse {
  data: ApiLead[];
  pagination: { page: number; limit: number; total: number; totalPages: number };
}

function toLead(l: ApiLead): ContactLead {
  return {
    id: l._id,
    name: l.name,
    company: l.company,
    email: l.email,
    phone: l.phone,
    message: l.message,
    status: l.status,
    createdAt: l.createdAt,
  };
}

export async function fetchLeads(
  params: { page?: number; limit?: number; status?: string } = {}
): Promise<{ leads: ContactLead[]; pagination: LeadsPaginatedResponse['pagination'] }> {
  const query = new URLSearchParams();
  if (params.page) query.set('page', String(params.page));
  if (params.limit) query.set('limit', String(params.limit));
  if (params.status && params.status !== 'all') query.set('status', params.status);
  const data = await apiRequest<LeadsPaginatedResponse>(`/api/leads?${query}`);
  return { leads: data.data.map(toLead), pagination: data.pagination };
}

export async function updateLeadStatusApi(id: string, status: ContactLead['status']): Promise<ContactLead> {
  const data = await apiRequest<ApiLead>(`/api/leads/${id}/status`, {
    method: 'PATCH',
    body: JSON.stringify({ status }),
  });
  return toLead(data);
}

export async function deleteLeadApi(id: string): Promise<void> {
  await apiRequest(`/api/leads/${id}`, { method: 'DELETE' });
}
