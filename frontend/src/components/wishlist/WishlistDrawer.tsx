import React from 'react';
import { X, Heart, ShoppingBag, Trash2, ArrowRight } from 'lucide-react';
import { useWishlist } from '../../context/WishlistContext';
import { useCart } from '../../context/CartContext';
import { useUIModal } from '../../context/UIModalContext';
import { Product } from '../../types';

export const WishlistDrawer: React.FC = () => {
  const { isWishlistOpen, closeWishlist, openProductModal, scrollToSection } = useUIModal();
  const { wishlist, toggleWishlist } = useWishlist();
  const { addToCart, setIsCartOpen } = useCart();

  if (!isWishlistOpen) return null;

  const handleMoveToBag = async (product: Product) => {
    await addToCart(product.id, undefined, 1);
    await toggleWishlist(product);
    closeWishlist();
    setIsCartOpen(true);
  };

  const handleOpenProduct = (product: Product) => {
    closeWishlist();
    openProductModal(product);
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-[#2D2325]/50 backdrop-blur-sm transition-opacity"
        onClick={closeWishlist}
      />

      {/* Drawer Container */}
      <div className="relative w-full max-w-md bg-[#FFFDFB] h-full shadow-2xl flex flex-col justify-between z-50 animate-slide-right">
        
        {/* Header */}
        <div className="p-6 border-b border-[#F4E3DF] flex items-center justify-between bg-[#FAF5F3]">
          <div className="flex items-center gap-2">
            <Heart className="w-5 h-5 text-[#8C5353] fill-[#8C5353]" />
            <h2 className="font-serif text-lg font-bold text-[#2D2325]">Your Saved Wishlist</h2>
            <span className="text-xs text-[#C49A8B] font-semibold">({wishlist.length})</span>
          </div>
          <button
            onClick={closeWishlist}
            className="p-1.5 rounded-full text-stone-400 hover:text-[#2D2325] hover:bg-white cursor-pointer"
            aria-label="Close Wishlist"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Wishlist Items List */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4 divide-y divide-[#FAF5F3]">
          {wishlist.length === 0 ? (
            <div className="py-16 text-center space-y-3">
              <Heart className="w-12 h-12 text-[#E8C4C0] mx-auto stroke-[1.5]" />
              <p className="font-serif text-lg text-[#2D2325]">Your wishlist is currently empty</p>
              <p className="text-xs text-[#6B5B5E] max-w-xs mx-auto">
                Save your favorite atelier designs here to purchase later or monitor boutique availability.
              </p>
              <div className="pt-2">
                <button
                  onClick={() => {
                    closeWishlist();
                    scrollToSection('collection');
                  }}
                  className="px-6 py-2.5 bg-[#2D2325] text-white text-xs uppercase font-semibold tracking-wider rounded-xl shadow-sm hover:bg-[#8C5353] transition-colors cursor-pointer"
                >
                  Explore Collection
                </button>
              </div>
            </div>
          ) : (
            wishlist.map((item) => {
              const effectivePrice = item.salePrice ?? item.basePrice;
              const originalPrice = item.salePrice ? item.basePrice : null;

              return (
                <div key={item.id} className="pt-4 first:pt-0 flex gap-4">
                  {/* Thumbnail */}
                  <img
                    src={item.primaryImageUrl || 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&w=800&q=80'}
                    alt={item.name}
                    onClick={() => handleOpenProduct(item)}
                    className="w-20 h-24 object-cover rounded-xl bg-[#FAF5F3] flex-shrink-0 cursor-pointer hover:opacity-90 transition-opacity"
                  />

                  {/* Details */}
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-start">
                        <h4
                          onClick={() => handleOpenProduct(item)}
                          className="font-serif text-sm font-semibold text-[#2D2325] line-clamp-1 cursor-pointer hover:text-[#8C5353] transition-colors"
                        >
                          {item.name}
                        </h4>
                        <button
                          onClick={() => toggleWishlist(item)}
                          className="text-stone-400 hover:text-red-600 p-1 cursor-pointer"
                          title="Remove from wishlist"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>

                      <p className="text-[11px] text-[#C49A8B] uppercase tracking-wider mt-0.5">
                        {item.categoryName || 'Haute Couture'}
                      </p>

                      <div className="flex items-baseline gap-2 mt-1">
                        <span className="font-serif text-sm font-bold text-[#8C5353]">
                          ₹{effectivePrice.toLocaleString('en-IN')}
                        </span>
                        {originalPrice && (
                          <span className="text-xs text-stone-400 line-through">
                            ₹{originalPrice.toLocaleString('en-IN')}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Move to bag button */}
                    <div className="mt-2">
                      <button
                        onClick={() => handleMoveToBag(item)}
                        className="w-full py-2 bg-[#2D2325] hover:bg-[#8C5353] text-white text-[11px] uppercase font-bold tracking-wider rounded-lg transition-colors flex items-center justify-center gap-1.5 cursor-pointer shadow-sm"
                      >
                        <ShoppingBag className="w-3.5 h-3.5" />
                        <span>Move to Bag</span>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer */}
        {wishlist.length > 0 && (
          <div className="p-6 border-t border-[#F4E3DF] bg-[#FAF5F3]">
            <button
              onClick={() => {
                closeWishlist();
                scrollToSection('collection');
              }}
              className="w-full py-3.5 bg-white hover:bg-[#FAF5F3] text-[#2D2325] border border-[#E8C4C0] font-semibold text-xs uppercase tracking-widest rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>Continue Shopping</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
