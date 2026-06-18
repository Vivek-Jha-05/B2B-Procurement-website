import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ChevronRight } from 'lucide-react';

const categories = [
  {
    name: 'Adhesives & Sealants',
    desc: 'High-performance epoxy, structural film adhesives, and silicone RTV sealants.',
    image: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=800&h=600&fit=crop',
    count: '6 Products',
  },
  {
    name: 'Coatings & Paints',
    desc: 'Corrosion-resistant primers and military-grade protective polyurethane topcoats.',
    image: 'https://images.unsplash.com/photo-1590233649088-e8898b5b4e31?w=800&h=600&fit=crop',
    count: '2 Products',
  },
  {
    name: 'Lubricants, Oils, & Greases',
    desc: 'AeroShell turbine engine oils and fire-resistant aviation hydraulic fluids.',
    image: 'https://images.unsplash.com/photo-1616401784845-180882ba9ba8?w=800&h=600&fit=crop',
    count: '4 Products',
  },
  {
    name: 'Mechanical Items & Consumables',
    desc: 'CherryMAX structural blind rivets, flexible braided hoses, and hardware.',
    image: 'https://images.unsplash.com/photo-1537462715879-360eeb61a0bc?w=800&h=600&fit=crop',
    count: '2 Products',
  },
  {
    name: 'Cleaners & NDT Chemicals',
    desc: 'Neutral aircraft washing compounds and fluorescent penetrants for crack testing.',
    image: 'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?w=800&h=600&fit=crop',
    count: '2 Products',
  },
  {
    name: 'Tapes',
    desc: 'Aircraft radome erosion protection tapes and high-tack adhesive transfer tapes.',
    image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&h=600&fit=crop',
    count: '2 Products',
  },
];

const ProductShowcase: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          observer.disconnect();
        }
      },
      { threshold: 0.05 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <section id="categories" ref={containerRef} className="section-pad bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div className="text-left max-w-2xl">
            <span className="inline-block text-xs font-semibold text-[#578E7E] uppercase tracking-[0.15em] mb-3">
              Product Catalogue
            </span>
            <div className="w-8 h-0.5 bg-[#578E7E] mb-4" />
            <h2
              className="text-3xl sm:text-4xl font-bold text-[#3D3D3D] mb-4 font-serif"
              style={{ fontFamily: 'Playfair Display, Georgia, serif' }}
            >
              Browse by Category
            </h2>
            <p className="text-[#5a5a5a] text-sm sm:text-base leading-relaxed">
              Find products by industry category. Select a category below to explore our full technical inventory and request quotes.
            </p>
          </div>
          
          <Link
            to="/products"
            className="flex-shrink-0 inline-flex items-center gap-1.5 text-sm font-semibold text-[#578E7E] hover:text-[#3a6b5e] transition-colors group/cta whitespace-nowrap md:mb-1"
          >
            Explore All Products
            <ArrowRight size={14} className="group-hover/cta:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* Category Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {categories.map((cat, idx) => (
            <Link
              key={cat.name}
              to={`/products?category=${encodeURIComponent(cat.name)}`}
              className={`group relative h-80 rounded-xl overflow-hidden shadow-sm border border-[#F5ECD5] flex flex-col justify-end p-6 hover:shadow-xl hover:-translate-y-1 transition-all duration-500 ${
                inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
              }`}
              style={{ transitionDelay: `${idx * 75}ms` }}
            >
              {/* Image background with overlay */}
              <div className="absolute inset-0 z-0">
                <img
                  src={cat.image}
                  alt={cat.name}
                  loading="lazy"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-[1.5s]"
                />
                <div 
                  className="absolute inset-0 z-10 transition-colors duration-300"
                  style={{
                    background: 'linear-gradient(to top, rgba(61, 61, 61, 0.95) 0%, rgba(61, 61, 61, 0.6) 50%, rgba(61, 61, 61, 0.2) 100%)'
                  }}
                />
              </div>

              {/* Text content overlay */}
              <div className="relative z-20 text-[#FFFAEC]">
                <span className="text-[10px] uppercase tracking-wider font-semibold text-[#a8d5c8] bg-white/10 px-2.5 py-1 rounded-full border border-white/10 backdrop-blur-sm inline-block mb-3">
                  {cat.count}
                </span>
                <h3 
                  className="text-lg font-bold mb-2 font-serif group-hover:text-[#a8d5c8] transition-colors"
                  style={{ fontFamily: 'Playfair Display, Georgia, serif' }}
                >
                  {cat.name}
                </h3>
                <p className="text-xs text-white/75 leading-relaxed mb-4 font-normal line-clamp-2">
                  {cat.desc}
                </p>
                <div className="flex items-center gap-1 text-xs font-semibold text-[#a8d5c8] group-hover:text-white transition-colors">
                  View Catalogue <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProductShowcase;

