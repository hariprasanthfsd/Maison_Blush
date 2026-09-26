import React, { useState, useEffect } from 'react';
import { Search, X, ArrowRight } from 'lucide-react';
import { productApi } from '../../services/api';
import { Product } from '../../types';
import { useUIModal } from '../../context/UIModalContext';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SearchModal: React.FC<SearchModalProps> = ({ isOpen, onClose }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [results, setResults] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { openProductModal, scrollToSection } = useUIModal();

  useEffect(() => {
    if (!searchTerm.trim()) {
      setResults([]);
      return;
    }

    const timer = setTimeout(async () => {
      setIsLoading(true);
      try {
        const res = await productApi.getProducts({ search: searchTerm, pageSize: 6 });
        setResults(res.items);
      } catch (err) {
        // Handle error
      } finally {
        setIsLoading(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    scrollToSection('collection');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 px-4">
      {/* Backdrop */}
      <div className="fixed inset-0 bg-[#2D2325]/60 backdrop-blur-sm transition-opacity" onClick={onClose} />

      {/* Search Modal Content */}
      <div className="relative w-full max-w-2xl bg-[#FFFDFB] rounded-3xl shadow-2xl border border-[#F4E3DF] p-6 z-50 animate-fade-in">
        <div className="flex items-center justify-between pb-4 border-b border-[#F4E3DF]">
          <span className="font-serif text-lg font-bold text-[#2D2325]">Search Boutique Catalog</span>
          <button onClick={onClose} className="p-1.5 rounded-full text-stone-400 hover:text-[#2D2325] hover:bg-stone-100 cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSearchSubmit} className="mt-4 relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#C49A8B]" />
          <input
            type="text"
            placeholder="Search dresses, linen tops, accessories, pearls..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-[#FAF5F3] border border-[#E8C4C0] rounded-xl pl-12 pr-10 py-3.5 text-sm text-[#2D2325] placeholder-[#C49A8B] focus:outline-none focus:border-[#8C5353]"
            autoFocus
          />
          {searchTerm && (
            <button
              type="button"
              onClick={() => setSearchTerm('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-[#2D2325] cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </form>

        {/* Live Search Results */}
        <div className="mt-4 max-h-80 overflow-y-auto">
          {isLoading && (
            <div className="py-6 text-center text-xs text-[#C49A8B] animate-pulse">
              Searching boutique collection...
            </div>
          )}

          {!isLoading && results.length > 0 && (
            <div className="divide-y divide-[#FAF5F3]">
              {results.map((p) => (
                <div
                  key={p.id}
                  onClick={() => {
                    onClose();
                    openProductModal(p);
                  }}
                  className="flex items-center gap-4 py-3 px-2 hover:bg-[#FAF5F3] rounded-xl cursor-pointer transition-colors"
                >
                  <img
                    src={p.primaryImageUrl}
                    alt={p.name}
                    className="w-12 h-14 object-cover rounded-lg bg-[#FAF5F3]"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="font-serif text-sm font-semibold text-[#2D2325] truncate">{p.name}</p>
                    <p className="text-xs text-[#C49A8B]">{p.categoryName}</p>
                  </div>
                  <span className="font-serif text-sm font-bold text-[#8C5353]">
                    ₹{(p.salePrice ?? p.basePrice).toLocaleString('en-IN')}
                  </span>
                </div>
              ))}
            </div>
          )}

          {!isLoading && searchTerm && results.length === 0 && (
            <div className="py-8 text-center text-xs text-stone-500">
              No garments found matching "{searchTerm}".
            </div>
          )}
        </div>

        {searchTerm && (
          <div className="mt-4 pt-3 border-t border-[#FAF5F3] text-right">
            <button
              onClick={handleSearchSubmit}
              className="text-xs font-semibold text-[#8C5353] hover:text-[#6E3C3D] inline-flex items-center gap-1 cursor-pointer"
            >
              <span>View in catalog</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
