import React, { useState } from 'react';
import { Mail, ArrowRight, Heart } from 'lucide-react';
import { cmsApi } from '../../services/api';
import { useToast } from '../../context/ToastContext';
import { useUIModal } from '../../context/UIModalContext';

export const Footer: React.FC = () => {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { showToast } = useToast();
  const { scrollToSection, openPolicy, openAuthModal } = useUIModal();

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes('@')) {
      showToast('Please enter a valid email address.', 'error');
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await cmsApi.subscribeNewsletter(email);
      showToast(res.message || 'Subscribed successfully!', 'success');
      setEmail('');
    } catch (err: any) {
      showToast('Thank you for subscribing!', 'success');
      setEmail('');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <footer className="bg-[#2D2325] text-[#FAF5F3] pt-16 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Newsletter Banner */}
        <div className="bg-[#381A1B] border border-[#52292A] rounded-2xl p-6 sm:p-8 md:p-12 mb-16 flex flex-col lg:flex-row items-center justify-between gap-8 text-center lg:text-left overflow-hidden">
          <div className="max-w-xl">
            <span className="font-script text-2xl text-[#E8C4C0]">Join the Atelier</span>
            <h3 className="font-serif text-2xl sm:text-3xl font-bold tracking-wide mt-1">
              Enjoy 10% Off Your First Boutique Order
            </h3>
            <p className="text-sm text-[#E8C4C0] mt-2 max-w-md mx-auto lg:mx-0">
              Subscribe to receive private invitations to new collection drops, seasonal edits, and styling tips.
            </p>
          </div>

          <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row w-full lg:w-auto max-w-md gap-3">
            <input
              type="email"
              placeholder="Enter your email address..."
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full sm:flex-1 min-w-0 bg-[#2D2325] border border-[#6E3C3D] rounded-xl px-4 py-3 text-sm text-[#FAF5F3] placeholder-[#C49A8B] focus:outline-none focus:border-[#E8C4C0]"
              required
            />
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full sm:w-auto bg-[#D9A09A] hover:bg-[#8C5353] text-[#2D2325] hover:text-white px-6 py-3 rounded-xl font-medium text-sm transition-all duration-300 flex items-center justify-center gap-2 flex-shrink-0 cursor-pointer shadow-md"
            >
              <span>Subscribe</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        </div>

        {/* Footer Navigation Columns */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-[#52292A]">
          {/* Brand Info */}
          <div className="lg:col-span-2">
            <button
              onClick={() => scrollToSection('hero')}
              className="text-left cursor-pointer bg-transparent border-0 p-0"
            >
              <span className="font-serif text-2xl tracking-[0.2em] font-bold text-white uppercase">
                MAISON BLUSH
              </span>
              <p className="font-script text-sm text-[#E8C4C0] -mt-1">Haute Couture Boutique</p>
            </button>
            <p className="text-sm text-[#E8C4C0] mt-4 leading-relaxed max-w-sm">
              An independent luxury fashion boutique dedicated to timeless feminine elegance, effortless silhouettes, and exquisite craftsmanship. Designed for the modern woman.
            </p>
            <div className="flex items-center gap-4 mt-6">
              <a href="#" className="w-10 h-10 rounded-full bg-[#381A1B] hover:bg-[#8C5353] flex items-center justify-center transition-colors text-[#E8C4C0]">
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-[#381A1B] hover:bg-[#8C5353] flex items-center justify-center transition-colors text-[#E8C4C0]">
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M9 8H6v4h3v12h5V12h3.642L18 8h-4V6.333C14 5.374 14.5 5 15.5 5H18V0h-3.808C10.592 0 9 1.583 9 4.615V8z"/></svg>
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-[#381A1B] hover:bg-[#8C5353] flex items-center justify-center transition-colors text-[#E8C4C0]">
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/></svg>
              </a>
            </div>
          </div>

          {/* Shop Column */}
          <div>
            <h4 className="font-serif text-base font-semibold uppercase tracking-wider text-white mb-4">Shop Atelier</h4>
            <ul className="space-y-2.5 text-sm text-[#E8C4C0]">
              <li>
                <button
                  onClick={() => scrollToSection('collection', 'dresses-and-accessories', false)}
                  className="hover:text-white transition-colors cursor-pointer text-left"
                >
                  Dresses & Accessories
                </button>
              </li>
              <li>
                <button
                  onClick={() => scrollToSection('new-arrivals')}
                  className="hover:text-white transition-colors cursor-pointer text-left"
                >
                  New Arrivals
                </button>
              </li>
              <li>
                <button
                  onClick={() => scrollToSection('collection')}
                  className="hover:text-white transition-colors cursor-pointer text-left"
                >
                  All Collection
                </button>
              </li>
              <li>
                <button
                  onClick={() => scrollToSection('collection', undefined, true)}
                  className="hover:text-white transition-colors font-medium text-[#D9A09A] cursor-pointer text-left"
                >
                  Boutique Sale ✨
                </button>
              </li>
            </ul>
          </div>

          {/* Customer Care */}
          <div>
            <h4 className="font-serif text-base font-semibold uppercase tracking-wider text-white mb-4">Customer Care</h4>
            <ul className="space-y-2.5 text-sm text-[#E8C4C0]">
              <li>
                <button
                  onClick={() => openAuthModal('orders')}
                  className="hover:text-white transition-colors cursor-pointer text-left"
                >
                  My Account & Orders
                </button>
              </li>
              <li>
                <button
                  onClick={() => scrollToSection('testimonials')}
                  className="hover:text-white transition-colors cursor-pointer text-left"
                >
                  Client Testimonials
                </button>
              </li>
              <li>
                <button
                  onClick={() => openPolicy('shipping')}
                  className="hover:text-white transition-colors cursor-pointer text-left"
                >
                  Shipping & Express Delivery
                </button>
              </li>
              <li>
                <button
                  onClick={() => openPolicy('returns')}
                  className="hover:text-white transition-colors cursor-pointer text-left"
                >
                  Easy 14-Day Returns
                </button>
              </li>
              <li>
                <button
                  onClick={() => scrollToSection('contact')}
                  className="hover:text-white transition-colors cursor-pointer text-left"
                >
                  Contact Support
                </button>
              </li>
              <li>
                <button
                  onClick={() => scrollToSection('about')}
                  className="hover:text-white transition-colors cursor-pointer text-left"
                >
                  Our Brand Story
                </button>
              </li>
            </ul>
          </div>

          {/* Policy Links */}
          <div>
            <h4 className="font-serif text-base font-semibold uppercase tracking-wider text-white mb-4">Boutique Policies</h4>
            <ul className="space-y-2.5 text-sm text-[#E8C4C0]">
              <li>
                <button
                  onClick={() => openPolicy('privacy')}
                  className="hover:text-white transition-colors cursor-pointer text-left"
                >
                  Privacy Policy
                </button>
              </li>
              <li>
                <button
                  onClick={() => openPolicy('terms')}
                  className="hover:text-white transition-colors cursor-pointer text-left"
                >
                  Terms of Service
                </button>
              </li>
              <li>
                <button
                  onClick={() => openPolicy('returns')}
                  className="hover:text-white transition-colors cursor-pointer text-left"
                >
                  Refund & Exchange
                </button>
              </li>
              <li className="pt-2 text-xs text-[#C49A8B]">
                📍 Bandra West, Mumbai, India<br />
                📞 +91 (022) 8765-4321
              </li>
            </ul>
          </div>
        </div>

        {/* Copyright */}
        <div className="pt-8 flex flex-col md:flex-row items-center justify-between text-xs text-[#C49A8B] gap-4">
          <p>© {new Date().getFullYear()} Maison Blush Boutique. All rights reserved.</p>
          <div className="flex items-center gap-2">
            <span>Secured Online Checkout via</span>
            <span className="font-semibold text-white px-2 py-0.5 bg-[#381A1B] rounded border border-[#52292A]">Razorpay</span>
            <span className="font-semibold text-white px-2 py-0.5 bg-[#381A1B] rounded border border-[#52292A]">UPI</span>
            <span className="font-semibold text-white px-2 py-0.5 bg-[#381A1B] rounded border border-[#52292A]">Cards</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
