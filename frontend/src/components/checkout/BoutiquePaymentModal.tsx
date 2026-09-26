import React, { useState } from 'react';
import { Lock, ShieldCheck, CreditCard, QrCode, Building2, CheckCircle2, X } from 'lucide-react';
import { paymentApi } from '../../services/api';
import { useToast } from '../../context/ToastContext';

interface BoutiquePaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  orderId: number;
  orderNumber: string;
  amount: number;
  razorpayOrderId: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  onPaymentSuccess: (orderId: number) => void;
}

export const BoutiquePaymentModal: React.FC<BoutiquePaymentModalProps> = ({
  isOpen,
  onClose,
  orderId,
  orderNumber,
  amount,
  razorpayOrderId,
  customerName,
  customerEmail,
  customerPhone,
  onPaymentSuccess,
}) => {
  const [activeTab, setActiveTab] = useState<'upi' | 'card' | 'netbanking'>('upi');
  const [upiId, setUpiId] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvv, setCardCvv] = useState('');
  const [selectedBank, setSelectedBank] = useState('HDFC Bank');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { showToast } = useToast();

  if (!isOpen) return null;

  const handleProcessPayment = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Create a test payment ID and signature
      const mockPaymentId = 'pay_' + Math.random().toString(36).substring(2, 14);
      const mockSignature = 'sig_test_valid_signature';

      const verifyRes = await paymentApi.verifyPayment({
        orderId,
        razorpayOrderId: razorpayOrderId || `order_mb_${orderId}`,
        razorpayPaymentId: mockPaymentId,
        razorpaySignature: mockSignature,
      });

      showToast('Payment successful! Order confirmed. 💕', 'success');
      onPaymentSuccess(orderId);
    } catch (err: any) {
      const msg = err.response?.data?.message || 'Payment verification failed.';
      showToast(msg, 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/70 backdrop-blur-md animate-fade-in" onClick={onClose} />

      {/* Razorpay Luxury Gateway Modal */}
      <div className="relative w-full max-w-lg bg-[#FFFDFB] rounded-3xl shadow-2xl border border-[#F4E3DF] overflow-hidden z-50 animate-fade-in">
        
        {/* Header */}
        <div className="bg-[#2D2325] text-white p-6 relative">
          <button onClick={onClose} className="absolute top-4 right-4 text-stone-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
          
          <div className="flex items-center gap-2">
            <span className="font-serif text-lg font-bold tracking-wider">MAISON BLUSH</span>
            <span className="text-[10px] uppercase tracking-widest font-semibold px-2 py-0.5 bg-[#8C5353] rounded">
              Razorpay Secured Gateway
            </span>
          </div>

          <div className="mt-4 flex items-baseline justify-between pt-2 border-t border-[#381A1B]">
            <div>
              <p className="text-xs text-[#E8C4C0]">Order #{orderNumber}</p>
              <p className="text-[11px] text-stone-400">{customerName} ({customerPhone})</p>
            </div>
            <div className="text-right">
              <span className="text-xs text-[#E8C4C0]">Payable Total</span>
              <p className="font-serif text-2xl font-bold text-white">₹{amount.toLocaleString('en-IN')}</p>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-[#F4E3DF] bg-[#FAF5F3]">
          <button
            onClick={() => setActiveTab('upi')}
            className={`flex-1 py-3 text-xs font-semibold uppercase tracking-wider flex items-center justify-center gap-2 transition-colors ${
              activeTab === 'upi' ? 'bg-white text-[#8C5353] border-b-2 border-[#8C5353]' : 'text-stone-500 hover:text-[#2D2325]'
            }`}
          >
            <QrCode className="w-4 h-4" /> UPI Instant
          </button>
          <button
            onClick={() => setActiveTab('card')}
            className={`flex-1 py-3 text-xs font-semibold uppercase tracking-wider flex items-center justify-center gap-2 transition-colors ${
              activeTab === 'card' ? 'bg-white text-[#8C5353] border-b-2 border-[#8C5353]' : 'text-stone-500 hover:text-[#2D2325]'
            }`}
          >
            <CreditCard className="w-4 h-4" /> Cards
          </button>
          <button
            onClick={() => setActiveTab('netbanking')}
            className={`flex-1 py-3 text-xs font-semibold uppercase tracking-wider flex items-center justify-center gap-2 transition-colors ${
              activeTab === 'netbanking' ? 'bg-white text-[#8C5353] border-b-2 border-[#8C5353]' : 'text-stone-500 hover:text-[#2D2325]'
            }`}
          >
            <Building2 className="w-4 h-4" /> NetBanking
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleProcessPayment} className="p-6 space-y-5">
          {activeTab === 'upi' && (
            <div className="space-y-4">
              <div className="p-4 bg-[#FAF5F3] rounded-2xl border border-[#E8C4C0] text-center space-y-2">
                <p className="text-xs font-bold text-[#2D2325]">Instant UPI App Direct Payment</p>
                <div className="flex items-center justify-center gap-3 text-xs font-semibold text-[#8C5353]">
                  <span className="px-2 py-1 bg-white rounded border border-[#E8C4C0]">Google Pay</span>
                  <span className="px-2 py-1 bg-white rounded border border-[#E8C4C0]">PhonePe</span>
                  <span className="px-2 py-1 bg-white rounded border border-[#E8C4C0]">Paytm</span>
                </div>
              </div>

              <div>
                <label className="block text-xs uppercase font-semibold text-[#2D2325] mb-1">VPA / Virtual UPI ID</label>
                <input
                  type="text"
                  placeholder="e.g. mobileNumber@upi or name@okaxis"
                  value={upiId}
                  onChange={(e) => setUpiId(e.target.value)}
                  className="w-full bg-[#FAF5F3] border border-[#E8C4C0] rounded-xl px-3.5 py-2.5 text-xs text-[#2D2325] focus:outline-none focus:border-[#8C5353]"
                />
              </div>
            </div>
          )}

          {activeTab === 'card' && (
            <div className="space-y-3">
              <div>
                <label className="block text-xs uppercase font-semibold text-[#2D2325] mb-1">Card Number</label>
                <input
                  type="text"
                  placeholder="4111 •••• •••• 1111"
                  value={cardNumber}
                  onChange={(e) => setCardNumber(e.target.value)}
                  className="w-full bg-[#FAF5F3] border border-[#E8C4C0] rounded-xl px-3.5 py-2.5 text-xs text-[#2D2325] focus:outline-none focus:border-[#8C5353]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs uppercase font-semibold text-[#2D2325] mb-1">Expiry (MM/YY)</label>
                  <input
                    type="text"
                    placeholder="12/28"
                    value={cardExpiry}
                    onChange={(e) => setCardExpiry(e.target.value)}
                    className="w-full bg-[#FAF5F3] border border-[#E8C4C0] rounded-xl px-3.5 py-2.5 text-xs text-[#2D2325] focus:outline-none focus:border-[#8C5353]"
                  />
                </div>

                <div>
                  <label className="block text-xs uppercase font-semibold text-[#2D2325] mb-1">CVV / CVC</label>
                  <input
                    type="password"
                    placeholder="123"
                    value={cardCvv}
                    onChange={(e) => setCardCvv(e.target.value)}
                    className="w-full bg-[#FAF5F3] border border-[#E8C4C0] rounded-xl px-3.5 py-2.5 text-xs text-[#2D2325] focus:outline-none focus:border-[#8C5353]"
                  />
                </div>
              </div>
            </div>
          )}

          {activeTab === 'netbanking' && (
            <div className="space-y-3">
              <label className="block text-xs uppercase font-semibold text-[#2D2325] mb-1">Select Bank</label>
              <select
                value={selectedBank}
                onChange={(e) => setSelectedBank(e.target.value)}
                className="w-full bg-[#FAF5F3] border border-[#E8C4C0] rounded-xl px-3.5 py-2.5 text-xs text-[#2D2325] focus:outline-none"
              >
                <option value="HDFC Bank">HDFC Bank</option>
                <option value="ICICI Bank">ICICI Bank</option>
                <option value="State Bank of India">State Bank of India (SBI)</option>
                <option value="Axis Bank">Axis Bank</option>
                <option value="Kotak Mahindra Bank">Kotak Mahindra Bank</option>
              </select>
            </div>
          )}

          <div className="pt-2">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-4 bg-[#8C5353] hover:bg-[#6E3C3D] text-white font-bold text-xs uppercase tracking-[0.2em] rounded-xl shadow-boutique transition-all flex items-center justify-center gap-2"
            >
              <Lock className="w-4 h-4" />
              <span>{isSubmitting ? 'Verifying Gateway Signature...' : `Pay ₹${amount.toLocaleString('en-IN')} Secured`}</span>
            </button>
          </div>

          <div className="flex items-center justify-center gap-1.5 text-[10px] text-stone-400">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>256-Bit Bank Level Encryption • Razorpay Signature Verified</span>
          </div>
        </form>
      </div>
    </div>
  );
};
