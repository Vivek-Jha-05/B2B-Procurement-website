import React from 'react';
import { useInView } from 'react-intersection-observer';
import {
  Search, Package, Users, Settings, BarChart3, FileCheck
} from 'lucide-react';
import SectionHeader from '../ui/SectionHeader';
import { cn } from '../../utils/cn';

const services = [
  {
    icon: Search,
    title: 'Product Sourcing',
    desc: 'We identify and qualify the best suppliers for any product category — from industrial goods to office consumables. Our sourcing team runs competitive RFQs and ensures quality benchmarks are met.',
    tags: ['Market Research', 'Supplier Qualification', 'RFQ Management'],
  },
  {
    icon: Package,
    title: 'Bulk Procurement',
    desc: 'Handle high-volume purchase orders with our established vendor network. We negotiate pricing, manage lead times, and consolidate deliveries across multiple locations.',
    tags: ['Volume Pricing', 'Multi-location', 'Consolidated Delivery'],
  },
  {
    icon: Users,
    title: 'Vendor Management',
    desc: 'End-to-end vendor lifecycle management — from onboarding and compliance verification to performance tracking and contract renewals.',
    tags: ['Compliance Checks', 'Performance SLAs', 'Contract Management'],
  },
  {
    icon: Settings,
    title: 'Custom Requirements',
    desc: 'Specialized procurement for unique or category-specific requirements. Our team builds bespoke sourcing strategies aligned to your operational and budgetary goals.',
    tags: ['Bespoke Sourcing', 'Category Strategy', 'Spec Compliance'],
  },
  {
    icon: BarChart3,
    title: 'Supply Chain Consulting',
    desc: 'Strategic advisory on procurement optimization, cost reduction, and supply chain resilience. We analyze your spending and identify consolidation opportunities.',
    tags: ['Spend Analysis', 'Cost Reduction', 'Process Optimization'],
  },
  {
    icon: FileCheck,
    title: 'Compliance & Reporting',
    desc: 'Full documentation support — GSTINs, compliance certificates, delivery challans, and audit-ready procurement records maintained for every transaction.',
    tags: ['GST Documentation', 'Audit Trails', 'MIS Reports'],
  },
];

const Services: React.FC = () => {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.05 });

  return (
    <section id="services" className="section-pad bg-[#FFFAEC]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div
          className={cn(
            'transition-all duration-600',
            inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
          )}
        >
          <SectionHeader
            label="What We Do"
            title="Comprehensive Procurement Services"
            subtitle="From single-category sourcing to enterprise-wide procurement management, we bring the expertise and infrastructure to handle it all."
            className="mb-14"
          />
        </div>

        <div ref={ref} className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map(({ icon: Icon, title, desc, tags }, i) => (
            <div
              key={title}
              className={cn(
                'group bg-white rounded-sm border border-[#F5ECD5] p-7 hover:border-[#578E7E]/30 hover:shadow-lg transition-all duration-300 card-hover',
                'transition-all duration-500',
                inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
              )}
              style={{ transitionDelay: `${i * 80}ms` }}
            >
              {/* Icon */}
              <div className="w-12 h-12 rounded-sm bg-[#578E7E]/10 flex items-center justify-center mb-5 group-hover:bg-[#578E7E] transition-colors duration-300">
                <Icon size={20} className="text-[#578E7E] group-hover:text-white transition-colors duration-300" />
              </div>

              {/* Content */}
              <h3 className="font-bold text-[#3D3D3D] text-lg mb-3">{title}</h3>
              <p className="text-sm text-[#5a5a5a] leading-relaxed mb-5">{desc}</p>

              {/* Tags */}
              <div className="flex flex-wrap gap-2">
                {tags.map(tag => (
                  <span
                    key={tag}
                    className="text-xs px-2.5 py-1 rounded-sm bg-[#F5ECD5] text-[#578E7E] font-medium"
                  >
                    {tag}
                  </span>
                ))}
              </div>

              {/* Hover line */}
              <div className="mt-5 h-0.5 w-0 bg-[#578E7E] group-hover:w-full transition-all duration-300" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Services;
