import React, { useState, useEffect } from 'react';
import { Truck, Heart, Sparkles, RotateCcw, ShieldCheck, Gift } from 'lucide-react';
import { StoreBenefit } from '../../types';
import { cmsApi } from '../../services/api';

const DEFAULT_BENEFITS: StoreBenefit[] = [
  { id: 1, title: 'Fast & Free Shipping', iconName: 'Truck', description: 'Complimentary courier delivery on all orders above ₹2,999 across India.', displayOrder: 1, isActive: true },
  { id: 2, title: 'Women Owned & Crafted', iconName: 'Heart', description: 'Founded and operated by female designers passionate about timeless style.', displayOrder: 2, isActive: true },
  { id: 3, title: 'Affordable Luxury', iconName: 'Sparkles', description: 'Boutique quality craftsmanship offered at accessible direct-to-consumer prices.', displayOrder: 3, isActive: true },
  { id: 4, title: 'Easy 14-Day Returns', iconName: 'RotateCcw', description: 'Hassle-free return policy with instant store credit or full refunds.', displayOrder: 4, isActive: true },
];

const ICON_MAP: Record<string, React.ReactNode> = {
  Truck: <Truck className="w-6 h-6 text-[#8C5353]" />,
  Heart: <Heart className="w-6 h-6 text-[#8C5353]" />,
  Sparkles: <Sparkles className="w-6 h-6 text-[#8C5353]" />,
  RotateCcw: <RotateCcw className="w-6 h-6 text-[#8C5353]" />,
  ShieldCheck: <ShieldCheck className="w-6 h-6 text-[#8C5353]" />,
  Gift: <Gift className="w-6 h-6 text-[#8C5353]" />,
};

export const BoutiqueBenefits: React.FC = () => {
  const [benefits, setBenefits] = useState<StoreBenefit[]>(DEFAULT_BENEFITS);

  useEffect(() => {
    const loadBenefits = async () => {
      try {
        const data = await cmsApi.getStoreBenefits();
        if (data && data.length > 0) setBenefits(data);
      } catch (err) { }
    };
    loadBenefits();
  }, []);

  return (
    <section className="py-12 bg-[#FAF5F3] border-b border-[#F4E3DF]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {benefits.map((b) => (
            <div
              key={b.id}
              className="bg-white/80 backdrop-blur-sm border border-[#F4E3DF] p-6 rounded-2xl shadow-soft hover:shadow-boutique transition-all duration-300 flex items-start gap-4 group"
            >
              <div className="p-3 bg-[#FAF5F3] rounded-xl group-hover:bg-[#E8C4C0]/40 transition-colors flex-shrink-0">
                {ICON_MAP[b.iconName] || <Sparkles className="w-6 h-6 text-[#8C5353]" />}
              </div>
              <div>
                <h4 className="font-serif text-base font-semibold text-[#2D2325]">{b.title}</h4>
                <p className="text-xs text-[#6B5B5E] mt-1 leading-relaxed font-light">{b.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
