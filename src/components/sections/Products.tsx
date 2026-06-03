import React, { useState, useMemo } from 'react';
import { useInView } from 'react-intersection-observer';
import { Tag, ArrowRight } from 'lucide-react';
import SectionHeader from '../ui/SectionHeader';
import { cn } from '../../utils/cn';
import { useAdmin } from '../../context/AdminContext';
import { productCategories } from '../../data/mockData';

const Products: React.FC = () => {
  const { products, loadingProducts } = useAdmin();
  const [activeCategory, setActiveCategory] = useState('All');
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.05 });

  const filtered = useMemo(
    () =>
      activeCategory === 'All'
        ? products
        : products.filter(p => p.category === activeCategory),
    [products, activeCategory]
  );

  const scrollToContact = () => {
    document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
  };

  // Loading skeleton
  if (loadingProducts && products.length === 0) {
    return (
      <section id="products" className="section-pad bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeader
            label="Product Showcase"
            title="Categories We Procure"
            subtitle="We source across 50+ product categories. Browse our showcase to understand the breadth of our procurement capability."
            className="mb-10"
          />
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="bg-[#F5ECD5] rounded-sm h-64 animate-pulse" />
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="products" className="section-pad bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeader
          label="Product Showcase"
          title="Categories We Procure"
          subtitle="We source across 50+ product categories. Browse our showcase to understand the breadth of our procurement capability."
          className="mb-10"
        />

        {/* Category Filter */}
        <div className="flex flex-wrap justify-center gap-2 mb-10">
          {productCategories.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={cn(
                'px-4 py-2 text-sm font-medium rounded-sm border transition-all duration-200',
                activeCategory === cat
                  ? 'bg-[#578E7E] text-white border-[#578E7E]'
                  : 'bg-white text-[#5a5a5a] border-[#e0d8c8] hover:border-[#578E7E] hover:text-[#578E7E]'
              )}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Products Grid */}
        <div ref={ref} className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {filtered.map((product, i) => (
            <div
              key={product.id}
              className={cn(
                'group bg-[#FFFAEC] rounded-sm border border-[#F5ECD5] overflow-hidden',
                'hover:shadow-lg hover:border-[#578E7E]/25 transition-all duration-300 card-hover',
                'transition-all duration-500',
                inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
              )}
              style={{ transitionDelay: `${i * 60}ms` }}
            >
              {/* Image */}
              <div className="relative h-44 overflow-hidden bg-[#F5ECD5]">
                {product.imageUrl ? (
                  <img
                    src={product.imageUrl}
                    alt={product.name}
                    width={600}
                    height={400}
                    decoding="async"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-400"
                    loading="lazy"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-[#F5ECD5]">
                    <Tag size={32} className="text-[#578E7E]/40" />
                  </div>
                )}
                {/* Category overlay */}
                <div className="absolute top-3 left-3">
                  <span className="text-xs px-2 py-1 bg-[#578E7E] text-white rounded-sm font-medium">
                    {product.category}
                  </span>
                </div>
              </div>

              {/* Content */}
              <div className="p-5">
                <h3 className="font-bold text-[#3D3D3D] text-base mb-2 leading-snug">{product.name}</h3>
                <p className="text-xs text-[#7a7a7a] leading-relaxed line-clamp-3">{product.description}</p>
              </div>

              {/* Footer */}
              <div className="px-5 pb-4 border-t border-[#F5ECD5] pt-3">
                <button
                  onClick={scrollToContact}
                  className="flex items-center gap-1.5 text-xs font-semibold text-[#578E7E] hover:text-[#3a6b5e] transition-colors group/btn"
                >
                  Enquire Now
                  <ArrowRight size={12} className="group-hover/btn:translate-x-1 transition-transform" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom note */}
        <div className="mt-12 text-center">
          <div className="inline-block px-6 py-4 bg-[#F5ECD5] rounded-sm border border-[#e0d8c8]">
            <p className="text-sm text-[#5a5a5a]">
              Don't see your product category?{' '}
              <button
                onClick={scrollToContact}
                className="text-[#578E7E] font-semibold hover:underline"
              >
                Send us a custom requirement
              </button>
              {' '}— we source across 50+ categories.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Products;
