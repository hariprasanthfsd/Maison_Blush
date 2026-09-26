import React, { useState, useEffect } from 'react';
import { Filter, SlidersHorizontal, RotateCcw, Search, Sparkles, Check } from 'lucide-react';
import { ProductCard } from '../common/ProductCard';
import { Product, Category, PaginatedResponse } from '../../types';
import { productApi, categoryApi } from '../../services/api';
import { useUIModal } from '../../context/UIModalContext';

export const AtelierCatalog: React.FC = () => {
  const { categoryFilter, setCategoryFilter, onSaleFilter, setOnSaleFilter } = useUIModal();

  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [totalCount, setTotalCount] = useState<number>(0);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState<boolean>(false);

  // Local filter states
  const [selectedSubcategory, setSelectedSubcategory] = useState<string>('');
  const [selectedSize, setSelectedSize] = useState<string>('');
  const [inStock, setInStock] = useState<boolean>(false);
  const [sort, setSort] = useState<string>('newest');
  const [search, setSearch] = useState<string>('');
  const [page, setPage] = useState<number>(1);

  // Load available categories once
  useEffect(() => {
    const loadCategories = async () => {
      try {
        const data = await categoryApi.getCategories();
        setCategories(data);
      } catch (err) {}
    };
    loadCategories();
  }, []);

  // Fetch products whenever filters change
  useEffect(() => {
    const fetchProducts = async () => {
      setIsLoading(true);
      try {
        const res: PaginatedResponse<Product> = await productApi.getProducts({
          category: categoryFilter || undefined,
          subcategory: selectedSubcategory || undefined,
          size: selectedSize || undefined,
          onSale: onSaleFilter || undefined,
          inStock: inStock || undefined,
          sort,
          search: search || undefined,
          page,
          pageSize: 12,
        });
        setProducts(res.items);
        setTotalCount(res.totalCount);
        setTotalPages(res.totalPages);
      } catch (err) {
        console.error('Failed to load catalog products:', err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchProducts();
  }, [categoryFilter, selectedSubcategory, selectedSize, onSaleFilter, inStock, sort, search, page]);

  const handleCategorySelect = (slug: string) => {
    setCategoryFilter(slug);
    setSelectedSubcategory('');
    setPage(1);
  };

  const clearAllFilters = () => {
    setCategoryFilter('');
    setSelectedSubcategory('');
    setSelectedSize('');
    setOnSaleFilter(false);
    setInStock(false);
    setSearch('');
    setSort('newest');
    setPage(1);
  };

  const hasActiveFilters = Boolean(
    categoryFilter || selectedSubcategory || selectedSize || onSaleFilter || inStock || search
  );

  // Get active category object for subcategories
  const currentCategoryObj = categories.find((c) => c.slug === categoryFilter);

  return (
    <section id="collection" className="py-20 bg-[#FAF5F3] scroll-mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="font-script text-2xl sm:text-3xl text-[#C49A8B]">The Complete Atelier</span>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold tracking-wide text-[#2D2325] mt-1 capitalize">
            {categoryFilter ? `${categoryFilter} Collection` : 'Haute Couture Catalogue'}
          </h2>
          <div className="w-16 h-0.5 bg-[#D9A09A] mx-auto mt-3 rounded-full" />
          <p className="text-xs text-[#6B5B5E] mt-3 font-light">
            Displaying {totalCount} signature boutique pieces • Handcrafted in limited editions
          </p>
        </div>

        {/* Filter Control Bar */}
        <div className="bg-white p-4 rounded-2xl shadow-soft border border-[#F4E3DF] mb-8 flex flex-col md:flex-row items-center justify-between gap-4">
          
          {/* Mobile Filter Button */}
          <button
            onClick={() => setIsMobileFilterOpen(!isMobileFilterOpen)}
            className="lg:hidden w-full md:w-auto py-2.5 px-4 bg-[#FAF5F3] border border-[#E8C4C0] rounded-xl text-xs font-semibold uppercase tracking-wider text-[#2D2325] flex items-center justify-center gap-2 cursor-pointer"
          >
            <SlidersHorizontal className="w-4 h-4 text-[#8C5353]" />
            <span>Filter Catalog {hasActiveFilters && '• Active'}</span>
          </button>

          {/* Keyword Search */}
          <div className="relative w-full md:w-80">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#C49A8B]" />
            <input
              type="text"
              placeholder="Search garments, fabrics, styles..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              className="w-full bg-[#FAF5F3] border border-[#E8C4C0] rounded-xl pl-10 pr-4 py-2 text-xs text-[#2D2325] placeholder-[#C49A8B] focus:outline-none focus:border-[#8C5353]"
            />
          </div>

          {/* Active Filter Badges */}
          {hasActiveFilters && (
            <div className="hidden lg:flex items-center gap-2 overflow-x-auto">
              {categoryFilter && (
                <span className="px-3 py-1 bg-[#FAF5F3] border border-[#E8C4C0] rounded-full text-[11px] text-[#8C5353] font-semibold flex items-center gap-1">
                  Cat: {categoryFilter}
                  <button onClick={() => setCategoryFilter('')} className="hover:text-black cursor-pointer">×</button>
                </span>
              )}
              {selectedSize && (
                <span className="px-3 py-1 bg-[#FAF5F3] border border-[#E8C4C0] rounded-full text-[11px] text-[#8C5353] font-semibold flex items-center gap-1">
                  Size: {selectedSize}
                  <button onClick={() => setSelectedSize('')} className="hover:text-black cursor-pointer">×</button>
                </span>
              )}
              {onSaleFilter && (
                <span className="px-3 py-1 bg-red-50 border border-red-200 rounded-full text-[11px] text-red-700 font-semibold flex items-center gap-1">
                  On Sale ✨
                  <button onClick={() => setOnSaleFilter(false)} className="hover:text-black cursor-pointer">×</button>
                </span>
              )}
              <button
                onClick={clearAllFilters}
                className="text-xs text-stone-500 hover:text-stone-800 underline font-medium ml-2 cursor-pointer"
              >
                Reset All
              </button>
            </div>
          )}

          {/* Sorting */}
          <div className="flex items-center gap-2 w-full md:w-auto justify-end">
            <span className="text-xs uppercase font-semibold text-[#C49A8B] whitespace-nowrap">Sort:</span>
            <select
              value={sort}
              onChange={(e) => {
                setSort(e.target.value);
                setPage(1);
              }}
              className="bg-[#FAF5F3] border border-[#E8C4C0] rounded-xl px-3 py-2 text-xs font-semibold text-[#2D2325] focus:outline-none focus:border-[#8C5353]"
            >
              <option value="newest">Newest Drops</option>
              <option value="price_asc">Price: Low to High</option>
              <option value="price_desc">Price: High to Low</option>
              <option value="popularity">Popularity & Rating</option>
            </select>
          </div>
        </div>

        {/* Catalog Main Layout (Sidebar + Product Grid) */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          
          {/* Sidebar Filter Panel */}
          <aside className={`lg:block ${isMobileFilterOpen ? 'block' : 'hidden'} space-y-6 bg-white p-6 rounded-3xl border border-[#F4E3DF] shadow-soft h-fit`}>
            <div className="flex items-center justify-between pb-3 border-b border-[#FAF5F3]">
              <div className="flex items-center gap-2">
                <Filter className="w-4 h-4 text-[#8C5353]" />
                <h3 className="font-serif text-base font-bold text-[#2D2325]">Refine Atelier</h3>
              </div>
              {hasActiveFilters && (
                <button
                  onClick={clearAllFilters}
                  className="text-xs text-[#8C5353] hover:underline font-semibold flex items-center gap-1 cursor-pointer"
                >
                  <RotateCcw className="w-3 h-3" /> Reset
                </button>
              )}
            </div>

            {/* Categories */}
            <div>
              <h4 className="text-xs uppercase font-semibold text-[#2D2325] tracking-wider mb-2.5">Category</h4>
              <div className="space-y-1">
                <button
                  onClick={() => handleCategorySelect('')}
                  className={`w-full text-left px-3 py-2 rounded-xl text-xs transition-colors font-medium flex items-center justify-between cursor-pointer ${
                    !categoryFilter ? 'bg-[#2D2325] text-white font-semibold shadow-sm' : 'text-[#4A3E3F] hover:bg-[#FAF5F3]'
                  }`}
                >
                  <span>All Categories</span>
                  <span>({totalCount})</span>
                </button>
                {categories.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => handleCategorySelect(cat.slug)}
                    className={`w-full text-left px-3 py-2 rounded-xl text-xs transition-colors font-medium flex items-center justify-between cursor-pointer ${
                      categoryFilter === cat.slug ? 'bg-[#8C5353] text-white font-semibold shadow-sm' : 'text-[#4A3E3F] hover:bg-[#FAF5F3]'
                    }`}
                  >
                    <span>{cat.name}</span>
                    <span>({cat.productCount})</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Subcategories (if selected category has any) */}
            {currentCategoryObj?.subcategories && currentCategoryObj.subcategories.length > 0 && (
              <div className="pt-4 border-t border-[#FAF5F3]">
                <h4 className="text-xs uppercase font-semibold text-[#2D2325] tracking-wider mb-2">
                  {currentCategoryObj.name} Sub-Styles
                </h4>
                <div className="space-y-1">
                  <button
                    onClick={() => setSelectedSubcategory('')}
                    className={`w-full text-left px-3 py-1.5 rounded-lg text-xs transition-colors cursor-pointer ${
                      !selectedSubcategory ? 'text-[#8C5353] font-bold' : 'text-[#4A3E3F] hover:text-[#2D2325]'
                    }`}
                  >
                    All {currentCategoryObj.name}
                  </button>
                  {currentCategoryObj.subcategories.map((sub) => (
                    <button
                      key={sub.id}
                      onClick={() => {
                        setSelectedSubcategory(sub.slug);
                        setPage(1);
                      }}
                      className={`w-full text-left px-3 py-1.5 rounded-lg text-xs transition-colors cursor-pointer ${
                        selectedSubcategory === sub.slug ? 'text-[#8C5353] font-bold' : 'text-[#4A3E3F] hover:text-[#2D2325]'
                      }`}
                    >
                      {sub.name}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Size Filter */}
            <div className="pt-4 border-t border-[#FAF5F3]">
              <h4 className="text-xs uppercase font-semibold text-[#2D2325] tracking-wider mb-2.5">Garment Size</h4>
              <div className="grid grid-cols-3 gap-2">
                {['XS', 'S', 'M', 'L', 'XL', 'One Size'].map((sz) => (
                  <button
                    key={sz}
                    onClick={() => {
                      setSelectedSize(selectedSize === sz ? '' : sz);
                      setPage(1);
                    }}
                    className={`py-2 text-xs font-semibold rounded-xl border transition-all cursor-pointer ${
                      selectedSize === sz
                        ? 'bg-[#2D2325] text-white border-[#2D2325] shadow-sm'
                        : 'bg-[#FAF5F3] text-[#4A3E3F] border-[#E8C4C0] hover:bg-white'
                    }`}
                  >
                    {sz}
                  </button>
                ))}
              </div>
            </div>

            {/* Checkbox Options */}
            <div className="pt-4 border-t border-[#FAF5F3] space-y-3">
              <h4 className="text-xs uppercase font-semibold text-[#2D2325] tracking-wider mb-2">Options</h4>
              <label className="flex items-center gap-2 cursor-pointer text-xs text-[#4A3E3F]">
                <input
                  type="checkbox"
                  checked={onSaleFilter}
                  onChange={(e) => {
                    setOnSaleFilter(e.target.checked);
                    setPage(1);
                  }}
                  className="rounded border-[#E8C4C0] text-[#8C5353] focus:ring-[#8C5353]"
                />
                <span>Exclusive Sale Items ✨</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer text-xs text-[#4A3E3F]">
                <input
                  type="checkbox"
                  checked={inStock}
                  onChange={(e) => {
                    setInStock(e.target.checked);
                    setPage(1);
                  }}
                  className="rounded border-[#E8C4C0] text-[#8C5353] focus:ring-[#8C5353]"
                />
                <span>In Stock at Atelier Only</span>
              </label>
            </div>
          </aside>

          {/* Product Grid Area */}
          <div className="lg:col-span-3 space-y-8">
            {isLoading ? (
              <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-6">
                {[1, 2, 3, 4, 5, 6].map((n) => (
                  <div key={n} className="bg-white rounded-2xl h-72 sm:h-96 animate-pulse p-3 sm:p-4 border border-[#F4E3DF]" />
                ))}
              </div>
            ) : products.length > 0 ? (
              <>
                <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-6">
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
                        onClick={() => {
                          setPage(pNum);
                          const el = document.getElementById('collection');
                          if (el) {
                            window.scrollTo({ top: el.offsetTop - 80, behavior: 'smooth' });
                          }
                        }}
                        className={`w-10 h-10 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
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
                  We couldn't find any garments matching this exact filter combination.
                </p>
                <button
                  onClick={clearAllFilters}
                  className="px-6 py-3 bg-[#2D2325] text-white text-xs font-semibold uppercase tracking-wider rounded-xl hover:bg-[#8C5353] transition-colors cursor-pointer"
                >
                  Clear All Filters
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};
