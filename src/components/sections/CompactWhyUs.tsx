import React, { useState, useEffect, useRef } from 'react';
import { ShieldCheck, Package, Truck, Headphones } from 'lucide-react';

const advantages = [
  {
    icon: ShieldCheck,
    title: 'Verified Vendors',
    desc: 'Pre-qualified global manufacturers and certified suppliers.',
  },
  {
    icon: Package,
    title: 'Bulk Sourcing',
    desc: 'High-volume procurement with customized contract pricing.',
  },
  {
    icon: Truck,
    title: 'Fast Delivery',
    desc: 'Pan-India logistics networks with real-time transit tracking.',
  },
  {
    icon: Headphones,
    title: 'Dedicated Support',
    desc: 'Direct account managers with 4-hour SLA response times.',
  },
];

const CompactWhyUs: React.FC = () => {
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
      { threshold: 0.1 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <section ref={ref} className="py-12 bg-[#FFFAEC]/50 border-t border-[#F5ECD5]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {advantages.map((item, index) => {
            const Icon = item.icon;
            return (
              <div
                key={item.title}
                className={`flex items-start gap-3 transition-all duration-750 ${
                  inView
                    ? 'opacity-100 translate-y-0'
                    : 'opacity-0 translate-y-4'
                }`}
                style={{ transitionDelay: `${index * 100}ms` }}
              >
                <div className="flex-shrink-0 p-2 bg-[#578E7E]/10 rounded-sm text-[#578E7E]">
                  <Icon size={20} />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-[#3D3D3D] flex items-center gap-1.5 mb-1">
                    <span className="text-[#578E7E]">✓</span> {item.title}
                  </h3>
                  <p className="text-xs text-[#8a8a8a] leading-relaxed">{item.desc}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default CompactWhyUs;
