export interface Product {
  id: string;
  name: string;
  category: string;
  description: string;
  imageUrl: string;
  createdAt: string;
}

export interface Certification {
  id: string;
  title: string;
  imageUrl: string;
  issuer?: string;
  year?: string;
}

export interface Category {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  order: number;
}

export interface ContactLead {
  id: string;
  name: string;
  company: string;
  email: string;
  phone: string;
  message: string;
  status: 'new' | 'contacted' | 'closed';
  createdAt: string;
}

export interface AdminUser {
  email: string;
  role: string;
  token: string;
}

export interface ContactFormData {
  name: string;
  company: string;
  email: string;
  phone: string;
  message: string;
  honeypot?: string;
}

export interface Client {
  id: string;
  name: string;
  logoUrl: string;
  cloudinaryPublicId?: string;
  order: number;
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
}
