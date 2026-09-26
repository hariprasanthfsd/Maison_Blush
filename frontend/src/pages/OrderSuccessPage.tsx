import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { CheckCircle2, Package, Truck, Clock, Printer, ArrowRight } from 'lucide-react';
import { BackButton } from '../components/common/BackButton';
import { orderApi } from '../services/api';
import { Order } from '../types';

export const OrderSuccessPage: React.FC = () => {
  const { orderId } = useParams<{ orderId: string }>();
  const [order, setOrder] = useState<Order | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const loadOrder = async () => {
      if (!orderId) return;
      try {
        const data = await orderApi.getOrderById(Number(orderId));
        setOrder(data);
      } catch (err) {
        console.error('Failed to load order details:', err);
      } finally {
        setIsLoading(false);
      }
    };
    loadOrder();
  }, [orderId]);

  if (isLoading) {
    return (
      <div className="py-20 bg-[#FAF5F3] min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-12 h-12 border-4 border-[#8C5353] border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="font-serif text-base text-[#2D2325]">Verifying Order Confirmation...</p>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="py-20 bg-[#FAF5F3] min-h-screen text-center space-y-4">
        <h2 className="font-serif text-2xl font-bold text-[#2D2325]">Order Details Unavailable</h2>
        <Link to="/shop" className="px-6 py-2.5 bg-[#2D2325] text-white rounded-xl text-xs uppercase font-semibold">
          Return to Shop
        </Link>
      </div>
    );
  }

  return (
    <div className="py-12 bg-[#FAF5F3] min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Back Navigation */}
        <div>
          <BackButton label="Back to Home" to="/" />
        </div>

        {/* Banner */}
        <div className="bg-white p-8 sm:p-12 rounded-3xl border border-[#F4E3DF] shadow-soft text-center space-y-4">
          <div className="w-16 h-16 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-sm">
            <CheckCircle2 className="w-10 h-10" />
          </div>
          <span className="font-script text-2xl text-[#C49A8B]">Thank You for Buying at Maison Blush</span>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[#2D2325]">Order Confirmed!</h1>
          <p className="text-xs text-[#6B5B5E] max-w-md mx-auto">
            Your payment was successfully verified. Order <strong className="text-[#2D2325]">#{order.orderNumber}</strong> has been logged in our atelier system.
          </p>

          <div className="inline-flex items-center gap-3 pt-2">
            <button
              onClick={() => window.print()}
              className="px-4 py-2 bg-[#FAF5F3] border border-[#E8C4C0] hover:bg-white text-[#2D2325] rounded-xl text-xs font-semibold flex items-center gap-2"
            >
              <Printer className="w-4 h-4 text-[#8C5353]" /> Print Receipt
            </button>
            <Link
              to="/shop"
              className="px-6 py-2 bg-[#2D2325] hover:bg-[#8C5353] text-white rounded-xl text-xs font-semibold uppercase tracking-wider flex items-center gap-2"
            >
              <span>Continue Shopping</span> <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>

        {/* Timeline Status Tracker */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#F4E3DF] shadow-soft space-y-6">
          <h3 className="font-serif text-lg font-bold text-[#2D2325]">Order Status Timeline</h3>
          
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
            {[
              { label: 'Order Confirmed', icon: CheckCircle2, status: 'Confirmed', done: true },
              { label: 'Atelier Processing', icon: Clock, status: 'Processing', done: ['Processing', 'Packed', 'Shipped', 'Delivered'].includes(order.orderStatus) },
              { label: 'Courier Shipped', icon: Truck, status: 'Shipped', done: ['Shipped', 'Delivered'].includes(order.orderStatus) },
              { label: 'Delivered', icon: Package, status: 'Delivered', done: order.orderStatus === 'Delivered' },
            ].map((step, idx) => {
              const Icon = step.icon;
              return (
                <div key={idx} className={`p-4 rounded-2xl border transition-all ${step.done ? 'bg-[#FAF5F3] border-[#D9A09A] text-[#8C5353]' : 'bg-stone-50 border-stone-200 text-stone-400'}`}>
                  <Icon className="w-6 h-6 mx-auto mb-2" />
                  <p className="text-xs font-bold">{step.label}</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Items Breakdown */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#F4E3DF] shadow-soft space-y-6">
          <h3 className="font-serif text-lg font-bold text-[#2D2325]">Order Items & Receipt</h3>

          <div className="divide-y divide-[#FAF5F3]">
            {order.items.map((item) => (
              <div key={item.id} className="py-4 first:pt-0 flex items-center justify-between text-xs">
                <div className="flex items-center gap-4">
                  <img src={item.productImageUrl} alt={item.productName} className="w-12 h-14 object-cover rounded-lg bg-[#FAF5F3]" />
                  <div>
                    <p className="font-bold text-[#2D2325]">{item.productName}</p>
                    <p className="text-[#C49A8B]">{item.variantDescription}</p>
                    <p className="text-stone-500">Qty: {item.quantity} × ₹{item.unitPrice.toLocaleString('en-IN')}</p>
                  </div>
                </div>
                <span className="font-serif text-sm font-bold text-[#2D2325]">₹{item.totalPrice.toLocaleString('en-IN')}</span>
              </div>
            ))}
          </div>

          <div className="pt-4 border-t border-[#FAF5F3] space-y-2 text-xs text-[#6B5B5E]">
            <div className="flex justify-between"><span>Subtotal</span><span className="font-semibold text-[#2D2325]">₹{order.subtotal.toLocaleString('en-IN')}</span></div>
            {order.discountAmount > 0 && <div className="flex justify-between text-[#8C5353]"><span>Discount</span><span>-₹{order.discountAmount.toLocaleString('en-IN')}</span></div>}
            <div className="flex justify-between"><span>Shipping Fee</span><span>₹{order.shippingFee.toLocaleString('en-IN')}</span></div>
            <div className="flex justify-between"><span>Taxes</span><span>₹{order.taxAmount.toLocaleString('en-IN')}</span></div>
            <div className="flex justify-between text-base font-bold text-[#2D2325] pt-2 border-t border-[#F4E3DF]">
              <span>Paid Total</span>
              <span className="font-serif text-xl text-[#8C5353]">₹{order.totalAmount.toLocaleString('en-IN')}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
