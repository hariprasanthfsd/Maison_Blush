import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Product } from '../types';
import { productApi } from '../services/api';

type AuthTab = 'login' | 'register' | 'account' | 'orders';

interface UIModalContextType {
  // Product Modal
  selectedProduct: Product | null;
  isProductLoading: boolean;
  openProductModal: (productOrId: Product | number) => Promise<void>;
  closeProductModal: () => void;

  // Checkout Modal
  isCheckoutOpen: boolean;
  openCheckout: () => void;
  closeCheckout: () => void;

  // Auth / Account Modal
  isAuthModalOpen: boolean;
  authModalTab: AuthTab;
  openAuthModal: (tab?: AuthTab) => void;
  closeAuthModal: () => void;

  // Wishlist Drawer
  isWishlistOpen: boolean;
  openWishlist: () => void;
  closeWishlist: () => void;

  // Policy Modal
  activePolicy: string | null;
  openPolicy: (policyType: string) => void;
  closePolicy: () => void;

  // Catalog Section Filter State
  categoryFilter: string;
  setCategoryFilter: (cat: string) => void;
  onSaleFilter: boolean;
  setOnSaleFilter: (sale: boolean) => void;

  // Smooth Scroll Helper
  scrollToSection: (sectionId: string, categorySlug?: string, onSale?: boolean) => void;
}

const UIModalContext = createContext<UIModalContextType | undefined>(undefined);

export const UIModalProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isProductLoading, setIsProductLoading] = useState(false);

  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);

  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalTab, setAuthModalTab] = useState<AuthTab>('login');

  const [isWishlistOpen, setIsWishlistOpen] = useState(false);

  const [activePolicy, setActivePolicy] = useState<string | null>(null);

  const [categoryFilter, setCategoryFilter] = useState<string>('');
  const [onSaleFilter, setOnSaleFilter] = useState<boolean>(false);

  const openProductModal = async (productOrId: Product | number) => {
    if (typeof productOrId === 'object') {
      setSelectedProduct(productOrId);
      // Fetch full details if variants or images need refreshing
      try {
        const full = await productApi.getProductById(productOrId.id);
        setSelectedProduct(full);
      } catch (err) {
        // use basic object if offline
      }
    } else {
      setIsProductLoading(true);
      try {
        const full = await productApi.getProductById(productOrId);
        setSelectedProduct(full);
      } catch (err) {
        console.error('Failed to load product modal:', err);
      } finally {
        setIsProductLoading(false);
      }
    }
  };

  const closeProductModal = () => {
    setSelectedProduct(null);
  };

  const openCheckout = () => {
    setIsCheckoutOpen(true);
  };

  const closeCheckout = () => {
    setIsCheckoutOpen(false);
  };

  const openAuthModal = (tab: AuthTab = 'login') => {
    setAuthModalTab(tab);
    setIsAuthModalOpen(true);
  };

  const closeAuthModal = () => {
    setIsAuthModalOpen(false);
  };

  const openWishlist = () => {
    setIsWishlistOpen(true);
  };

  const closeWishlist = () => {
    setIsWishlistOpen(false);
  };

  const openPolicy = (policyType: string) => {
    setActivePolicy(policyType);
  };

  const closePolicy = () => {
    setActivePolicy(null);
  };

  const scrollToSection = (sectionId: string, categorySlug?: string, onSale?: boolean) => {
    if (categorySlug !== undefined) {
      setCategoryFilter(categorySlug);
    }
    if (onSale !== undefined) {
      setOnSaleFilter(onSale);
    }

    const element = document.getElementById(sectionId);
    if (element) {
      const navOffset = 80;
      const elementPosition = element.getBoundingClientRect().top + window.scrollY;
      window.scrollTo({
        top: elementPosition - navOffset,
        behavior: 'smooth'
      });
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <UIModalContext.Provider
      value={{
        selectedProduct,
        isProductLoading,
        openProductModal,
        closeProductModal,
        isCheckoutOpen,
        openCheckout,
        closeCheckout,
        isAuthModalOpen,
        authModalTab,
        openAuthModal,
        closeAuthModal,
        isWishlistOpen,
        openWishlist,
        closeWishlist,
        activePolicy,
        openPolicy,
        closePolicy,
        categoryFilter,
        setCategoryFilter,
        onSaleFilter,
        setOnSaleFilter,
        scrollToSection,
      }}
    >
      {children}
    </UIModalContext.Provider>
  );
};

export const useUIModal = (): UIModalContextType => {
  const context = useContext(UIModalContext);
  if (!context) {
    throw new Error('useUIModal must be used within a UIModalProvider');
  }
  return context;
};
