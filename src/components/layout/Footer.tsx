import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Phone, Mail, ArrowRight } from 'lucide-react';

const Footer: React.FC = () => {
  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    if (href.startsWith('/#')) {
      e.preventDefault();
      const id = href.replace('/#', '');
      const el = document.getElementById(id);
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <footer className="bg-[#3D3D3D] text-[#F5ECD5]">
      {/* Main Footer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-12">
          {/* Brand */}
          <div className="lg:col-span-1">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-9 h-9 bg-[#578E7E] rounded-sm flex items-center justify-center">
                <span className="text-[#FFFAEC] font-bold text-sm">PS</span>
              </div>
              <div>
                <div className="font-bold text-[#FFFAEC] text-base">ProSource</div>
                <div className="text-[0.65rem] text-[#578E7E] tracking-widest uppercase">Enterprise</div>
              </div>
            </div>
            <p className="text-sm text-[#b0a898] leading-relaxed mb-5">
              Trusted B2B procurement partner for large enterprises and MNCs. We source, manage, and deliver at scale.
            </p>
            <div className="flex gap-3">
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 rounded-sm bg-[#4a4a4a] hover:bg-[#578E7E] flex items-center justify-center transition-colors"
                aria-label="LinkedIn"
              >
                <span className="text-xs font-bold">in</span>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-sm font-semibold text-[#FFFAEC] tracking-wider uppercase mb-5">
              Quick Links
            </h3>
            <ul className="space-y-2.5">
              {[
                { label: 'About Us', href: '/#about' },
                { label: 'Our Services', href: '/#services' },
                { label: 'Product Showcase', href: '/#products' },
                { label: 'Our Process', href: '/#process' },
                { label: 'Why Choose Us', href: '/#why-us' },
                { label: 'Certifications', href: '/#certifications' },
              ].map(link => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    onClick={(e) => handleNavClick(e, link.href)}
                    className="flex items-center gap-2 text-sm text-[#b0a898] hover:text-[#578E7E] transition-colors group"
                  >
                    <ArrowRight size={12} className="group-hover:translate-x-1 transition-transform" />
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h3 className="text-sm font-semibold text-[#FFFAEC] tracking-wider uppercase mb-5">
              Our Services
            </h3>
            <ul className="space-y-2.5">
              {[
                'Product Sourcing',
                'Bulk Procurement',
                'Vendor Management',
                'Custom Requirements',
                'Supply Chain Consulting',
                'Contract Management',
              ].map(service => (
                <li key={service}>
                  <span className="flex items-center gap-2 text-sm text-[#b0a898]">
                    <span className="w-1 h-1 rounded-full bg-[#578E7E] inline-block flex-shrink-0" />
                    {service}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-sm font-semibold text-[#FFFAEC] tracking-wider uppercase mb-5">
              Contact Us
            </h3>
            <ul className="space-y-4">
              <li className="flex gap-3">
                <MapPin size={15} className="text-[#578E7E] flex-shrink-0 mt-0.5" />
                <span className="text-sm text-[#b0a898] leading-relaxed">
                  12th Floor, Tower B, DLF Cyber City,<br />
                  Gurugram, Haryana – 122002
                </span>
              </li>
              <li>
                <a
                  href="tel:+911140001000"
                  className="flex items-center gap-3 text-sm text-[#b0a898] hover:text-[#578E7E] transition-colors"
                >
                  <Phone size={15} className="text-[#578E7E] flex-shrink-0" />
                  +91 114 000 1000
                </a>
              </li>
              <li>
                <a
                  href="mailto:procurement@prosource.com"
                  className="flex items-center gap-3 text-sm text-[#b0a898] hover:text-[#578E7E] transition-colors"
                >
                  <Mail size={15} className="text-[#578E7E] flex-shrink-0" />
                  procurement@prosource.com
                </a>
              </li>
            </ul>

            {/* Certifications Mini */}
            <div className="mt-6 pt-6 border-t border-[#4a4a4a]">
              <p className="text-xs text-[#7a7a7a] uppercase tracking-wider mb-3">Registered & Certified</p>
              <div className="flex flex-wrap gap-2">
                {['GST', 'MSME', 'ISO 9001', 'Udyam'].map(cert => (
                  <span
                    key={cert}
                    className="text-xs px-2 py-1 rounded-sm border border-[#4a4a4a] text-[#8a8a8a] bg-[#3a3a3a]"
                  >
                    {cert}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-[#4a4a4a]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-[#7a7a7a]">
            © {new Date().getFullYear()} ProSource Enterprise Pvt. Ltd. All rights reserved.
          </p>
          <div className="flex items-center gap-4">
            <span className="text-xs text-[#7a7a7a]">Privacy Policy</span>
            <span className="text-[#4a4a4a]">|</span>
            <span className="text-xs text-[#7a7a7a]">Terms of Service</span>
            <span className="text-[#4a4a4a]">|</span>
            <Link to="/admin" className="text-xs text-[#7a7a7a] hover:text-[#578E7E] transition-colors">
              Admin
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
