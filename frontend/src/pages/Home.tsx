import React, { useState } from 'react';
import { HeroSlider } from '../components/home/HeroSlider';
import { BoutiqueBenefits } from '../components/home/BoutiqueBenefits';
import { CategoryGrid } from '../components/home/CategoryGrid';
import { NewArrivalsGrid } from '../components/home/NewArrivalsGrid';
import { AtelierCatalog } from '../components/catalog/AtelierCatalog';
import { TestimonialsSection } from '../components/home/TestimonialsSection';
import { Sparkles, Heart, MapPin, Phone, Mail, Clock, Send, Award, ShieldCheck } from 'lucide-react';
import { useUIModal } from '../context/UIModalContext';
import { useToast } from '../context/ToastContext';

export const Home: React.FC = () => {
  const { scrollToSection } = useUIModal();
  const { showToast } = useToast();

  // Contact Inquiry Form State
  const [contactName, setContactName] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [contactMessage, setContactMessage] = useState('');
  const [isSendingInquiry, setIsSendingInquiry] = useState(false);

  const handleInquirySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!contactName || !contactEmail || !contactMessage) return;

    setIsSendingInquiry(true);
    setTimeout(() => {
      showToast('Thank you! Your inquiry has been sent to our boutique concierge. 💕', 'success');
      setContactName('');
      setContactEmail('');
      setContactMessage('');
      setIsSendingInquiry(false);
    }, 600);
  };

  return (
    <div className="space-y-0">
      {/* 1. Hero Banner Section */}
      <section id="hero">
        <HeroSlider />
      </section>

      {/* 2. Boutique Benefits Feature Bar */}
      <section id="benefits">
        <BoutiqueBenefits />
      </section>

      {/* 3. Shop by Category Grid */}
      <section id="categories">
        <CategoryGrid />
      </section>

      {/* 4. Atelier Ethos Inspirational Banner */}
      <section className="relative py-24 bg-[#2D2325] text-white overflow-hidden">
        <div className="absolute inset-0 opacity-25">
          <img
            src="https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=1600&q=80"
            alt="Atelier Banner"
            className="w-full h-full object-cover"
          />
        </div>
        <div className="relative max-w-5xl mx-auto px-6 text-center space-y-6">
          <span className="font-script text-3xl sm:text-4xl text-[#E8C4C0]">The Maison Blush Ethos</span>
          <h2 className="font-serif text-3xl sm:text-5xl font-bold tracking-wide leading-tight text-white">
            "Feminine Elegance Designed for Unforgettable Moments"
          </h2>
          <p className="text-sm sm:text-base text-[#FAF5F3] font-light max-w-2xl mx-auto leading-relaxed">
            Every garment in our boutique is thoughtfully designed with premium silk, organic linens, and delicate hand embroidery. Crafted in small batches to celebrate individuality and timeless elegance.
          </p>
          <div className="pt-4 flex items-center justify-center gap-4">
            <button
              onClick={() => scrollToSection('about')}
              className="inline-flex items-center gap-2 px-8 py-3.5 bg-[#E8C4C0] hover:bg-white text-[#2D2325] font-bold text-xs uppercase tracking-[0.2em] rounded-full transition-all duration-300 shadow-xl cursor-pointer"
            >
              <Heart className="w-4 h-4 text-[#8C5353]" />
              <span>Read Our Brand Story</span>
            </button>
            <button
              onClick={() => scrollToSection('collection')}
              className="inline-flex items-center gap-2 px-8 py-3.5 bg-transparent hover:bg-white/10 text-white border border-[#E8C4C0] font-bold text-xs uppercase tracking-[0.2em] rounded-full transition-all duration-300 cursor-pointer"
            >
              <span>Explore Atelier</span>
            </button>
          </div>
        </div>
      </section>

      {/* 5. New Arrivals & Seasonal Highlights */}
      <section id="new-arrivals">
        <NewArrivalsGrid />
      </section>

      {/* 6. Complete In-Page Filterable & Searchable Catalog */}
      <AtelierCatalog />

      {/* 7. Client Testimonials */}
      <TestimonialsSection />

      {/* 8. About The Atelier & Brand Story */}
      <section id="about" className="py-24 bg-[#FFFDFB] scroll-mt-20 border-t border-[#F4E3DF]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center max-w-2xl mx-auto">
            <span className="font-script text-3xl text-[#C49A8B]">Our Story & Vision</span>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold tracking-wide text-[#2D2325] mt-1">
              Maison Blush Haute Couture
            </h2>
            <div className="w-16 h-0.5 bg-[#D9A09A] mx-auto mt-4 rounded-full" />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center bg-[#FAF5F3] p-8 sm:p-12 rounded-3xl border border-[#F4E3DF] shadow-soft">
            <div className="aspect-[4/5] rounded-2xl overflow-hidden bg-white shadow-soft">
              <img
                src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=800&q=80"
                alt="Atelier Fashion Designer"
                className="w-full h-full object-cover"
                loading="lazy"
              />
            </div>

            <div className="space-y-6">
              <span className="font-script text-2xl text-[#8C5353]">Handcrafted in Mumbai</span>
              <h3 className="font-serif text-2xl sm:text-3xl font-bold text-[#2D2325]">
                Women Owned & Thoughtfully Handcrafted
              </h3>
              <p className="text-sm text-[#4A3E3F] leading-relaxed font-light">
                Maison Blush was born out of a desire to create romantic, ultra-feminine garments that combine soft pastel aesthetics with comfortable, breathable organic fabrics.
              </p>
              <p className="text-sm text-[#4A3E3F] leading-relaxed font-light">
                From our signature liquid satin maxis to our hand-embroidered French linen blouses, every piece in our collection is produced in small, limited batches to minimize waste and ensure unmatched attention to detail.
              </p>

              <div className="grid grid-cols-2 gap-4 pt-4 border-t border-[#E8C4C0]">
                <div className="flex items-center gap-2">
                  <Heart className="w-5 h-5 text-[#8C5353]" />
                  <span className="text-xs font-bold text-[#2D2325]">100% Ethical Production</span>
                </div>
                <div className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-[#8C5353]" />
                  <span className="text-xs font-bold text-[#2D2325]">Limited Run Collections</span>
                </div>
              </div>

              <div className="pt-2">
                <button
                  onClick={() => scrollToSection('collection')}
                  className="px-8 py-3.5 bg-[#2D2325] hover:bg-[#8C5353] text-white text-xs font-bold uppercase tracking-[0.2em] rounded-full shadow-boutique transition-all cursor-pointer"
                >
                  Shop The Handcrafted Collection
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 8. Boutique Concierge & Contact Inquiry */}
      <section id="contact" className="py-24 bg-[#FAF5F3] scroll-mt-20 border-t border-[#F4E3DF]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center max-w-xl mx-auto">
            <span className="font-script text-3xl text-[#C49A8B]">We Would Love to Assist You</span>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold tracking-wide text-[#2D2325] mt-1">
              Boutique Concierge & Atelier Visit
            </h2>
            <div className="w-16 h-0.5 bg-[#D9A09A] mx-auto mt-4 rounded-full" />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Atelier Info Card */}
            <div className="bg-white p-8 rounded-3xl border border-[#F4E3DF] shadow-soft space-y-6">
              <h3 className="font-serif text-xl font-bold text-[#2D2325]">Atelier Flagship</h3>
              
              <div className="space-y-4 text-xs text-[#4A3E3F]">
                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-[#8C5353] flex-shrink-0" />
                  <span>45 Rosewood Villa, Hill Road, Bandra West, Mumbai, Maharashtra 400050, India</span>
                </div>
                <div className="flex items-center gap-3">
                  <Phone className="w-5 h-5 text-[#8C5353] flex-shrink-0" />
                  <span>+91 (022) 8765-4321</span>
                </div>
                <div className="flex items-center gap-3">
                  <Mail className="w-5 h-5 text-[#8C5353] flex-shrink-0" />
                  <span>concierge@maisonblush.com</span>
                </div>
                <div className="flex items-start gap-3">
                  <Clock className="w-5 h-5 text-[#8C5353] flex-shrink-0" />
                  <span>Monday - Saturday: 10:00 AM - 8:00 PM IST</span>
                </div>
              </div>

              <div className="pt-4 border-t border-[#FAF5F3]">
                <p className="text-[11px] text-[#C49A8B] leading-relaxed">
                  Private styling appointments and custom bridal consultations available upon advance request.
                </p>
              </div>
            </div>

            {/* Direct Inquiry Form */}
            <div className="lg:col-span-2 bg-white p-8 rounded-3xl border border-[#F4E3DF] shadow-soft space-y-6">
              <h3 className="font-serif text-xl font-bold text-[#2D2325]">Send an Inquiry to Concierge</h3>

              <form onSubmit={handleInquirySubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs uppercase font-semibold text-[#2D2325] mb-1">Your Name *</label>
                    <input
                      type="text"
                      placeholder="Sophia Rose"
                      value={contactName}
                      onChange={(e) => setContactName(e.target.value)}
                      className="w-full bg-[#FAF5F3] border border-[#E8C4C0] rounded-xl px-3.5 py-2.5 text-xs text-[#2D2325] focus:outline-none focus:border-[#8C5353]"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xs uppercase font-semibold text-[#2D2325] mb-1">Email Address *</label>
                    <input
                      type="email"
                      placeholder="you@example.com"
                      value={contactEmail}
                      onChange={(e) => setContactEmail(e.target.value)}
                      className="w-full bg-[#FAF5F3] border border-[#E8C4C0] rounded-xl px-3.5 py-2.5 text-xs text-[#2D2325] focus:outline-none focus:border-[#8C5353]"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs uppercase font-semibold text-[#2D2325] mb-1">Message / Fit Inquiry *</label>
                  <textarea
                    rows={4}
                    placeholder="How can our boutique styling concierge assist you today? Inquire about bespoke sizing, fabric samples, or delivery times..."
                    value={contactMessage}
                    onChange={(e) => setContactMessage(e.target.value)}
                    className="w-full bg-[#FAF5F3] border border-[#E8C4C0] rounded-xl px-3.5 py-2.5 text-xs text-[#2D2325] focus:outline-none focus:border-[#8C5353]"
                    required
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSendingInquiry}
                  className="px-8 py-3.5 bg-[#8C5353] hover:bg-[#6E3C3D] text-white text-xs font-bold uppercase tracking-wider rounded-xl transition-all inline-flex items-center gap-2 cursor-pointer shadow-boutique"
                >
                  <Send className="w-4 h-4" />
                  <span>{isSendingInquiry ? 'Sending Inquiry...' : 'Send Message to Concierge'}</span>
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
