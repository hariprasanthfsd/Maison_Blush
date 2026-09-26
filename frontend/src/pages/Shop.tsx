import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Filter, SlidersHorizontal, RotateCcw, Search, ChevronDown, Sparkles } from 'lucide-react';
import { ProductCard } from '../components/common/ProductCard';
import { BackButton } from '../components/common/BackButton';
import { Product, Category, PaginatedResponse } from '../types';
import { productApi, categoryApi } from '../services/api';

export const Shop: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [totalCount, setTotalCount] = useState<number>(0);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState<boolean>(false);

  // Extract query filters from URL
  const selectedCategory = searchParams.get('category') || '';
  const selectedSubcategory = searchParams.get('subcategory') || '';
  const selectedSize = searchParams.get('size') || '';
  const selectedColor = searchParams.get('color') || '';
  const minPrice = searchParams.get('minPrice') || '';
  const maxPrice = searchParams.get('maxPrice') || '';
  const onSale = searchParams.get('onSale') === 'true';
  const inStock = searchParams.get('inStock') === 'true';
  const sort = searchParams.get('sort') || 'newest';
  const search = searchParams.get('search') || '';
  const page = parseInt(searchParams.get('page') || '1', 10);

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const data = await categoryApi.getCategories();
        setCategories(data);
      } catch (err) { }
    };
    loadCategories();
  }, []);

  useEffect(() => {
    const fetchProducts = async () => {
      setIsLoading(true);
      try {
        const res: PaginatedResponse<Product> = await productApi.getProducts({
          category: selectedCategory,
          subcategory: selectedSubcategory,
          size: selectedSize,
          color: selectedColor,
          minPrice: minPrice ? Number(minPrice) : undefined,
          maxPrice: maxPrice ? Number(maxPrice) : undefined,
          onSale: onSale || undefined,
          inStock: inStock || undefined,
          sort,
          search,
          page,
          pageSize: 12,
        });
        setProducts(res.items);
        setTotalCount(res.totalCount);
        setTotalPages(res.totalPages);
      } catch (err) {
        console.error('Failed to load products:', err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchProducts();
  }, [searchParams]);

  const updateFilter = (key: string, value: string | null) => {
    const newParams = new URLSearchParams(searchParams);
    if (value) {
      newParams.set(key, value);
    } else {
      newParams.delete(key);
    }
    newParams.set('page', '1'); // Reset to page 1 on filter change
    setSearchParams(newParams);
  };

  const clearAllFilters = () => {
    setSearchParams(new URLSearchParams());
  };

  const hasActiveFilters = Boolean(
    selectedCategory || selectedSubcategory || selectedSize || selectedColor || minPrice || maxPrice || onSale || inStock || search
  );

  return (
    <div className="py-10 bg-[#FAF5F3] min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Back Navigation */}
        <div className="mb-6">
          <BackButton label="Back to Home" to="/" />
        </div>

        {/* Page Title Header */}
        <div className="text-center max-w-xl mx-auto mb-10">
          <span className="font-script text-2xl text-[#C49A8B]">The Complete Collection</span>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold tracking-wide text-[#2D2325] mt-1 capitalize">
            {selectedCategory ? `${selectedCategory} Boutique` : 'All Boutique Products'}
          </h1>
          <p className="text-xs text-[#6B5B5E] mt-2 font-light">
            Showing {totalCount} curated haute couture items
          </p>
        </div>

        {/* Top Control Bar (Search, Filter toggle, Sorting) */}
        <div className="bg-white p-4 rounded-2xl shadow-soft border border-[#F4E3DF] mb-8 flex flex-col md:flex-row items-center justify-between gap-4">
          
          {/* Mobile Filter Toggle */}
          <button
            onClick={() => setIsMobileFilterOpen(!isMobileFilterOpen)}
            className="lg:hidden w-full md:w-auto py-2.5 px-4 bg-[#FAF5F3] border border-[#E8C4C0] rounded-xl text-xs font-semibold uppercase tracking-wider text-[#2D2325] flex items-center justify-center gap-2"
          >
            <SlidersHorizontal className="w-4 h-4 text-[#8C5353]" />
            <span>Filter Catalog {hasActiveFilters && '• Active'}</span>
          </button>

          {/* Keyword Search Input */}
          <div className="relative w-full md:w-72">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#C49A8B]" />
            <input
              type="text"
              placeholder="Search by keyword..."
              value={search}
              onChange={(e) => updateFilter('search', e.target.value || null)}
              className="w-full bg-[#FAF5F3] border border-[#E8C4C0] rounded-xl pl-10 pr-4 py-2 text-xs text-[#2D2325] placeholder-[#C49A8B] focus:outline-none focus:border-[#8C5353]"
            />
          </div>

          {/* Active Filter Pills */}
          {hasActiveFilters && (
            <div className="hidden lg:flex items-center gap-2 overflow-x-auto">
              {selectedCategory && (
                <span className="px-3 py-1 bg-[#FAF5F3] border border-[#E8C4C0] rounded-full text-[11px] text-[#8C5353] font-semibold flex items-center gap-1">
                  Cat: {selectedCategory}
                  <button onClick={() => updateFilter('category', null)} className="hover:text-black">×</button>
                </span>
              )}
              {selectedSize && (
                <span className="px-3 py-1 bg-[#FAF5F3] border border-[#E8C4C0] rounded-full text-[11px] text-[#8C5353] font-semibold flex items-center gap-1">
                  Size: {selectedSize}
                  <button onClick={() => updateFilter('size', null)} className="hover:text-black">×</button>
                </span>
              )}
              {onSale && (
                <span className="px-3 py-1 bg-red-50 border border-red-200 rounded-full text-[11px] text-red-700 font-semibold flex items-center gap-1">
                  On Sale
                  <button onClick={() => updateFilter('onSale', null)} className="hover:text-black">×</button>
                </span>
              )}
              <button
                onClick={clearAllFilters}
                className="text-xs text-stone-500 hover:text-stone-800 underline font-medium ml-2"
              >
                Reset All
              </button>
            </div>
          )}

          {/* Sort Dropdown */}
          <div className="flex items-center gap-2 w-full md:w-auto justify-end">
            <span className="text-xs uppercase font-semibold text-[#C49A8B] whitespace-nowrap">Sort By:</span>
            <select
              value={sort}
              onChange={(e) => updateFilter('sort', e.target.value)}
              className="bg-[#FAF5F3] border border-[#E8C4C0] rounded-xl px-3 py-2 text-xs font-semibold text-[#2D2325] focus:outline-none focus:border-[#8C5353]"
            >
              <option value="newest">Newest Arrivals</option>
              <option value="price_asc">Price: Low to High</option>
              <option value="price_desc">Price: High to Low</option>
              <option value="popularity">Popularity & Rating</option>
            </select>
          </div>
        </div>

        {/* Catalog Main Layout (Sidebar + Product Grid) */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          
          {/* Sidebar Filter Panel (Desktop & Mobile Drawer) */}
          <aside className={`lg:block ${isMobileFilterOpen ? 'block' : 'hidden'} space-y-6 bg-white p-6 rounded-3xl border border-[#F4E3DF] shadow-soft h-fit`}>
            <div className="flex items-center justify-between pb-4 border-b border-[#FAF5F3]">
              <div className="flex items-center gap-2">
                <Filter className="w-4 h-4 text-[#8C5353]" />
                <h3 className="font-serif text-base font-bold text-[#2D2325]">Refine Selection</h3>
              </div>
              {hasActiveFilters && (
                <button
                  onClick={clearAllFilters}
                  className="text-xs text-[#8C5353] hover:underline font-semibold flex items-center gap-1"
                >
                  <RotateCcw className="w-3 h-3" /> Reset
                </button>
              )}
            </div>

            {/* Categories Filter */}
            <div>
              <h4 className="text-xs uppercase font-semibold text-[#2D2325] tracking-wider mb-3">Category</h4>
              <div className="space-y-1.5">
                <button
                  onClick={() => updateFilter('category', null)}
                  className={`w-full text-left px-3 py-2 rounded-xl text-xs transition-colors font-medium flex items-center justify-between ${
                    !selectedCategory ? 'bg-[#2D2325] text-white font-semibold' : 'text-[#4A3E3F] hover:bg-[#FAF5F3]'
                  }`}
                >
                  <span>All Categories</span>
                  <span>({totalCount})</span>
                </button>
                {categories.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => updateFilter('category', cat.slug)}
                    className={`w-full text-left px-3 py-2 rounded-xl text-xs transition-colors font-medium flex items-center justify-between ${
                      selectedCategory === cat.slug ? 'bg-[#8C5353] text-white font-semibold' : 'text-[#4A3E3F] hover:bg-[#FAF5F3]'
                    }`}
                  >
                    <span>{cat.name}</span>
                    <span>({cat.productCount})</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Size Filter */}
            <div className="pt-4 border-t border-[#FAF5F3]">
              <h4 className="text-xs uppercase font-semibold text-[#2D2325] tracking-wider mb-3">Size</h4>
              <div className="grid grid-cols-4 gap-2">
                {['XS', 'S', 'M', 'L', 'XL', 'One Size'].map((sz) => (
                  <button
                    key={sz}
                    onClick={() => updateFilter('size', selectedSize === sz ? null : sz)}
                    className={`py-2 text-xs font-semibold rounded-xl border transition-all ${
                      selectedSize === sz
                        ? 'bg-[#2D2325] text-white border-[#2D2325]'
                        : 'bg-[#FAF5F3] text-[#4A3E3F] border-[#E8C4C0] hover:bg-white'
                    }`}
                  >
                    {sz}
                  </button>
                ))}
              </div>
            </div>

            {/* Special Filters */}
            <div className="pt-4 border-t border-[#FAF5F3] space-y-3">
              <h4 className="text-xs uppercase font-semibold text-[#2D2325] tracking-wider mb-2">Options</h4>
              <label className="flex items-center gap-2 cursor-pointer text-xs text-[#4A3E3F]">
                <input
                  type="checkbox"
                  checked={onSale}
                  onChange={(e) => updateFilter('onSale', e.target.checked ? 'true' : null)}
                  className="rounded border-[#E8C4C0] text-[#8C5353] focus:ring-[#8C5353]"
                />
                <span>On Sale Items Only ✨</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer text-xs text-[#4A3E3F]">
                <input
                  type="checkbox"
                  checked={inStock}
                  onChange={(e) => updateFilter('inStock', e.target.checked ? 'true' : null)}
                  className="rounded border-[#E8C4C0] text-[#8C5353] focus:ring-[#8C5353]"
                />
                <span>In Stock Only</span>
              </label>
            </div>
          </aside>

          {/* Product Grid Area */}
          <div className="lg:col-span-3 space-y-8">
            {isLoading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3, 4, 5, 6].map((n) => (
                  <div key={n} className="bg-white rounded-2xl h-96 animate-pulse p-4 border border-[#F4E3DF]" />
                ))}
              </div>
            ) : products.length > 0 ? (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {products.map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex items-center justify-center gap-2 pt-8">
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((pNum) => (
                      <button
                        key={pNum}
                        onClick={() => updateFilter('page', pNum.toString())}
                        className={`w-10 h-10 rounded-xl text-xs font-semibold transition-all ${
                          page === pNum
                            ? 'bg-[#2D2325] text-white shadow-sm'
                            : 'bg-white text-[#4A3E3F] hover:bg-[#FAF5F3] border border-[#F4E3DF]'
                        }`}
                      >
                        {pNum}
                      </button>
                    ))}
                  </div>
                )}
              </>
            ) : (
              <div className="bg-white rounded-3xl border border-[#F4E3DF] p-16 text-center space-y-4">
                <Sparkles className="w-12 h-12 text-[#C49A8B] mx-auto" />
                <h3 className="font-serif text-xl font-bold text-[#2D2325]">No Matching Boutique Pieces</h3>
                <p className="text-xs text-[#6B5B5E] max-w-sm mx-auto">
                  We couldn't find any products matching your selected combination of filters.
                </p>
                <button
                  onClick={clearAllFilters}
                  className="px-6 py-3 bg-[#2D2325] text-white text-xs font-semibold uppercase tracking-wider rounded-xl hover:bg-[#8C5353] transition-colors"
                >
                  Clear All Filters
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
