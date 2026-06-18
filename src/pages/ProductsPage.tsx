import React, { useState, useMemo, useCallback, useRef, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import {
  Search, Filter, X, Tag, ChevronLeft, ChevronRight,
  ArrowLeft, ArrowRight, ZoomIn
} from 'lucide-react';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import { useAdmin } from '../context/AdminContext';
import type { Product } from '../types';
import { productCategories } from '../data/mockData';
import { cn } from '../utils/cn';

const ITEMS_PER_PAGE = 12;

/* ════════════════════════════════════════════════════════
   PRODUCT CARD  — compact grid card linking to detail page
   ════════════════════════════════════════════════════════ */
const ProductCard: React.FC<{ product: Product; delay: number }> = ({ product, delay }) => {
  const ref = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          observer.disconnect();
        }
      },
      { threshold: 0.08 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <Link
      ref={ref}
      to={`/products/${product.id}`}
      className={cn(
        'group bg-white rounded-xl border border-[#F5ECD5] overflow-hidden flex flex-col',
        'hover:shadow-xl hover:border-[#578E7E]/35 hover:-translate-y-1 transition-all duration-300',
        inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'
      )}
      style={{ transitionDelay: `${delay}ms` }}
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
            <ZoomIn size={12} /> View Product
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
            Specifications <ArrowRight size={11} className="group-hover:translate-x-1 transition-transform" />
          </span>
          <span className="text-[10px] text-white bg-[#578E7E] px-2.5 py-1 rounded-full font-semibold">
            Get Quote
          </span>
        </div>
      </div>
    </Link>
  );
};

/* ════════════════════════════════════════════════════════
   MAIN PAGE
   ════════════════════════════════════════════════════════ */
const ProductsPage: React.FC = () => {
  const { products, loadingProducts } = useAdmin();
  const [searchParams, setSearchParams] = useSearchParams();
  const categoryParam = searchParams.get('category') || 'All';

  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState(categoryParam);
  const [page, setPage] = useState(1);
  const [showFilters, setShowFilters] = useState(false);
  const topRef = useRef<HTMLDivElement>(null);

  // Sync category param with activeCategory state
  useEffect(() => {
    setActiveCategory(categoryParam);
    setPage(1);
  }, [categoryParam]);

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
    if (cat === 'All') {
      searchParams.delete('category');
    } else {
      searchParams.set('category', cat);
    }
    setSearchParams(searchParams);
    setPage(1);
  }, [searchParams, setSearchParams]);

  const handleSearch = useCallback((val: string) => {
    setSearch(val);
    setPage(1);
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
              <p className="text-[#a8d5c8] text-xs font-semibold uppercase tracking-[0.15em] mb-2">APR Services Enterprise</p>
              <h1 className="text-3xl sm:text-4xl font-bold text-white font-serif mb-2">
                Product Catalogue
              </h1>
              <p className="text-white/60 text-sm max-w-lg">
                Browse our complete aviation and industrial consumables range. Select any product to view full technical specifications and request quotes.
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
            <p className="text-xs text-[#8a8a8a] hidden sm:block">Select any card to view details</p>
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
    </>
  );
};

export default ProductsPage;
