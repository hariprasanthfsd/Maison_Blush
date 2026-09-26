import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { orderApi } from '../services/api';
import { Order } from '../types';
import { User, Package, MapPin, Clock, ArrowRight, ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';
import { BackButton } from '../components/common/BackButton';

export const AccountPage: React.FC = () => {
  const { user } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadOrders = async () => {
      try {
        const data = await orderApi.getMyOrders();
        setOrders(data);
      } catch (err) {
        console.error('Failed to load user orders:', err);
      } finally {
        setIsLoading(false);
      }
    };
    if (user) loadOrders();
  }, [user]);

  if (!user) {
    return (
      <div className="py-20 bg-[#FAF5F3] text-center space-y-4">
        <h2 className="font-serif text-2xl font-bold text-[#2D2325]">Please Sign In</h2>
        <Link to="/login" className="px-6 py-2.5 bg-[#2D2325] text-white rounded-xl text-xs uppercase font-semibold">
          Go to Sign In
        </Link>
      </div>
    );
  }

  return (
    <div className="py-12 bg-[#FAF5F3] min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Back Navigation */}
        <div>
          <BackButton label="Back to Home" to="/" />
        </div>

        {/* Header */}
        <div className="bg-white p-8 rounded-3xl border border-[#F4E3DF] shadow-soft flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-[#FAF5F3] border border-[#E8C4C0] rounded-full flex items-center justify-center font-serif text-2xl font-bold text-[#8C5353]">
              {user.name.charAt(0).toUpperCase()}
            </div>
            <div>
              <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#2D2325]">{user.name}</h1>
              <p className="text-xs text-[#C49A8B]">{user.email} • {user.phone || 'No phone added'}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <span className="px-4 py-1.5 bg-[#FAF5F3] border border-[#E8C4C0] text-[#8C5353] rounded-full text-xs font-semibold uppercase">
              {user.role} Member
            </span>
          </div>
        </div>

        {/* Order History */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#F4E3DF] shadow-soft space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-[#FAF5F3]">
            <div className="flex items-center gap-2">
              <Package className="w-5 h-5 text-[#8C5353]" />
              <h2 className="font-serif text-xl font-bold text-[#2D2325]">Order History & Tracking</h2>
            </div>
            <span className="text-xs text-[#C49A8B] font-semibold">({orders.length} Orders)</span>
          </div>

          {isLoading ? (
            <div className="py-8 text-center text-xs text-[#C49A8B] animate-pulse">Loading order history...</div>
          ) : orders.length === 0 ? (
            <div className="py-12 text-center text-xs text-stone-500 space-y-3">
              <p>You have not placed any boutique orders yet.</p>
              <Link to="/shop" className="inline-block px-6 py-2 bg-[#2D2325] text-white rounded-xl font-semibold uppercase">
                Explore Collection
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {orders.map((order) => (
                <div key={order.id} className="p-5 bg-[#FAF5F3] rounded-2xl border border-[#E8C4C0] flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-3">
                      <span className="font-serif text-base font-bold text-[#2D2325]">#{order.orderNumber}</span>
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] uppercase font-bold ${
                        order.orderStatus === 'Delivered' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                      }`}>
                        {order.orderStatus}
                      </span>
                      <span className="text-[10px] text-stone-500">{new Date(order.createdAt).toLocaleDateString()}</span>
                    </div>

                    <p className="text-xs text-[#6B5B5E] mt-1">
                      {order.items.length} item(s) • Total: <strong className="text-[#8C5353]">₹{order.totalAmount.toLocaleString('en-IN')}</strong>
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setSelectedOrder(order)}
                      className="px-4 py-2 bg-white hover:bg-[#8C5353] text-[#2D2325] hover:text-white rounded-xl text-xs font-semibold border border-[#E8C4C0] transition-colors flex items-center gap-1"
                    >
                      <span>View Receipt & Tracking</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Modal Detail for Selected Order */}
        {selectedOrder && (
          <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4" onClick={() => setSelectedOrder(null)}>
            <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-2xl w-full space-y-6 max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
              <div className="flex justify-between items-start pb-4 border-b border-[#FAF5F3]">
                <div>
                  <h3 className="font-serif text-xl font-bold text-[#2D2325]">Order #{selectedOrder.orderNumber}</h3>
                  <p className="text-xs text-[#C49A8B]">Placed on {new Date(selectedOrder.createdAt).toLocaleString()}</p>
                </div>
                <button onClick={() => setSelectedOrder(null)} className="text-stone-400 hover:text-black font-bold">×</button>
              </div>

              <div className="space-y-3">
                <h4 className="text-xs uppercase font-bold text-[#2D2325]">Items Purchased</h4>
                <div className="divide-y divide-[#FAF5F3]">
                  {selectedOrder.items.map((item) => (
                    <div key={item.id} className="py-2 flex justify-between text-xs">
                      <span>{item.productName} ({item.variantDescription}) x{item.quantity}</span>
                      <span className="font-bold">₹{item.totalPrice.toLocaleString('en-IN')}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-4 border-t border-[#FAF5F3] flex justify-between items-center">
                <span className="text-xs font-bold text-[#2D2325]">Total Paid:</span>
                <span className="font-serif text-xl font-bold text-[#8C5353]">₹{selectedOrder.totalAmount.toLocaleString('en-IN')}</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
