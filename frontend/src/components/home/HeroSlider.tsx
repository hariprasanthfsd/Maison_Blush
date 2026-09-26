import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, ArrowRight } from 'lucide-react';
import { Banner } from '../../types';
import { cmsApi } from '../../services/api';
import { useUIModal } from '../../context/UIModalContext';

const DEFAULT_SLIDES: Banner[] = [
  {
    id: 1,
    title: 'Elegance in Every Thread',
    subtitle: 'THE SPRING / SUMMER COLLECTION',
    description: 'Embrace soft pastels, effortless silhouettes, and ethereal fabrics handcrafted for the modern woman.',
    imageUrl: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=1600&q=80',
    buttonText: 'Explore Collection',
    targetUrl: '/shop',
    slideOrder: 1,
    isActive: true,
  },
  {
    id: 2,
    title: 'Romantic Silk & Satin',
    subtitle: 'FEATURED DRESSES',
    description: 'From sunset cocktail parties to serene garden soirées, discover your signature look.',
    imageUrl: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=1600&q=80',
    buttonText: 'Shop Dresses',
    targetUrl: '/shop?category=dresses',
    slideOrder: 2,
    isActive: true,
  },
  {
    id: 3,
    title: 'Timeless Fine Accessories',
    subtitle: 'THE FINISHING TOUCH',
    description: 'Handpicked gold jewelry, woven leather clutches, and silk scarves designed to elevate any ensemble.',
    imageUrl: 'https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&w=1600&q=80',
    buttonText: 'Discover Accessories',
    targetUrl: '/shop?category=accessories',
    slideOrder: 3,
    isActive: true,
  }
];

export const HeroSlider: React.FC = () => {
  const [slides, setSlides] = useState<Banner[]>(DEFAULT_SLIDES);
  const [currentSlide, setCurrentSlide] = useState(0);
  const { scrollToSection } = useUIModal();

  const handleSlideClick = (targetUrl?: string) => {
    if (!targetUrl) {
      scrollToSection('collection');
      return;
    }
    if (targetUrl.includes('category=')) {
      const cat = targetUrl.split('category=')[1]?.split('&')[0];
      scrollToSection('collection', cat, false);
    } else if (targetUrl.includes('onSale=true')) {
      scrollToSection('collection', undefined, true);
    } else {
      scrollToSection('collection');
    }
  };

  useEffect(() => {
    const loadBanners = async () => {
      try {
        const data = await cmsApi.getHeroBanners();
        if (data && data.length > 0) setSlides(data);
      } catch (err) {
        // Fallback
      }
    };
    loadBanners();
  }, []);

  useEffect(() => {
    if (slides.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [slides]);

  if (!slides.length) return null;
  const slide = slides[currentSlide];

  return (
    <section className="relative w-full h-[550px] sm:h-[650px] lg:h-[720px] overflow-hidden bg-[#2D2325]">
      
      {/* Background Image Banner */}
      {slides.map((s, idx) => (
        <div
          key={s.id}
          className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
            idx === currentSlide ? 'opacity-100 scale-100' : 'opacity-0 scale-105 pointer-events-none'
          }`}
        >
          <img
            src={s.imageUrl}
            alt={s.title}
            className="w-full h-full object-cover object-center"
          />
          {/* Subtle Dark Glass Gradient Overlay for perfect text legibility */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/30 to-transparent" />
        </div>
      ))}

      {/* Slide Content Overlay */}
      <div className="relative max-w-7xl mx-auto h-full px-6 sm:px-8 lg:px-12 flex items-center z-20">
        <div className="max-w-xl text-white space-y-4 sm:space-y-6 animate-fade-in">
          <span className="inline-block text-xs sm:text-sm uppercase tracking-[0.25em] font-semibold text-[#E8C4C0] drop-shadow">
            {slide.subtitle}
          </span>
          <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-bold tracking-wide leading-tight text-white drop-shadow-md">
            {slide.title}
          </h1>
          <p className="text-sm sm:text-base text-[#FAF5F3] font-light leading-relaxed max-w-md drop-shadow">
            {slide.description}
          </p>

          <div className="pt-2">
            <button
              onClick={() => handleSlideClick(slide.targetUrl)}
              className="px-8 py-4 bg-[#FFFDFB] hover:bg-[#8C5353] text-[#2D2325] hover:text-white rounded-full text-xs font-bold uppercase tracking-[0.2em] shadow-2xl transition-all duration-300 transform hover:-translate-y-0.5 flex items-center gap-3 cursor-pointer"
            >
              <span>{slide.buttonText || 'Shop New Arrivals'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Navigation Controls */}
      {slides.length > 1 && (
        <>
          <button
            onClick={() => setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length)}
            className="absolute left-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-white/20 hover:bg-white/40 text-white backdrop-blur-md transition-all z-30"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={() => setCurrentSlide((prev) => (prev + 1) % slides.length)}
            className="absolute right-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-white/20 hover:bg-white/40 text-white backdrop-blur-md transition-all z-30"
          >
            <ChevronRight className="w-5 h-5" />
          </button>

          {/* Indicators */}
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-2 z-30">
            {slides.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentSlide(idx)}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  idx === currentSlide ? 'w-8 bg-white' : 'w-2 bg-white/50'
                }`}
              />
            ))}
          </div>
        </>
      )}
    </section>
  );
};
