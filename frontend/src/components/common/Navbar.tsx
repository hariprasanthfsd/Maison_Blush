import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Search, Heart, ShoppingBag, User, Menu, X, ChevronDown, ShieldCheck, Sparkles, MessageSquareHeart } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';
import { useUIModal } from '../../context/UIModalContext';
import { Category } from '../../types';
import { categoryApi } from '../../services/api';

interface NavbarProps {
  onOpenSearch: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenSearch }) => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const { user, logout, isAdmin } = useAuth();
  const { itemCount, setIsCartOpen } = useCart();
  const { wishlist } = useWishlist();
  const { openAuthModal, openWishlist, scrollToSection, categoryFilter, onSaleFilter } = useUIModal();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 30);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Lock body scroll when mobile menu is open to prevent background bleed and scroll conflicts
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isMobileMenuOpen]);

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const data = await categoryApi.getCategories();
        setCategories(data);
      } catch (err) {
        // Fallback
      }
    };
    loadCategories();
  }, []);

  // Filter & merge navigation categories:
  // - Rename "Dresses" to "Dresses and Accessories"
  // - Remove "Tops" and "Bottoms"
  // - Merge subcategories from dresses & accessories so the dropdown has complete styling options
  const dressesCat = categories.find((c) => c.slug.toLowerCase() === 'dresses');
  const accessoriesCat = categories.find((c) => c.slug.toLowerCase() === 'accessories');

  const combinedStyles = [
    ...(dressesCat?.subcategories || []),
    ...(accessoriesCat?.subcategories || []),
  ];

  const dressesAndAccessoriesCategory = {
    id: dressesCat?.id || 1,
    name: 'Dresses and Accessories',
    slug: 'dresses-and-accessories',
    subcategories: combinedStyles.length > 0 ? combinedStyles : [
      { id: 101, name: 'Maxi & Silk Slip Dresses', slug: 'maxis' },
      { id: 102, name: 'Cocktail & Gala Silhouettes', slug: 'cocktail' },
      { id: 103, name: 'Handcrafted Clutches & Bags', slug: 'clutches' },
      { id: 104, name: 'Fine 18k Pearl Jewelry', slug: 'jewelry' },
    ],
  };

  const isDressesAndAccActive =
    categoryFilter === 'dresses-and-accessories' ||
    categoryFilter === 'dresses' ||
    categoryFilter === 'accessories';

  return (
    <header
      className={`sticky top-0 z-40 transition-all duration-300 ${
        isScrolled
          ? 'glass-header shadow-soft py-3'
          : 'bg-[#FFFDFB] border-b border-[#F4E3DF] py-4'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        {/* Mobile Hamburger Button */}
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="lg:hidden p-2 text-[#2D2325] hover:text-[#8C5353] focus:outline-none transition-colors rounded-lg hover:bg-[#FAF5F3] cursor-pointer"
          aria-label="Toggle Navigation Menu"
        >
          {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>

        {/* Brand Logo & Tagline */}
        <button
          onClick={() => scrollToSection('hero')}
          className="flex flex-col items-center group py-0.5 text-center cursor-pointer bg-transparent border-0"
        >
          <span className="font-serif text-2xl sm:text-3xl tracking-[0.24em] uppercase font-bold text-[#2D2325] group-hover:text-[#8C5353] transition-colors duration-300">
            MAISON BLUSH
          </span>
          <span className="font-script text-xs sm:text-sm text-[#C49A8B] -mt-1 tracking-widest group-hover:text-[#8C5353] transition-colors">
            Haute Couture Boutique
          </span>
        </button>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center gap-7">
          <button
            onClick={() => scrollToSection('collection', '', false)}
            className={`text-xs uppercase tracking-[0.16em] font-medium transition-colors py-2 relative group cursor-pointer ${
              !categoryFilter && !onSaleFilter
                ? 'text-[#8C5353] font-semibold'
                : 'text-[#2D2325] hover:text-[#8C5353]'
            }`}
          >
            All Collection
            <span
              className={`absolute bottom-0 left-0 w-full h-[1.5px] bg-[#8C5353] transition-transform duration-200 ${
                !categoryFilter && !onSaleFilter ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'
              }`}
            />
          </button>

          <button
            onClick={() => scrollToSection('new-arrivals')}
            className="text-xs uppercase tracking-[0.16em] font-medium transition-colors py-2 relative group cursor-pointer text-[#2D2325] hover:text-[#8C5353]"
          >
            New Arrivals
            <span className="absolute bottom-0 left-0 w-full h-[1.5px] bg-[#8C5353] transition-transform duration-200 scale-x-0 group-hover:scale-x-100" />
          </button>

          {/* DRESSES AND ACCESSORIES (Renamed from Dresses, Tops and Bottoms removed) */}
          <div
            className="relative group"
            onMouseEnter={() => setIsDropdownOpen(true)}
            onMouseLeave={() => setIsDropdownOpen(false)}
          >
            <button
              onClick={() => scrollToSection('collection', dressesAndAccessoriesCategory.slug, false)}
              className={`text-xs uppercase tracking-[0.16em] font-medium transition-colors py-2 flex items-center gap-1.5 relative cursor-pointer ${
                isDressesAndAccActive
                  ? 'text-[#8C5353] font-semibold'
                  : 'text-[#2D2325] hover:text-[#8C5353]'
              }`}
            >
              <span>{dressesAndAccessoriesCategory.name}</span>
              <ChevronDown className="w-3 h-3 text-[#C49A8B] group-hover:rotate-180 transition-transform duration-200" />
              <span
                className={`absolute bottom-0 left-0 w-full h-[1.5px] bg-[#8C5353] transition-transform duration-200 ${
                  isDressesAndAccActive ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'
                }`}
              />
            </button>

            {/* Subcategories Dropdown Menu */}
            {dressesAndAccessoriesCategory.subcategories && dressesAndAccessoriesCategory.subcategories.length > 0 && (
              <div className="absolute top-full left-0 w-60 bg-[#FFFDFB] shadow-boutique border border-[#F4E3DF] rounded-xl py-3 px-2 hidden group-hover:block animate-fade-in z-50">
                <p className="px-3 py-1 text-[10px] uppercase font-bold tracking-widest text-[#C49A8B] border-b border-[#FAF5F3] mb-1">
                  Atelier Silhouettes & Pieces
                </p>
                {dressesAndAccessoriesCategory.subcategories.map((sub) => (
                  <button
                    key={sub.id}
                    onClick={() => scrollToSection('collection', dressesAndAccessoriesCategory.slug, false)}
                    className="w-full text-left block px-3 py-2 text-xs text-[#4A3E3F] hover:text-[#8C5353] hover:bg-[#FAF5F3] rounded-lg transition-colors font-medium cursor-pointer"
                  >
                    {sub.name}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* SINGLE ACCENTED SALE LINK */}
          <button
            onClick={() => scrollToSection('collection', undefined, true)}
            className={`text-xs uppercase tracking-[0.16em] font-semibold transition-all py-1.5 px-3 rounded-full flex items-center gap-1.5 cursor-pointer ${
              onSaleFilter
                ? 'bg-[#8C5353] text-white shadow-sm'
                : 'text-[#8C5353] hover:bg-[#F4E3DF]/50 border border-[#F4E3DF]'
            }`}
          >
            <span>Sale</span>
            <Sparkles className="w-3 h-3 text-amber-500 fill-amber-400" />
          </button>

          {/* TESTIMONY LINK */}
          <button
            onClick={() => scrollToSection('testimonials')}
            className="text-xs uppercase tracking-[0.16em] font-medium transition-colors py-2 relative group cursor-pointer text-[#2D2325] hover:text-[#8C5353]"
          >
            <span>Testimonials</span>
            <span className="absolute bottom-0 left-0 w-full h-[1.5px] bg-[#8C5353] transition-transform duration-200 scale-x-0 group-hover:scale-x-100" />
          </button>
        </nav>

        {/* Right Action Icons */}
        <div className="flex items-center gap-2 sm:gap-4">
          {/* Search Trigger Button */}
          <button
            onClick={onOpenSearch}
            className="p-2 text-[#2D2325] hover:text-[#8C5353] hover:bg-[#FAF5F3] rounded-full transition-colors cursor-pointer"
            title="Search collection"
            aria-label="Search"
          >
            <Search className="w-5 h-5" />
          </button>

          {/* User Account / Profile Menu */}
          <div className="relative group">
            <button
              onClick={() => openAuthModal(user ? 'account' : 'login')}
              className="p-2 text-[#2D2325] hover:text-[#8C5353] hover:bg-[#FAF5F3] rounded-full transition-colors flex items-center gap-1 cursor-pointer"
              title={user ? user.name : 'Account Login'}
              aria-label="Account"
            >
              <User className="w-5 h-5" />
            </button>

            {user && (
              <div className="absolute top-full right-0 w-52 bg-[#FFFDFB] shadow-boutique border border-[#F4E3DF] rounded-2xl py-2 hidden group-hover:block animate-fade-in z-50">
                <div className="px-4 py-2.5 border-b border-[#FAF5F3]">
                  <p className="text-xs font-semibold text-[#2D2325] truncate">{user.name}</p>
                  <p className="text-[10px] text-[#C49A8B] truncate">{user.email}</p>
                </div>

                {isAdmin && (
                  <a
                    href="/admin"
                    className="flex items-center gap-2 px-4 py-2.5 text-xs text-[#8C5353] font-semibold hover:bg-[#FAF5F3] transition-colors"
                  >
                    <ShieldCheck className="w-4 h-4 text-[#8C5353]" /> Admin Portal
                  </a>
                )}

                <button
                  onClick={() => openAuthModal('account')}
                  className="w-full text-left block px-4 py-2 text-xs text-[#4A3E3F] hover:text-[#8C5353] hover:bg-[#FAF5F3] transition-colors cursor-pointer"
                >
                  My Member Profile
                </button>
                <button
                  onClick={() => openAuthModal('orders')}
                  className="w-full text-left block px-4 py-2 text-xs text-[#4A3E3F] hover:text-[#8C5353] hover:bg-[#FAF5F3] transition-colors cursor-pointer"
                >
                  My Orders & Receipts
                </button>
                <button
                  onClick={openWishlist}
                  className="w-full text-left block px-4 py-2 text-xs text-[#4A3E3F] hover:text-[#8C5353] hover:bg-[#FAF5F3] transition-colors cursor-pointer"
                >
                  My Wishlist ({wishlist.length})
                </button>
                <button
                  onClick={logout}
                  className="w-full text-left px-4 py-2.5 text-xs text-red-600 hover:bg-red-50 border-t border-[#FAF5F3] transition-colors cursor-pointer"
                >
                  Sign Out
                </button>
              </div>
            )}
          </div>

          {/* Wishlist Link with Badge */}
          <button
            onClick={openWishlist}
            className="p-2 text-[#2D2325] hover:text-[#8C5353] hover:bg-[#FAF5F3] rounded-full transition-colors relative cursor-pointer"
            title="Wishlist"
            aria-label="Wishlist"
          >
            <Heart className="w-5 h-5" />
            {wishlist.length > 0 && (
              <span className="absolute top-0 right-0 w-4 h-4 bg-[#8C5353] text-white text-[10px] font-bold rounded-full flex items-center justify-center ring-2 ring-white animate-fade-in">
                {wishlist.length}
              </span>
            )}
          </button>

          {/* Shopping Bag Drawer Trigger */}
          <button
            onClick={() => setIsCartOpen(true)}
            className="p-2 text-[#2D2325] hover:text-[#8C5353] hover:bg-[#FAF5F3] rounded-full transition-colors relative cursor-pointer"
            title="Shopping Bag"
            aria-label="Cart"
          >
            <ShoppingBag className="w-5 h-5" />
            {itemCount > 0 && (
              <span className="absolute top-0 right-0 w-4 h-4 bg-[#8C5353] text-white text-[10px] font-bold rounded-full flex items-center justify-center ring-2 ring-white animate-fade-in">
                {itemCount}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu Drawer (Portaled to document.body to prevent clipping by header's backdrop-filter/sticky container) */}
      {isMobileMenuOpen && typeof document !== 'undefined' && createPortal(
        <div className="fixed inset-0 z-[9999] lg:hidden">
          {/* Backdrop covering whole viewport */}
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
            onClick={() => setIsMobileMenuOpen(false)}
          />

          {/* Menu Drawer covering full screen height */}
          <div className="fixed inset-y-0 left-0 w-[85%] max-w-sm bg-[#FFFDFB] h-[100dvh] min-h-screen p-6 shadow-2xl flex flex-col justify-between overflow-y-auto animate-slide-right z-[10000]">
            <div>
              <div className="flex items-center justify-between pb-4 border-b border-[#F4E3DF]">
                <div>
                  <span className="font-serif text-xl tracking-[0.2em] uppercase font-bold text-[#2D2325]">
                    MAISON BLUSH
                  </span>
                  <p className="font-script text-xs text-[#C49A8B]">Haute Couture Boutique</p>
                </div>
                <button
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="p-2 rounded-full hover:bg-[#FAF5F3] text-[#2D2325] cursor-pointer"
                  aria-label="Close Menu"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <nav className="py-6 flex flex-col gap-3">
                <button
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    scrollToSection('collection', '', false);
                  }}
                  className="w-full text-left text-xs uppercase tracking-[0.16em] font-semibold text-[#2D2325] py-2 border-b border-[#FAF5F3] cursor-pointer"
                >
                  Shop All Collection
                </button>
                <button
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    scrollToSection('new-arrivals');
                  }}
                  className="w-full text-left text-xs uppercase tracking-[0.16em] font-semibold text-[#2D2325] py-2 border-b border-[#FAF5F3] cursor-pointer"
                >
                  New Arrivals
                </button>

                {/* Categories: Renamed to "Dresses and Accessories", Tops & Bottoms removed */}
                <div className="py-2">
                  <p className="text-[10px] text-[#C49A8B] font-bold uppercase tracking-widest mb-2">
                    Featured Collection
                  </p>
                  <div className="flex flex-col gap-1 pl-2">
                    <button
                      onClick={() => {
                        setIsMobileMenuOpen(false);
                        scrollToSection('collection', dressesAndAccessoriesCategory.slug, false);
                      }}
                      className="w-full text-left text-xs text-[#4A3E3F] hover:text-[#8C5353] py-1.5 font-medium flex items-center justify-between cursor-pointer"
                    >
                      <span className="font-semibold text-[#2D2325]">Dresses and Accessories</span>
                    </button>
                  </div>
                </div>

                {/* SINGLE SALE LINK IN MOBILE MENU */}
                <button
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    scrollToSection('collection', undefined, true);
                  }}
                  className="w-full text-left text-xs uppercase tracking-[0.16em] font-bold text-[#8C5353] py-2.5 px-3 bg-[#FAF5F3] rounded-xl flex items-center justify-between border border-[#F4E3DF] cursor-pointer"
                >
                  <span>Exclusive Sale</span>
                  <Sparkles className="w-3.5 h-3.5 text-amber-500 fill-amber-400" />
                </button>

                {/* CLIENT TESTIMONIALS */}
                <button
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    scrollToSection('testimonials');
                  }}
                  className="w-full text-left text-xs uppercase tracking-[0.16em] font-semibold text-[#2D2325] py-2 border-b border-[#FAF5F3] cursor-pointer"
                >
                  Client Testimonials
                </button>

                <div className="pt-3 border-t border-[#FAF5F3] flex flex-col gap-2">
                  <button
                    onClick={() => {
                      setIsMobileMenuOpen(false);
                      scrollToSection('about');
                    }}
                    className="w-full text-left text-xs text-[#6B5B5E] hover:text-[#2D2325] py-1 cursor-pointer"
                  >
                    About the Atelier
                  </button>
                  <button
                    onClick={() => {
                      setIsMobileMenuOpen(false);
                      scrollToSection('contact');
                    }}
                    className="w-full text-left text-xs text-[#6B5B5E] hover:text-[#2D2325] py-1 cursor-pointer"
                  >
                    Client Concierge & Contact
                  </button>
                </div>
              </nav>
            </div>

            <div className="pt-6 border-t border-[#F4E3DF]">
              {user ? (
                <div className="flex flex-col gap-2">
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4 text-[#8C5353]" />
                    <p className="text-xs font-semibold text-[#2D2325]">{user.name}</p>
                  </div>
                  {isAdmin && (
                    <a href="/admin" className="text-xs text-[#8C5353] font-semibold flex items-center gap-1">
                      <ShieldCheck className="w-3.5 h-3.5" /> Admin Dashboard
                    </a>
                  )}
                  <button
                    onClick={() => {
                      setIsMobileMenuOpen(false);
                      openAuthModal('orders');
                    }}
                    className="text-xs text-[#4A3E3F] text-left underline cursor-pointer"
                  >
                    My Account & Orders
                  </button>
                  <button
                    onClick={() => {
                      setIsMobileMenuOpen(false);
                      openWishlist();
                    }}
                    className="text-xs text-[#4A3E3F] text-left cursor-pointer"
                  >
                    My Wishlist ({wishlist.length})
                  </button>
                  <button onClick={logout} className="text-xs text-red-600 text-left cursor-pointer pt-1">
                    Sign Out
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    openAuthModal('login');
                  }}
                  className="w-full text-center py-3 bg-[#2D2325] hover:bg-[#8C5353] text-white rounded-xl text-xs uppercase tracking-widest font-semibold transition-colors cursor-pointer"
                >
                  Sign In / Register
                </button>
              )}
            </div>
          </div>
        </div>,
        document.body
      )}
    </header>
  );
};
