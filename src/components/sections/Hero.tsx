import React, { useEffect, useState } from 'react';
import { ArrowRight, ShieldCheck, Award, Users } from 'lucide-react';
import Button from '../ui/Button';

const trustBadges = [
  { icon: ShieldCheck, text: 'ISO 9001:2015 Certified' },
  { icon: Award, text: 'MSME Registered' },
  { icon: Users, text: '200+ Enterprise Clients' },
];

const clientNames = ['Tata Group', 'Infosys', 'Wipro', 'L&T', 'Mahindra', 'HCL', 'Reliance'];

const Hero: React.FC = () => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);

  const scrollToContact = () => {
    document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
  };
  const scrollToAbout = () => {
    document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' });
  };

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
            <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#3D3D3D" strokeWidth="1" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
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
                Enterprise Procurement Partner
              </span>
            </div>

            {/* Headline */}
            <h1
              className="text-4xl sm:text-5xl lg:text-6xl font-bold text-[#3D3D3D] leading-[1.1] mb-6"
              style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
            >
              Procurement at Scale,{' '}
              <span className="text-[#578E7E] relative">
                Delivered with Precision
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
            <p className="text-lg text-[#5a5a5a] leading-relaxed mb-8 max-w-xl">
              We partner with large enterprises and MNCs to streamline sourcing, manage vendors, 
              and deliver bulk procurement solutions — reliably, on time, and at competitive pricing.
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-4 mb-10">
              <Button
                variant="primary"
                size="lg"
                onClick={scrollToContact}
                className="group"
              >
                Request a Quote
                <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
              </Button>
              <Button
                variant="outline"
                size="lg"
                onClick={scrollToAbout}
              >
                Learn More
              </Button>
            </div>

            {/* Trust Badges */}
            <div className="flex flex-wrap gap-4">
              {trustBadges.map(({ icon: Icon, text }) => (
                <div key={text} className="flex items-center gap-2 text-sm text-[#5a5a5a]">
                  <Icon size={15} className="text-[#578E7E]" />
                  <span>{text}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Right Content — Stats & Visual Card */}
          <div
            className={`transition-all duration-700 delay-200 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
          >
            <div className="relative">
              {/* Main card */}
              <div className="bg-white rounded-sm shadow-xl border border-[#F5ECD5] p-8 relative z-10">
                <div className="flex items-center gap-2 mb-6">
                  <div className="w-2 h-2 rounded-full bg-green-400" />
                  <span className="text-xs text-[#8a8a8a] font-medium">Live Operations Dashboard</span>
                </div>

                {/* Stats grid */}
                <div className="grid grid-cols-2 gap-6 mb-8">
                  {[
                    { value: '12+', label: 'Years of Experience', desc: 'In enterprise procurement' },
                    { value: '200+', label: 'Enterprise Clients', desc: 'MNCs & large corporates' },
                    { value: '₹500Cr+', label: 'Procurement Handled', desc: 'Annual transaction volume' },
                    { value: '98.5%', label: 'On-Time Delivery', desc: 'Across all categories' },
                  ].map(stat => (
                    <div key={stat.label} className="group">
                      <div
                        className="text-3xl font-bold text-[#578E7E] mb-1"
                        style={{ fontFamily: "'Playfair Display', serif" }}
                      >
                        {stat.value}
                      </div>
                      <div className="text-sm font-semibold text-[#3D3D3D] mb-0.5">{stat.label}</div>
                      <div className="text-xs text-[#8a8a8a]">{stat.desc}</div>
                    </div>
                  ))}
                </div>

                {/* Client logos bar */}
                <div className="border-t border-[#F5ECD5] pt-5">
                  <p className="text-xs text-[#8a8a8a] uppercase tracking-wider mb-3">Trusted by leading enterprises</p>
                  <div className="flex flex-wrap gap-2">
                    {clientNames.map(name => (
                      <span
                        key={name}
                        className="px-3 py-1.5 bg-[#F5ECD5] text-[#5a5a5a] text-xs font-medium rounded-sm"
                      >
                        {name}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Decorative elements */}
              <div className="absolute -top-4 -right-4 w-24 h-24 border-2 border-teal-900/20 rounded-sm z-0" />
              <div className="absolute -bottom-4 -left-4 w-32 h-32 bg-[#ded3b6] rounded-sm z-0" />

              {/* Floating badge */}
              {/* <div className="absolute -translate-y-1/2 bg-[#578E7E] text-[#FFFAEC] px-3 py-2 rounded-sm shadow-lg z-20 hidden md:block">
                <div className="text-xs font-bold">PAN India</div>
                <div className="text-[0.6rem] opacity-80">Coverage</div>
              </div> */}
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
