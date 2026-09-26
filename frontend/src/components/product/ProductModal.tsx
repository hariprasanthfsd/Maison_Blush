import React, { useState, useEffect } from 'react';
import { X, Heart, ShoppingBag, Star, Truck, RotateCcw, ShieldCheck, Share2, Plus, Minus, Sparkles } from 'lucide-react';
import { useUIModal } from '../../context/UIModalContext';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';
import { useToast } from '../../context/ToastContext';
import { ProductVariant } from '../../types';
import { ImageGallery } from './ImageGallery';
import { ReviewSection } from './ReviewSection';

export const ProductModal: React.FC = () => {
  const { selectedProduct, closeProductModal, isProductLoading, openCheckout, openProductModal } = useUIModal();
  const { addToCart, setIsCartOpen } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();
  const { showToast } = useToast();

  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(null);
  const [quantity, setQuantity] = useState<number>(1);
  const [activeTab, setActiveTab] = useState<'desc' | 'specs' | 'shipping' | 'reviews'>('desc');

  useEffect(() => {
    if (selectedProduct?.variants && selectedProduct.variants.length > 0) {
      setSelectedVariant(selectedProduct.variants[0]);
    } else {
      setSelectedVariant(null);
    }
    setQuantity(1);
    setActiveTab('desc');
  }, [selectedProduct]);

  if (!selectedProduct && !isProductLoading) return null;

  const product = selectedProduct;
  const isSaved = product ? isInWishlist(product.id) : false;
  const effectivePrice = product
    ? (product.salePrice ?? product.basePrice) + (selectedVariant?.additionalPrice || 0)
    : 0;
  const originalPrice = product?.salePrice ? product.basePrice : null;
  const availableStock = selectedVariant ? selectedVariant.stockQuantity : (product?.totalStock || 0);

  const handleAddToCart = async () => {
    if (!product) return;
    if (availableStock <= 0) {
      showToast('Selected variant is currently out of stock.', 'error');
      return;
    }
    await addToCart(product.id, selectedVariant?.id, quantity);
  };

  const handleBuyNow = async () => {
    if (!product) return;
    const success = await addToCart(product.id, selectedVariant?.id, quantity);
    if (success) {
      closeProductModal();
      openCheckout();
    }
  };

  const handleShare = () => {
    if (!product) return;
    if (navigator.share) {
      navigator.share({ title: product.name, url: window.location.href });
    } else {
      navigator.clipboard.writeText(window.location.href);
      showToast('Product link copied to clipboard! 📋', 'info');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-[#2D2325]/60 backdrop-blur-md transition-opacity"
        onClick={closeProductModal}
      />

      {/* Modal Dialog Card */}
      <div className="relative w-full max-w-5xl bg-white rounded-3xl border border-[#F4E3DF] shadow-2xl overflow-hidden z-10 max-h-[92vh] flex flex-col animate-fade-in my-auto">
        {/* Top Floating Close Button */}
        <div className="absolute top-4 right-4 z-20">
          <button
            onClick={closeProductModal}
            className="p-2.5 rounded-full bg-white/90 hover:bg-white text-[#2D2325] hover:text-[#8C5353] border border-[#F4E3DF] shadow-sm transition-colors cursor-pointer"
            aria-label="Close Product View"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {isProductLoading || !product ? (
          <div className="p-20 text-center space-y-4">
            <div className="w-12 h-12 border-4 border-[#8C5353] border-t-transparent rounded-full animate-spin mx-auto" />
            <p className="font-serif text-sm text-[#2D2325]">Opening Atelier Details...</p>
          </div>
        ) : (
          <div className="overflow-y-auto p-6 sm:p-10 divide-y divide-[#FAF5F3]">
            {/* Main Product Overview */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 pb-10">
              {/* Left: Gallery */}
              <div className="space-y-4">
                <ImageGallery images={product.images || []} productName={product.name} />
              </div>

              {/* Right: Info & Actions */}
              <div className="space-y-6 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between gap-4 mb-2">
                    <span className="px-3 py-1 bg-[#2D2325] text-white text-[10px] uppercase font-bold tracking-widest rounded-full">
                      {product.categoryName || 'Haute Couture'}
                    </span>

                    <div className="flex items-center gap-2 mr-10">
                      <button
                        onClick={handleShare}
                        className="p-2 text-stone-400 hover:text-[#2D2325] rounded-full hover:bg-[#FAF5F3] transition-colors"
                        title="Share product"
                      >
                        <Share2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => toggleWishlist(product)}
                        className={`p-2 rounded-full border transition-all ${
                          isSaved
                            ? 'bg-red-50 text-red-600 border-red-200'
                            : 'text-stone-400 border-stone-200 hover:text-red-500'
                        }`}
                        title="Save to wishlist"
                      >
                        <Heart className={`w-4 h-4 ${isSaved ? 'fill-current' : ''}`} />
                      </button>
                    </div>
                  </div>

                  <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#2D2325] tracking-tight">
                    {product.name}
                  </h1>

                  {/* Rating & Stock Status */}
                  <div className="flex items-center gap-3 mt-2">
                    <div className="flex items-center gap-1 text-amber-500 text-xs font-semibold">
                      <Star className="w-3.5 h-3.5 fill-current" />
                      <span>{product.averageRating || 5.0}</span>
                      <span className="text-[#C49A8B] font-normal">
                        ({product.reviewCount || (product.reviews?.length || 0)} Atelier reviews)
                      </span>
                    </div>
                    <span>•</span>
                    <span
                      className={`text-[10px] uppercase tracking-wider font-bold px-2 py-0.5 rounded-full ${
                        availableStock > 0 ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-700'
                      }`}
                    >
                      {availableStock > 0 ? `${availableStock} in Atelier Stock` : 'Out of Stock'}
                    </span>
                  </div>

                  {/* Price */}
                  <div className="flex items-baseline gap-3 mt-4">
                    <span className="font-serif text-3xl font-bold text-[#2D2325]">
                      ₹{effectivePrice.toLocaleString('en-IN')}
                    </span>
                    {originalPrice && (
                      <span className="text-sm text-stone-400 line-through">
                        ₹{originalPrice.toLocaleString('en-IN')}
                      </span>
                    )}
                    {product.salePrice && (
                      <span className="text-xs bg-[#8C5353] text-white px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wider">
                        Sale Offer
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-[#C49A8B] mt-0.5">Inclusive of all boutique duties and luxury taxes.</p>

                  <p className="text-xs text-[#4A3E3F] leading-relaxed mt-4 font-light">
                    {product.shortDescription || product.description}
                  </p>

                  {/* Variant Selector (Sizes & Colors) */}
                  {product.variants && product.variants.length > 0 && (
                    <div className="mt-6 pt-4 border-t border-[#FAF5F3] space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-semibold uppercase tracking-wider text-[#2D2325]">
                          Select Size & Tone
                        </span>
                        {selectedVariant && (
                          <span className="text-xs text-[#8C5353] font-medium">
                            {selectedVariant.size} / {selectedVariant.colorName}
                          </span>
                        )}
                      </div>

                      <div className="flex flex-wrap gap-2">
                        {product.variants.map((v) => {
                          const isSelected = selectedVariant?.id === v.id;
                          const isOut = v.stockQuantity <= 0;
                          return (
                            <button
                              key={v.id}
                              onClick={() => !isOut && setSelectedVariant(v)}
                              disabled={isOut}
                              className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition-all border ${
                                isSelected
                                  ? 'bg-[#2D2325] text-white border-[#2D2325] shadow-sm'
                                  : isOut
                                  ? 'bg-stone-100 text-stone-300 border-stone-200 line-through cursor-not-allowed'
                                  : 'bg-[#FAF5F3] text-[#2D2325] border-[#E8C4C0] hover:border-[#8C5353]'
                              }`}
                            >
                              <span>{v.size} - {v.colorName}</span>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* Quantity & Actions */}
                  <div className="mt-6 pt-4 border-t border-[#FAF5F3] space-y-3">
                    <div className="flex items-center gap-4">
                      {/* Quantity Stepper */}
                      <div className="flex items-center border border-[#E8C4C0] bg-[#FAF5F3] rounded-xl px-2 py-1">
                        <button
                          onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                          className="p-1.5 text-stone-500 hover:text-[#2D2325]"
                          disabled={quantity <= 1}
                        >
                          <Minus className="w-3.5 h-3.5" />
                        </button>
                        <span className="w-8 text-center text-xs font-semibold text-[#2D2325]">{quantity}</span>
                        <button
                          onClick={() => setQuantity((q) => Math.min(availableStock, q + 1))}
                          className="p-1.5 text-stone-500 hover:text-[#2D2325]"
                          disabled={quantity >= availableStock}
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      {/* Add to Cart Button */}
                      <button
                        onClick={handleAddToCart}
                        disabled={availableStock <= 0}
                        className="flex-1 py-3 px-6 bg-[#2D2325] hover:bg-[#8C5353] text-white rounded-xl text-xs uppercase font-bold tracking-widest flex items-center justify-center gap-2 transition-all shadow-md disabled:bg-stone-300 disabled:cursor-not-allowed cursor-pointer"
                      >
                        <ShoppingBag className="w-4 h-4" />
                        <span>{availableStock > 0 ? 'Add to Bag' : 'Sold Out'}</span>
                      </button>
                    </div>

                    {/* Instant Buy Now Button */}
                    {availableStock > 0 && (
                      <button
                        onClick={handleBuyNow}
                        className="w-full py-2.5 bg-[#FAF5F3] hover:bg-[#F4E3DF] text-[#8C5353] border border-[#E8C4C0] rounded-xl text-xs uppercase font-bold tracking-widest flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                      >
                        <Sparkles className="w-3.5 h-3.5 text-amber-500 fill-amber-400" />
                        <span>Instant Checkout</span>
                      </button>
                    )}
                  </div>
                </div>

                {/* Benefits Micro-Bar */}
                <div className="grid grid-cols-3 gap-2 pt-4 border-t border-[#FAF5F3] text-[10px] text-[#6B5B5E]">
                  <div className="flex items-center gap-1.5">
                    <Truck className="w-3.5 h-3.5 text-[#8C5353]" />
                    <span>Free Shipping &gt; ₹2,999</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <RotateCcw className="w-3.5 h-3.5 text-[#8C5353]" />
                    <span>14-Day Returns</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <ShieldCheck className="w-3.5 h-3.5 text-[#8C5353]" />
                    <span>100% Authentic Silk</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Accordion Tabs & Reviews */}
            <div className="pt-8">
              <div className="flex border-b border-[#FAF5F3] gap-6 text-xs uppercase font-semibold tracking-wider">
                <button
                  onClick={() => setActiveTab('desc')}
                  className={`pb-3 transition-colors relative ${
                    activeTab === 'desc' ? 'text-[#8C5353]' : 'text-stone-400 hover:text-[#2D2325]'
                  }`}
                >
                  Description & Fabric
                  {activeTab === 'desc' && (
                    <span className="absolute bottom-0 left-0 w-full h-[2px] bg-[#8C5353]" />
                  )}
                </button>
                <button
                  onClick={() => setActiveTab('specs')}
                  className={`pb-3 transition-colors relative ${
                    activeTab === 'specs' ? 'text-[#8C5353]' : 'text-stone-400 hover:text-[#2D2325]'
                  }`}
                >
                  Atelier Specs & Care
                  {activeTab === 'specs' && (
                    <span className="absolute bottom-0 left-0 w-full h-[2px] bg-[#8C5353]" />
                  )}
                </button>
                <button
                  onClick={() => setActiveTab('reviews')}
                  className={`pb-3 transition-colors relative ${
                    activeTab === 'reviews' ? 'text-[#8C5353]' : 'text-stone-400 hover:text-[#2D2325]'
                  }`}
                >
                  Client Reviews ({product.reviews?.length || 0})
                  {activeTab === 'reviews' && (
                    <span className="absolute bottom-0 left-0 w-full h-[2px] bg-[#8C5353]" />
                  )}
                </button>
              </div>

              <div className="py-6 text-xs text-[#4A3E3F] leading-relaxed">
                {activeTab === 'desc' && (
                  <div className="space-y-3 font-light">
                    <p>{product.description}</p>
                    <p>
                      <strong>Material:</strong> {product.material || 'Organic Mulberry Silk & Fine Cotton Blend'}
                    </p>
                  </div>
                )}

                {activeTab === 'specs' && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="bg-[#FAF5F3] p-4 rounded-xl border border-[#F4E3DF]">
                      <h4 className="font-semibold text-[#2D2325] mb-2 uppercase tracking-wider text-[10px]">
                        Care Instructions
                      </h4>
                      <p>
                        {product.careInstructions ||
                          'Dry clean recommended or gentle hand wash in lukewarm water with mild silk detergent.'}
                      </p>
                    </div>
                    <div className="bg-[#FAF5F3] p-4 rounded-xl border border-[#F4E3DF]">
                      <h4 className="font-semibold text-[#2D2325] mb-2 uppercase tracking-wider text-[10px]">
                        Sizing Advice
                      </h4>
                      <p>True to size silhouette. Model is 5'9" wearing size S. Hand-stitched in small batches.</p>
                    </div>
                  </div>
                )}

                {activeTab === 'reviews' && (
                  <ReviewSection
                    productId={product.id}
                    reviews={product.reviews || []}
                    onReviewAdded={() => openProductModal(product.id)}
                  />
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
