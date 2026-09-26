import React from 'react';
import { Heart, ShoppingBag, Star } from 'lucide-react';
import { Product } from '../../types';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';
import { useUIModal } from '../../context/UIModalContext';

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { addToCart } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();
  const { openProductModal } = useUIModal();

  const isSaved = isInWishlist(product.id);
  const effectivePrice = product.salePrice ?? product.basePrice;
  const originalPrice = product.salePrice ? product.basePrice : null;
  const discountPercent = originalPrice ? Math.round(((originalPrice - effectivePrice) / originalPrice) * 100) : 0;

  return (
    <div className="group relative bg-white border border-[#F4E3DF] rounded-2xl overflow-hidden shadow-soft hover:shadow-boutique transition-all duration-500 flex flex-col justify-between">
      
      {/* Image Container */}
      <div className="relative aspect-[3/4] overflow-hidden bg-[#FAF5F3] cursor-pointer" onClick={() => openProductModal(product)}>
        <img
          src={product.primaryImageUrl || 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&w=800&q=80'}
          alt={product.name}
          className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-700 ease-out"
          loading="lazy"
        />

        {/* Badges */}
        <div className="absolute top-2 sm:top-3 left-2 sm:left-3 flex flex-col gap-1 sm:gap-1.5 z-10">
          {product.badge && (
            <span className="px-2 sm:px-3 py-0.5 sm:py-1 bg-[#2D2325] text-white text-[9px] sm:text-[10px] uppercase font-bold tracking-wider rounded-full shadow-sm">
              {product.badge}
            </span>
          )}
          {discountPercent > 0 && (
            <span className="px-2 sm:px-3 py-0.5 sm:py-1 bg-[#8C5353] text-white text-[9px] sm:text-[10px] uppercase font-bold tracking-wider rounded-full shadow-sm">
              {discountPercent}% OFF
            </span>
          )}
        </div>

        {/* Wishlist Heart Button */}
        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            toggleWishlist(product);
          }}
          className={`absolute top-2 sm:top-3 right-2 sm:right-3 p-1.5 sm:p-2.5 rounded-full backdrop-blur-md transition-all duration-300 shadow-sm z-10 cursor-pointer ${
            isSaved
              ? 'bg-red-50 text-red-600'
              : 'bg-white/80 text-[#2D2325] hover:bg-white hover:text-[#8C5353]'
          }`}
          aria-label="Save to Wishlist"
        >
          <Heart className={`w-3.5 h-3.5 sm:w-4 sm:h-4 ${isSaved ? 'fill-current text-red-500' : ''}`} />
        </button>

        {/* Quick Add overlay button */}
        <div className="absolute bottom-2 sm:bottom-3 left-2 sm:left-3 right-2 sm:right-3 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 z-10">
          <button
            onClick={(e) => {
              e.stopPropagation();
              addToCart(product.id);
            }}
            className="w-full py-2 sm:py-2.5 bg-[#2D2325]/95 hover:bg-[#8C5353] text-white text-[11px] sm:text-xs uppercase font-semibold tracking-wider rounded-xl backdrop-blur-md shadow-lg flex items-center justify-center gap-1.5 sm:gap-2 transition-colors cursor-pointer"
          >
            <ShoppingBag className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            <span>Quick Add</span>
          </button>
        </div>
      </div>

      {/* Product Content Details */}
      <div className="p-3 sm:p-5 flex flex-col justify-between flex-grow">
        <div>
          <div className="flex items-center justify-between gap-1 mb-1">
            <span className="text-[9px] sm:text-[11px] uppercase tracking-widest text-[#C49A8B] font-semibold truncate">
              {product.categoryName || 'Boutique'}
            </span>

            {/* Rating Stars */}
            <div className="flex items-center gap-0.5 sm:gap-1 text-amber-500 text-[10px] sm:text-xs font-semibold shrink-0">
              <Star className="w-3 h-3 sm:w-3.5 sm:h-3.5 fill-current" />
              <span>{product.averageRating || 5.0}</span>
            </div>
          </div>

          <div
            onClick={() => openProductModal(product)}
            className="block group-hover:text-[#8C5353] transition-colors cursor-pointer"
          >
            <h3 className="font-serif text-xs sm:text-base font-semibold text-[#2D2325] line-clamp-1">
              {product.name}
            </h3>
          </div>

          <p className="text-[11px] sm:text-xs text-[#6B5B5E] line-clamp-1 mt-0.5 sm:mt-1 font-light">
            {product.shortDescription}
          </p>
        </div>

        {/* Price Row */}
        <div className="mt-2 sm:mt-3 pt-2 sm:pt-3 border-t border-[#FAF5F3] flex items-center justify-between gap-1">
          <div className="flex items-baseline gap-1 sm:gap-2 flex-wrap">
            <span className="font-serif text-sm sm:text-lg font-bold text-[#2D2325]">
              ₹{effectivePrice.toLocaleString('en-IN')}
            </span>
            {originalPrice && (
              <span className="text-[10px] sm:text-xs text-stone-400 line-through font-light">
                ₹{originalPrice.toLocaleString('en-IN')}
              </span>
            )}
          </div>

          <span className={`text-[8px] sm:text-[10px] font-semibold tracking-wide uppercase px-1.5 sm:px-2 py-0.5 rounded shrink-0 ${product.totalStock > 0 ? 'text-emerald-700 bg-emerald-50' : 'text-red-700 bg-red-50'}`}>
            {product.totalStock > 0 ? 'In Stock' : 'Sold Out'}
          </span>
        </div>
      </div>
    </div>
  );
};
