import React, { useState, useEffect } from 'react';
import { ArrowUpRight } from 'lucide-react';
import { Category } from '../../types';
import { categoryApi } from '../../services/api';
import { useUIModal } from '../../context/UIModalContext';

const DEFAULT_CATEGORIES: Category[] = [
  { id: 1, name: 'Dresses', slug: 'dresses', imageUrl: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&w=800&q=80', description: 'Ethereal maxis, flowing midis & slip dresses', displayOrder: 1, isActive: true, productCount: 12 },
  { id: 2, name: 'Tops', slug: 'tops', imageUrl: 'https://images.unsplash.com/photo-1564257631407-4deb1f99d992?auto=format&fit=crop&w=800&q=80', description: 'Linen blouses, knits & embroidered camis', displayOrder: 2, isActive: true, productCount: 8 },
  { id: 3, name: 'Bottoms', slug: 'bottoms', imageUrl: 'https://images.unsplash.com/photo-1583496661160-fb5886a0aaaa?auto=format&fit=crop&w=800&q=80', description: 'High-waisted trousers & pleated skirts', displayOrder: 3, isActive: true, productCount: 6 },
  { id: 4, name: 'Accessories', slug: 'accessories', imageUrl: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=800&q=80', description: 'Natural pearls, clutches & gold jewelry', displayOrder: 4, isActive: true, productCount: 15 },
  { id: 5, name: 'Sale', slug: 'sale', imageUrl: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=800&q=80', description: 'Exclusive discounts on last-chance items', displayOrder: 5, isActive: true, productCount: 10 },
];

export const CategoryGrid: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>(DEFAULT_CATEGORIES);
  const { scrollToSection } = useUIModal();

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const data = await categoryApi.getCategories();
        if (data && data.length > 0) setCategories(data);
      } catch (err) { }
    };
    loadCategories();
  }, []);

  return (
    <section className="py-20 bg-[#FFFDFB]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header Title */}
        <div className="text-center max-w-2xl mx-auto mb-14">
          <span className="font-script text-2xl sm:text-3xl text-[#C49A8B]">Curated Collections</span>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold tracking-wide text-[#2D2325] mt-1">
            Shop by Boutique Category
          </h2>
          <div className="w-16 h-0.5 bg-[#D9A09A] mx-auto mt-4 rounded-full" />
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {categories.map((cat, idx) => (
            <div
              key={cat.id}
              onClick={() => scrollToSection('collection', cat.slug === 'sale' ? undefined : cat.slug, cat.slug === 'sale')}
              className={`group relative overflow-hidden rounded-3xl shadow-soft hover:shadow-boutique transition-all duration-500 h-80 sm:h-96 cursor-pointer ${
                idx === 0 ? 'lg:col-span-2 sm:h-96' : ''
              }`}
            >
              {/* Image */}
              <img
                src={cat.imageUrl || 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&w=800&q=80'}
                alt={cat.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
              />

              {/* Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent transition-opacity group-hover:opacity-90" />

              {/* Content */}
              <div className="absolute inset-0 p-8 flex flex-col justify-end text-white">
                <div className="flex items-end justify-between">
                  <div>
                    <span className="text-xs uppercase tracking-[0.2em] font-semibold text-[#E8C4C0]">
                      {cat.productCount} Products
                    </span>
                    <h3 className="font-serif text-2xl sm:text-3xl font-bold tracking-wide mt-1">
                      {cat.name}
                    </h3>
                    <p className="text-xs sm:text-sm text-[#FAF5F3] font-light mt-1.5 opacity-90 line-clamp-1">
                      {cat.description}
                    </p>
                  </div>

                  <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-md group-hover:bg-[#8C5353] flex items-center justify-center transition-all duration-300 transform group-hover:scale-110">
                    <ArrowUpRight className="w-5 h-5 text-white" />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
