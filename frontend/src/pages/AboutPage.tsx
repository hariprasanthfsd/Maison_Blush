import React from 'react';
import { Heart, Sparkles, ShieldCheck, Award } from 'lucide-react';
import { Link } from 'react-router-dom';
import { BackButton } from '../components/common/BackButton';

export const AboutPage: React.FC = () => {
  return (
    <div className="py-16 bg-[#FAF5F3] min-h-screen">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Back Navigation */}
        <div>
          <BackButton label="Back to Home" to="/" />
        </div>

        {/* Title */}
        <div className="text-center max-w-2xl mx-auto">
          <span className="font-script text-3xl text-[#C49A8B]">Our Story & Vision</span>
          <h1 className="font-serif text-4xl sm:text-5xl font-bold tracking-wide text-[#2D2325] mt-1">
            Maison Blush Haute Couture
          </h1>
          <div className="w-16 h-0.5 bg-[#D9A09A] mx-auto mt-4 rounded-full" />
        </div>

        {/* Feature Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center bg-white p-8 sm:p-12 rounded-3xl border border-[#F4E3DF] shadow-soft">
          <div className="aspect-[4/5] rounded-2xl overflow-hidden bg-[#FAF5F3]">
            <img
              src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=800&q=80"
              alt="Atelier Fashion Designer"
              className="w-full h-full object-cover"
            />
          </div>

          <div className="space-y-6">
            <span className="font-script text-2xl text-[#8C5353]">Founded in 2024</span>
            <h2 className="font-serif text-3xl font-bold text-[#2D2325]">
              Women Owned & Thoughtfully Handcrafted
            </h2>
            <p className="text-sm text-[#4A3E3F] leading-relaxed font-light">
              Maison Blush was born out of a desire to create romantic, ultra-feminine garments that combine soft pastel aesthetics with comfortable, breathable organic fabrics.
            </p>
            <p className="text-sm text-[#4A3E3F] leading-relaxed font-light">
              From our signature liquid satin maxis to our hand-embroidered French linen blouses, every piece in our collection is produced in small, limited batches to minimize waste and ensure unmatched attention to detail.
            </p>

            <div className="grid grid-cols-2 gap-4 pt-4 border-t border-[#FAF5F3]">
              <div className="flex items-center gap-2">
                <Heart className="w-5 h-5 text-[#8C5353]" />
                <span className="text-xs font-bold text-[#2D2325]">100% Ethical Production</span>
              </div>
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-[#8C5353]" />
                <span className="text-xs font-bold text-[#2D2325]">Limited Run Collections</span>
              </div>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center">
          <Link
            to="/shop"
            className="px-10 py-4 bg-[#2D2325] hover:bg-[#8C5353] text-white text-xs font-bold uppercase tracking-[0.2em] rounded-full shadow-boutique transition-all"
          >
            Explore The Current Collection
          </Link>
        </div>
      </div>
    </div>
  );
};
