import React, { useState, useEffect } from 'react';
import { X, Truck, RotateCcw, ShieldCheck, FileText, ArrowRight } from 'lucide-react';
import { useUIModal } from '../../context/UIModalContext';

export const PolicyModal: React.FC = () => {
  const { activePolicy, closePolicy, scrollToSection } = useUIModal();
  const [currentTab, setCurrentTab] = useState<'shipping' | 'returns' | 'privacy' | 'terms'>('shipping');

  useEffect(() => {
    if (activePolicy) {
      if (['shipping', 'returns', 'privacy', 'terms'].includes(activePolicy)) {
        setCurrentTab(activePolicy as any);
      } else if (activePolicy === 'refund') {
        setCurrentTab('returns');
      } else {
        setCurrentTab('shipping');
      }
    }
  }, [activePolicy]);

  if (!activePolicy) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-[#2D2325]/70 backdrop-blur-md transition-opacity"
        onClick={closePolicy}
      />

      {/* Modal Dialog */}
      <div className="relative w-full max-w-3xl bg-[#FFFDFB] rounded-3xl border border-[#F4E3DF] shadow-2xl overflow-hidden z-10 max-h-[88vh] flex flex-col animate-fade-in my-auto">
        
        {/* Floating Close Button */}
        <div className="absolute top-4 right-4 z-20">
          <button
            onClick={closePolicy}
            className="p-2.5 rounded-full bg-white/90 hover:bg-white text-[#2D2325] hover:text-[#8C5353] border border-[#F4E3DF] shadow-sm transition-colors cursor-pointer"
            aria-label="Close Policy Modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Header */}
        <div className="bg-[#FAF5F3] border-b border-[#F4E3DF] px-6 sm:px-8 pt-6 pb-2">
          <span className="font-script text-2xl text-[#C49A8B]">Maison Blush Atelier</span>
          <h2 className="font-serif text-2xl font-bold text-[#2D2325]">Boutique Standards & Policies</h2>

          {/* Policy Navigation Tabs */}
          <div className="flex gap-4 sm:gap-6 mt-4 text-xs uppercase font-semibold tracking-wider overflow-x-auto pb-1">
            <button
              onClick={() => setCurrentTab('shipping')}
              className={`pb-2.5 transition-colors relative whitespace-nowrap cursor-pointer flex items-center gap-1.5 ${
                currentTab === 'shipping' ? 'text-[#8C5353] font-bold' : 'text-stone-400 hover:text-[#2D2325]'
              }`}
            >
              <Truck className="w-3.5 h-3.5" />
              <span>Shipping & Delivery</span>
              {currentTab === 'shipping' && <span className="absolute bottom-0 left-0 w-full h-[2px] bg-[#8C5353]" />}
            </button>

            <button
              onClick={() => setCurrentTab('returns')}
              className={`pb-2.5 transition-colors relative whitespace-nowrap cursor-pointer flex items-center gap-1.5 ${
                currentTab === 'returns' ? 'text-[#8C5353] font-bold' : 'text-stone-400 hover:text-[#2D2325]'
              }`}
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>14-Day Returns</span>
              {currentTab === 'returns' && <span className="absolute bottom-0 left-0 w-full h-[2px] bg-[#8C5353]" />}
            </button>

            <button
              onClick={() => setCurrentTab('privacy')}
              className={`pb-2.5 transition-colors relative whitespace-nowrap cursor-pointer flex items-center gap-1.5 ${
                currentTab === 'privacy' ? 'text-[#8C5353] font-bold' : 'text-stone-400 hover:text-[#2D2325]'
              }`}
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Privacy & Security</span>
              {currentTab === 'privacy' && <span className="absolute bottom-0 left-0 w-full h-[2px] bg-[#8C5353]" />}
            </button>

            <button
              onClick={() => setCurrentTab('terms')}
              className={`pb-2.5 transition-colors relative whitespace-nowrap cursor-pointer flex items-center gap-1.5 ${
                currentTab === 'terms' ? 'text-[#8C5353] font-bold' : 'text-stone-400 hover:text-[#2D2325]'
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Terms of Service</span>
              {currentTab === 'terms' && <span className="absolute bottom-0 left-0 w-full h-[2px] bg-[#8C5353]" />}
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="overflow-y-auto p-6 sm:p-8 flex-1 text-xs text-[#4A3E3F] leading-relaxed space-y-4">
          {currentTab === 'shipping' && (
            <div className="space-y-4 font-light">
              <h3 className="font-serif text-base font-bold text-[#2D2325]">Complimentary & Express Transit</h3>
              <p>
                All Maison Blush orders placed before 2:00 PM IST are inspected and packaged in signature luxury dust bags before leaving our Mumbai atelier on the same business day.
              </p>
              <div className="p-4 bg-[#FAF5F3] rounded-2xl border border-[#E8C4C0] space-y-2">
                <p className="font-semibold text-[#2D2325]">Estimated Delivery Windows:</p>
                <ul className="list-disc pl-5 space-y-1 text-[#6B5B5E]">
                  <li><strong>Metro Cities (Mumbai, Delhi, Bengaluru, Chennai):</strong> 2 to 3 Business Days via BlueDart Air.</li>
                  <li><strong>Rest of India:</strong> 3 to 5 Business Days via Express Insured Courier.</li>
                  <li><strong>Orders over ₹2,999:</strong> Free Boutique Express Delivery automatically applied at checkout.</li>
                </ul>
              </div>
              <p>
                A real-time tracking link will be sent via SMS and Email the instant your atelier package is scanned into the courier logistics hub.
              </p>
            </div>
          )}

          {currentTab === 'returns' && (
            <div className="space-y-4 font-light">
              <h3 className="font-serif text-base font-bold text-[#2D2325]">Effortless 14-Day Boutique Exchange</h3>
              <p>
                We want you to feel sublime in every garment you select. If an item does not drape or fit as expected, we gladly facilitate complimentary return pickups or exchanges within 14 days of delivery.
              </p>
              <div className="p-4 bg-[#FAF5F3] rounded-2xl border border-[#E8C4C0] space-y-2">
                <p className="font-semibold text-[#2D2325]">Conditions for Return Approval:</p>
                <ul className="list-disc pl-5 space-y-1 text-[#6B5B5E]">
                  <li>Garment must be in original unworn, unwashed condition with all Maison Blush security ribbons attached.</li>
                  <li>Items must be returned inside original archival dust bags and packaging.</li>
                  <li>Refunds are credited back to the original payment source within 48 hours of quality inspection.</li>
                </ul>
              </div>
            </div>
          )}

          {currentTab === 'privacy' && (
            <div className="space-y-4 font-light">
              <h3 className="font-serif text-base font-bold text-[#2D2325]">Data Confidentiality & OWASP Top 10 Standards</h3>
              <p>
                Your privacy is paramount. Maison Blush operates strict digital privacy controls adhering to modern international cybersecurity benchmarks:
              </p>
              <div className="p-4 bg-[#FAF5F3] rounded-2xl border border-[#E8C4C0] space-y-2">
                <ul className="list-disc pl-5 space-y-1 text-[#6B5B5E]">
                  <li><strong>Cryptographic Integrity:</strong> Zero storage of raw debit/credit card credentials. Payments are processed via PCI-DSS compliant Razorpay with HMAC-SHA256 signature verification.</li>
                  <li><strong>Stored XSS & Injection Prevention:</strong> All client reviews, addresses, and user inputs are strictly sanitized and encoded before storage.</li>
                  <li><strong>Session Protection:</strong> Strict SameSite cookies, JWT authentication, and automated rate limiting to prevent brute-force attacks.</li>
                </ul>
              </div>
            </div>
          )}

          {currentTab === 'terms' && (
            <div className="space-y-4 font-light">
              <h3 className="font-serif text-base font-bold text-[#2D2325]">Atelier Purchase Agreement</h3>
              <p>
                By completing an order on the Maison Blush online platform, you agree to our standard boutique terms of service.
              </p>
              <p>
                Every garment is subject to artisanal availability. Because many of our collections are hand-stitched in limited runs, items in your cart are not reserved until checkout is fully secured.
              </p>
              <p>
                In the rare instance of an accidental stock discrepancy or silk dye run, our client concierge will reach out directly to arrange an immediate full refund or bespoke priority pre-order.
              </p>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 sm:p-6 border-t border-[#F4E3DF] bg-[#FAF5F3] flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
          <span className="text-[#6B5B5E]">Need personalized assistance?</span>
          <button
            onClick={() => {
              closePolicy();
              scrollToSection('contact');
            }}
            className="text-[#8C5353] font-bold hover:underline flex items-center gap-1 cursor-pointer"
          >
            <span>Contact Boutique Concierge</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
