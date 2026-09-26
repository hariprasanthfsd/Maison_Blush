import React, { useState, useEffect } from 'react';
import { X, Lock, CheckCircle2, CreditCard, ShoppingBag, ArrowRight, Sparkles, PackageCheck } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { useUIModal } from '../../context/UIModalContext';
import { orderApi, paymentApi } from '../../services/api';
import { ShippingAddress } from '../../types';
import { BoutiquePaymentModal } from './BoutiquePaymentModal';

export const CheckoutModal: React.FC = () => {
  const { isCheckoutOpen, closeCheckout, openAuthModal, scrollToSection } = useUIModal();
  const { cart, appliedCoupon, refreshCart } = useCart();
  const { user } = useAuth();
  const { showModalNotice, showToast } = useToast();

  const [address, setAddress] = useState<ShippingAddress>({
    fullName: user?.name || '',
    phone: user?.phone || '',
    street: '',
    city: 'Mumbai',
    state: 'Maharashtra',
    country: 'India',
    postalCode: '400050',
  });

  const [isProcessing, setIsProcessing] = useState(false);
  const [confirmedOrder, setConfirmedOrder] = useState<{
    orderId: number;
    orderNumber: string;
    totalAmount: number;
    itemsCount: number;
  } | null>(null);

  const [activePaymentModal, setActivePaymentModal] = useState<{
    isOpen: boolean;
    orderId: number;
    orderNumber: string;
    amount: number;
    razorpayOrderId: string;
  } | null>(null);

  useEffect(() => {
    if (user) {
      setAddress((prev) => ({
        ...prev,
        fullName: user.name,
        phone: user.phone || prev.phone,
      }));
    }
  }, [user]);

  useEffect(() => {
    if (!isCheckoutOpen) {
      setConfirmedOrder(null);
    }
  }, [isCheckoutOpen]);

  if (!isCheckoutOpen) return null;

  const subtotal = cart?.subtotal || 0;
  const discount = appliedCoupon ? appliedCoupon.calculatedDiscount : 0;
  const shipping = subtotal >= 2999 ? 0 : 150;
  const tax = Math.round((subtotal - discount) * 0.05);
  const total = Math.max(0, subtotal - discount + shipping + tax);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setAddress((prev) => ({ ...prev, [name]: value }));
  };

  const handlePaymentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!address.fullName || !address.phone || !address.street || !address.city || !address.postalCode) {
      showModalNotice('Please complete all required shipping address fields before proceeding.', 'Missing Delivery Info', 'warning');
      return;
    }

    if (!cart || cart.items.length === 0) {
      showToast('Your shopping bag is empty.', 'error');
      closeCheckout();
      return;
    }

    setIsProcessing(true);
    try {
      // 1. Create Order in ASP.NET Core Backend
      const orderRes = await orderApi.createOrder({
        shippingAddress: address,
        couponCode: appliedCoupon?.code || '',
      });

      // 2. Generate Razorpay Order in Backend
      let razorpayOrderRes;
      try {
        razorpayOrderRes = await paymentApi.createRazorpayOrder(orderRes.orderId);
      } catch {
        razorpayOrderRes = { razorpayOrderId: `order_mb_${orderRes.orderId}`, amount: orderRes.totalAmount };
      }

      // Open Razorpay Gateway Modal
      setActivePaymentModal({
        isOpen: true,
        orderId: orderRes.orderId,
        orderNumber: orderRes.orderNumber,
        amount: orderRes.totalAmount,
        razorpayOrderId: razorpayOrderRes.razorpayOrderId,
      });
    } catch (err: any) {
      const msg = err.response?.data?.message || 'Failed to place order. Please review your cart.';
      showModalNotice(msg, 'Checkout Error', 'error');
    } finally {
      setIsProcessing(false);
    }
  };

  const handlePaymentSuccess = (confirmedOrderId: number) => {
    if (activePaymentModal) {
      setConfirmedOrder({
        orderId: confirmedOrderId,
        orderNumber: activePaymentModal.orderNumber,
        totalAmount: activePaymentModal.amount,
        itemsCount: cart?.items.length || 1,
      });
    }
    refreshCart();
    setActivePaymentModal(null);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-[#2D2325]/70 backdrop-blur-md transition-opacity"
        onClick={closeCheckout}
      />

      {/* Modal Dialog */}
      <div className="relative w-full max-w-4xl bg-[#FFFDFB] rounded-3xl border border-[#F4E3DF] shadow-2xl overflow-hidden z-10 max-h-[92vh] flex flex-col animate-fade-in my-auto">
        {/* Floating Close Button */}
        <div className="absolute top-4 right-4 z-20">
          <button
            onClick={closeCheckout}
            className="p-2.5 rounded-full bg-white/90 hover:bg-white text-[#2D2325] hover:text-[#8C5353] border border-[#F4E3DF] shadow-sm transition-colors cursor-pointer"
            aria-label="Close Checkout"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Area */}
        <div className="overflow-y-auto p-6 sm:p-10">
          {confirmedOrder ? (
            /* Order Success View */
            <div className="text-center py-10 sm:py-16 space-y-6 max-w-lg mx-auto">
              <div className="w-20 h-20 bg-emerald-50 border border-emerald-200 rounded-full flex items-center justify-center mx-auto text-emerald-600 shadow-soft">
                <PackageCheck className="w-10 h-10 stroke-[1.5]" />
              </div>

              <div>
                <span className="font-script text-2xl text-[#C49A8B]">Payment Confirmed & Verified</span>
                <h2 className="font-serif text-3xl font-bold text-[#2D2325] mt-1">Thank You For Your Order!</h2>
                <p className="text-xs text-[#6B5B5E] mt-2">
                  Order <span className="font-bold text-[#2D2325]">#{confirmedOrder.orderNumber}</span> has been dispatched to our Mumbai atelier for artisan hand-finishing.
                </p>
              </div>

              <div className="p-5 bg-[#FAF5F3] rounded-2xl border border-[#E8C4C0] space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-[#6B5B5E]">Estimated Delivery</span>
                  <span className="font-semibold text-[#2D2325]">2-4 Business Days Express</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#6B5B5E]">Total Amount Paid</span>
                  <span className="font-bold text-[#8C5353]">₹{confirmedOrder.totalAmount.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#6B5B5E]">Confirmation Sent To</span>
                  <span className="font-medium text-[#2D2325] truncate">{user?.email || 'Your Registered Email'}</span>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 pt-4">
                <button
                  onClick={() => {
                    closeCheckout();
                    openAuthModal('orders');
                  }}
                  className="flex-1 py-3 bg-[#2D2325] hover:bg-[#8C5353] text-white rounded-xl text-xs uppercase font-bold tracking-wider transition-colors cursor-pointer"
                >
                  Track in My Orders
                </button>
                <button
                  onClick={() => {
                    closeCheckout();
                    scrollToSection('collection');
                  }}
                  className="flex-1 py-3 bg-white hover:bg-[#FAF5F3] text-[#2D2325] border border-[#E8C4C0] rounded-xl text-xs uppercase font-bold tracking-wider transition-colors cursor-pointer"
                >
                  Continue Shopping
                </button>
              </div>
            </div>
          ) : !cart || cart.items.length === 0 ? (
            /* Empty Cart View */
            <div className="text-center py-16 space-y-4">
              <ShoppingBag className="w-16 h-16 text-[#E8C4C0] mx-auto stroke-[1.5]" />
              <h3 className="font-serif text-2xl font-bold text-[#2D2325]">Your Shopping Bag is Empty</h3>
              <p className="text-xs text-[#6B5B5E] max-w-sm mx-auto">
                Explore our signature haute couture gowns, linen tops, and fine accessories to proceed with checkout.
              </p>
              <button
                onClick={() => {
                  closeCheckout();
                  scrollToSection('collection');
                }}
                className="px-8 py-3 bg-[#2D2325] hover:bg-[#8C5353] text-white rounded-xl text-xs uppercase font-bold tracking-wider transition-colors cursor-pointer"
              >
                Browse Collection
              </button>
            </div>
          ) : (
            /* Standard Checkout Form */
            <div className="space-y-8">
              {/* Modal Header */}
              <div className="text-center max-w-md mx-auto">
                <span className="font-script text-2xl text-[#C49A8B]">Express Atelier Dispatch</span>
                <h2 className="font-serif text-3xl font-bold text-[#2D2325]">Shipping & Secure Payment</h2>
              </div>

              <form onSubmit={handlePaymentSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left: Address Form */}
                <div className="lg:col-span-2 space-y-6">
                  <div className="bg-white p-6 rounded-2xl border border-[#F4E3DF] shadow-soft space-y-4">
                    <div className="flex items-center gap-2 pb-3 border-b border-[#FAF5F3]">
                      <CheckCircle2 className="w-4 h-4 text-[#8C5353]" />
                      <h3 className="font-serif text-base font-bold text-[#2D2325]">Shipping & Delivery Address</h3>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs uppercase font-semibold text-[#2D2325] mb-1">Full Recipient Name *</label>
                        <input
                          type="text"
                          name="fullName"
                          value={address.fullName}
                          onChange={handleInputChange}
                          placeholder="e.g. Sophia Rose"
                          className="w-full bg-[#FAF5F3] border border-[#E8C4C0] rounded-xl px-3.5 py-2.5 text-xs text-[#2D2325] focus:outline-none focus:border-[#8C5353]"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-xs uppercase font-semibold text-[#2D2325] mb-1">Contact Phone Number *</label>
                        <input
                          type="text"
                          name="phone"
                          value={address.phone}
                          onChange={handleInputChange}
                          placeholder="+91 9876543210"
                          className="w-full bg-[#FAF5F3] border border-[#E8C4C0] rounded-xl px-3.5 py-2.5 text-xs text-[#2D2325] focus:outline-none focus:border-[#8C5353]"
                          required
                        />
                      </div>

                      <div className="sm:col-span-2">
                        <label className="block text-xs uppercase font-semibold text-[#2D2325] mb-1">Street Address & Villa/Apt *</label>
                        <input
                          type="text"
                          name="street"
                          value={address.street}
                          onChange={handleInputChange}
                          placeholder="e.g. 45 Rosewood Villa, Bandra West"
                          className="w-full bg-[#FAF5F3] border border-[#E8C4C0] rounded-xl px-3.5 py-2.5 text-xs text-[#2D2325] focus:outline-none focus:border-[#8C5353]"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-xs uppercase font-semibold text-[#2D2325] mb-1">City *</label>
                        <input
                          type="text"
                          name="city"
                          value={address.city}
                          onChange={handleInputChange}
                          className="w-full bg-[#FAF5F3] border border-[#E8C4C0] rounded-xl px-3.5 py-2.5 text-xs text-[#2D2325] focus:outline-none focus:border-[#8C5353]"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-xs uppercase font-semibold text-[#2D2325] mb-1">State *</label>
                        <input
                          type="text"
                          name="state"
                          value={address.state}
                          onChange={handleInputChange}
                          className="w-full bg-[#FAF5F3] border border-[#E8C4C0] rounded-xl px-3.5 py-2.5 text-xs text-[#2D2325] focus:outline-none focus:border-[#8C5353]"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-xs uppercase font-semibold text-[#2D2325] mb-1">Postal / Pin Code *</label>
                        <input
                          type="text"
                          name="postalCode"
                          value={address.postalCode}
                          onChange={handleInputChange}
                          className="w-full bg-[#FAF5F3] border border-[#E8C4C0] rounded-xl px-3.5 py-2.5 text-xs text-[#2D2325] focus:outline-none focus:border-[#8C5353]"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-xs uppercase font-semibold text-[#2D2325] mb-1">Country</label>
                        <input
                          type="text"
                          name="country"
                          value={address.country}
                          readOnly
                          className="w-full bg-stone-100 border border-stone-200 rounded-xl px-3.5 py-2.5 text-xs text-stone-600"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="bg-white p-5 rounded-2xl border border-[#F4E3DF] shadow-soft flex items-center gap-3">
                    <CreditCard className="w-5 h-5 text-[#8C5353] flex-shrink-0" />
                    <div>
                      <h4 className="font-serif text-sm font-bold text-[#2D2325]">Instant Payment Protection</h4>
                      <p className="text-[11px] text-[#6B5B5E]">UPI Apps (GPay, PhonePe, Paytm), Debit/Credit Cards & NetBanking supported.</p>
                    </div>
                  </div>
                </div>

                {/* Right: Summary */}
                <div className="bg-white p-6 rounded-2xl border border-[#F4E3DF] shadow-soft space-y-5 h-fit">
                  <h3 className="font-serif text-lg font-bold text-[#2D2325] pb-3 border-b border-[#FAF5F3]">Order Overview</h3>

                  <div className="divide-y divide-[#FAF5F3] max-h-52 overflow-y-auto">
                    {cart.items.map((item) => (
                      <div key={item.id} className="py-2.5 flex justify-between items-center text-xs">
                        <div className="truncate pr-2">
                          <p className="font-semibold text-[#2D2325] truncate">{item.productName}</p>
                          <p className="text-[#C49A8B]">Qty: {item.quantity} {item.size && `• Size: ${item.size}`}</p>
                        </div>
                        <span className="font-bold text-[#2D2325] whitespace-nowrap">
                          ₹{(item.unitPrice * item.quantity).toLocaleString('en-IN')}
                        </span>
                      </div>
                    ))}
                  </div>

                  <div className="space-y-2 pt-3 border-t border-[#F4E3DF] text-xs text-[#6B5B5E]">
                    <div className="flex justify-between">
                      <span>Subtotal</span>
                      <span className="font-semibold text-[#2D2325]">₹{subtotal.toLocaleString('en-IN')}</span>
                    </div>
                    {discount > 0 && (
                      <div className="flex justify-between text-[#8C5353] font-semibold">
                        <span>Applied Coupon ({appliedCoupon?.code})</span>
                        <span>-₹{discount.toLocaleString('en-IN')}</span>
                      </div>
                    )}
                    <div className="flex justify-between">
                      <span>Express Shipping</span>
                      <span>{shipping === 0 ? <strong className="text-emerald-700">FREE</strong> : `₹${shipping}`}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>GST Tax (5%)</span>
                      <span>₹{tax.toLocaleString('en-IN')}</span>
                    </div>
                    <div className="flex justify-between text-sm font-bold text-[#2D2325] pt-3 border-t border-[#F4E3DF]">
                      <span>Payable Total</span>
                      <span className="font-serif text-lg text-[#8C5353]">₹{total.toLocaleString('en-IN')}</span>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isProcessing}
                    className="w-full py-3.5 bg-[#8C5353] hover:bg-[#6E3C3D] text-white font-bold text-xs uppercase tracking-[0.18em] rounded-xl shadow-boutique transition-all flex items-center justify-center gap-2 cursor-pointer disabled:bg-stone-300"
                  >
                    <Lock className="w-4 h-4" />
                    <span>{isProcessing ? 'Connecting Gateway...' : `Pay ₹${total.toLocaleString('en-IN')} Secured`}</span>
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>
      </div>

      {/* Embedded Boutique Payment Gateway */}
      {activePaymentModal && (
        <BoutiquePaymentModal
          isOpen={activePaymentModal.isOpen}
          onClose={() => setActivePaymentModal(null)}
          orderId={activePaymentModal.orderId}
          orderNumber={activePaymentModal.orderNumber}
          amount={activePaymentModal.amount}
          razorpayOrderId={activePaymentModal.razorpayOrderId}
          customerName={address.fullName}
          customerEmail={user?.email || 'customer@maisonblush.com'}
          customerPhone={address.phone}
          onPaymentSuccess={handlePaymentSuccess}
        />
      )}
    </div>
  );
};
