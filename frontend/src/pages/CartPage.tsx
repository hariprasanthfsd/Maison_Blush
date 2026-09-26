import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingBag, Minus, Plus, Trash2, ArrowRight, Tag, X, ArrowLeft } from 'lucide-react';
import { BackButton } from '../components/common/BackButton';
import { useCart } from '../context/CartContext';

export const CartPage: React.FC = () => {
  const { cart, updateQuantity, removeItem, appliedCoupon, applyCoupon, removeCoupon } = useCart();
  const [couponCode, setCouponCode] = useState('');
  const [isApplying, setIsApplying] = useState(false);
  const navigate = useNavigate();

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
  const tax = Math.round((subtotal - discount) * 0.05);
  const total = Math.max(0, subtotal - discount + shipping + tax);

  if (!cart || cart.items.length === 0) {
    return (
      <div className="py-20 bg-[#FAF5F3] min-h-[70vh] flex items-center justify-center">
        <div className="text-center space-y-4 max-w-md bg-white p-10 rounded-3xl border border-[#F4E3DF] shadow-soft">
          <ShoppingBag className="w-16 h-16 text-[#E8C4C0] mx-auto stroke-[1.5]" />
          <h2 className="font-serif text-2xl font-bold text-[#2D2325]">Your Shopping Bag is Empty</h2>
          <p className="text-xs text-[#6B5B5E]">Explore our newly arrived romantic fashion collection and discover your signature look.</p>
          <button
            onClick={() => navigate('/shop')}
            className="px-8 py-3 bg-[#2D2325] text-white text-xs uppercase font-bold tracking-widest rounded-xl hover:bg-[#8C5353] transition-colors"
          >
            Explore Catalog
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="py-12 bg-[#FAF5F3] min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Back Navigation */}
        <div className="flex items-center justify-between">
          <BackButton label="Back to Shopping" fallbackUrl="/shop" />
          <Link to="/shop" className="text-xs font-semibold text-[#8C5353] hover:underline flex items-center gap-1">
            Continue Shopping →
          </Link>
        </div>

        {/* Title */}
        <div>
          <span className="font-script text-2xl text-[#C49A8B]">Atelier Cart</span>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[#2D2325]">Shopping Bag ({cart.totalQuantity})</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Item List Table */}
          <div className="lg:col-span-2 bg-white p-6 sm:p-8 rounded-3xl border border-[#F4E3DF] shadow-soft space-y-6">
            <div className="divide-y divide-[#FAF5F3]">
              {cart.items.map((item) => (
                <div key={item.id} className="py-6 first:pt-0 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
                  
                  <div className="flex items-center gap-4">
                    <img
                      src={item.productImageUrl || 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&w=800&q=80'}
                      alt={item.productName}
                      className="w-20 h-24 object-cover rounded-xl bg-[#FAF5F3]"
                    />
                    <div>
                      <Link to={`/product/${item.productId}`} className="font-serif text-base font-bold text-[#2D2325] hover:text-[#8C5353] transition-colors">
                        {item.productName}
                      </Link>
                      {(item.size || item.colorName) && (
                        <p className="text-xs text-[#C49A8B] mt-1">
                          {item.size && `Size: ${item.size}`} {item.colorName && `• Color: ${item.colorName}`}
                        </p>
                      )}
                      <p className="font-serif text-sm font-semibold text-[#8C5353] mt-1">
                        ₹{item.unitPrice.toLocaleString('en-IN')}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between w-full sm:w-auto gap-6">
                    {/* Quantity Selector */}
                    <div className="flex items-center border border-[#E8C4C0] rounded-xl bg-[#FAF5F3] p-1">
                      <button onClick={() => updateQuantity(item.id, item.quantity - 1)} className="p-1.5 text-stone-600 hover:text-black">
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                      <span className="px-4 text-xs font-semibold">{item.quantity}</span>
                      <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="p-1.5 text-stone-600 hover:text-black">
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <span className="font-serif text-base font-bold text-[#2D2325] min-w-[80px] text-right">
                      ₹{(item.unitPrice * item.quantity).toLocaleString('en-IN')}
                    </span>

                    <button onClick={() => removeItem(item.id)} className="text-stone-400 hover:text-red-600 p-1">
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Summary Sidebar */}
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#F4E3DF] shadow-soft space-y-6 h-fit">
            <h3 className="font-serif text-xl font-bold text-[#2D2325] pb-4 border-b border-[#FAF5F3]">Order Summary</h3>

            {/* Promo Code Form */}
            {appliedCoupon ? (
              <div className="flex items-center justify-between p-3 bg-[#FAF5F3] border border-[#D9A09A] rounded-xl text-xs">
                <div className="flex items-center gap-2 text-[#8C5353] font-semibold">
                  <Tag className="w-4 h-4" />
                  <span>Coupon '{appliedCoupon.code}' (-₹{appliedCoupon.calculatedDiscount})</span>
                </div>
                <button onClick={removeCoupon} className="text-stone-400 hover:text-red-600 font-bold">
                  <X className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <form onSubmit={handleCouponSubmit} className="flex gap-2">
                <input
                  type="text"
                  placeholder="Coupon Code"
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value)}
                  className="flex-1 bg-[#FAF5F3] border border-[#E8C4C0] rounded-xl px-3 py-2 text-xs uppercase font-medium text-[#2D2325] focus:outline-none focus:border-[#8C5353]"
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

            {/* Calculations */}
            <div className="space-y-3 text-xs text-[#6B5B5E]">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="font-semibold text-[#2D2325]">₹{subtotal.toLocaleString('en-IN')}</span>
              </div>
              {discount > 0 && (
                <div className="flex justify-between text-[#8C5353] font-semibold">
                  <span>Coupon Savings</span>
                  <span>-₹{discount.toLocaleString('en-IN')}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>Shipping Charges</span>
                <span>{shipping === 0 ? <strong className="text-emerald-700">FREE</strong> : `₹${shipping}`}</span>
              </div>
              <div className="flex justify-between">
                <span>GST Tax (5%)</span>
                <span>₹{tax.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between text-base font-bold text-[#2D2325] pt-4 border-t border-[#F4E3DF]">
                <span>Total Amount</span>
                <span className="font-serif text-xl text-[#8C5353]">₹{total.toLocaleString('en-IN')}</span>
              </div>
            </div>

            {/* Checkout CTA */}
            <button
              onClick={() => navigate('/checkout')}
              className="w-full py-4 bg-[#8C5353] hover:bg-[#6E3C3D] text-white font-bold text-xs uppercase tracking-[0.2em] rounded-xl shadow-boutique transition-all flex items-center justify-center gap-2"
            >
              <span>Proceed to Checkout</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
