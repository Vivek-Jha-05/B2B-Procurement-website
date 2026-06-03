import React from 'react';
import { useInView } from 'react-intersection-observer';
import {
  ShieldCheck, Clock, BadgeDollarSign, Network, ThumbsUp, Headphones
} from 'lucide-react';
import SectionHeader from '../ui/SectionHeader';
import { cn } from '../../utils/cn';

const reasons = [
  {
    icon: ShieldCheck,
    title: 'Verified Quality',
    desc: 'Every vendor is rigorously vetted. Products are inspected against your specifications before dispatch. Zero compromise on quality.',
  },
  {
    icon: Clock,
    title: 'Reliable Delivery',
    desc: '98.5% on-time delivery rate across all categories. Real-time tracking and proactive communication at every stage.',
  },
  {
    icon: BadgeDollarSign,
    title: 'Competitive Pricing',
    desc: 'Bulk purchasing power and strategic vendor partnerships allow us to consistently deliver 15–25% cost savings vs. direct sourcing.',
  },
  {
    icon: Network,
    title: 'Extensive Network',
    desc: '1,000+ pre-qualified vendors across India. We have the depth to source niche products and the scale to handle massive volumes.',
  },
  {
    icon: ThumbsUp,
    title: 'Compliance Ready',
    desc: 'GST-compliant invoicing, MSME-certified operations, and audit-ready documentation for every transaction. No regulatory surprises.',
  },
  {
    icon: Headphones,
    title: 'Dedicated Support',
    desc: 'A named account manager, not a ticket queue. Your procurement queries are addressed within 4 business hours, always.',
  },
];

const WhyUs: React.FC = () => {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.05 });

  return (
    <section id="why-us" className="section-pad bg-[#FFFAEC]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeader
          label="Why ProSource"
          title="The Enterprise Procurement Advantage"
          subtitle="We understand what enterprise procurement teams need: reliability, transparency, and a partner who performs consistently at scale."
          className="mb-14"
        />

        <div ref={ref} className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {reasons.map(({ icon: Icon, title, desc }, i) => (
            <div
              key={title}
              className={cn(
                'group relative p-7 rounded-sm border border-[#F5ECD5] bg-white',
                'hover:shadow-md transition-all duration-300',
                'transition-all duration-500',
                inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
              )}
              style={{ transitionDelay: `${i * 80}ms` }}
            >
              {/* Number */}
              <div className="absolute top-5 right-5 text-4xl font-bold text-[#578E7E]/8 select-none"
                style={{ fontFamily: 'Playfair Display, serif' }}>
                {String(i + 1).padStart(2, '0')}
              </div>

              {/* Icon */}
              <div className="w-11 h-11 rounded-sm bg-[#578E7E]/10 flex items-center justify-center mb-5 group-hover:bg-[#578E7E] transition-colors duration-300">
                <Icon size={20} className="text-[#578E7E] group-hover:text-white transition-colors duration-300" />
              </div>

              <h3 className="font-bold text-[#3D3D3D] text-base mb-3">{title}</h3>
              <p className="text-sm text-[#5a5a5a] leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>

        {/* CTA Banner */}
        <div className="mt-14">
          <div
            className="rounded-sm p-8 md:p-12 text-center relative overflow-hidden"
            style={{ background: 'linear-gradient(135deg, #578E7E 0%, #3a6b5e 100%)' }}
          >
            {/* Background pattern */}
            <div className="absolute inset-0 opacity-5">
              <svg width="100%" height="100%">
                <defs>
                  <pattern id="dots" width="20" height="20" patternUnits="userSpaceOnUse">
                    <circle cx="2" cy="2" r="1.5" fill="white" />
                  </pattern>
                </defs>
                <rect width="100%" height="100%" fill="url(#dots)" />
              </svg>
            </div>
            <div className="relative z-10">
              <h3
                className="text-2xl md:text-3xl font-bold text-white mb-4"
                style={{ fontFamily: 'Playfair Display, serif' }}
              >
                Ready to Optimize Your Procurement?
              </h3>
              <p className="text-[#c8dfd9] text-base mb-7 max-w-xl mx-auto">
                Let's discuss your procurement needs. Our team will prepare a customized sourcing strategy within 48 hours.
              </p>
              <button
                onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
                className="inline-flex items-center gap-2 px-8 py-3.5 bg-[#FFFAEC] text-[#578E7E] font-semibold rounded-sm hover:bg-white transition-colors shadow-md text-sm"
              >
                Request a Quote Today
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default WhyUs;
