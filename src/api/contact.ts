import { apiRequest } from './client';

export interface ContactPayload {
  name: string;
  company: string;
  email: string;
  phone: string;
  message: string;
  honeypot?: string;
}

export interface QuotePayload extends ContactPayload {
  productName?: string;
  productCategory?: string;
}

export async function submitContactForm(
  data: ContactPayload
): Promise<{ success: boolean; message: string }> {
  return apiRequest('/api/contact', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export async function submitQuoteRequest(
  data: QuotePayload
): Promise<{ success: boolean; message: string }> {
  return apiRequest('/api/contact', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}
