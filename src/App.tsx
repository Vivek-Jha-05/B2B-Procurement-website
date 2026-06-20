import { lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AdminProvider } from './context/AdminContext';
import ProtectedRoute from './components/ProtectedRoute';

import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import Hero from './components/sections/Hero';
import ProductShowcase from './components/sections/ProductShowcase';
import FeaturedProducts from './components/sections/FeaturedProducts';
import CompactWhyUs from './components/sections/CompactWhyUs';
import CTABanner from './components/sections/CTABanner';
import ScrollToTop from './components/ScrollToTop';
import FloatingActions from './components/FloatingActions';
import ClientShowcase from './components/sections/ClientShowcase';

// Lazy load pages not needed on initial load
const AdminLogin = lazy(() => import('./pages/admin/AdminLogin'));
const AdminDashboard = lazy(() => import('./pages/admin/AdminDashboard'));
const AdminProducts = lazy(() => import('./pages/admin/AdminProducts'));
const AdminLeads = lazy(() => import('./pages/admin/AdminLeads'));
const AdminCertifications = lazy(() => import('./pages/admin/AdminCertifications'));
const AdminCategories = lazy(() => import('./pages/admin/AdminCategories'));
const AdminClients = lazy(() => import('./pages/admin/AdminClients'));
const ProductsPage = lazy(() => import('./pages/ProductsPage'));
const ProductDetailPage = lazy(() => import('./pages/ProductDetailPage'));
const ContactPage = lazy(() => import('./pages/ContactPage'));

function LoadingSpinner() {
  return (
    <div className="min-h-screen bg-[#F5ECD5] flex items-center justify-center">
      <div className="w-8 h-8 border-2 border-[#578E7E] border-t-transparent rounded-full animate-spin" />
    </div>
  );
}

function HomePage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow">
        <Hero />
        <ClientShowcase />
        <ProductShowcase />
        <FeaturedProducts />
        <CompactWhyUs />
        <CTABanner />
      </main>
      <Footer />
      <FloatingActions />
    </div>
  );
}

export default function App() {
  return (
    <AdminProvider>
      <Router>
        <ScrollToTop />
        <Suspense fallback={<LoadingSpinner />}>
          <Routes>
            {/* Public */}
            <Route path="/" element={<HomePage />} />
            <Route path="/products" element={<ProductsPage />} />
            <Route path="/products/:id" element={<ProductDetailPage />} />
            <Route path="/contact" element={<ContactPage />} />

            {/* Admin auth */}
            <Route path="/admin" element={<AdminLogin />} />

            {/* Protected admin routes */}
            <Route
              path="/admin/dashboard"
              element={
                <ProtectedRoute>
                  <AdminDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/products"
              element={
                <ProtectedRoute>
                  <AdminProducts />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/categories"
              element={
                <ProtectedRoute>
                  <AdminCategories />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/clients"
              element={
                <ProtectedRoute>
                  <AdminClients />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/leads"
              element={
                <ProtectedRoute>
                  <AdminLeads />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/certifications"
              element={
                <ProtectedRoute>
                  <AdminCertifications />
                </ProtectedRoute>
              }
            />
          </Routes>
        </Suspense>
      </Router>
    </AdminProvider>
  );
}
