import React, { createContext, useContext, useState, useCallback, useMemo, useEffect } from 'react';
import type { AdminUser, Product, Certification } from '../types';
import { loginApi, logoutApi } from '../api/auth';
import {
  fetchProducts,
  createProduct as createProductApi,
  updateProduct as updateProductApi,
  deleteProduct as deleteProductApi,
} from '../api/products';
import {
  fetchCertifications,
  createCertification as createCertApi,
  deleteCertificationApi,
} from '../api/certifications';

interface AdminContextType {
  admin: AdminUser | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  products: Product[];
  certifications: Certification[];
  loadingProducts: boolean;
  addProduct: (product: Omit<Product, 'id' | 'createdAt'>) => Promise<Product>;
  updateProduct: (id: string, data: Partial<Product>) => Promise<Product>;
  deleteProduct: (id: string) => Promise<void>;
  refreshProducts: () => Promise<void>;
  addCertification: (cert: Omit<Certification, 'id'>) => Promise<void>;
  deleteCertification: (id: string) => Promise<void>;
}

const AdminContext = createContext<AdminContextType | null>(null);

export const AdminProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [admin, setAdmin] = useState<AdminUser | null>(() => {
    try {
      const stored = localStorage.getItem('admin_user');
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });
  const [products, setProducts] = useState<Product[]>([]);
  const [certifications, setCertifications] = useState<Certification[]>([]);
  const [loadingProducts, setLoadingProducts] = useState(false);

  const refreshProducts = useCallback(async () => {
    setLoadingProducts(true);
    try {
      const data = await fetchProducts();
      setProducts(data);
    } catch (err) {
      console.error('Failed to fetch products:', err);
    } finally {
      setLoadingProducts(false);
    }
  }, []);

  const refreshCertifications = useCallback(async () => {
    try {
      const data = await fetchCertifications();
      setCertifications(data);
    } catch (err) {
      console.error('Failed to fetch certifications:', err);
    }
  }, []);

  // Load public data on mount
  useEffect(() => {
    refreshProducts();
    refreshCertifications();
  }, [refreshProducts, refreshCertifications]);

  const login = useCallback(async (email: string, password: string): Promise<boolean> => {
    try {
      const response = await loginApi(email, password);
      const user: AdminUser = {
        email: response.user.email,
        role: response.user.role,
        token: response.token,
      };
      setAdmin(user);
      // Store only non-sensitive display info
      localStorage.setItem(
        'admin_user',
        JSON.stringify({ email: user.email, role: user.role, token: '' })
      );
      return true;
    } catch {
      return false;
    }
  }, []);

  const logout = useCallback(async () => {
    await logoutApi();
    setAdmin(null);
    localStorage.removeItem('admin_user');
  }, []);

  const addProduct = useCallback(async (product: Omit<Product, 'id' | 'createdAt'>) => {
    const newProduct = await createProductApi(product);
    setProducts(prev => [newProduct, ...prev]);
    return newProduct;
  }, []);

  const updateProduct = useCallback(async (id: string, data: Partial<Product>) => {
    const updated = await updateProductApi(id, data);
    setProducts(prev => prev.map(p => (p.id === id ? updated : p)));
    return updated;
  }, []);

  const deleteProduct = useCallback(async (id: string) => {
    await deleteProductApi(id);
    setProducts(prev => prev.filter(p => p.id !== id));
  }, []);

  const addCertification = useCallback(async (cert: Omit<Certification, 'id'>) => {
    const newCert = await createCertApi(cert);
    setCertifications(prev => [newCert, ...prev]);
  }, []);

  const deleteCertification = useCallback(async (id: string) => {
    await deleteCertificationApi(id);
    setCertifications(prev => prev.filter(c => c.id !== id));
  }, []);

  const contextValue = useMemo(
    () => ({
      admin,
      isAuthenticated: !!admin,
      login,
      logout,
      products,
      certifications,
      loadingProducts,
      addProduct,
      updateProduct,
      deleteProduct,
      refreshProducts,
      addCertification,
      deleteCertification,
    }),
    [
      admin,
      products,
      certifications,
      loadingProducts,
      login,
      logout,
      addProduct,
      updateProduct,
      deleteProduct,
      refreshProducts,
      addCertification,
      deleteCertification,
    ]
  );

  return <AdminContext.Provider value={contextValue}>{children}</AdminContext.Provider>;
};

export const useAdmin = () => {
  const ctx = useContext(AdminContext);
  if (!ctx) throw new Error('useAdmin must be used within AdminProvider');
  return ctx;
};
