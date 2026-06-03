import React from 'react';
import { useInView } from 'react-intersection-observer';
import { CheckCircle2, Building2, TrendingUp, Globe } from 'lucide-react';
import SectionHeader from '../ui/SectionHeader';
import { cn } from '../../utils/cn';

const highlights = [
  'Pan-India sourcing network with 1,000+ verified vendors',
  'Dedicated account manager for every enterprise client',
  'Transparent pricing with no hidden procurement fees',
  'End-to-end supply chain visibility and reporting',
  'Compliance with ISO, GST, and government procurement norms',
  'Custom SLAs tailored to enterprise-specific requirements',
];

const pillars = [
  {
    icon: Building2,
    title: 'Enterprise Focus',
    desc: 'Built exclusively to serve MNCs, PSUs, and large corporates with complex procurement needs.',
  },
  {
    icon: TrendingUp,
    title: 'Scale & Efficiency',
    desc: 'Leveraging economies of scale to deliver better pricing and faster turnaround at volume.',
  },
  {
    icon: Globe,
    title: 'Pan-India Reach',
    desc: 'Sourcing and delivery infrastructure spanning 28 states and all major industrial hubs.',
  },
];

const About: React.FC = () => {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.1 });

  return (
    <section id="about" className="section-pad bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div ref={ref} className="grid lg:grid-cols-2 gap-14 lg:gap-20 items-center">
          {/* Left — Text content */}
          <div
            className={cn(
              'transition-all duration-700',
              inView ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-8'
            )}
          >
            <SectionHeader
              label="About ProSource"
              title="A Procurement Partner Built for Enterprise Scale"
              align="left"
              className="mb-8"
            />

            <p className="text-[#5a5a5a] leading-relaxed mb-5 text-base">
              ProSource Enterprise was founded in 2012 with a singular mission: to eliminate procurement 
              inefficiencies for India's largest organizations. Over the past 12+ years, we have grown into 
              a full-spectrum procurement partner trusted by MNCs, PSUs, and fast-scaling corporates.
            </p>
            <p className="text-[#5a5a5a] leading-relaxed mb-8 text-base">
              We are not a marketplace or a trading platform. We are a <strong className="text-[#3D3D3D]">strategic 
              procurement arm</strong> — sourcing products across categories, managing vendor relationships, 
              and ensuring last-mile delivery with uncompromising quality control.
            </p>

            {/* Highlights */}
            <ul className="space-y-3 mb-8">
              {highlights.map(h => (
                <li key={h} className="flex items-start gap-3">
                  <CheckCircle2 size={16} className="text-[#578E7E] flex-shrink-0 mt-0.5" />
                  <span className="text-sm text-[#5a5a5a]">{h}</span>
                </li>
              ))}
            </ul>

            {/* Founding year badge */}
            <div className="inline-flex items-center gap-3 px-5 py-3 bg-[#F5ECD5] rounded-sm border border-[#e0d8c8]">
              <span className="text-2xl font-bold text-[#578E7E]" style={{ fontFamily: 'Playfair Display, serif' }}>2012</span>
              <div>
                <div className="text-sm font-semibold text-[#3D3D3D]">Founded</div>
                <div className="text-xs text-[#8a8a8a]">12+ years of enterprise trust</div>
              </div>
            </div>
          </div>

          {/* Right — Visual pillars */}
          <div
            className={cn(
              'transition-all duration-700 delay-200',
              inView ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-8'
            )}
          >
            <div className="space-y-5">
              {pillars.map(({ icon: Icon, title, desc }) => (
                <div
                  key={title}
                  className="flex gap-5 p-6 bg-[#FFFAEC] rounded-sm border border-[#F5ECD5] group hover:border-[#578E7E]/30 hover:shadow-md transition-all duration-250"
                >
                  <div className="w-12 h-12 rounded-sm bg-[#578E7E]/10 flex items-center justify-center flex-shrink-0 group-hover:bg-[#578E7E] transition-colors duration-250">
                    <Icon size={20} className="text-[#578E7E] group-hover:text-white transition-colors duration-250" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-[#3D3D3D] mb-1.5">{title}</h3>
                    <p className="text-sm text-[#5a5a5a] leading-relaxed">{desc}</p>
                  </div>
                </div>
              ))}

              {/* Stats row */}
              <div className="grid grid-cols-3 gap-4 mt-6">
                {[
                  { val: '50+', label: 'Categories' },
                  { val: '1000+', label: 'Vendors' },
                  { val: '28', label: 'States' },
                ].map(s => (
                  <div key={s.label} className="text-center p-4 bg-[#578E7E] rounded-sm text-white">
                    <div className="text-2xl font-bold mb-1" style={{ fontFamily: 'Playfair Display, serif' }}>{s.val}</div>
                    <div className="text-xs opacity-80">{s.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
