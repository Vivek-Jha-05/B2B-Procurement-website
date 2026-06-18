import React, { useMemo, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Tag, Shield, CheckCircle, HelpCircle, Package, Send, Mail, Phone, ChevronRight } from 'lucide-react';
import { useAdmin } from '../context/AdminContext';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import Button from '../components/ui/Button';

const ProductDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { products, loadingProducts } = useAdmin();

  // Find current product
  const product = useMemo(() => products.find(p => p.id === id), [products, id]);

  // Find related products in the same category (excluding current)
  const relatedProducts = useMemo(() => {
    if (!product) return [];
    return products
      .filter(p => p.category === product.category && p.id !== product.id)
      .slice(0, 4);
  }, [products, product]);

  // SEO metadata & JSON-LD schema injection
  useEffect(() => {
    if (!product) return;

    // Set page title and meta description
    document.title = `${product.name} | B2B Procurement | ProSource Enterprise`;
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) {
      metaDesc.setAttribute(
        'content',
        `Source ${product.name} in bulk. ${product.description.slice(0, 150)}... Request a fast quotation today.`
      );
    }

    // JSON-LD schema
    const schema = {
      '@context': 'https://schema.org/',
      '@type': 'Product',
      'name': product.name,
      'image': product.imageUrl,
      'description': product.description,
      'category': product.category,
      'brand': {
        '@type': 'Brand',
        'name': 'ProSource Enterprise',
      },
      'offers': {
        '@type': 'AggregateOffer',
        'priceCurrency': 'INR',
        'offerCount': '1',
        'priceValued': 'Request Quote',
      },
    };

    const scriptId = 'product-jsonld';
    let script = document.getElementById(scriptId) as HTMLScriptElement;
    if (!script) {
      script = document.createElement('script');
      script.id = scriptId;
      script.type = 'application/ld+json';
      document.head.appendChild(script);
    }
    script.text = JSON.stringify(schema);

    return () => {
      const existingScript = document.getElementById(scriptId);
      if (existingScript) {
        existingScript.remove();
      }
    };
  }, [product]);

  if (loadingProducts) {
    return (
      <>
        <Navbar />
        <div className="bg-[#FFFAEC] min-h-screen flex items-center justify-center pt-20">
          <div className="w-8 h-8 border-2 border-[#578E7E] border-t-transparent rounded-full animate-spin" />
        </div>
        <Footer />
      </>
    );
  }

  if (!product) {
    return (
      <>
        <Navbar />
        <div className="bg-[#FFFAEC] min-h-screen pt-24 pb-16 flex flex-col items-center justify-center">
          <Tag size={48} className="text-[#578E7E]/30 mb-4" />
          <h2 className="text-2xl font-bold text-[#3D3D3D] mb-2 font-serif">Product Not Found</h2>
          <p className="text-[#8a8a8a] text-sm mb-6">The product you are looking for does not exist or has been removed.</p>
          <Link to="/products">
            <Button variant="primary" size="md">Back to Catalogue</Button>
          </Link>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />

      <div className="bg-[#FFFAEC] min-h-screen pt-24 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Breadcrumbs */}
          <nav className="flex items-center gap-2 text-xs text-[#8a8a8a] mb-6 overflow-x-auto whitespace-nowrap pb-2">
            <Link to="/" className="hover:text-[#578E7E] transition-colors">Home</Link>
            <ChevronRight size={10} />
            <Link to="/products" className="hover:text-[#578E7E] transition-colors">Products</Link>
            <ChevronRight size={10} />
            <Link to={`/products?category=${encodeURIComponent(product.category)}`} className="hover:text-[#578E7E] transition-colors">
              {product.category}
            </Link>
            <ChevronRight size={10} />
            <span className="text-[#3D3D3D] font-medium truncate">{product.name}</span>
          </nav>

          {/* Product Detail Grid */}
          <div className="grid lg:grid-cols-12 gap-8 lg:gap-12 bg-white border border-[#F5ECD5] rounded-xl p-5 md:p-8 shadow-sm mb-16">
            
            {/* Image Section - Left (5 cols) */}
            <div className="lg:col-span-5 flex flex-col">
              <div className="h-80 md:h-[400px] bg-[#F5ECD5] rounded-lg overflow-hidden border border-[#F5ECD5] relative">
                {product.imageUrl ? (
                  <img
                    src={product.imageUrl}
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <Tag size={64} className="text-[#578E7E]/15" />
                  </div>
                )}
                <div className="absolute top-3 left-3 bg-[#578E7E] text-white text-xs font-semibold px-3 py-1 rounded-full shadow-sm">
                  {product.category}
                </div>
              </div>
              
              {/* Trust Badges */}
              <div className="grid grid-cols-2 gap-3 mt-4">
                <div className="flex items-center gap-2 p-3 bg-[#FFFAEC]/40 rounded-lg border border-[#F5ECD5]">
                  <Shield size={16} className="text-[#578E7E]" />
                  <span className="text-xs font-semibold text-[#3D3D3D]">Verified OEM Grade</span>
                </div>
                <div className="flex items-center gap-2 p-3 bg-[#FFFAEC]/40 rounded-lg border border-[#F5ECD5]">
                  <Package size={16} className="text-[#578E7E]" />
                  <span className="text-xs font-semibold text-[#3D3D3D]">Bulk Sourcing only</span>
                </div>
              </div>
            </div>

            {/* Info Section - Right (7 cols) */}
            <div className="lg:col-span-7 flex flex-col justify-between">
              <div>
                <span className="text-xs font-semibold text-[#578E7E] tracking-widest uppercase mb-2 block">
                  Product Details
                </span>
                <h1 
                  className="text-2xl sm:text-3xl font-bold text-[#3D3D3D] mb-4 font-serif"
                  style={{ fontFamily: 'Playfair Display, Georgia, serif' }}
                >
                  {product.name}
                </h1>
                
                {/* Description */}
                <div className="border-t border-[#F5ECD5] pt-4 mb-6">
                  <h3 className="text-xs font-bold text-[#8a8a8a] uppercase tracking-wider mb-2">Description</h3>
                  <p className="text-[#5a5a5a] text-sm leading-relaxed whitespace-pre-line">
                    {product.description}
                  </p>
                </div>

                {/* Procurement Specifications Info */}
                <div className="bg-[#FFFAEC] border border-[#F5ECD5] rounded-lg p-4 mb-6">
                  <h3 className="text-xs font-bold text-[#578E7E] uppercase tracking-wider mb-3">Procurement Conditions</h3>
                  <ul className="space-y-2 text-xs text-[#5a5a5a]">
                    <li className="flex items-center gap-2">
                      <CheckCircle size={12} className="text-[#578E7E]" />
                      <span><strong>Minimum Order:</strong> Sourced in bulk packs / case lots only</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle size={12} className="text-[#578E7E]" />
                      <span><strong>Pricing:</strong> Custom pricing based on order volume & location</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle size={12} className="text-[#578E7E]" />
                      <span><strong>Compliance:</strong> Full COA (Certificate of Analysis) / OEM certification provided</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle size={12} className="text-[#578E7E]" />
                      <span><strong>Logistics:</strong> Pan-India shipping with regulatory compliance clearances</span>
                    </li>
                  </ul>
                </div>
              </div>

              {/* CTAs */}
              <div className="flex flex-col sm:flex-row gap-4 pt-4 border-t border-[#F5ECD5]">
                <Link to={`/contact?product=${encodeURIComponent(product.name)}`} className="flex-1">
                  <Button variant="primary" size="lg" className="w-full justify-center gap-2">
                    <Send size={15} /> Request Quote / Send Enquiry
                  </Button>
                </Link>
                <Link to="/contact" className="flex-shrink-0">
                  <Button variant="outline" size="lg" className="w-full justify-center">
                    Contact Procurement Team
                  </Button>
                </Link>
              </div>
            </div>

          </div>

          {/* Related Products */}
          {relatedProducts.length > 0 && (
            <div>
              <div className="text-left mb-8">
                <span className="inline-block text-xs font-semibold text-[#578E7E] uppercase tracking-[0.15em] mb-2">
                  Similar Items
                </span>
                <h2 
                  className="text-2xl font-bold text-[#3D3D3D] font-serif"
                  style={{ fontFamily: 'Playfair Display, Georgia, serif' }}
                >
                  Related Products
                </h2>
              </div>

              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {relatedProducts.map((p) => (
                  <Link
                    key={p.id}
                    to={`/products/${p.id}`}
                    className="group bg-white rounded-xl border border-[#F5ECD5] overflow-hidden flex flex-col hover:shadow-lg hover:border-[#578E7E]/30 transition-all duration-300"
                  >
                    <div className="h-40 bg-[#F5ECD5] relative overflow-hidden">
                      {p.imageUrl ? (
                        <img
                          src={p.imageUrl}
                          alt={p.name}
                          loading="lazy"
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <Tag size={28} className="text-[#578E7E]/20" />
                        </div>
                      )}
                    </div>
                    <div className="p-4 flex flex-col flex-1 justify-between">
                      <h3 className="font-bold text-[#3D3D3D] text-xs leading-snug line-clamp-2 mb-2 group-hover:text-[#578E7E] transition-colors">
                        {p.name}
                      </h3>
                      <span className="text-[10px] text-[#578E7E] font-semibold flex items-center gap-1">
                        View Product <ChevronRight size={10} />
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}

        </div>
      </div>

      <Footer />
    </>
  );
};

export default ProductDetailPage;
