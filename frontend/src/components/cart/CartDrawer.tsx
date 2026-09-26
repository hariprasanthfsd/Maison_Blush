import React, { useState } from 'react';
import { X, ShoppingBag, Plus, Minus, Trash2, ArrowRight, Tag } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useUIModal } from '../../context/UIModalContext';

export const CartDrawer: React.FC = () => {
  const { cart, isCartOpen, setIsCartOpen, updateQuantity, removeItem, appliedCoupon, applyCoupon, removeCoupon } = useCart();
  const { openCheckout, scrollToSection } = useUIModal();
  const [couponCode, setCouponCode] = useState('');
  const [isApplying, setIsApplying] = useState(false);

  if (!isCartOpen) return null;

  const handleCouponSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponCode.trim()) return;

    setIsApplying(true);
    await applyCoupon(couponCode.trim());
    setIsApplying(false);
    setCouponCode('');
  };

  const discount = appliedCoupon ? appliedCoupon.calculatedDiscount : 0;
  const subtotal = cart?.subtotal || 0;
  const shipping = subtotal >= 2999 || subtotal === 0 ? 0 : 150;
  const total = Math.max(0, subtotal - discount + shipping);

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity" onClick={() => setIsCartOpen(false)} />

      {/* Drawer */}
      <div className="relative w-full max-w-md bg-[#FFFDFB] h-full shadow-2xl flex flex-col justify-between z-50 animate-slide-right">
        
        {/* Header */}
        <div className="p-6 border-b border-[#F4E3DF] flex items-center justify-between bg-[#FAF5F3]">
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-[#8C5353]" />
            <h2 className="font-serif text-lg font-bold text-[#2D2325]">Your Shopping Bag</h2>
            <span className="text-xs text-[#C49A8B] font-semibold">({cart?.totalQuantity || 0})</span>
          </div>
          <button onClick={() => setIsCartOpen(false)} className="p-1 text-stone-400 hover:text-[#2D2325]">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Cart Item List */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4 divide-y divide-[#FAF5F3]">
          {!cart || cart.items.length === 0 ? (
            <div className="py-16 text-center">
              <ShoppingBag className="w-12 h-12 text-[#E8C4C0] mx-auto mb-3 stroke-[1.5]" />
              <p className="font-serif text-lg text-[#2D2325]">Your bag is empty</p>
              <p className="text-xs text-[#6B5B5E] mt-1 mb-6">Discover our romantic luxury fashion collection.</p>
              <button
                onClick={() => {
                  setIsCartOpen(false);
                  scrollToSection('collection');
                }}
                className="px-6 py-2.5 bg-[#2D2325] text-white text-xs uppercase font-semibold tracking-wider rounded-xl shadow-sm hover:bg-[#8C5353] transition-colors cursor-pointer"
              >
                Shop New Arrivals
              </button>
            </div>
          ) : (
            cart.items.map((item) => (
              <div key={item.id} className="pt-4 first:pt-0 flex gap-4">
                <img
                  src={item.productImageUrl || 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&w=800&q=80'}
                  alt={item.productName}
                  className="w-20 h-24 object-cover rounded-xl bg-[#FAF5F3] flex-shrink-0"
                />

                <div className="flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-start">
                      <h4 className="font-serif text-sm font-semibold text-[#2D2325] line-clamp-1">{item.productName}</h4>
                      <button onClick={() => removeItem(item.id)} className="text-stone-400 hover:text-red-600 p-1">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    {(item.size || item.colorName) && (
                      <p className="text-[11px] text-[#C49A8B] mt-0.5">
                        {item.size && `Size: ${item.size}`} {item.colorName && `• Color: ${item.colorName}`}
                      </p>
                    )}

                    <p className="font-serif text-sm font-bold text-[#8C5353] mt-1">
                      ₹{item.unitPrice.toLocaleString('en-IN')}
                    </p>
                  </div>

                  {/* Quantity controls */}
                  <div className="flex items-center justify-between mt-2">
                    <div className="flex items-center border border-[#E8C4C0] rounded-lg bg-[#FAF5F3]">
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="p-1 text-stone-600 hover:text-black"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="px-3 text-xs font-semibold">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="p-1 text-stone-600 hover:text-black"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>

                    <span className="text-xs font-bold text-[#2D2325]">
                      ₹{(item.unitPrice * item.quantity).toLocaleString('en-IN')}
                    </span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer Summary & Checkout */}
        {cart && cart.items.length > 0 && (
          <div className="p-6 border-t border-[#F4E3DF] bg-[#FAF5F3] space-y-4">
            
            {/* Coupon Code Entry */}
            {appliedCoupon ? (
              <div className="flex items-center justify-between p-3 bg-[#FFFDFB] border border-[#D9A09A] rounded-xl text-xs">
                <div className="flex items-center gap-2 text-[#8C5353] font-semibold">
                  <Tag className="w-4 h-4" />
                  <span>Coupon Code '{appliedCoupon.code}' (-₹{appliedCoupon.calculatedDiscount})</span>
                </div>
                <button onClick={removeCoupon} className="text-stone-400 hover:text-red-600 font-bold">
                  <X className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <form onSubmit={handleCouponSubmit} className="flex gap-2">
                <input
                  type="text"
                  placeholder="Promo Code (e.g. WELCOME10)"
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value)}
                  className="flex-1 bg-[#FFFDFB] border border-[#E8C4C0] rounded-xl px-3 py-2 text-xs uppercase font-medium text-[#2D2325] focus:outline-none focus:border-[#8C5353]"
                />
                <button
                  type="submit"
                  disabled={isApplying || !couponCode}
                  className="px-4 py-2 bg-[#2D2325] text-white text-xs font-semibold rounded-xl hover:bg-[#8C5353] transition-colors"
                >
                  Apply
                </button>
              </form>
            )}

            {/* Subtotal & Total breakdown */}
            <div className="space-y-1.5 text-xs text-[#6B5B5E]">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="font-semibold text-[#2D2325]">₹{subtotal.toLocaleString('en-IN')}</span>
              </div>
              {discount > 0 && (
                <div className="flex justify-between text-[#8C5353] font-semibold">
                  <span>Discount</span>
                  <span>-₹{discount.toLocaleString('en-IN')}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>Shipping</span>
                <span>{shipping === 0 ? <strong className="text-emerald-700">FREE</strong> : `₹${shipping}`}</span>
              </div>
              <div className="flex justify-between text-sm font-bold text-[#2D2325] pt-2 border-t border-[#E8C4C0]">
                <span>Estimated Total</span>
                <span className="font-serif text-lg text-[#8C5353]">₹{total.toLocaleString('en-IN')}</span>
              </div>
            </div>

            {/* Checkout Button */}
            <button
              onClick={() => {
                setIsCartOpen(false);
                openCheckout();
              }}
              className="w-full py-3.5 bg-[#8C5353] hover:bg-[#6E3C3D] text-white font-semibold text-xs uppercase tracking-widest rounded-xl shadow-boutique transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>Proceed to Checkout</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
