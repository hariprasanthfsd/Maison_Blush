import React from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Package, ShoppingBag, Layers, Image, Tag, Users, LogOut, ArrowLeft, ShieldCheck } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { BackButton } from '../../components/common/BackButton';

export const AdminLayout: React.FC = () => {
  const { user, logout, isAdmin } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  if (!user || !isAdmin) {
    return (
      <div className="py-20 bg-[#FAF5F3] min-h-screen flex items-center justify-center">
        <div className="bg-white p-8 rounded-3xl border border-red-200 text-center space-y-4 max-w-md shadow-soft">
          <ShieldCheck className="w-12 h-12 text-red-600 mx-auto" />
          <h2 className="font-serif text-2xl font-bold text-[#2D2325]">Access Restricted</h2>
          <p className="text-xs text-[#6B5B5E]">Administrator authorization is required to access the Maison Blush management portal.</p>
          <Link to="/login" className="inline-block px-6 py-2.5 bg-[#2D2325] text-white text-xs font-semibold rounded-xl">
            Sign In as Administrator
          </Link>
        </div>
      </div>
    );
  }

  const navItems = [
    { label: 'Overview', path: '/admin', icon: LayoutDashboard },
    { label: 'Products & Inventory', path: '/admin/products', icon: Package },
    { label: 'Orders Management', path: '/admin/orders', icon: ShoppingBag },
    { label: 'CMS & Banners', path: '/admin/cms', icon: Image },
    { label: 'Discount Coupons', path: '/admin/coupons', icon: Tag },
  ];

  return (
    <div className="min-h-screen bg-[#FAF5F3] flex">
      {/* Sidebar */}
      <aside className="w-64 bg-[#2D2325] text-white flex flex-col justify-between p-6 hidden lg:flex">
        <div className="space-y-8">
          <div>
            <Link to="/" className="inline-block">
              <span className="font-serif text-xl font-bold tracking-widest uppercase">MAISON BLUSH</span>
              <p className="font-script text-xs text-[#E8C4C0]">Store Admin Portal</p>
            </Link>
          </div>

          <nav className="space-y-1.5">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-semibold transition-all ${
                    isActive ? 'bg-[#8C5353] text-white shadow-md' : 'text-[#E8C4C0] hover:bg-[#381A1B] hover:text-white'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="pt-6 border-t border-[#381A1B] space-y-3">
          <Link to="/" className="flex items-center gap-2 text-xs text-[#E8C4C0] hover:text-white">
            <ArrowLeft className="w-4 h-4" /> View Main Storefront
          </Link>
          <button onClick={logout} className="w-full text-left flex items-center gap-2 text-xs text-red-400 hover:text-red-300">
            <LogOut className="w-4 h-4" /> Sign Out Admin
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        <header className="bg-white border-b border-[#F4E3DF] p-4 sm:p-6 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <BackButton label="Back to Storefront" fallbackUrl="/" />
            <h2 className="font-serif text-xl font-bold text-[#2D2325] hidden sm:block">Store Control Panel</h2>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-xs font-semibold text-[#8C5353] bg-[#FAF5F3] px-3 py-1 rounded-full border border-[#E8C4C0]">
              Logged in as {user.name}
            </span>
          </div>
        </header>

        <main className="p-4 sm:p-8 flex-1 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
