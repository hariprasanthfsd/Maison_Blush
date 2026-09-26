import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Heart, ShoppingBag, Star, Truck, RotateCcw, ShieldCheck, Share2, Plus, Minus, ArrowLeft } from 'lucide-react';
import { ImageGallery } from '../components/product/ImageGallery';
import { VariantSelector } from '../components/product/VariantSelector';
import { ReviewSection } from '../components/product/ReviewSection';
import { ProductCard } from '../components/common/ProductCard';
import { BackButton } from '../components/common/BackButton';
import { Product, ProductVariant } from '../types';
import { productApi } from '../services/api';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { useToast } from '../context/ToastContext';

export const ProductDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [product, setProduct] = useState<Product | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(null);
  const [quantity, setQuantity] = useState<number>(1);
  const [activeTab, setActiveTab] = useState<'desc' | 'specs' | 'size' | 'shipping' | 'reviews'>('desc');
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const { addToCart } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();
  const { showToast } = useToast();

  useEffect(() => {
    const loadProductDetail = async () => {
      if (!id) return;
      setIsLoading(true);
      try {
        const data = await productApi.getProductById(Number(id));
        setProduct(data);
        if (data.variants && data.variants.length > 0) {
          setSelectedVariant(data.variants[0]);
        }
        
        // Fetch related products
        const related = await productApi.getRelatedProducts(data.id);
        setRelatedProducts(related);

        // Store recently viewed in localStorage
        const history = JSON.parse(localStorage.getItem('mb_recent_products') || '[]');
        const updatedHistory = [data, ...history.filter((p: any) => p.id !== data.id)].slice(0, 4);
        localStorage.setItem('mb_recent_products', JSON.stringify(updatedHistory));
      } catch (err) {
        console.error('Failed to load product details:', err);
      } finally {
        setIsLoading(false);
      }
    };
    loadProductDetail();
    window.scrollTo(0, 0);
  }, [id]);

  if (isLoading) {
    return (
      <div className="py-20 bg-[#FAF5F3] min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-12 h-12 border-4 border-[#8C5353] border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="font-serif text-base text-[#2D2325]">Opening Atelier Details...</p>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="py-20 bg-[#FAF5F3] min-h-screen text-center space-y-4">
        <h2 className="font-serif text-2xl font-bold text-[#2D2325]">Product Not Found</h2>
        <button onClick={() => navigate('/shop')} className="px-6 py-2.5 bg-[#2D2325] text-white rounded-xl text-xs uppercase font-semibold">
          Return to Shop
        </button>
      </div>
    );
  }

  const isSaved = isInWishlist(product.id);
  const effectivePrice = (product.salePrice ?? product.basePrice) + (selectedVariant?.additionalPrice || 0);
  const originalPrice = product.salePrice ? product.basePrice : null;
  const availableStock = selectedVariant ? selectedVariant.stockQuantity : product.totalStock;

  const handleAddToCart = async () => {
    if (availableStock <= 0) {
      showToast('Selected variant is currently out of stock.', 'error');
      return;
    }
    await addToCart(product.id, selectedVariant?.id, quantity);
  };

  const handleBuyNow = async () => {
    const success = await addToCart(product.id, selectedVariant?.id, quantity);
    if (success) {
      navigate('/checkout');
    }
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({ title: product.name, url: window.location.href });
    } else {
      navigator.clipboard.writeText(window.location.href);
      showToast('Product link copied to clipboard! 📋', 'info');
    }
  };

  return (
    <div className="py-10 bg-[#FAF5F3] min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        
        {/* Navigation & Breadcrumb Bar */}
        <div className="flex items-center justify-between flex-wrap gap-4">
          <BackButton label="Back to Products" fallbackUrl="/shop" />

          <div className="flex items-center gap-2 text-xs text-[#C49A8B]">
            <Link to="/" className="hover:text-[#2D2325] transition-colors">Home</Link>
            <span>/</span>
            <Link to="/shop" className="hover:text-[#2D2325] transition-colors">Shop</Link>
            <span>/</span>
            <Link to={`/shop?category=${product.categorySlug}`} className="hover:text-[#2D2325] transition-colors">{product.categoryName}</Link>
            <span>/</span>
            <span className="text-[#2D2325] font-semibold truncate max-w-xs">{product.name}</span>
          </div>
        </div>

        {/* Main Product Overview */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 bg-white p-6 sm:p-10 rounded-3xl border border-[#F4E3DF] shadow-soft">
          
          {/* Left: Gallery */}
          <ImageGallery images={product.images || []} productName={product.name} />

          {/* Right: Info & Actions */}
          <div className="space-y-6 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between gap-4 mb-2">
                <span className="px-3 py-1 bg-[#2D2325] text-white text-[10px] uppercase font-bold tracking-widest rounded-full">
                  {product.categoryName || 'Boutique'}
                </span>

                <div className="flex items-center gap-2">
                  <button onClick={handleShare} className="p-2 text-stone-400 hover:text-[#2D2325]" title="Share product">
                    <Share2 className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => toggleWishlist(product)}
                    className={`p-2 rounded-full border transition-all ${isSaved ? 'bg-red-50 text-red-600 border-red-200' : 'text-stone-400 border-stone-200 hover:text-red-500'}`}
                    title="Save to wishlist"
                  >
                    <Heart className={`w-5 h-5 ${isSaved ? 'fill-current' : ''}`} />
                  </button>
                </div>
              </div>

              <h1 className="font-serif text-3xl sm:text-4xl font-bold tracking-wide text-[#2D2325]">
                {product.name}
              </h1>

              {/* Rating summary */}
              <div className="flex items-center gap-2 mt-2">
                <div className="flex text-amber-500 gap-0.5">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <Star key={s} className={`w-4 h-4 ${s <= Math.round(product.averageRating) ? 'fill-current' : 'text-stone-300'}`} />
                  ))}
                </div>
                <span className="text-xs text-[#6B5B5E] font-medium">
                  {product.averageRating} ({product.reviewCount} Reviews)
                </span>
              </div>

              {/* Price row */}
              <div className="flex items-baseline gap-3 mt-4 pt-4 border-t border-[#FAF5F3]">
                <span className="font-serif text-3xl font-bold text-[#8C5353]">
                  ₹{effectivePrice.toLocaleString('en-IN')}
                </span>
                {originalPrice && (
                  <span className="text-sm text-stone-400 line-through font-light">
                    ₹{originalPrice.toLocaleString('en-IN')}
                  </span>
                )}
                {product.badge && (
                  <span className="px-3 py-1 bg-[#E8C4C0] text-[#2D2325] text-[10px] uppercase font-bold tracking-wider rounded-full">
                    {product.badge}
                  </span>
                )}
              </div>

              <p className="text-xs sm:text-sm text-[#4A3E3F] leading-relaxed mt-4 font-light">
                {product.shortDescription}
              </p>

              {/* Variant Selector */}
              {product.variants && (
                <VariantSelector
                  variants={product.variants}
                  selectedVariant={selectedVariant}
                  onSelectVariant={(v) => setSelectedVariant(v)}
                />
              )}

              {/* Quantity Counter */}
              <div className="pt-6 border-t border-[#FAF5F3] space-y-2">
                <label className="block text-xs uppercase font-semibold text-[#2D2325] tracking-wider">Quantity</label>
                <div className="flex items-center gap-4">
                  <div className="flex items-center border border-[#E8C4C0] rounded-xl bg-[#FAF5F3] p-1">
                    <button
                      onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                      className="p-2 text-stone-600 hover:text-black"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <span className="px-4 text-sm font-semibold">{quantity}</span>
                    <button
                      onClick={() => setQuantity((q) => Math.min(availableStock, q + 1))}
                      className="p-2 text-stone-600 hover:text-black"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                  <span className="text-xs text-[#C49A8B]">Max {availableStock} per order</span>
                </div>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="space-y-3 pt-6 border-t border-[#FAF5F3]">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <button
                  disabled={availableStock <= 0}
                  onClick={handleAddToCart}
                  className="py-4 bg-[#2D2325] hover:bg-[#8C5353] disabled:bg-stone-300 text-white text-xs uppercase font-bold tracking-[0.15em] rounded-xl shadow-boutique transition-all flex items-center justify-center gap-2"
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>Add to Shopping Bag</span>
                </button>

                <button
                  disabled={availableStock <= 0}
                  onClick={handleBuyNow}
                  className="py-4 bg-[#8C5353] hover:bg-[#6E3C3D] disabled:bg-stone-300 text-white text-xs uppercase font-bold tracking-[0.15em] rounded-xl shadow-boutique transition-all"
                >
                  Buy Now Instant
                </button>
              </div>

              {/* Perks summary */}
              <div className="grid grid-cols-3 gap-2 pt-4 text-[11px] text-[#6B5B5E] text-center border-t border-[#FAF5F3]">
                <div className="flex flex-col items-center gap-1">
                  <Truck className="w-4 h-4 text-[#8C5353]" />
                  <span>Free Courier Shipping</span>
                </div>
                <div className="flex flex-col items-center gap-1">
                  <RotateCcw className="w-4 h-4 text-[#8C5353]" />
                  <span>14-Day Easy Return</span>
                </div>
                <div className="flex flex-col items-center gap-1">
                  <ShieldCheck className="w-4 h-4 text-[#8C5353]" />
                  <span>Verified Authentic</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tabbed Detailed Specifications & Reviews */}
        <div className="bg-white p-6 sm:p-10 rounded-3xl border border-[#F4E3DF] shadow-soft">
          <div className="flex items-center gap-4 sm:gap-8 border-b border-[#F4E3DF] overflow-x-auto pb-4">
            {[
              { id: 'desc', label: 'Description' },
              { id: 'specs', label: 'Specifications & Care' },
              { id: 'size', label: 'Size Guide' },
              { id: 'shipping', label: 'Shipping & Returns' },
              { id: 'reviews', label: `Reviews (${product.reviewCount})` },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`text-xs uppercase font-semibold tracking-wider transition-all whitespace-nowrap pb-2 -mb-4 border-b-2 ${
                  activeTab === tab.id
                    ? 'border-[#8C5353] text-[#8C5353]'
                    : 'border-transparent text-[#6B5B5E] hover:text-[#2D2325]'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="pt-8 text-sm text-[#4A3E3F] leading-relaxed">
            {activeTab === 'desc' && (
              <div className="space-y-4 max-w-3xl">
                <p className="font-serif text-lg font-bold text-[#2D2325]">The Artisan Design Story</p>
                <p>{product.description || product.shortDescription}</p>
              </div>
            )}

            {activeTab === 'specs' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl">
                <div className="space-y-2">
                  <p className="font-semibold text-[#2D2325]">Fabric & Composition:</p>
                  <p className="text-xs bg-[#FAF5F3] p-3 rounded-xl border border-[#E8C4C0]">{product.material || '100% Handcrafted Premium Fabric'}</p>
                </div>
                <div className="space-y-2">
                  <p className="font-semibold text-[#2D2325]">Care Instructions:</p>
                  <p className="text-xs bg-[#FAF5F3] p-3 rounded-xl border border-[#E8C4C0]">{product.careInstructions || 'Dry clean recommended. Low iron on reverse.'}</p>
                </div>
                <div className="space-y-2">
                  <p className="font-semibold text-[#2D2325]">SKU Identifier:</p>
                  <p className="text-xs font-mono bg-[#FAF5F3] p-3 rounded-xl border border-[#E8C4C0]">{product.sku || 'MB-001'}</p>
                </div>
              </div>
            )}

            {activeTab === 'size' && (
              <div className="space-y-4 max-w-2xl">
                <p className="font-serif text-lg font-bold text-[#2D2325]">Boutique Sizing Chart (Inches)</p>
                <table className="w-full text-xs text-left border border-[#E8C4C0] rounded-xl overflow-hidden">
                  <thead className="bg-[#FAF5F3] font-semibold text-[#2D2325]">
                    <tr>
                      <th className="p-3">Size</th>
                      <th className="p-3">Bust (in)</th>
                      <th className="p-3">Waist (in)</th>
                      <th className="p-3">Hips (in)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#FAF5F3]">
                    <tr><td className="p-3 font-bold">XS</td><td className="p-3">32 - 33</td><td className="p-3">24 - 25</td><td className="p-3">35 - 36</td></tr>
                    <tr><td className="p-3 font-bold">S</td><td className="p-3">34 - 35</td><td className="p-3">26 - 27</td><td className="p-3">37 - 38</td></tr>
                    <tr><td className="p-3 font-bold">M</td><td className="p-3">36 - 37</td><td className="p-3">28 - 29</td><td className="p-3">39 - 40</td></tr>
                    <tr><td className="p-3 font-bold">L</td><td className="p-3">38 - 40</td><td className="p-3">30 - 32</td><td className="p-3">41 - 43</td></tr>
                  </tbody>
                </table>
              </div>
            )}

            {activeTab === 'shipping' && (
              <div className="space-y-4 max-w-2xl">
                <p className="font-serif text-lg font-bold text-[#2D2325]">Delivery & Return Policies</p>
                <p>We provide insured courier dispatch across India within 24-48 business hours. Orders above ₹2,999 qualify for complimentary express delivery.</p>
                <p>If you are not completely enchanted with your purchase, return it within 14 days for a seamless exchange or refund.</p>
              </div>
            )}

            {activeTab === 'reviews' && (
              <ReviewSection
                productId={product.id}
                reviews={product.reviews || []}
                onReviewAdded={() => {
                  productApi.getProductById(product.id).then(setProduct);
                }}
              />
            )}
          </div>
        </div>

        {/* Related Products Section */}
        {relatedProducts.length > 0 && (
          <div className="space-y-8">
            <div className="text-center">
              <span className="font-script text-2xl text-[#C49A8B]">Complete The Look</span>
              <h2 className="font-serif text-3xl font-bold text-[#2D2325] mt-1">You May Also Love</h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
