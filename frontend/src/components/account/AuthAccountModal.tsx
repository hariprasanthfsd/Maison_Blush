import React, { useState, useEffect } from 'react';
import { X, Lock, Mail, User, Phone, ShieldCheck, ArrowRight, Package, ExternalLink, LogOut, CheckCircle } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useUIModal } from '../../context/UIModalContext';
import { useToast } from '../../context/ToastContext';
import { orderApi } from '../../services/api';
import { Order } from '../../types';

export const AuthAccountModal: React.FC = () => {
  const { isAuthModalOpen, closeAuthModal, authModalTab, openAuthModal, scrollToSection } = useUIModal();
  const { user, login, register, logout, isAdmin } = useAuth();
  const { showToast } = useToast();

  // Form states
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Orders state
  const [orders, setOrders] = useState<Order[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isLoadingOrders, setIsLoadingOrders] = useState(false);

  useEffect(() => {
    if (isAuthModalOpen && user && (authModalTab === 'orders' || authModalTab === 'account')) {
      const fetchOrders = async () => {
        setIsLoadingOrders(true);
        try {
          const data = await orderApi.getMyOrders();
          setOrders(data);
        } catch (err) {
          console.error('Failed to load orders:', err);
        } finally {
          setIsLoadingOrders(false);
        }
      };
      fetchOrders();
    }
  }, [isAuthModalOpen, user, authModalTab]);

  if (!isAuthModalOpen) return null;

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;

    setIsSubmitting(true);
    const success = await login(email, password);
    setIsSubmitting(false);
    if (success) {
      showToast('Welcome back to Maison Blush! 💕', 'success');
      openAuthModal('account');
    }
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !password) return;

    setIsSubmitting(true);
    const success = await register({ name, email, phone, password });
    setIsSubmitting(false);
    if (success) {
      showToast('Account created successfully! Welcome. 🥂', 'success');
      openAuthModal('account');
    }
  };

  const handleDemoLogin = async (demoEmail: string, demoPass: string) => {
    setIsSubmitting(true);
    const success = await login(demoEmail, demoPass);
    setIsSubmitting(false);
    if (success) {
      showToast(`Signed in as ${demoEmail.includes('admin') ? 'Administrator' : 'Customer'}!`, 'success');
      openAuthModal('account');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-[#2D2325]/70 backdrop-blur-md transition-opacity"
        onClick={closeAuthModal}
      />

      {/* Modal Dialog Card */}
      <div className="relative w-full max-w-2xl bg-[#FFFDFB] rounded-3xl border border-[#F4E3DF] shadow-2xl overflow-hidden z-10 max-h-[92vh] flex flex-col animate-fade-in my-auto">
        
        {/* Floating Close Button */}
        <div className="absolute top-4 right-4 z-20">
          <button
            onClick={closeAuthModal}
            className="p-2.5 rounded-full bg-white/90 hover:bg-white text-[#2D2325] hover:text-[#8C5353] border border-[#F4E3DF] shadow-sm transition-colors cursor-pointer"
            aria-label="Close Account Modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Header */}
        <div className="bg-[#FAF5F3] border-b border-[#F4E3DF] px-6 sm:px-8 pt-6 pb-2">
          <div className="flex items-center justify-between mb-4">
            <div>
              <span className="font-script text-2xl text-[#C49A8B]">Maison Blush Atelier</span>
              <h2 className="font-serif text-2xl font-bold text-[#2D2325]">
                {user
                  ? (authModalTab === 'orders' ? 'Order History & Status' : 'Atelier Member Profile')
                  : (authModalTab === 'register' ? 'Join the Atelier' : 'Client Sign In')}
              </h2>
            </div>
          </div>

          <div className="flex gap-4 text-xs uppercase font-semibold tracking-wider">
            {!user ? (
              <>
                <button
                  onClick={() => openAuthModal('login')}
                  className={`pb-2.5 transition-colors relative cursor-pointer ${
                    authModalTab === 'login' ? 'text-[#8C5353] font-bold' : 'text-stone-400 hover:text-[#2D2325]'
                  }`}
                >
                  Sign In
                  {authModalTab === 'login' && <span className="absolute bottom-0 left-0 w-full h-[2px] bg-[#8C5353]" />}
                </button>
                <button
                  onClick={() => openAuthModal('register')}
                  className={`pb-2.5 transition-colors relative cursor-pointer ${
                    authModalTab === 'register' ? 'text-[#8C5353] font-bold' : 'text-stone-400 hover:text-[#2D2325]'
                  }`}
                >
                  Create Account
                  {authModalTab === 'register' && <span className="absolute bottom-0 left-0 w-full h-[2px] bg-[#8C5353]" />}
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => openAuthModal('account')}
                  className={`pb-2.5 transition-colors relative cursor-pointer ${
                    authModalTab === 'account' ? 'text-[#8C5353] font-bold' : 'text-stone-400 hover:text-[#2D2325]'
                  }`}
                >
                  Profile Details
                  {authModalTab === 'account' && <span className="absolute bottom-0 left-0 w-full h-[2px] bg-[#8C5353]" />}
                </button>
                <button
                  onClick={() => openAuthModal('orders')}
                  className={`pb-2.5 transition-colors relative cursor-pointer flex items-center gap-1.5 ${
                    authModalTab === 'orders' ? 'text-[#8C5353] font-bold' : 'text-stone-400 hover:text-[#2D2325]'
                  }`}
                >
                  <span>My Orders</span>
                  {orders.length > 0 && (
                    <span className="px-1.5 py-0.2 bg-[#8C5353] text-white text-[10px] rounded-full">
                      {orders.length}
                    </span>
                  )}
                  {authModalTab === 'orders' && <span className="absolute bottom-0 left-0 w-full h-[2px] bg-[#8C5353]" />}
                </button>
              </>
            )}
          </div>
        </div>

        {/* Modal Body */}
        <div className="overflow-y-auto p-6 sm:p-8 flex-1">
          {/* TAB 1: LOGIN */}
          {!user && authModalTab === 'login' && (
            <div className="space-y-6 max-w-md mx-auto">
              {/* Quick Demo Shortcuts */}
              <div className="p-4 bg-[#FAF5F3] rounded-2xl border border-[#E8C4C0] space-y-2">
                <p className="text-[10px] font-bold uppercase text-[#8C5353] text-center tracking-wider">
                  Instant Test Sign-In
                </p>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => handleDemoLogin('customer@maisonblush.com', 'password123')}
                    className="py-2 px-3 bg-white hover:bg-[#8C5353] text-[#2D2325] hover:text-white rounded-xl text-xs font-semibold border border-[#E8C4C0] transition-colors flex items-center justify-center gap-1 cursor-pointer"
                  >
                    <User className="w-3.5 h-3.5" /> Customer Demo
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDemoLogin('admin@maisonblush.com', 'admin123')}
                    className="py-2 px-3 bg-[#2D2325] hover:bg-[#8C5353] text-white rounded-xl text-xs font-semibold transition-colors flex items-center justify-center gap-1 cursor-pointer"
                  >
                    <ShieldCheck className="w-3.5 h-3.5" /> Admin Demo
                  </button>
                </div>
              </div>

              <form onSubmit={handleLoginSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs uppercase font-semibold text-[#2D2325] mb-1">Email Address</label>
                  <div className="relative">
                    <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#C49A8B]" />
                    <input
                      type="email"
                      placeholder="you@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full bg-[#FAF5F3] border border-[#E8C4C0] rounded-xl pl-10 pr-4 py-2.5 text-xs text-[#2D2325] focus:outline-none focus:border-[#8C5353]"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs uppercase font-semibold text-[#2D2325] mb-1">Password</label>
                  <div className="relative">
                    <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#C49A8B]" />
                    <input
                      type="password"
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full bg-[#FAF5F3] border border-[#E8C4C0] rounded-xl pl-10 pr-4 py-2.5 text-xs text-[#2D2325] focus:outline-none focus:border-[#8C5353]"
                      required
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3.5 bg-[#8C5353] hover:bg-[#6E3C3D] text-white font-bold text-xs uppercase tracking-[0.16em] rounded-xl shadow-boutique transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span>{isSubmitting ? 'Authenticating...' : 'Sign In'}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>

              <p className="text-center text-xs text-[#6B5B5E]">
                Don't have an account?{' '}
                <button
                  onClick={() => openAuthModal('register')}
                  className="text-[#8C5353] font-semibold hover:underline cursor-pointer"
                >
                  Create one now
                </button>
              </p>
            </div>
          )}

          {/* TAB 2: REGISTER */}
          {!user && authModalTab === 'register' && (
            <div className="space-y-4 max-w-md mx-auto">
              <form onSubmit={handleRegisterSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs uppercase font-semibold text-[#2D2325] mb-1">Full Name *</label>
                  <div className="relative">
                    <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#C49A8B]" />
                    <input
                      type="text"
                      placeholder="Sophia Rose"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full bg-[#FAF5F3] border border-[#E8C4C0] rounded-xl pl-10 pr-4 py-2.5 text-xs text-[#2D2325] focus:outline-none focus:border-[#8C5353]"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs uppercase font-semibold text-[#2D2325] mb-1">Email Address *</label>
                  <div className="relative">
                    <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#C49A8B]" />
                    <input
                      type="email"
                      placeholder="you@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full bg-[#FAF5F3] border border-[#E8C4C0] rounded-xl pl-10 pr-4 py-2.5 text-xs text-[#2D2325] focus:outline-none focus:border-[#8C5353]"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs uppercase font-semibold text-[#2D2325] mb-1">Phone Number</label>
                  <div className="relative">
                    <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#C49A8B]" />
                    <input
                      type="text"
                      placeholder="+91 9876543210"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full bg-[#FAF5F3] border border-[#E8C4C0] rounded-xl pl-10 pr-4 py-2.5 text-xs text-[#2D2325] focus:outline-none focus:border-[#8C5353]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs uppercase font-semibold text-[#2D2325] mb-1">Password *</label>
                  <div className="relative">
                    <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#C49A8B]" />
                    <input
                      type="password"
                      placeholder="At least 6 characters..."
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full bg-[#FAF5F3] border border-[#E8C4C0] rounded-xl pl-10 pr-4 py-2.5 text-xs text-[#2D2325] focus:outline-none focus:border-[#8C5353]"
                      required
                      minLength={6}
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3.5 bg-[#8C5353] hover:bg-[#6E3C3D] text-white font-bold text-xs uppercase tracking-[0.16em] rounded-xl shadow-boutique transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span>{isSubmitting ? 'Registering...' : 'Complete Registration'}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>

              <p className="text-center text-xs text-[#6B5B5E]">
                Already registered?{' '}
                <button
                  onClick={() => openAuthModal('login')}
                  className="text-[#8C5353] font-semibold hover:underline cursor-pointer"
                >
                  Sign in here
                </button>
              </p>
            </div>
          )}

          {/* TAB 3: LOGGED IN PROFILE */}
          {user && authModalTab === 'account' && (
            <div className="space-y-6">
              <div className="bg-[#FAF5F3] p-6 rounded-2xl border border-[#E8C4C0] flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 bg-white border border-[#E8C4C0] rounded-full flex items-center justify-center font-serif text-2xl font-bold text-[#8C5353]">
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <h3 className="font-serif text-xl font-bold text-[#2D2325]">{user.name}</h3>
                    <p className="text-xs text-[#C49A8B]">{user.email}</p>
                    <p className="text-xs text-[#6B5B5E] mt-0.5">{user.phone || 'No phone recorded'}</p>
                  </div>
                </div>

                <div className="text-right">
                  <span className="px-3 py-1 bg-white border border-[#E8C4C0] text-[#8C5353] text-[10px] font-bold uppercase rounded-full">
                    {user.role} Member
                  </span>
                </div>
              </div>

              {isAdmin && (
                <div className="p-4 bg-[#2D2325] text-white rounded-2xl flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="w-5 h-5 text-[#E8C4C0]" />
                    <span className="text-xs font-semibold">Store Administrator Privileges</span>
                  </div>
                  <a
                    href="/admin"
                    className="px-4 py-1.5 bg-[#8C5353] hover:bg-[#6E3C3D] text-white rounded-xl text-xs uppercase font-bold tracking-wider"
                  >
                    Open Admin Portal →
                  </a>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <button
                  onClick={() => openAuthModal('orders')}
                  className="p-4 bg-white rounded-2xl border border-[#F4E3DF] hover:border-[#8C5353] transition-colors text-left flex items-center gap-3 cursor-pointer"
                >
                  <Package className="w-6 h-6 text-[#8C5353]" />
                  <div>
                    <h4 className="text-xs font-bold text-[#2D2325] uppercase tracking-wider">My Orders & Receipts</h4>
                    <p className="text-[11px] text-[#6B5B5E]">{orders.length} Total Boutique Orders</p>
                  </div>
                </button>

                <button
                  onClick={() => {
                    closeAuthModal();
                    scrollToSection('collection');
                  }}
                  className="p-4 bg-white rounded-2xl border border-[#F4E3DF] hover:border-[#8C5353] transition-colors text-left flex items-center gap-3 cursor-pointer"
                >
                  <CheckCircle className="w-6 h-6 text-[#8C5353]" />
                  <div>
                    <h4 className="text-xs font-bold text-[#2D2325] uppercase tracking-wider">Explore Atelier</h4>
                    <p className="text-[11px] text-[#6B5B5E]">Continue shopping haute couture</p>
                  </div>
                </button>
              </div>

              <div className="pt-4 border-t border-[#FAF5F3] flex justify-end">
                <button
                  onClick={() => {
                    logout();
                    openAuthModal('login');
                  }}
                  className="px-4 py-2 text-xs font-semibold text-red-600 hover:bg-red-50 rounded-xl transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Sign Out</span>
                </button>
              </div>
            </div>
          )}

          {/* TAB 4: ORDERS */}
          {user && authModalTab === 'orders' && (
            <div className="space-y-4">
              {isLoadingOrders ? (
                <div className="py-12 text-center text-xs text-[#C49A8B] animate-pulse">
                  Retrieving your boutique orders...
                </div>
              ) : orders.length === 0 ? (
                <div className="py-12 text-center space-y-3">
                  <Package className="w-12 h-12 text-[#E8C4C0] mx-auto stroke-[1.5]" />
                  <p className="font-serif text-base text-[#2D2325]">No boutique orders found</p>
                  <p className="text-xs text-[#6B5B5E]">When you place an order, it will appear here for instant tracking.</p>
                  <button
                    onClick={() => {
                      closeAuthModal();
                      scrollToSection('collection');
                    }}
                    className="px-6 py-2.5 bg-[#2D2325] text-white rounded-xl text-xs uppercase font-bold tracking-wider hover:bg-[#8C5353] transition-colors cursor-pointer"
                  >
                    Shop New Collection
                  </button>
                </div>
              ) : (
                <div className="space-y-3 max-h-96 overflow-y-auto pr-1">
                  {orders.map((order) => (
                    <div
                      key={order.id}
                      className="p-4 bg-[#FAF5F3] rounded-2xl border border-[#E8C4C0] flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                    >
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-serif text-sm font-bold text-[#2D2325]">#{order.orderNumber}</span>
                          <span className={`px-2 py-0.5 rounded-full text-[9px] uppercase font-bold ${
                            order.orderStatus === 'Delivered'
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'bg-amber-100 text-amber-800'
                          }`}>
                            {order.orderStatus}
                          </span>
                        </div>
                        <p className="text-[11px] text-[#6B5B5E] mt-1">
                          {new Date(order.createdAt).toLocaleDateString()} • {order.items.length} item(s) • Total: <strong className="text-[#8C5353]">₹{order.totalAmount.toLocaleString('en-IN')}</strong>
                        </p>
                      </div>

                      <button
                        onClick={() => setSelectedOrder(order)}
                        className="px-3.5 py-1.5 bg-white hover:bg-[#8C5353] text-[#2D2325] hover:text-white rounded-xl text-xs font-semibold border border-[#E8C4C0] transition-colors flex items-center justify-center gap-1 cursor-pointer"
                      >
                        <span>Receipt</span>
                        <ExternalLink className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Selected Order Receipt Sub-Dialog */}
      {selectedOrder && (
        <div
          className="fixed inset-0 z-60 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in"
          onClick={() => setSelectedOrder(null)}
        >
          <div
            className="bg-[#FFFDFB] rounded-3xl p-6 sm:p-8 max-w-lg w-full space-y-5 border border-[#F4E3DF] shadow-2xl max-h-[85vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-start pb-3 border-b border-[#FAF5F3]">
              <div>
                <span className="font-script text-xl text-[#C49A8B]">Maison Blush Receipt</span>
                <h3 className="font-serif text-xl font-bold text-[#2D2325]">Order #{selectedOrder.orderNumber}</h3>
                <p className="text-[10px] text-[#6B5B5E]">Placed on {new Date(selectedOrder.createdAt).toLocaleString()}</p>
              </div>
              <button
                onClick={() => setSelectedOrder(null)}
                className="p-1 rounded-full text-stone-400 hover:text-black cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-2">
              <h4 className="text-[11px] uppercase font-bold text-[#2D2325] tracking-wider">Garments Ordered</h4>
              <div className="divide-y divide-[#FAF5F3] max-h-48 overflow-y-auto text-xs">
                {selectedOrder.items.map((item) => (
                  <div key={item.id} className="py-2 flex justify-between">
                    <div>
                      <p className="font-semibold text-[#2D2325]">{item.productName}</p>
                      <p className="text-[10px] text-[#C49A8B]">Qty: {item.quantity} {item.variantDescription && `• ${item.variantDescription}`}</p>
                    </div>
                    <span className="font-bold text-[#2D2325]">₹{item.totalPrice.toLocaleString('en-IN')}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="p-3 bg-[#FAF5F3] rounded-xl text-xs space-y-1">
              <div className="flex justify-between text-[#6B5B5E]">
                <span>Status:</span>
                <span className="font-bold text-[#8C5353]">{selectedOrder.orderStatus}</span>
              </div>
              <div className="flex justify-between text-[#6B5B5E]">
                <span>Payment:</span>
                <span className="font-bold text-emerald-700">{selectedOrder.paymentStatus}</span>
              </div>
              <div className="flex justify-between font-bold text-[#2D2325] pt-2 border-t border-[#E8C4C0]">
                <span>Total Amount:</span>
                <span className="font-serif text-base text-[#8C5353]">₹{selectedOrder.totalAmount.toLocaleString('en-IN')}</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
