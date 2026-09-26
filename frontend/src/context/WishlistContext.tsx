import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Product } from '../types';
import { wishlistApi } from '../services/api';
import { useAuth } from './AuthContext';
import { useToast } from './ToastContext';

interface WishlistContextType {
  wishlist: Product[];
  isInWishlist: (productId: number) => boolean;
  toggleWishlist: (product: Product) => Promise<void>;
  refreshWishlist: () => Promise<void>;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export const WishlistProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [wishlist, setWishlist] = useState<Product[]>([]);
  const { user } = useAuth();
  const { showToast } = useToast();

  const refreshWishlist = async () => {
    if (!user) {
      // Local storage fallback for guest wishlist
      const saved = localStorage.getItem('mb_guest_wishlist');
      if (saved) {
        try { setWishlist(JSON.parse(saved)); } catch { }
      }
      return;
    }

    try {
      const data = await wishlistApi.getWishlist();
      setWishlist(data);
    } catch (err) {
      console.error('Failed to load wishlist:', err);
    }
  };

  useEffect(() => {
    refreshWishlist();
  }, [user]);

  const isInWishlist = (productId: number): boolean => {
    return wishlist.some((p) => p.id === productId);
  };

  const toggleWishlist = async (product: Product) => {
    if (isInWishlist(product.id)) {
      setWishlist((prev) => prev.filter((p) => p.id !== product.id));
      showToast('Removed from your wishlist.', 'info');
      if (!user) {
        const updated = wishlist.filter((p) => p.id !== product.id);
        localStorage.setItem('mb_guest_wishlist', JSON.stringify(updated));
      } else {
        try { await wishlistApi.toggleWishlist(product.id); } catch { }
      }
    } else {
      setWishlist((prev) => [...prev, product]);
      showToast('Saved to your wishlist ❤️', 'success');
      if (!user) {
        const updated = [...wishlist, product];
        localStorage.setItem('mb_guest_wishlist', JSON.stringify(updated));
      } else {
        try { await wishlistApi.toggleWishlist(product.id); } catch { }
      }
    }
  };

  return (
    <WishlistContext.Provider
      value={{
        wishlist,
        isInWishlist,
        toggleWishlist,
        refreshWishlist,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (!context) throw new Error('useWishlist must be used within a WishlistProvider');
  return context;
};
