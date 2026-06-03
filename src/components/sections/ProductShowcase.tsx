import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Tag } from 'lucide-react';
import { useAdmin } from '../../context/AdminContext';
import type { Product } from '../../types';

/* ── Single product card ───────────────────────────────── */
const MarqueeCard: React.FC<{ product: Product }> = ({ product }) => (
  <div className="flex-shrink-0 w-56 mx-3 bg-white rounded-xl border border-[#F5ECD5] shadow-sm overflow-hidden group hover:shadow-lg hover:border-[#578E7E]/40 transition-all duration-300 cursor-default">
    <div className="h-36 overflow-hidden bg-[#F5ECD5] relative">
      {product.imageUrl ? (
        <img
          src={product.imageUrl}
          alt={product.name}
          loading="lazy"
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
      ) : (
        <div className="w-full h-full flex items-center justify-center">
          <Tag size={28} className="text-[#578E7E]/25" />
        </div>
      )}
      <div className="absolute top-2 left-2">
        <span className="text-[10px] px-2 py-0.5 bg-[#578E7E] text-white rounded-full font-semibold tracking-wide">
          {product.category}
        </span>
      </div>
    </div>
    <div className="p-3.5">
      <h3 className="font-bold text-[#3D3D3D] text-sm leading-snug line-clamp-1 mb-1">
        {product.name}
      </h3>
      <p className="text-[11px] text-[#8a8a8a] leading-relaxed line-clamp-2">
        {product.description}
      </p>
    </div>
  </div>
);

/* ── Section ────────────────────────────────────────────── */
const ProductShowcase: React.FC = () => {
  const { products, loadingProducts } = useAdmin();

  const topSale = useMemo(() => products.slice(0, 6), [products]);
  const marqueeItems = useMemo(
    () => (topSale.length > 0 ? [...topSale, ...topSale] : []),
    [topSale]
  );

  return (
    <section id="products" className="section-pad bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* ── Header: Left aligned text, right aligned button ── */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
          <div className="text-left max-w-2xl">
            <span className="inline-block text-xs font-semibold text-[#578E7E] uppercase tracking-[0.15em] mb-3">
              Top Categories
            </span>
            <div className="w-8 h-0.5 bg-[#578E7E] mb-4" />
            <h2
              className="text-3xl sm:text-4xl font-bold text-[#3D3D3D] mb-4"
              style={{ fontFamily: 'Playfair Display, serif' }}
            >
              Our Most Procured Products
            </h2>
            <p className="text-[#5a5a5a] text-sm sm:text-base leading-relaxed">
              A curated showcase of our highest-demand procurement categories, trusted by India's leading enterprises.
            </p>
          </div>
          
          <Link
            to="/products"
            className="flex-shrink-0 inline-flex items-center gap-1.5 text-sm font-semibold text-[#578E7E] hover:text-[#3a6b5e] transition-colors group/cta whitespace-nowrap md:mb-1"
          >
            Browse All Products
            <ArrowRight size={14} className="group-hover/cta:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>

      {/* Marquee strip — full bleed with fade edges */}
      {loadingProducts && products.length === 0 ? (
        <div className="flex gap-4 px-8">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="flex-shrink-0 w-56 h-48 bg-[#F5ECD5] rounded-xl animate-pulse" />
          ))}
        </div>
      ) : marqueeItems.length > 0 ? (
        <div
          className="overflow-hidden"
          style={{
            maskImage: 'linear-gradient(to right, transparent 0%, black 6%, black 94%, transparent 100%)',
            WebkitMaskImage: 'linear-gradient(to right, transparent 0%, black 6%, black 94%, transparent 100%)',
          }}
        >
          <div className="marquee-track marquee-left py-3">
            {marqueeItems.map((p, i) => (
              <MarqueeCard key={`${p.id}-${i}`} product={p} />
            ))}
          </div>
        </div>
      ) : (
        <div className="text-center py-10 text-[#8a8a8a] text-sm">No products yet.</div>
      )}

      {/* CTA button */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-10 text-center">
        <Link
          to="/products"
          className="inline-flex items-center gap-2 px-7 py-3 bg-[#578E7E] text-white text-sm font-semibold rounded-sm hover:bg-[#3a6b5e] transition-colors shadow-sm hover:shadow-md"
        >
          View Full Product Catalogue & Request a Quote
          <ArrowRight size={14} />
        </Link>
      </div>
    </section>
  );
};

export default ProductShowcase;
