import React, { createContext, useContext, useState, useCallback, useMemo, useEffect } from 'react';
import type { AdminUser, Product, Certification, Category, Client } from '../types';
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
import {
  fetchCategories,
  createCategory as createCategoryApi,
  updateCategory as updateCategoryApi,
  deleteCategory as deleteCategoryApi,
} from '../api/categories';
import {
  fetchClients,
  fetchClientsAll,
  createClient as createClientApi,
  updateClient as updateClientApi,
  deleteClient as deleteClientApi,
} from '../api/clients';

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
  categories_list: Category[];
  addCategory: (category: Omit<Category, 'id'>) => Promise<Category>;
  updateCategory: (id: string, data: Partial<Category>) => Promise<Category>;
  deleteCategory: (id: string) => Promise<void>;
  refreshCategories: () => Promise<void>;
  clients_list: Client[];
  addClient: (client: Omit<Client, 'id'>) => Promise<Client>;
  updateClient: (id: string, data: Partial<Client>) => Promise<Client>;
  deleteClient: (id: string) => Promise<void>;
  refreshClients: () => Promise<void>;
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
  const [categories_list, setCategoriesList] = useState<Category[]>([]);
  const [clients_list, setClientsList] = useState<Client[]>([]);
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

  const refreshCategories = useCallback(async () => {
    try {
      const data = await fetchCategories();
      setCategoriesList(data);
    } catch (err) {
      console.error('Failed to fetch categories:', err);
    }
  }, []);

  const refreshClients = useCallback(async () => {
    try {
      const data = admin ? await fetchClientsAll() : await fetchClients();
      setClientsList(data);
    } catch (err) {
      console.error('Failed to fetch clients:', err);
    }
  }, [admin]);

  // Load public data on mount
  useEffect(() => {
    refreshProducts();
    refreshCertifications();
    refreshCategories();
    refreshClients();
  }, [refreshProducts, refreshCertifications, refreshCategories, refreshClients]);

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

  const addCategory = useCallback(async (category: Omit<Category, 'id'>) => {
    const newCat = await createCategoryApi(category);
    setCategoriesList(prev => [newCat, ...prev]);
    return newCat;
  }, []);

  const updateCategoryFn = useCallback(async (id: string, data: Partial<Category>) => {
    const updated = await updateCategoryApi(id, data);
    setCategoriesList(prev => prev.map(c => (c.id === id ? updated : c)));
    return updated;
  }, []);

  const deleteCategoryFn = useCallback(async (id: string) => {
    await deleteCategoryApi(id);
    setCategoriesList(prev => prev.filter(c => c.id !== id));
  }, []);

  const addClient = useCallback(async (client: Omit<Client, 'id'>) => {
    const newClient = await createClientApi(client);
    setClientsList(prev => [newClient, ...prev]);
    return newClient;
  }, []);

  const updateClientFn = useCallback(async (id: string, data: Partial<Client>) => {
    const updated = await updateClientApi(id, data);
    setClientsList(prev => prev.map(c => (c.id === id ? updated : c)));
    return updated;
  }, []);

  const deleteClientFn = useCallback(async (id: string) => {
    await deleteClientApi(id);
    setClientsList(prev => prev.filter(c => c.id !== id));
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
      categories_list,
      addCategory,
      updateCategory: updateCategoryFn,
      deleteCategory: deleteCategoryFn,
      refreshCategories,
      clients_list,
      addClient,
      updateClient: updateClientFn,
      deleteClient: deleteClientFn,
      refreshClients,
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
      categories_list,
      addCategory,
      updateCategoryFn,
      deleteCategoryFn,
      refreshCategories,
      clients_list,
      addClient,
      updateClientFn,
      deleteClientFn,
      refreshClients,
    ]
  );

  return <AdminContext.Provider value={contextValue}>{children}</AdminContext.Provider>;
};

export const useAdmin = () => {
  const ctx = useContext(AdminContext);
  if (!ctx) throw new Error('useAdmin must be used within AdminProvider');
  return ctx;
};
