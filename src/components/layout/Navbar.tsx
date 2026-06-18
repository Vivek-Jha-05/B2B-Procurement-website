import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { cn } from '../../utils/cn';
import Button from '../ui/Button';
const navLinks = [
  { label: 'Home', href: '/' },
  { label: 'Products', href: '/products', isRoute: true },
  { label: 'Contact', href: '/contact', isRoute: true },
];

const Navbar: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const isAdminPage = location.pathname.startsWith('/admin');

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
  }, [location]);

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string, isRoute?: boolean) => {
    if (isRoute) return; // Let React Router handle it
    if (href === '/') {
      e.preventDefault();
      if (location.pathname !== '/') navigate('/');
      else window.scrollTo({ top: 0, behavior: 'smooth' });
      setMobileOpen(false);
      return;
    }
    if (href.startsWith('/#')) {
      e.preventDefault();
      const id = href.replace('/#', '');
      if (location.pathname !== '/') {
        navigate('/');
        setTimeout(() => {
          document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 300);
      } else {
        document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
      setMobileOpen(false);
    }
  };

  const isHomePage = location.pathname === '/';

  if (isAdminPage) return null;

  return (
    <header
      className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
        !isHomePage || isScrolled
          ? 'bg-[#FFFAEC]/97 backdrop-blur-md shadow-sm border-b border-[#F5ECD5]'
          : 'bg-transparent'
      )}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-9 h-9 bg-[#578E7E] rounded-sm flex items-center justify-center group-hover:bg-[#3a6b5e] transition-colors">
              <span className="text-[#FFFAEC] font-bold text-sm tracking-tight">PS</span>
            </div>
            <div className="flex flex-col leading-none">
              <span className="font-bold text-[#3D3D3D] text-base tracking-tight">APR Services</span>
              <span className="text-[0.65rem] text-[#578E7E] tracking-[0.12em] uppercase font-medium">Enterprise</span>
            </div>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-1">
            {navLinks.map(link =>
              link.isRoute ? (
                <Link
                  key={link.label}
                  to={link.href}
                  className={cn(
                    'px-4 py-2 text-sm font-medium rounded-sm transition-all duration-200 animated-underline',
                    location.pathname === link.href
                      ? 'text-[#578E7E] bg-[#F5ECD5]'
                      : 'text-[#5a5a5a] hover:text-[#578E7E] hover:bg-[#F5ECD5]'
                  )}
                >
                  {link.label}
                </Link>
              ) : (
                <a
                  key={link.label}
                  href={link.href}
                  onClick={e => handleNavClick(e, link.href, link.isRoute)}
                  className="px-4 py-2 text-sm font-medium text-[#5a5a5a] hover:text-[#578E7E] rounded-sm hover:bg-[#F5ECD5] transition-all duration-200 animated-underline"
                >
                  {link.label}
                </a>
              )
            )}
          </nav>

          {/* CTA Buttons */}
          <div className="hidden lg:flex items-center gap-3">
            <Link to="/contact">
              <Button variant="primary" size="sm">
                Request Quote
              </Button>
            </Link>
          </div>

          {/* Mobile Toggle */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="lg:hidden p-2 rounded-sm text-[#3D3D3D] hover:bg-[#F5ECD5] transition-colors"
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        className={cn(
          'lg:hidden overflow-hidden transition-all duration-300',
          mobileOpen ? 'max-h-[400px] opacity-100' : 'max-h-0 opacity-0'
        )}
      >
        <div className="bg-[#FFFAEC] border-t border-[#F5ECD5] px-4 py-4 space-y-1">
          {navLinks.map(link =>
              link.isRoute ? (
                <Link
                  key={link.label}
                  to={link.href}
                  className="block px-4 py-2.5 text-sm font-medium text-[#5a5a5a] hover:text-[#578E7E] hover:bg-[#F5ECD5] rounded-sm transition-colors"
                  onClick={() => setMobileOpen(false)}
                >
                  {link.label}
                </Link>
              ) : (
                <a
                  key={link.label}
                  href={link.href}
                  onClick={e => handleNavClick(e, link.href, link.isRoute)}
                  className="block px-4 py-2.5 text-sm font-medium text-[#5a5a5a] hover:text-[#578E7E] hover:bg-[#F5ECD5] rounded-sm transition-colors"
                >
                  {link.label}
                </a>
              )
            )}
          <div className="pt-3 border-t border-[#F5ECD5]">
            <Link to="/contact" onClick={() => setMobileOpen(false)}>
              <Button variant="primary" size="sm" className="w-full">
                Request Quote
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
