import React from 'react';
import { useInView } from 'react-intersection-observer';
import { Award, BadgeCheck, FileCheck2, Building } from 'lucide-react';
import SectionHeader from '../ui/SectionHeader';
import { cn } from '../../utils/cn';
import { useAdmin } from '../../context/AdminContext';

const certIcons: Record<string, React.ComponentType<{ size?: number; className?: string }>> = {
  'GST Registered': Building,
  'MSME Certified': BadgeCheck,
  'ISO 9001:2015': Award,
  'Udyam Registration': FileCheck2,
};

const Certifications: React.FC = () => {
  const { certifications } = useAdmin();
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.1 });

  return (
    <section id="certifications" className="section-pad bg-[#3D3D3D] text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeader
          label="Registrations & Certifications"
          title="Compliant. Certified. Trustworthy."
          subtitle="All our operations are backed by government registrations and international certifications — giving you complete peace of mind."
          className="mb-14"
          titleClassName="text-white"
        />

        <div ref={ref} className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {certifications.map((cert, i) => {
            const Icon = certIcons[cert.title] || Award;
            return (
              <div
                key={cert.id}
                className={cn(
                  'group relative bg-[#4a4a4a] border border-[#5a5a5a] rounded-sm p-7 text-center',
                  'hover:border-[#578E7E] hover:bg-[#454545] transition-all duration-300',
                  'transition-all duration-500',
                  inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
                )}
                style={{ transitionDelay: `${i * 80}ms` }}
              >
                {/* Cert image or icon */}
                {cert.imageUrl ? (
                  <div className="w-16 h-16 mx-auto mb-4 rounded-sm overflow-hidden bg-white/10">
                    <img
                      src={cert.imageUrl}
                      alt={cert.title}
                      className="w-full h-full object-contain p-2"
                    />
                  </div>
                ) : (
                  <div className="w-14 h-14 mx-auto mb-4 rounded-sm bg-[#578E7E]/20 flex items-center justify-center group-hover:bg-[#578E7E]/30 transition-colors">
                    <Icon size={24} className="text-[#578E7E]" />
                  </div>
                )}

                <h3 className="font-bold text-white text-base mb-1.5">{cert.title}</h3>

                {cert.issuer && (
                  <p className="text-xs text-[#9a9a9a] mb-1">{cert.issuer}</p>
                )}
                {cert.year && (
                  <span className="inline-block text-xs px-2.5 py-1 rounded-sm bg-[#578E7E]/20 text-[#578E7E] font-medium">
                    Since {cert.year}
                  </span>
                )}

                {/* Verified indicator */}
                <div className="absolute top-4 right-4">
                  <div className="w-5 h-5 rounded-full bg-[#578E7E]/20 flex items-center justify-center">
                    <BadgeCheck size={12} className="text-[#578E7E]" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Trust note */}
        <div className="mt-10 text-center">
          <p className="text-sm text-[#7a7a7a]">
            All registrations and certifications are valid and up to date.{' '}
            <button className="text-[#578E7E] hover:text-[#6aab99] transition-colors underline">
              Download company profile
            </button>
            {' '}for full documentation.
          </p>
        </div>
      </div>
    </section>
  );
};

export default Certifications;
