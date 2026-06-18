import React, { useState, useEffect } from 'react';
import { MessageCircle, ArrowUp, FileText } from 'lucide-react';
import { cn } from '../utils/cn';

const FloatingActions: React.FC = () => {
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    const handler = () => setShowScrollTop(window.scrollY > 400);
    window.addEventListener('scroll', handler, { passive: true });
    return () => window.removeEventListener('scroll', handler);
  }, []);

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });
  const scrollToContact = () => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });

  return (
    <div className="fixed bottom-6 right-5 z-40 flex flex-col gap-3 items-end">
      {/* WhatsApp */}
      <a
        href="https://wa.me/919911394456?text=Hi, I'd like to discuss a procurement requirement."
        target="_blank"
        rel="noopener noreferrer"
        className="group flex items-center gap-2 bg-[#25D366] text-white rounded-full shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-200 overflow-hidden"
        title="Chat on WhatsApp"
      >
        <div className="shrink-0 w-12 h-12 flex items-center justify-center">
          <MessageCircle size={20} />
        </div>
        <span className="-group-hover:hidden group-hover:pr-4 group-hover:text-sm group-hover:font-medium whitespace-nowrap max-w-0 group-hover:max-w-xs transition-all duration-300 overflow-hidden group-hover:opacity-100">
          WhatsApp Us
        </span>
      </a>

      {/* Sticky Quote Button */}
      <button
        onClick={scrollToContact}
        className="group flex items-center gap-2 bg-[#578E7E] text-white rounded-full shadow-lg hover:shadow-xl hover:bg-[#3a6b5e] hover:scale-105 transition-all duration-200 overflow-hidden"
        title="Request a Quote"
      >
        <div className="flex-shrink-0 w-12 h-12 flex items-center justify-center">
          <FileText size={20} />
        </div>
        <span className="group-hover:pr-4 text-sm font-medium whitespace-nowrap max-w-0 group-hover:max-w-xs transition-all duration-300 overflow-hidden opacity-0 group-hover:opacity-100">
          Get a Quote
        </span>
      </button>

      {/* Scroll to top */}
      <button
        onClick={scrollToTop}
        className={cn(
          'w-10 h-10 rounded-full bg-[#3D3D3D] text-white shadow-lg hover:bg-[#2a2a2a] hover:scale-105 transition-all duration-200 flex items-center justify-center',
          showScrollTop ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'
        )}
        title="Scroll to top"
        aria-label="Scroll to top"
      >
        <ArrowUp size={16} />
      </button>
    </div>
  );
};

export default FloatingActions;
