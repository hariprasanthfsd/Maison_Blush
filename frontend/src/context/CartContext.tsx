import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Cart, CartItem, CouponResult } from '../types';
import { cartApi, couponApi } from '../services/api';
import { useToast } from './ToastContext';

interface CartContextType {
  cart: Cart | null;
  itemCount: number;
  subtotal: number;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  addToCart: (productId: number, variantId?: number, qty?: number) => Promise<boolean>;
  updateQuantity: (itemId: number, qty: number) => Promise<void>;
  removeItem: (itemId: number) => Promise<void>;
  refreshCart: () => Promise<void>;
  appliedCoupon: CouponResult | null;
  applyCoupon: (code: string) => Promise<boolean>;
  removeCoupon: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [cart, setCart] = useState<Cart | null>(null);
  const [isCartOpen, setIsCartOpen] = useState<boolean>(false);
  const [appliedCoupon, setAppliedCoupon] = useState<CouponResult | null>(null);
  const { showToast } = useToast();

  const refreshCart = async () => {
    try {
      const data = await cartApi.getCart();
      setCart(data);
    } catch (err) {
      console.error('Failed to load cart:', err);
    }
  };

  useEffect(() => {
    refreshCart();
  }, []);

  const addToCart = async (productId: number, variantId?: number, qty: number = 1): Promise<boolean> => {
    try {
      const updatedCart = await cartApi.addToCart(productId, variantId, qty);
      setCart(updatedCart);
      setIsCartOpen(true);
      showToast('Item added to your shopping bag! 🛍️', 'success');
      return true;
    } catch (err: any) {
      const msg = err.response?.data?.message || err.response?.data || 'Failed to add item to cart.';
      showToast(msg, 'error');
      return false;
    }
  };

  const updateQuantity = async (itemId: number, qty: number) => {
    try {
      await cartApi.updateQuantity(itemId, qty);
      await refreshCart();
    } catch (err: any) {
      const msg = err.response?.data?.message || err.response?.data || 'Could not update quantity.';
      showToast(msg, 'error');
    }
  };

  const removeItem = async (itemId: number) => {
    try {
      await cartApi.removeItem(itemId);
      await refreshCart();
      showToast('Item removed from cart.', 'info');
    } catch (err) {
      showToast('Failed to remove item.', 'error');
    }
  };

  const applyCoupon = async (code: string): Promise<boolean> => {
    if (!cart || cart.subtotal === 0) {
      showToast('Your cart is empty.', 'error');
      return false;
    }

    try {
      const result = await couponApi.validateCoupon(code, cart.subtotal);
      if (result.isValid) {
        setAppliedCoupon(result);
        showToast(result.message, 'success');
        return true;
      } else {
        showToast(result.message, 'error');
        return false;
      }
    } catch (err) {
      showToast('Failed to apply coupon.', 'error');
      return false;
    }
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
    showToast('Coupon removed.', 'info');
  };

  const itemCount = cart?.totalQuantity || 0;
  const subtotal = cart?.subtotal || 0;

  return (
    <CartContext.Provider
      value={{
        cart,
        itemCount,
        subtotal,
        isCartOpen,
        setIsCartOpen,
        addToCart,
        updateQuantity,
        removeItem,
        refreshCart,
        appliedCoupon,
        applyCoupon,
        removeCoupon,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart must be used within a CartProvider');
  return context;
};
