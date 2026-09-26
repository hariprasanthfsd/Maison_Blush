import React from 'react';
import { useWishlist } from '../context/WishlistContext';
import { ProductCard } from '../components/common/ProductCard';
import { Heart, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { BackButton } from '../components/common/BackButton';

export const WishlistPage: React.FC = () => {
  const { wishlist } = useWishlist();
  const navigate = useNavigate();

  return (
    <div className="py-12 bg-[#FAF5F3] min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Back Navigation */}
        <div>
          <BackButton label="Back to Shopping" fallbackUrl="/shop" />
        </div>

        {/* Header */}
        <div className="text-center max-w-md mx-auto">
          <span className="font-script text-2xl text-[#C49A8B]">Your Saved Favorites</span>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[#2D2325]">My Wishlist ({wishlist.length})</h1>
        </div>

        {wishlist.length === 0 ? (
          <div className="bg-white p-12 rounded-3xl border border-[#F4E3DF] text-center max-w-md mx-auto space-y-4 shadow-soft">
            <Heart className="w-12 h-12 text-[#E8C4C0] mx-auto" />
            <h3 className="font-serif text-xl font-bold text-[#2D2325]">Your Wishlist is Empty</h3>
            <p className="text-xs text-[#6B5B5E]">Save your favorite luxury pieces to view them anytime across devices.</p>
            <button
              onClick={() => navigate('/shop')}
              className="px-8 py-3 bg-[#2D2325] text-white text-xs uppercase font-bold tracking-widest rounded-xl hover:bg-[#8C5353] transition-colors"
            >
              Explore Collection
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {wishlist.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
