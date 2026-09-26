import React, { useState, useEffect } from 'react';
import { ArrowRight, Sparkles } from 'lucide-react';
import { ProductCard } from '../common/ProductCard';
import { Product } from '../../types';
import { productApi } from '../../services/api';
import { useUIModal } from '../../context/UIModalContext';

export const NewArrivalsGrid: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [activeTab, setActiveTab] = useState<string>('all');
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const { scrollToSection } = useUIModal();

  useEffect(() => {
    const loadProducts = async () => {
      setIsLoading(true);
      try {
        const query: any = { pageSize: 8, sort: 'newest' };
        if (activeTab !== 'all') {
          query.category = activeTab;
        }
        const res = await productApi.getProducts(query);
        setProducts(res.items);
      } catch (err) {
        console.error('Error loading products:', err);
      } finally {
        setIsLoading(false);
      }
    };
    loadProducts();
  }, [activeTab]);

  return (
    <section className="py-20 bg-[#FAF5F3]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div>
            <span className="font-script text-2xl sm:text-3xl text-[#C49A8B]">Fresh Off the Atelier</span>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold tracking-wide text-[#2D2325] mt-1">
              New Arrivals & Seasonal Highlights
            </h2>
          </div>

          {/* Filter Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
            {[
              { id: 'all', label: 'All New' },
              { id: 'dresses', label: 'Dresses' },
              { id: 'tops', label: 'Tops' },
              { id: 'accessories', label: 'Accessories' },
              { id: 'sale', label: 'Sale' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-5 py-2 rounded-full text-xs font-semibold uppercase tracking-wider transition-all duration-300 whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'bg-[#2D2325] text-white shadow-sm'
                    : 'bg-white text-[#4A3E3F] hover:bg-[#E8C4C0]/40 border border-[#F4E3DF]'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Product Grid */}
        {isLoading ? (
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6 lg:gap-8">
            {[1, 2, 3, 4].map((n) => (
              <div key={n} className="bg-white rounded-2xl h-72 sm:h-96 animate-pulse p-3 sm:p-4 flex flex-col justify-between border border-[#F4E3DF]">
                <div className="bg-[#FAF5F3] h-44 sm:h-64 rounded-xl" />
                <div className="space-y-2 mt-3 sm:mt-4">
                  <div className="h-3 sm:h-4 bg-[#FAF5F3] rounded w-3/4" />
                  <div className="h-3 sm:h-4 bg-[#FAF5F3] rounded w-1/2" />
                </div>
              </div>
            ))}
          </div>
        ) : products.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6 lg:gap-8">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="py-16 text-center bg-white rounded-2xl border border-[#F4E3DF] p-8">
            <Sparkles className="w-10 h-10 text-[#C49A8B] mx-auto mb-3" />
            <p className="font-serif text-lg text-[#2D2325]">No items currently available in this section</p>
            <button
              onClick={() => setActiveTab('all')}
              className="mt-4 px-6 py-2 bg-[#2D2325] text-white text-xs font-semibold rounded-xl"
            >
              Reset Tab Filters
            </button>
          </div>
        )}

        {/* Bottom CTA */}
        <div className="text-center mt-14">
          <button
            onClick={() => scrollToSection('collection')}
            className="px-10 py-4 bg-[#2D2325] hover:bg-[#8C5353] text-white text-xs font-bold uppercase tracking-[0.2em] rounded-full shadow-boutique transition-all duration-300 inline-flex items-center gap-3 cursor-pointer"
          >
            <span>Explore Complete Boutique Catalog</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </section>
  );
};
