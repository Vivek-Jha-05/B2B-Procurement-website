import React, { useState, useMemo, useCallback, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Search, Filter, X, Tag, ChevronLeft, ChevronRight,
  Send, CheckCircle, Building2, Mail, Phone, User, MessageSquare,
  ArrowLeft, Loader2, ArrowRight, Package, ZoomIn
} from 'lucide-react';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import { useAdmin } from '../context/AdminContext';
import { submitQuoteRequest } from '../api/contact';
import type { Product } from '../types';
import { productCategories } from '../data/mockData';
import { cn } from '../utils/cn';

const ITEMS_PER_PAGE = 12;

/* ════════════════════════════════════════════════════════
   QUOTE FORM  — rendered inside the detail drawer
   ════════════════════════════════════════════════════════ */
interface QuoteFormProps {
  product: Product;
  onSuccess: () => void;
}

const QuoteForm: React.FC<QuoteFormProps> = ({ product, onSuccess }) => {
  const [form, setForm] = useState({ name: '', company: '', email: '', phone: '', message: '' });
  const [errors, setErrors] = useState<Partial<typeof form>>({});
  const [submitting, setSubmitting] = useState(false);

  const validate = () => {
    const e: Partial<typeof form> = {};
    if (form.name.trim().length < 2) e.name = 'Name required (min 2 chars)';
    if (form.company.trim().length < 2) e.company = 'Company name required';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = 'Valid email required';
    if (!/^\+?[\d\s\-().]{10,}$/.test(form.phone)) e.phone = 'Valid phone required';
    if (form.message.trim().length < 10) e.message = 'Min 10 characters';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setSubmitting(true);
    try {
      await submitQuoteRequest({
        ...form,
        productName: product.name,
        productCategory: product.category,
      });
      onSuccess();
    } catch (err) {
      setErrors({ message: err instanceof Error ? err.message : 'Submission failed. Try again.' });
    } finally {
      setSubmitting(false);
    }
  };

  const field = (
    name: keyof typeof form,
    label: string,
    icon: React.ReactNode,
    type = 'text',
    placeholder = ''
  ) => (
    <div>
      <label className="block text-xs font-semibold text-[#5a5a5a] mb-1 uppercase tracking-wide">
        {label} <span className="text-red-400">*</span>
      </label>
      <div className="relative">
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#578E7E]/60">{icon}</span>
        <input
          type={type}
          value={form[name]}
          onChange={e => setForm(f => ({ ...f, [name]: e.target.value }))}
          placeholder={placeholder}
          className={cn(
            'w-full pl-9 pr-4 py-2.5 text-sm border rounded-lg bg-white transition-all outline-none',
            errors[name]
              ? 'border-red-400 focus:ring-2 focus:ring-red-100'
              : 'border-[#e0d8c8] focus:border-[#578E7E] focus:ring-2 focus:ring-[#578E7E]/15'
          )}
        />
      </div>
      {errors[name] && <p className="text-red-400 text-xs mt-1">{errors[name]}</p>}
    </div>
  );

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <div className="flex items-start gap-2 bg-[#578E7E]/8 border border-[#578E7E]/20 rounded-lg px-3 py-2.5">
        <Package size={14} className="text-[#578E7E] mt-0.5 flex-shrink-0" />
        <p className="text-xs text-[#5a5a5a] leading-relaxed">
          Your enquiry will be linked to <strong className="text-[#3D3D3D]">{product.name}</strong>. Just fill in your contact details below.
        </p>
      </div>

      {field('name', 'Your Name', <User size={14} />, 'text', 'e.g. Rajesh Kumar')}
      {field('company', 'Company', <Building2 size={14} />, 'text', 'e.g. Tata Consultancy')}
      {field('email', 'Work Email', <Mail size={14} />, 'email', 'e.g. rajesh@company.com')}
      {field('phone', 'Phone', <Phone size={14} />, 'tel', 'e.g. +91 98765 43210')}

      <div>
        <label className="block text-xs font-semibold text-[#5a5a5a] mb-1 uppercase tracking-wide">
          Requirements <span className="text-red-400">*</span>
        </label>
        <div className="relative">
          <MessageSquare size={14} className="absolute left-3 top-3 text-[#578E7E]/60" />
          <textarea
            value={form.message}
            onChange={e => setForm(f => ({ ...f, message: e.target.value }))}
            rows={3}
            placeholder="Quantity needed, delivery timeline, special specs…"
            className={cn(
              'w-full pl-9 pr-4 py-2.5 text-sm border rounded-lg bg-white resize-none transition-all outline-none',
              errors.message
                ? 'border-red-400 focus:ring-2 focus:ring-red-100'
                : 'border-[#e0d8c8] focus:border-[#578E7E] focus:ring-2 focus:ring-[#578E7E]/15'
            )}
          />
        </div>
        {errors.message && <p className="text-red-400 text-xs mt-1">{errors.message}</p>}
      </div>

      {/* Honeypot */}
      <input type="text" name="honeypot" style={{ display: 'none' }} tabIndex={-1} readOnly />

      <button
        type="submit"
        disabled={submitting}
        className="w-full flex items-center justify-center gap-2 py-3 bg-[#578E7E] text-white font-semibold rounded-lg hover:bg-[#3a6b5e] disabled:opacity-60 disabled:cursor-not-allowed transition-all shadow-sm hover:shadow-md text-sm"
      >
        {submitting
          ? <><Loader2 size={15} className="animate-spin" /> Sending…</>
          : <><Send size={14} /> Send Quote Request</>}
      </button>
    </form>
  );
};

/* ════════════════════════════════════════════════════════
   PRODUCT DETAIL DRAWER  — slides in from the right
   ════════════════════════════════════════════════════════ */
interface DetailDrawerProps {
  product: Product;
  onClose: () => void;
}

const DetailDrawer: React.FC<DetailDrawerProps> = ({ product, onClose }) => {
  const [showQuoteForm, setShowQuoteForm] = useState(false);
  const [quoteSuccess, setQuoteSuccess] = useState(false);
  const [imageZoomed, setImageZoomed] = useState(false);
  const [visible, setVisible] = useState(false);

  // Animate in
  useEffect(() => {
    requestAnimationFrame(() => setVisible(true));
  }, []);

  // Close on Escape
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') handleClose(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  // Lock body scroll
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, []);

  const handleClose = () => {
    setVisible(false);
    setTimeout(onClose, 280);
  };

  return (
    <>
      {/* Backdrop */}
      <div
        className={cn(
          'fixed inset-0 z-50 bg-black/40 backdrop-blur-sm transition-opacity duration-280',
          visible ? 'opacity-100' : 'opacity-0'
        )}
        onClick={handleClose}
      />

      {/* Drawer panel */}
      <div
        className={cn(
          'fixed top-0 right-0 h-full z-50 w-full sm:w-[480px] lg:w-[540px]',
          'bg-white shadow-2xl overflow-y-auto flex flex-col',
          'transition-transform duration-300 ease-out',
          visible ? 'translate-x-0' : 'translate-x-full'
        )}
      >
        {/* ── Header ── */}
        <div className="sticky top-0 z-10 bg-white border-b border-[#F5ECD5] px-5 py-4 flex items-center justify-between gap-3">
          <button
            onClick={handleClose}
            className="flex items-center gap-1.5 text-sm text-[#7a7a7a] hover:text-[#3D3D3D] transition-colors"
          >
            <ArrowLeft size={15} /> Back
          </button>
          <span className="text-xs font-semibold text-[#578E7E] uppercase tracking-wider">Product Detail</span>
          <button
            onClick={handleClose}
            className="p-1.5 rounded-lg hover:bg-[#F5ECD5] text-[#8a8a8a] hover:text-[#3D3D3D] transition-colors"
          >
            <X size={16} />
          </button>
        </div>

        {/* ── Product Image ── */}
        <div
          className="relative overflow-hidden bg-[#F5ECD5] cursor-zoom-in"
          style={{ height: '260px' }}
          onClick={() => setImageZoomed(true)}
        >
          {product.imageUrl ? (
            <>
              <img
                src={product.imageUrl}
                alt={product.name}
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute bottom-3 right-3 flex items-center gap-1.5 bg-black/50 text-white text-xs px-2.5 py-1 rounded-full">
                <ZoomIn size={11} /> Tap to zoom
              </div>
            </>
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <Tag size={48} className="text-[#578E7E]/25" />
            </div>
          )}
          {/* Category badge */}
          <div className="absolute top-3 left-3">
            <span className="text-xs px-3 py-1 bg-[#578E7E] text-white rounded-full font-semibold shadow-sm">
              {product.category}
            </span>
          </div>
        </div>

        {/* ── Product Info ── */}
        <div className="px-5 pt-5 pb-3">
          <h2 className="text-xl font-bold text-[#3D3D3D] leading-snug mb-3">
            {product.name}
          </h2>

          <div className="mb-4">
            <h3 className="text-xs font-bold text-[#5a5a5a] uppercase tracking-wider mb-2">
              Product Description
            </h3>
            <p className="text-sm text-[#5a5a5a] leading-relaxed">
              {product.description}
            </p>
          </div>

          <div className="flex flex-wrap gap-2 mb-5">
            <div className="flex items-center gap-1.5 text-xs text-[#578E7E] bg-[#578E7E]/8 border border-[#578E7E]/20 px-3 py-1.5 rounded-full font-medium">
              <Package size={11} /> B2B Procurement
            </div>
            <div className="flex items-center gap-1.5 text-xs text-[#578E7E] bg-[#578E7E]/8 border border-[#578E7E]/20 px-3 py-1.5 rounded-full font-medium">
              ✓ Verified Suppliers
            </div>
            <div className="flex items-center gap-1.5 text-xs text-[#578E7E] bg-[#578E7E]/8 border border-[#578E7E]/20 px-3 py-1.5 rounded-full font-medium">
              ✓ Bulk Orders Welcome
            </div>
          </div>

          {/* Divider */}
          <div className="border-t border-[#F5ECD5] mb-5" />

          {/* ── Quote Section ── */}
          {quoteSuccess ? (
            <div className="text-center py-8">
              <div className="w-14 h-14 bg-[#578E7E]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle size={28} className="text-[#578E7E]" />
              </div>
              <h3 className="font-bold text-[#3D3D3D] text-lg mb-2">Quote Request Sent!</h3>
              <p className="text-sm text-[#7a7a7a] mb-5">
                Our procurement team will review your enquiry for <strong>{product.name}</strong> and reach out within 1–2 business days.
              </p>
              <button
                onClick={handleClose}
                className="px-6 py-2.5 bg-[#578E7E] text-white text-sm font-semibold rounded-lg hover:bg-[#3a6b5e] transition-colors"
              >
                Done
              </button>
            </div>
          ) : !showQuoteForm ? (
            /* CTA to open form */
            <div>
              <h3 className="text-sm font-bold text-[#3D3D3D] mb-1">Interested in this product?</h3>
              <p className="text-xs text-[#7a7a7a] mb-4">
                Fill a quick form and our team will send you a personalised quote with pricing, availability, and delivery timelines.
              </p>
              <button
                onClick={() => setShowQuoteForm(true)}
                className="w-full flex items-center justify-center gap-2 py-3.5 bg-[#578E7E] text-white font-bold rounded-lg hover:bg-[#3a6b5e] transition-all shadow-md hover:shadow-lg text-sm group"
              >
                <Send size={15} />
                Request a Quote for This Product
                <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          ) : (
            /* Quote Form */
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-bold text-[#3D3D3D]">Request a Quote</h3>
                <button
                  onClick={() => setShowQuoteForm(false)}
                  className="text-xs text-[#8a8a8a] hover:text-[#578E7E] transition-colors"
                >
                  ← Back to details
                </button>
              </div>
              <QuoteForm
                product={product}
                onSuccess={() => setQuoteSuccess(true)}
              />
            </div>
          )}
        </div>

        {/* Bottom padding */}
        <div className="h-8" />
      </div>

      {/* Zoomed image lightbox */}
      {imageZoomed && product.imageUrl && (
        <div
          className="fixed inset-0 z-[70] bg-black/90 flex items-center justify-center p-4 cursor-zoom-out"
          onClick={() => setImageZoomed(false)}
        >
          <button
            onClick={() => setImageZoomed(false)}
            className="absolute top-4 right-4 p-2 bg-white/20 rounded-full text-white hover:bg-white/30 transition-colors"
          >
            <X size={20} />
          </button>
          <img
            src={product.imageUrl}
            alt={product.name}
            className="max-w-full max-h-full rounded-xl object-contain shadow-2xl"
          />
        </div>
      )}
    </>
  );
};

/* ════════════════════════════════════════════════════════
   PRODUCT CARD  — compact grid card, click → detail drawer
   ════════════════════════════════════════════════════════ */
interface ProductCardProps {
  product: Product;
  onView: (p: Product) => void;
  delay: number;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, onView, delay }) => {
  const ref = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setInView(true); observer.disconnect(); } },
      { threshold: 0.08 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      onClick={() => onView(product)}
      className={cn(
        'group bg-white rounded-xl border border-[#F5ECD5] overflow-hidden flex flex-col cursor-pointer',
        'hover:shadow-xl hover:border-[#578E7E]/30 hover:-translate-y-1 transition-all duration-300',
        inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'
      )}
      style={{ transitionDelay: `${delay}ms` }}
      role="button"
      tabIndex={0}
      onKeyDown={e => e.key === 'Enter' && onView(product)}
    >
      {/* Image */}
      <div className="relative h-44 overflow-hidden bg-[#F5ECD5]">
        {product.imageUrl ? (
          <img
            src={product.imageUrl}
            alt={product.name}
            loading="lazy"
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <Tag size={36} className="text-[#578E7E]/20" />
          </div>
        )}
        {/* Category */}
        <div className="absolute top-2.5 left-2.5">
          <span className="text-[10px] px-2.5 py-0.5 bg-[#578E7E] text-white rounded-full font-semibold">
            {product.category}
          </span>
        </div>
        {/* View overlay on hover */}
        <div className="absolute inset-0 bg-[#578E7E]/0 group-hover:bg-[#578E7E]/10 transition-colors duration-300 flex items-center justify-center">
          <span className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-white text-[#578E7E] text-xs font-bold px-4 py-2 rounded-full shadow-lg flex items-center gap-1.5">
            <ZoomIn size={12} /> View Details
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="flex flex-col flex-1 p-4">
        <h3 className="font-bold text-[#3D3D3D] text-sm leading-snug mb-1.5 line-clamp-2 group-hover:text-[#578E7E] transition-colors">
          {product.name}
        </h3>
        <p className="text-xs text-[#8a8a8a] leading-relaxed line-clamp-3 flex-1">
          {product.description}
        </p>

        {/* Footer */}
        <div className="mt-3 pt-3 border-t border-[#F5ECD5] flex items-center justify-between">
          <span className="text-xs text-[#578E7E] font-semibold flex items-center gap-1">
            View Details <ArrowRight size={11} className="group-hover:translate-x-1 transition-transform" />
          </span>
          <span className="text-[10px] text-white bg-[#578E7E] px-2 py-0.5 rounded-full font-semibold">
            Get Quote
          </span>
        </div>
      </div>
    </div>
  );
};

/* ════════════════════════════════════════════════════════
   MAIN PAGE
   ════════════════════════════════════════════════════════ */
const ProductsPage: React.FC = () => {
  const { products, loadingProducts } = useAdmin();
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [page, setPage] = useState(1);
  const [detailProduct, setDetailProduct] = useState<Product | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const topRef = useRef<HTMLDivElement>(null);

  const filtered = useMemo(() => products.filter(p => {
    const matchCat = activeCategory === 'All' || p.category === activeCategory;
    const q = search.toLowerCase();
    const matchSearch = !search ||
      p.name.toLowerCase().includes(q) ||
      p.description.toLowerCase().includes(q) ||
      p.category.toLowerCase().includes(q);
    return matchCat && matchSearch;
  }), [products, search, activeCategory]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / ITEMS_PER_PAGE));
  const paginated = useMemo(
    () => filtered.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE),
    [filtered, page]
  );

  const handleCategoryChange = useCallback((cat: string) => {
    setActiveCategory(cat); setPage(1);
  }, []);

  const handleSearch = useCallback((val: string) => {
    setSearch(val); setPage(1);
  }, []);

  const handlePageChange = (p: number) => {
    setPage(p);
    topRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <>
      <Navbar />

      {/* Hero Header */}
      <div className="bg-gradient-to-br from-[#3D3D3D] via-[#4a6b60] to-[#578E7E] pt-24 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link to="/" className="inline-flex items-center gap-1.5 text-white/60 hover:text-white text-sm mb-5 transition-colors">
            <ArrowLeft size={14} /> Back to Home
          </Link>
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <p className="text-[#a8d5c8] text-xs font-semibold uppercase tracking-[0.15em] mb-2">ProSource Enterprise</p>
              <h1 className="text-3xl sm:text-4xl font-bold text-white font-serif mb-2">
                Product Catalogue
              </h1>
              <p className="text-white/60 text-sm max-w-lg">
                Browse our complete procurement range. Click any product to see full details and request a personalised quote.
              </p>
            </div>
            {!loadingProducts && (
              <div className="flex-shrink-0 bg-white/10 border border-white/20 rounded-xl px-5 py-3 text-center backdrop-blur-sm">
                <p className="text-2xl font-bold text-white">{products.length}</p>
                <p className="text-white/60 text-xs">Total Products</p>
              </div>
            )}
          </div>
        </div>
      </div>

      <div ref={topRef} className="bg-[#FFFAEC] min-h-screen">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

          {/* Toolbar */}
          <div className="flex flex-col sm:flex-row gap-3 mb-5">
            <div className="relative flex-1">
              <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#8a8a8a]" />
              <input
                type="text"
                placeholder="Search products by name, category or description…"
                value={search}
                onChange={e => handleSearch(e.target.value)}
                className="w-full pl-10 pr-10 py-2.5 text-sm border border-[#e0d8c8] rounded-lg bg-white focus:border-[#578E7E] focus:ring-2 focus:ring-[#578E7E]/15 outline-none"
              />
              {search && (
                <button onClick={() => handleSearch('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#8a8a8a] hover:text-[#3D3D3D]">
                  <X size={14} />
                </button>
              )}
            </div>
            <button
              onClick={() => setShowFilters(v => !v)}
              className="sm:hidden flex items-center gap-2 px-4 py-2.5 text-sm border border-[#e0d8c8] rounded-lg bg-white text-[#5a5a5a]"
            >
              <Filter size={14} /> Filters
            </button>
          </div>

          {/* Category pills */}
          <div className={cn('flex flex-wrap gap-2 mb-6', !showFilters && 'hidden sm:flex')}>
            {productCategories.map(cat => (
              <button
                key={cat}
                onClick={() => handleCategoryChange(cat)}
                className={cn(
                  'px-4 py-1.5 text-sm font-medium rounded-full border transition-all duration-200',
                  activeCategory === cat
                    ? 'bg-[#578E7E] text-white border-[#578E7E] shadow-sm'
                    : 'bg-white text-[#5a5a5a] border-[#e0d8c8] hover:border-[#578E7E] hover:text-[#578E7E]'
                )}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Result count */}
          <div className="flex items-center justify-between mb-5">
            <p className="text-sm text-[#8a8a8a]">
              {loadingProducts ? 'Loading products…' : (
                <>
                  Showing <strong className="text-[#3D3D3D]">{paginated.length}</strong> of{' '}
                  <strong className="text-[#3D3D3D]">{filtered.length}</strong> products
                  {activeCategory !== 'All' && <> in <em>"{activeCategory}"</em></>}
                </>
              )}
            </p>
            <p className="text-xs text-[#8a8a8a] hidden sm:block">Click any card to view details</p>
          </div>

          {/* Loading */}
          {loadingProducts && products.length === 0 ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="bg-[#F5ECD5] rounded-xl h-72 animate-pulse" />
              ))}
            </div>
          ) : paginated.length === 0 ? (
            <div className="text-center py-20">
              <Tag size={40} className="mx-auto mb-4 text-[#578E7E]/25" />
              <p className="text-[#8a8a8a] font-medium mb-1">No products found</p>
              <p className="text-xs text-[#8a8a8a]">Try adjusting your search or category filter</p>
              {(search || activeCategory !== 'All') && (
                <button
                  onClick={() => { handleSearch(''); handleCategoryChange('All'); }}
                  className="mt-4 text-sm text-[#578E7E] hover:underline"
                >
                  Clear all filters
                </button>
              )}
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
              {paginated.map((product, i) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onView={setDetailProduct}
                  delay={i * 40}
                />
              ))}
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 mt-12">
              <button
                onClick={() => handlePageChange(page - 1)}
                disabled={page === 1}
                className="p-2 rounded-lg border border-[#e0d8c8] bg-white text-[#5a5a5a] hover:border-[#578E7E] hover:text-[#578E7E] disabled:opacity-40 disabled:cursor-not-allowed transition-all"
              >
                <ChevronLeft size={16} />
              </button>

              {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => {
                const show = p === 1 || p === totalPages || Math.abs(p - page) <= 1;
                const ellipsisBefore = p === page - 2 && page > 3;
                const ellipsisAfter = p === page + 2 && page < totalPages - 2;
                if (ellipsisBefore || ellipsisAfter) return <span key={p} className="px-1 text-[#8a8a8a] text-sm">…</span>;
                if (!show) return null;
                return (
                  <button
                    key={p}
                    onClick={() => handlePageChange(p)}
                    className={cn(
                      'w-9 h-9 text-sm font-medium rounded-lg border transition-all',
                      p === page
                        ? 'bg-[#578E7E] text-white border-[#578E7E]'
                        : 'bg-white text-[#5a5a5a] border-[#e0d8c8] hover:border-[#578E7E] hover:text-[#578E7E]'
                    )}
                  >
                    {p}
                  </button>
                );
              })}

              <button
                onClick={() => handlePageChange(page + 1)}
                disabled={page === totalPages}
                className="p-2 rounded-lg border border-[#e0d8c8] bg-white text-[#5a5a5a] hover:border-[#578E7E] hover:text-[#578E7E] disabled:opacity-40 disabled:cursor-not-allowed transition-all"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          )}
        </div>
      </div>

      <Footer />

      {/* Product Detail Drawer */}
      {detailProduct && (
        <DetailDrawer
          product={detailProduct}
          onClose={() => setDetailProduct(null)}
        />
      )}
    </>
  );
};

export default ProductsPage;
