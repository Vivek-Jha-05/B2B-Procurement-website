import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ShieldCheck, Award, Layers } from 'lucide-react';
import Button from '../ui/Button';

const trustBadges = [
  { icon: ShieldCheck, text: 'ISO 9001:2015 Quality Assured' },
  { icon: Award, text: 'MSME Registered Partner' },
];

const coreCapabilities = [
  { name: 'Adhesives & Sealants', desc: 'Structural epoxy, RTV & film adhesives' },
  { name: 'Lubricants & Oils', desc: 'Aviation turbine oils & hydraulic fluids' },
  { name: 'Coatings & Paints', desc: 'Anti-corrosive aerospace primers' },
  { name: 'Cleaners & Chemicals', desc: 'NDT penetrants & industrial washing compounds' },
];

const Hero: React.FC = () => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);

  return (
    <section
      id="home"
      className="relative min-h-screen flex items-center overflow-hidden bg-[#FFFAEC]"
      style={{
        background: 'linear-gradient(135deg, #FFFAEC 0%, #F5ECD5 40%, #FFFAEC 100%)',
      }}
    >
      {/* Background geometric elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div
          className="absolute -top-20 -right-20 w-[500px] h-[500px] rounded-full opacity-20"
          style={{ background: 'radial-gradient(circle, #578E7E 0%, transparent 70%)' }}
        />
        <div
          className="absolute bottom-0 -left-40 w-[400px] h-[400px] rounded-full opacity-10"
          style={{ background: 'radial-gradient(circle, #578E7E 0%, transparent 70%)' }}
        />
        {/* Grid pattern */}
        <svg
          className="absolute inset-0 w-full h-full opacity-[0.03]"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <pattern id="hero-grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#3D3D3D" strokeWidth="1" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#hero-grid)" />
        </svg>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-0">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center min-h-screen lg:min-h-0 py-16">
          {/* Left Content */}
          <div
            className={`transition-all duration-700 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
          >
            {/* Label */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-[#578E7E]/10 border border-[#578E7E]/20 rounded-sm mb-6">
              <span className="w-1.5 h-1.5 rounded-full bg-[#578E7E] animate-pulse" />
              <span className="text-xs font-semibold text-[#578E7E] tracking-widest uppercase">
                B2B Sourcing & Supply
              </span>
            </div>

            {/* Headline */}
            <h1
              className="text-4xl sm:text-5xl lg:text-6xl font-bold text-[#3D3D3D] leading-[1.1] mb-6"
              style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
            >
              Industrial Sourcing,{' '}
              <span className="text-[#578E7E] relative">
                Delivered in Bulk.
                <svg
                  className="absolute -bottom-2 left-0 w-full"
                  height="6"
                  viewBox="0 0 300 6"
                  preserveAspectRatio="none"
                >
                  <path
                    d="M0,3 Q75,0 150,3 Q225,6 300,3"
                    stroke="#578E7E"
                    strokeWidth="2"
                    fill="none"
                    strokeDasharray="300"
                    strokeDashoffset="0"
                    opacity="0.5"
                  />
                </svg>
              </span>
            </h1>

            {/* Subtext */}
            <p className="text-base sm:text-lg text-[#5a5a5a] leading-relaxed mb-8 max-w-xl">
              High-performance adhesives, lubricants, sealants, coatings, and tapes for aviation and industrial applications. Sourced directly with full certification.
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-4 mb-10">
              <Link to="/products">
                <Button variant="primary" size="lg" className="group w-full sm:w-auto justify-center">
                  Browse Catalogue
                  <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              <Link to="/contact">
                <Button variant="outline" size="lg" className="w-full sm:w-auto justify-center">
                  Request Quote
                </Button>
              </Link>
            </div>

            {/* Trust Badges */}
            <div className="flex flex-wrap gap-6 border-t border-[#F5ECD5] pt-6">
              {trustBadges.map(({ icon: Icon, text }) => (
                <div key={text} className="flex items-center gap-2.5 text-sm text-[#5a5a5a]">
                  <Icon size={16} className="text-[#578E7E]" />
                  <span className="font-semibold text-xs uppercase tracking-wider">{text}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Right Content — Product Category Highlights Grid */}
          <div
            className={`transition-all duration-700 delay-200 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
          >
            <div className="relative">
              {/* Main card */}
              <div className="bg-white rounded-sm shadow-xl border border-[#F5ECD5] p-6 md:p-8 relative z-10">
                <div className="flex items-center gap-2 mb-6 border-b border-[#F5ECD5] pb-4">
                  <Layers size={18} className="text-[#578E7E]" />
                  <span className="text-sm font-bold text-[#3D3D3D]">Core Sourcing Categories</span>
                </div>

                {/* Sourcing capabilities grid */}
                <div className="grid gap-4">
                  {coreCapabilities.map((cap, idx) => (
                    <Link
                      key={cap.name}
                      to={`/products?category=${encodeURIComponent(
                        cap.name === 'Lubricants & Oils' ? 'Lubricants, Oils, & Greases' :
                        cap.name === 'Cleaners & Chemicals' ? 'Cleaners & NDT Chemicals' : cap.name
                      )}`}
                      className="group flex items-center justify-between p-3.5 rounded-sm border border-[#F5ECD5]/60 bg-[#FFFAEC]/10 hover:bg-[#FFFAEC]/40 hover:border-[#578E7E]/30 transition-all duration-200"
                    >
                      <div>
                        <div className="text-sm font-bold text-[#3D3D3D] group-hover:text-[#578E7E] transition-colors">
                          {cap.name}
                        </div>
                        <div className="text-xs text-[#8a8a8a] mt-0.5">{cap.desc}</div>
                      </div>
                      <div className="w-7 h-7 rounded-full bg-[#F5ECD5] flex items-center justify-center text-[#578E7E] group-hover:bg-[#578E7E] group-hover:text-white transition-all duration-200">
                        <ArrowRight size={12} />
                      </div>
                    </Link>
                  ))}
                </div>

                {/* Bottom link */}
                <div className="mt-6 text-center">
                  <Link
                    to="/products"
                    className="text-xs font-bold text-[#578E7E] hover:text-[#3a6b5e] transition-colors flex items-center justify-center gap-1.5"
                  >
                    View All Sourcing Categories <ArrowRight size={12} />
                  </Link>
                </div>
              </div>

              {/* Decorative borders */}
              <div className="absolute -top-4 -right-4 w-24 h-24 border-2 border-teal-900/20 rounded-sm z-0" />
              <div className="absolute -bottom-4 -left-4 w-32 h-32 bg-[#ded3b6]/50 rounded-sm z-0" />
            </div>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 animate-bounce">
        <div className="w-px h-8 bg-[#578E7E]/40" />
        <div className="w-1.5 h-1.5 rounded-full bg-[#578E7E]/60" />
      </div>
    </section>
  );
};

export default Hero;

