import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Tag, ZoomIn } from 'lucide-react';
import { useAdmin } from '../../context/AdminContext';
import Button from '../ui/Button';

const FeaturedProducts: React.FC = () => {
  const { products, loadingProducts } = useAdmin();

  // Show first 4 active products as featured
  const featured = products.slice(0, 4);

  return (
    <section className="section-pad bg-white border-t border-[#F5ECD5]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div className="text-left max-w-2xl">
            <span className="inline-block text-xs font-semibold text-[#578E7E] uppercase tracking-[0.15em] mb-3">
              Premium Sourcing
            </span>
            <div className="w-8 h-0.5 bg-[#578E7E] mb-4" />
            <h2
              className="text-3xl sm:text-4xl font-bold text-[#3D3D3D] mb-4 font-serif"
              style={{ fontFamily: 'Playfair Display, Georgia, serif' }}
            >
              Featured Products
            </h2>
            <p className="text-[#5a5a5a] text-sm sm:text-base leading-relaxed">
              Explore some of our highest-demand aviation and aerospace consumables, trusted by operators and MROs.
            </p>
          </div>

          <Link
            to="/products"
            className="flex-shrink-0 inline-flex items-center gap-1.5 text-sm font-semibold text-[#578E7E] hover:text-[#3a6b5e] transition-colors group/cta whitespace-nowrap md:mb-1"
          >
            View Full Catalogue
            <ArrowRight size={14} className="group-hover/cta:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* Loading State */}
        {loadingProducts && products.length === 0 ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="bg-[#F5ECD5] rounded-xl h-80 animate-pulse" />
            ))}
          </div>
        ) : featured.length > 0 ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featured.map((product) => (
              <Link
                key={product.id}
                to={`/products/${product.id}`}
                className="group bg-[#FFFAEC]/30 rounded-xl border border-[#F5ECD5] overflow-hidden flex flex-col hover:shadow-xl hover:border-[#578E7E]/30 hover:-translate-y-1 transition-all duration-300"
              >
                {/* Image */}
                <div className="relative h-48 overflow-hidden bg-[#F5ECD5]">
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
                  {/* Hover Overlay */}
                  <div className="absolute inset-0 bg-[#578E7E]/0 group-hover:bg-[#578E7E]/10 transition-colors duration-300 flex items-center justify-center">
                    <span className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-white text-[#578E7E] text-xs font-bold px-4 py-2 rounded-full shadow-lg flex items-center gap-1.5">
                      <ZoomIn size={12} /> View Product
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="flex flex-col flex-1 p-4 bg-white">
                  <h3 className="font-bold text-[#3D3D3D] text-sm leading-snug mb-1.5 line-clamp-2 group-hover:text-[#578E7E] transition-colors">
                    {product.name}
                  </h3>
                  <p className="text-xs text-[#8a8a8a] leading-relaxed line-clamp-3 flex-1">
                    {product.description}
                  </p>

                  {/* Card Footer */}
                  <div className="mt-4 pt-3 border-t border-[#F5ECD5] flex items-center justify-between">
                    <span className="text-xs text-[#578E7E] font-semibold flex items-center gap-1">
                      Specifications <ArrowRight size={11} className="group-hover:translate-x-1 transition-transform" />
                    </span>
                    <span className="text-[10px] text-white bg-[#578E7E] px-2.5 py-1 rounded-full font-semibold group-hover:bg-[#3a6b5e] transition-colors">
                      Get Quote
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 text-[#8a8a8a] text-sm">
            No products available at the moment.
          </div>
        )}
      </div>
    </section>
  );
};

export default FeaturedProducts;
