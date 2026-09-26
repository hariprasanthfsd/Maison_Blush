import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { BackButton } from '../components/common/BackButton';

export const PoliciesPage: React.FC = () => {
  const { type } = useParams<{ type: string }>();

  const titleMap: Record<string, string> = {
    shipping: 'Shipping & Delivery Policy',
    returns: 'Returns & Exchange Policy',
    privacy: 'Privacy & Data Policy',
    terms: 'Terms of Service',
  };

  const title = titleMap[type || 'shipping'] || 'Boutique Policy';

  return (
    <div className="py-16 bg-[#FAF5F3] min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div>
          <BackButton label="Back to Home" to="/" />
        </div>
        <div className="bg-white p-8 sm:p-12 rounded-3xl border border-[#F4E3DF] shadow-soft space-y-6">
          <span className="font-script text-2xl text-[#C49A8B]">Maison Blush Atelier</span>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[#2D2325]">{title}</h1>
          <div className="w-12 h-0.5 bg-[#D9A09A]" />

          <div className="prose prose-stone text-xs text-[#4A3E3F] leading-relaxed space-y-4">
            <p>
              Welcome to Maison Blush. We are committed to providing an exceptional and seamless luxury fashion experience.
            </p>

            <h3 className="font-serif text-base font-bold text-[#2D2325]">1. Dispatch & Express Transit</h3>
            <p>
              All orders placed before 2:00 PM IST are dispatched from our Mumbai atelier on the same business day. Delivery across metro cities in India takes 2-4 business days via insured express couriers.
            </p>

            <h3 className="font-serif text-base font-bold text-[#2D2325]">2. 14-Day Boutique Returns</h3>
            <p>
              If your garment does not fit perfectly, we offer store credit or full refunds within 14 days of delivery. Returned items must be unworn, unwashed, and in their original packaging with all boutique tags intact.
            </p>

            <h3 className="font-serif text-base font-bold text-[#2D2325]">3. Payment & Security</h3>
            <p>
              Transactions processed through Razorpay use 256-bit SSL encryption. We never store raw card numbers or payment credentials on our database servers.
            </p>
          </div>

          <div className="pt-6 border-t border-[#FAF5F3]">
            <Link to="/contact" className="text-xs text-[#8C5353] font-semibold hover:underline">
              Have questions regarding policies? Contact Concierge →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
