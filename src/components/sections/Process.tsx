import React from 'react';
import { useInView } from 'react-intersection-observer';
import {
  ClipboardList, SearchCheck, FileSignature, Truck
} from 'lucide-react';
import SectionHeader from '../ui/SectionHeader';
import { cn } from '../../utils/cn';

const steps = [
  {
    step: '01',
    icon: ClipboardList,
    title: 'Requirement Submission',
    desc: 'Share your product specifications, quantity, delivery timeline, and budget. Our team acknowledges within 4 business hours.',
    detail: 'Use our quote form, email, or schedule a call with your dedicated account manager.',
  },
  {
    step: '02',
    icon: SearchCheck,
    title: 'Sourcing & Quotation',
    desc: 'We run competitive RFQs across our vendor network, verify quality compliance, and prepare a detailed quotation for your review.',
    detail: 'Comparative price analysis from 3+ qualified vendors. Best value guaranteed.',
  },
  {
    step: '03',
    icon: FileSignature,
    title: 'Approval & PO Issuance',
    desc: 'You review and approve the quotation. A formal Purchase Order is raised, vendor is confirmed, and production or fulfilment begins.',
    detail: 'Digital PO processing with full audit trail and compliance documentation.',
  },
  {
    step: '04',
    icon: Truck,
    title: 'Delivery & Closure',
    desc: 'Products are quality-checked, packed, and dispatched. We track delivery to your facility and follow up for closure confirmation.',
    detail: 'Real-time delivery tracking. Post-delivery QC sign-off and invoice submission.',
  },
];

const Process: React.FC = () => {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.05 });

  return (
    <section id="process" className="section-pad bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeader
          label="How We Work"
          title="A Seamless Procurement Process"
          subtitle="Four clear steps from requirement to delivery. No ambiguity, no delays, no surprises."
          className="mb-14"
        />

        {/* ── Step grid ── */}
        <div ref={ref} className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 relative">

          {/* Connecting line across the top — desktop only */}
          <div className="hidden lg:block absolute top-7 left-[12.5%] right-[12.5%] h-px bg-[#E0D8C8] z-0" />

          {steps.map(({ step, icon: Icon, title, desc, detail }, i) => (
            <div
              key={step}
              className={cn(
                'flex flex-col transition-all duration-500',
                inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
              )}
              style={{ transitionDelay: `${i * 120}ms` }}
            >
              {/* Step icon — centred above the card */}
              <div className="flex justify-center mb-5 relative z-10">
                <div className="relative">
                  <div className="w-14 h-14 rounded-full bg-[#578E7E] flex items-center justify-center shadow-lg shadow-[#578E7E]/20">
                    <Icon size={22} className="text-white" />
                  </div>
                  {/* Step number badge */}
                  <div className="absolute -top-1.5 -right-1.5 w-6 h-6 rounded-full bg-white border-2 border-[#578E7E] flex items-center justify-center">
                    <span className="text-[0.55rem] font-bold text-[#578E7E] leading-none">{step}</span>
                  </div>
                </div>
              </div>

              {/* Card */}
              <div className="flex-1 bg-[#FFFAEC] rounded-sm border border-[#F5ECD5] p-5 hover:shadow-md hover:border-[#578E7E]/20 transition-all duration-250">
                <h3 className="font-bold text-[#3D3D3D] text-base mb-2">{title}</h3>
                <p className="text-sm text-[#5a5a5a] leading-relaxed mb-3">{desc}</p>
                <p className="text-xs text-[#578E7E] font-medium border-t border-[#F5ECD5] pt-3">{detail}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Timeline stats */}
        <div className="mt-12 grid sm:grid-cols-3 gap-4">
          {[
            { label: 'Quote Turnaround', value: '24–48 Hours', desc: 'From requirement to quotation' },
            { label: 'Standard Lead Time', value: '5–10 Days', desc: 'For stocked categories' },
            { label: 'Custom Orders', value: '15–30 Days', desc: 'Depending on complexity' },
          ].map(item => (
            <div
              key={item.label}
              className="text-center p-5 bg-[#F5ECD5] rounded-sm border border-[#e0d8c8]"
            >
              <div className="text-xs text-[#8a8a8a] uppercase tracking-wider mb-1">{item.label}</div>
              <div
                className="text-2xl font-bold text-[#578E7E] mb-1"
                style={{ fontFamily: 'Playfair Display, serif' }}
              >
                {item.value}
              </div>
              <div className="text-xs text-[#7a7a7a]">{item.desc}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Process;
