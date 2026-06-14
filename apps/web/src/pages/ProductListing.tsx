import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Filter,
  SearchSlash,
  ChevronDown,
  Star,
  Tag,
  RotateCcw,
  Sparkles,
  SlidersHorizontal,
  X,
} from 'lucide-react';
import { Product } from '../data/mockProducts';
import { getProducts, getCategories, CategoryData } from '../api/webApi';
import ProductCard from '../components/shop/ProductCard';
import CatalogSkeleton from '../components/shop/CatalogSkeleton';

export default function ProductListing() {
  const [searchParams, setSearchParams] = useSearchParams();
  const queryParam = searchParams.get('q') || '';
  const categoryParam = searchParams.get('category') || 'all';
  const subcategoryParam = searchParams.get('subcategory') || 'all';
  const sortParam = searchParams.get('sort') || 'bestseller';
  const saleParam = searchParams.get('sale') === 'true';

  // Live Database States
  const [dbProducts, setDbProducts] = useState<Product[]>([]);
  const [dbCategories, setDbCategories] = useState<CategoryData[]>([]);

  // Filters State
  const [selectedCategory, setSelectedCategory] = useState<string>(categoryParam);
  const [selectedSubcategories, setSelectedSubcategories] = useState<string[]>(
    subcategoryParam !== 'all' ? [subcategoryParam] : []
  );
  const [priceRange, setPriceRange] = useState<number>(11000);
  const [minRating, setMinRating] = useState<number>(0);
  const [onlySale, setOnlySale] = useState<boolean>(saleParam);
  const [sortBy, setSortBy] = useState<string>(sortParam);
  const [loading, setLoading] = useState<boolean>(true);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState<boolean>(false);

  // Sync state if URL changes
  useEffect(() => {
    setSelectedCategory(categoryParam);
    if (subcategoryParam !== 'all') {
      setSelectedSubcategories([subcategoryParam]);
    } else {
      setSelectedSubcategories([]);
    }
    setSortBy(sortParam);
    setOnlySale(saleParam);
  }, [categoryParam, subcategoryParam, sortParam, saleParam]);

  // Handle Sort Change
  const handleSortChange = (value: string) => {
    setSortBy(value);
    const newParams = new URLSearchParams(searchParams);
    newParams.set('sort', value);
    setSearchParams(newParams);
  };

  // Handle Sale Toggle
  const handleSaleToggle = (checked: boolean) => {
    setOnlySale(checked);
    const newParams = new URLSearchParams(searchParams);
    if (checked) {
      newParams.set('sale', 'true');
    } else {
      newParams.delete('sale');
    }
    setSearchParams(newParams);
  };

  // Fetch products and categories dynamically on filter/sort change
  useEffect(() => {
    let active = true;
    const loadData = async () => {
      setLoading(true);
      try {
        let apiSort = 'newest';
        if (sortBy === 'price-low') apiSort = 'price_asc';
        if (sortBy === 'price-high') apiSort = 'price_desc';
        if (sortBy === 'rating') apiSort = 'rating';
        if (sortBy === 'bestseller') apiSort = 'bestseller';

        const [catsRes, productsRes] = await Promise.all([
          dbCategories.length === 0 ? getCategories() : Promise.resolve(dbCategories),
          getProducts({
            petCategory: selectedCategory,
            q: queryParam,
            sort: apiSort,
            limit: 50
          })
        ]);

        if (active) {
          if (dbCategories.length === 0) setDbCategories(catsRes);
          setDbProducts(productsRes.products);
          setLoading(false);
        }
      } catch (err) {
        console.error('Failed to load products/categories:', err);
        if (active) setLoading(false);
      }
    };

    loadData();
    return () => {
      active = false;
    };
  }, [selectedCategory, sortBy, queryParam]);

  // Handle category top pills click
  const handleCategoryPill = (catId: string) => {
    setSelectedCategory(catId);
    setSelectedSubcategories([]); // Clear subcategories when switching pets
    const newParams = new URLSearchParams(searchParams);
    if (catId === 'all') {
      newParams.delete('category');
    } else {
      newParams.set('category', catId);
    }
    newParams.delete('subcategory');
    setSearchParams(newParams);
  };

  // Toggle subcategories checkboxes
  const handleSubcategoryCheckbox = (subId: string) => {
    if (selectedSubcategories.includes(subId)) {
      setSelectedSubcategories(selectedSubcategories.filter((s) => s !== subId));
    } else {
      setSelectedSubcategories([...selectedSubcategories, subId]);
    }
  };

  // Reset all filters
  const handleResetFilters = () => {
    setSelectedCategory('all');
    setSelectedSubcategories([]);
    setPriceRange(11000);
    setMinRating(0);
    setOnlySale(false);
    setSortBy('bestseller');
    setSearchParams({});
  };

  // Secondary Client-side Filtering Logic for fast, lag-free sliding/clicking
  const filteredProducts = dbProducts.filter((product) => {
    // 1. Price range filter
    if (product.price > priceRange) {
      return false;
    }

    // 2. Rating filter
    if (product.rating < minRating) {
      return false;
    }

    // 3. Subcategory (DB Category) filter
    if (selectedSubcategories.length > 0) {
      const productCatId = typeof product.dbCategory === 'object' && product.dbCategory !== null
        ? product.dbCategory._id
        : '';
      const productCatSlug = typeof product.dbCategory === 'object' && product.dbCategory !== null
        ? product.dbCategory.slug
        : '';
      const hasMatch = selectedSubcategories.includes(productCatId) || selectedSubcategories.includes(productCatSlug);
      if (!hasMatch) return false;
    }

    // 4. Only Sale filter
    if (onlySale) {
      const isPromo = product.originalPrice && product.originalPrice > product.price;
      const isSaleBadge = product.badge === 'sale';
      if (!isPromo && !isSaleBadge) return false;
    }

    return true;
  });

  const sortedProducts = filteredProducts;

  const categoriesList = [
    { id: 'all', label: 'All Pets' },
    { id: 'dogs', label: 'Dogs' },
    { id: 'cats', label: 'Cats' },
    { id: 'fish', label: 'Fish' },
    { id: 'birds', label: 'Birds' },
    { id: 'small_pets', label: 'Small Pets' },
  ];

  // Dynamically compute subcategories from loaded DB categories
  const activeDbCategories = dbCategories.filter((cat) =>
    selectedCategory === 'all' || cat.petCategory === selectedCategory
  );

  const subcategoriesList = activeDbCategories.map((cat) => ({
    id: cat._id,
    label: cat.name
  }));


  return (
    <div className="min-h-screen bg-gray-50/50 pb-20 pt-8" style={{ minHeight: '100vh', backgroundColor: 'var(--color-bg)', padding: '2.5rem 0 5rem 0' }}>
      <div className="container mx-auto px-4" style={{ maxWidth: 1280, margin: '0 auto', padding: '0 1.5rem' }}>
        {/* Search Header Banner if q is active */}
        {queryParam && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8 rounded-2xl bg-gradient-to-r from-orange-500/10 to-amber-500/10 border border-orange-100 p-6 backdrop-blur-sm flex flex-col sm:flex-row items-center justify-between gap-4"
            style={{
              marginBottom: '2rem',
              borderRadius: 24,
              background: 'linear-gradient(to right, rgba(249, 115, 22, 0.08), rgba(245, 158, 11, 0.08))',
              border: '1px solid rgba(249, 115, 22, 0.15)',
              padding: '1.5rem',
              display: 'flex',
              flexDirection: 'row',
              flexWrap: 'wrap',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '1rem',
              backdropFilter: 'blur(8px)',
            }}
          >
            <div className="flex items-center gap-3 text-center sm:text-left" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-orange-500 text-white shadow-md shadow-orange-500/20" style={{ display: 'flex', height: 48, width: 48, alignItems: 'center', justifyContent: 'center', borderRadius: 12, backgroundColor: '#f97316', color: '#fff', boxShadow: '0 4px 12px rgba(249,115,22,0.2)' }}>
                <Sparkles className="h-6 w-6" />
              </div>
              <div style={{ textAlign: 'left' }}>
                <h1 className="font-display text-xl font-extrabold text-gray-800" style={{ margin: 0, fontSize: '1.25rem', fontWeight: 900, color: '#2d2418', fontFamily: 'var(--font-display)' }}>
                  Search Results for "{queryParam}"
                </h1>
                <p className="text-xs text-gray-400 mt-0.5" style={{ margin: '4px 0 0 0', fontSize: '0.75rem', color: '#8a7e72', fontWeight: 550 }}>
                  We found {filteredProducts.length} matched item(s) in our store
                </p>
              </div>
            </div>
            <button
              onClick={() => {
                const newParams = new URLSearchParams(searchParams);
                newParams.delete('q');
                setSearchParams(newParams);
              }}
              className="flex items-center gap-2 text-xs font-bold text-orange-600 hover:text-orange-700 bg-white border border-orange-200 px-4 py-2.5 rounded-full shadow-sm transition-all active:scale-95"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.4rem',
                fontSize: '0.75rem',
                fontWeight: 800,
                color: '#ea580c',
                backgroundColor: '#fff',
                border: '1.5px solid #fed7aa',
                padding: '0.5rem 1.25rem',
                borderRadius: 9999,
                cursor: 'pointer',
                transition: 'all 200ms ease',
              }}
            >
              <RotateCcw className="h-4 w-4" />
              <span>Clear Search</span>
            </button>
          </motion.div>
        )}

        {/* Top Scrolling Category Selector Pills */}
        <div className="mb-8" style={{ marginBottom: '2rem' }}>
          <div className="flex items-center justify-between mb-4" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
            <h2 className="font-display text-base font-extrabold text-gray-800" style={{ margin: 0, fontSize: '1.1rem', fontWeight: 900, color: '#2d2418', fontFamily: 'var(--font-display)' }}>
              Browse by Companion
            </h2>
            <button
              onClick={() => setMobileFiltersOpen(true)}
              className="flex lg:hidden items-center gap-2 rounded-full bg-white border border-gray-200 px-4 py-2 font-display text-xs font-bold text-gray-700 shadow-sm hover:bg-gray-50 transition-colors"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.4rem',
                borderRadius: 9999,
                backgroundColor: '#fff',
                border: '1.5px solid rgba(0,0,0,0.06)',
                padding: '0.5rem 1.25rem',
                fontSize: '0.75rem',
                fontWeight: 800,
                color: '#4a4036',
                fontFamily: 'var(--font-display)',
                cursor: 'pointer',
              }}
            >
              <SlidersHorizontal className="h-4 w-4" />
              <span>Filters</span>
            </button>
          </div>
          <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-none" style={{ display: 'flex', gap: '0.75rem', overflowX: 'auto', paddingBottom: '0.75rem' }}>
            {categoriesList.map((cat) => (
              <button
                key={cat.id}
                onClick={() => handleCategoryPill(cat.id)}
                className={`flex-shrink-0 rounded-full px-6 py-3 font-display text-xs font-extrabold transition-all duration-300 shadow-sm ${
                  selectedCategory === cat.id
                    ? 'bg-orange-500 text-white shadow-md shadow-orange-500/20'
                    : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
                }`}
                style={{
                  flexShrink: 0,
                  borderRadius: 9999,
                  padding: '0.65rem 1.35rem',
                  fontFamily: 'var(--font-display)',
                  fontSize: '0.8rem',
                  fontWeight: 800,
                  cursor: 'pointer',
                  transition: 'all 200ms ease',
                  border: selectedCategory === cat.id ? '1.5px solid #f97316' : '1.5px solid rgba(0,0,0,0.06)',
                  backgroundColor: selectedCategory === cat.id ? '#f97316' : '#fff',
                  color: selectedCategory === cat.id ? '#fff' : '#4a4036',
                  boxShadow: selectedCategory === cat.id ? '0 4px 12px rgba(249,115,22,0.2)' : '0 1px 2px rgba(0,0,0,0.02)',
                }}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Main Filters & Grid Layout */}
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12" style={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap', gap: '2rem', alignItems: 'flex-start' }}>
          {/* Desktop Left-side Filter Panel */}
          <aside className="hidden lg:block lg:col-span-3" style={{ width: '290px', flexShrink: 0 }}>
            <div className="sticky top-28 rounded-2xl border border-gray-100 bg-white p-6 shadow-sm" style={{ position: 'sticky', top: '100px', borderRadius: 24, border: '1px solid rgba(0,0,0,0.05)', backgroundColor: '#fff', padding: '1.5rem', boxShadow: '0 4px 20px rgba(0,0,0,0.02)' }}>
              <div className="flex items-center justify-between pb-4 border-b border-gray-100" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingBottom: '1rem', borderBottom: '1px solid #f3ebe1' }}>
                <span className="flex items-center gap-2 font-display font-extrabold text-gray-800 text-sm" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '0.9rem', color: '#2d2418' }}>
                  <Filter className="h-4 w-4 text-orange-500" style={{ color: '#f97316' }} />
                  <span>Filters</span>
                </span>
                <button
                  onClick={handleResetFilters}
                  className="text-xs font-bold text-gray-400 hover:text-orange-500 flex items-center gap-1 transition-colors"
                  style={{
                    fontSize: '0.75rem',
                    fontWeight: 800,
                    color: '#8a7e72',
                    cursor: 'pointer',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.2rem',
                  }}
                >
                  <RotateCcw className="h-3 w-3" />
                  <span>Reset All</span>
                </button>
              </div>

              {/* Price Range Slider */}
              <div className="py-5 border-b border-gray-100" style={{ padding: '1.25rem 0', borderBottom: '1px solid #f3ebe1' }}>
                <h3 className="font-display text-xs font-extrabold text-gray-800 mb-3" style={{ fontFamily: 'var(--font-display)', fontSize: '0.8rem', fontWeight: 800, color: '#2d2418', marginBottom: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.02em' }}>
                  Max Price Range
                </h3>
                <input
                  type="range"
                  min="99"
                  max="11000"
                  step="100"
                  value={priceRange}
                  onChange={(e) => setPriceRange(Number(e.target.value))}
                  className="w-full h-1.5 bg-gray-100 rounded-lg appearance-none cursor-pointer accent-orange-500"
                  style={{ width: '100%', cursor: 'pointer' }}
                />
                <div className="flex items-center justify-between text-xs font-bold text-gray-500 mt-2" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.75rem', fontWeight: 700, marginTop: '0.5rem', color: '#8a7e72' }}>
                  <span>₹99</span>
                  <span className="rounded-md bg-orange-50 border border-orange-100 px-2 py-0.5 text-orange-600 text-xs" style={{ backgroundColor: '#fff1e6', border: '1px solid #fed7aa', padding: '2px 8px', borderRadius: 6, color: '#ea580c', fontWeight: 800 }}>
                    Up to ₹{priceRange.toLocaleString('en-IN')}
                  </span>
                </div>
              </div>

              {/* Subcategories / Product Type */}
              <div className="py-5 border-b border-gray-100" style={{ padding: '1.25rem 0', borderBottom: '1px solid #f3ebe1' }}>
                <h3 className="font-display text-xs font-extrabold text-gray-800 mb-3" style={{ fontFamily: 'var(--font-display)', fontSize: '0.8rem', fontWeight: 800, color: '#2d2418', marginBottom: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.02em' }}>
                  Product Type
                </h3>
                <div className="flex flex-col gap-3" style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
                  {subcategoriesList.map((sub) => (
                    <label
                      key={sub.id}
                      className="flex items-center gap-3 text-xs text-gray-600 cursor-pointer font-medium hover:text-orange-500 transition-colors"
                      style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.8rem', color: '#4a4036', cursor: 'pointer', fontWeight: 650 }}
                    >
                      <input
                        type="checkbox"
                        checked={selectedSubcategories.includes(sub.id)}
                        onChange={() => handleSubcategoryCheckbox(sub.id)}
                        className="h-4 w-4 rounded border-gray-300 text-orange-500 focus:ring-orange-500 cursor-pointer"
                        style={{ height: '1rem', width: '1rem', cursor: 'pointer' }}
                      />
                      <span>{sub.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Min Ratings */}
              <div className="py-5 border-b border-gray-100" style={{ padding: '1.25rem 0', borderBottom: '1px solid #f3ebe1' }}>
                <h3 className="font-display text-xs font-extrabold text-gray-800 mb-3" style={{ fontFamily: 'var(--font-display)', fontSize: '0.8rem', fontWeight: 800, color: '#2d2418', marginBottom: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.02em' }}>
                  Minimum Rating
                </h3>
                <div className="flex flex-col gap-3" style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
                  {[4.8, 4.5, 4.0].map((rating) => (
                    <label
                      key={rating}
                      className="flex items-center gap-2 text-xs text-gray-600 cursor-pointer hover:text-orange-500"
                      style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.8rem', color: '#4a4036', cursor: 'pointer', fontWeight: 650 }}
                    >
                      <input
                        type="radio"
                        name="rating-filter"
                        checked={minRating === rating}
                        onChange={() => setMinRating(rating)}
                        className="h-4 w-4 border-gray-300 text-orange-500 focus:ring-orange-500 cursor-pointer"
                        style={{ cursor: 'pointer' }}
                      />
                      <div className="flex items-center gap-1 text-amber-500 font-bold ml-1" style={{ display: 'flex', alignItems: 'center', gap: '0.2rem', color: '#d97706', fontWeight: 800 }}>
                        <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                        <span>{rating}+ Stars</span>
                      </div>
                    </label>
                  ))}
                  <label className="flex items-center gap-2 text-xs text-gray-600 cursor-pointer hover:text-orange-500" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.8rem', color: '#4a4036', cursor: 'pointer', fontWeight: 650 }}>
                    <input
                      type="radio"
                      name="rating-filter"
                      checked={minRating === 0}
                      onChange={() => setMinRating(0)}
                      className="h-4 w-4 border-gray-300 text-orange-500 focus:ring-orange-500 cursor-pointer"
                      style={{ cursor: 'pointer' }}
                    />
                    <span className="ml-1 font-medium text-gray-550">Any Rating</span>
                  </label>
                </div>
              </div>

              {/* Promo Toggles */}
              <div className="py-5" style={{ padding: '1.25rem 0 0 0' }}>
                <label className="flex items-center gap-3 text-xs text-gray-600 cursor-pointer hover:text-orange-500 transition-colors" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.8rem', color: '#4a4036', cursor: 'pointer', fontWeight: 800 }}>

                  <input
                    type="checkbox"
                    checked={onlySale}
                    onChange={(e) => handleSaleToggle(e.target.checked)}
                    className="h-4 w-4 rounded border-gray-300 text-orange-500 focus:ring-orange-500 cursor-pointer"
                    style={{ height: '1rem', width: '1rem', cursor: 'pointer' }}
                  />
                  <div className="flex items-center gap-1 text-red-500 font-bold" style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', color: '#ef4444', fontWeight: 800 }}>
                    <Tag className="h-3.5 w-3.5" />
                    <span>Special Offers & Sale</span>
                  </div>
                </label>
              </div>
            </div>
          </aside>

          {/* Right Product Grid Column */}
          <main className="lg:col-span-9" style={{ flex: 1, minWidth: '320px' }}>
            {/* Sorting and Count Panel */}
            <div
              className="mb-6 flex flex-col sm:flex-row items-center justify-between gap-4 rounded-xl border border-gray-100 bg-white p-4 shadow-sm"
              style={{
                display: 'flex',
                flexDirection: 'row',
                flexWrap: 'wrap',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: '1rem',
                marginBottom: '1.5rem',
                borderRadius: 16,
                border: '1px solid rgba(0,0,0,0.05)',
                backgroundColor: '#fff',
                padding: '1rem',
                boxShadow: '0 2px 8px rgba(0,0,0,0.02)',
              }}
            >
              <span className="text-xs font-bold text-gray-500" style={{ fontSize: '0.75rem', fontWeight: 800, color: '#8a7e72' }}>
                Showing {sortedProducts.length} of {dbProducts.length} Products
              </span>

              <div className="flex items-center gap-2" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span className="text-xs text-gray-400 font-medium" style={{ fontSize: '0.75rem', color: '#8a7e72', fontWeight: 650 }}>Sort by:</span>
                <div className="relative" style={{ position: 'relative' }}>
                  <select
                    value={sortBy}
                    onChange={(e) => handleSortChange(e.target.value)}
                    className="appearance-none rounded-lg border border-gray-200 bg-white pl-4 pr-10 py-2 font-display text-xs font-bold text-gray-700 outline-none cursor-pointer hover:bg-gray-50 shadow-sm"
                    style={{
                      borderRadius: 10,
                      border: '1.5px solid rgba(0,0,0,0.08)',
                      backgroundColor: '#fff',
                      padding: '0.5rem 2rem 0.5rem 1rem',
                      fontFamily: 'var(--font-display)',
                      fontSize: '0.78rem',
                      fontWeight: 800,
                      color: '#4a4036',
                      outline: 'none',
                      cursor: 'pointer',
                    }}
                  >
                    <option value="bestseller">🏆 Bestsellers First</option>
                    <option value="newest">✨ New Arrivals</option>
                    <option value="rating">⭐ Highest Rated</option>
                    <option value="price-low">📈 Price: Low to High</option>
                    <option value="price-high">📉 Price: High to Low</option>
                  </select>
                  <ChevronDown className="absolute right-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" style={{ position: 'absolute', right: 8, top: '50%', transform: 'translateY(-50%)', height: 16, width: 16, color: '#8a7e72', pointerEvents: 'none' }} />
                </div>
              </div>
            </div>

            {/* Catalog Grid Area */}
            <AnimatePresence mode="wait">
              {loading ? (
                <motion.div
                  key="skeleton"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <CatalogSkeleton count={8} />
                </motion.div>
              ) : sortedProducts.length > 0 ? (
                <motion.div
                  key="grid"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3"
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))',
                    gap: '1.5rem',
                  }}
                >
                  {sortedProducts.map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </motion.div>
              ) : (
                <motion.div
                  key="empty"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex flex-col items-center justify-center bg-white border border-gray-100 rounded-2xl p-16 text-center shadow-sm"
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: '#fff',
                    border: '1px solid rgba(0,0,0,0.05)',
                    borderRadius: 24,
                    padding: '4rem 2rem',
                    textAlign: 'center',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.02)',
                  }}
                >
                  <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-orange-50 text-orange-500 mb-4 shadow-sm shadow-orange-500/10 animate-pulse" style={{ display: 'flex', height: 64, width: 64, alignItems: 'center', justifyContent: 'center', borderRadius: 16, backgroundColor: '#fff1e6', color: '#f97316', marginBottom: '1rem' }}>
                    <SearchSlash className="h-8 w-8" />
                  </div>
                  <h3 className="font-display text-lg font-extrabold text-gray-800" style={{ margin: 0, fontSize: '1.1rem', fontWeight: 900, color: '#2d2418', fontFamily: 'var(--font-display)' }}>
                    No Products Found
                  </h3>
                  <p className="text-xs text-gray-400 mt-1 max-w-sm" style={{ margin: '8px 0 0 0', fontSize: '0.8rem', color: '#8a7e72', maxWidth: 320, lineHeight: 1.5 }}>
                    We couldn't find matches for your selected criteria. Try adjusting filters or search parameters.
                  </p>
                  <button
                    onClick={handleResetFilters}
                    className="mt-6 inline-flex items-center gap-2 rounded-full bg-orange-500 px-6 py-3 font-display text-xs font-bold text-white shadow-md hover:bg-orange-600 active:scale-95 transition-all"
                    style={{
                      marginTop: '1.5rem',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.4rem',
                      borderRadius: 9999,
                      backgroundColor: '#f97316',
                      padding: '0.75rem 1.75rem',
                      fontFamily: 'var(--font-display)',
                      fontWeight: 800,
                      fontSize: '0.8rem',
                      color: '#fff',
                      border: 'none',
                      cursor: 'pointer',
                      boxShadow: '0 4px 12px rgba(249,115,22,0.2)',
                      transition: 'all 200ms ease',
                    }}
                  >
                    <RotateCcw className="h-4 w-4" />
                    <span>Reset All Filters</span>
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </main>
        </div>
      </div>

      {/* Mobile Drawer Slide-up Filters */}
      <AnimatePresence>
        {mobileFiltersOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileFiltersOpen(false)}
              className="fixed inset-0 z-50 bg-black/60"
              style={{
                position: 'fixed',
                inset: 0,
                zIndex: 9999,
                backgroundColor: 'rgba(0,0,0,0.5)',
                backdropFilter: 'blur(4px)',
              }}
            />
            {/* Drawer */}
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 220 }}
              className="fixed bottom-0 left-0 right-0 z-50 rounded-t-3xl bg-white p-6 shadow-xl max-h-[85vh] overflow-y-auto"
              style={{
                position: 'fixed',
                bottom: 0,
                left: 0,
                right: 0,
                zIndex: 10000,
                borderTopLeftRadius: 32,
                borderTopRightRadius: 32,
                backgroundColor: '#fff',
                padding: '2rem',
                boxShadow: '0 -10px 40px rgba(0,0,0,0.15)',
                maxHeight: '85vh',
                overflowY: 'auto',
                fontFamily: 'var(--font-body)',
              }}
            >
              <div className="flex items-center justify-between pb-4 border-b border-gray-100 mb-5" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingBottom: '1rem', borderBottom: '1px solid #f3ebe1', marginBottom: '1.5rem' }}>
                <span className="flex items-center gap-2 font-display font-extrabold text-gray-800 text-sm" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '0.95rem', color: '#2d2418' }}>
                  <Filter className="h-4 w-4 text-orange-500" style={{ color: '#f97316' }} />
                  <span>Filters</span>
                </span>
                <div className="flex items-center gap-4" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <button
                    onClick={() => {
                      handleResetFilters();
                      setMobileFiltersOpen(false);
                    }}
                    className="text-xs font-bold text-orange-500 flex items-center gap-1"
                    style={{
                      fontSize: '0.75rem',
                      fontWeight: 800,
                      color: '#f97316',
                      cursor: 'pointer',
                      border: 'none',
                      backgroundColor: 'transparent',
                    }}
                  >
                    <RotateCcw className="h-3.5 w-3.5" />
                    <span>Reset</span>
                  </button>
                  <button
                    onClick={() => setMobileFiltersOpen(false)}
                    className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-100 text-gray-400 hover:text-gray-600 active:scale-90"
                    style={{
                      display: 'flex',
                      height: 32,
                      width: 32,
                      alignItems: 'center',
                      justifyContent: 'center',
                      borderRadius: '50%',
                      backgroundColor: '#f5f0eb',
                      color: '#8a7e72',
                      cursor: 'pointer',
                      border: 'none',
                    }}
                  >
                    <X className="h-4.5 w-4.5" />
                  </button>
                </div>
              </div>

              {/* Price range */}
              <div className="mb-6" style={{ marginBottom: '1.5rem' }}>
                <h3 className="font-display text-xs font-extrabold text-gray-800 mb-3" style={{ fontFamily: 'var(--font-display)', fontSize: '0.8rem', fontWeight: 800, color: '#2d2418', marginBottom: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.02em' }}>
                  Max Price Range
                </h3>
                <input
                  type="range"
                  min="99"
                  max="11000"
                  step="100"
                  value={priceRange}
                  onChange={(e) => setPriceRange(Number(e.target.value))}
                  className="w-full h-1.5 bg-gray-100 rounded-lg appearance-none cursor-pointer accent-orange-500"
                  style={{ width: '100%', cursor: 'pointer' }}
                />
                <div className="flex items-center justify-between text-xs font-bold text-gray-500 mt-2" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.75rem', fontWeight: 700, marginTop: '0.5rem', color: '#8a7e72' }}>
                  <span>₹99</span>
                  <span className="rounded-md bg-orange-50 border border-orange-100 px-2 py-0.5 text-orange-600 text-xs" style={{ backgroundColor: '#fff1e6', border: '1px solid #fed7aa', padding: '2px 8px', borderRadius: 6, color: '#ea580c', fontWeight: 800 }}>
                    Up to ₹{priceRange.toLocaleString('en-IN')}
                  </span>
                </div>
              </div>

              {/* Product types */}
              <div className="mb-6" style={{ marginBottom: '1.5rem' }}>
                <h3 className="font-display text-xs font-extrabold text-gray-800 mb-3" style={{ fontFamily: 'var(--font-display)', fontSize: '0.8rem', fontWeight: 800, color: '#2d2418', marginBottom: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.02em' }}>
                  Product Type
                </h3>
                <div className="grid grid-cols-2 gap-3" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                  {subcategoriesList.map((sub) => {
                    const isSelected = selectedSubcategories.includes(sub.id);
                    return (
                      <label
                        key={sub.id}
                        className={`flex items-center justify-center gap-2 rounded-xl border p-3.5 text-xs font-bold cursor-pointer transition-all duration-300 ${
                          isSelected
                            ? 'bg-orange-50 border-orange-500 text-orange-600'
                            : 'bg-white border-gray-200 text-gray-600'
                        }`}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: '0.5rem',
                          borderRadius: 12,
                          border: isSelected ? '1.5px solid #f97316' : '1.5px solid rgba(0,0,0,0.08)',
                          backgroundColor: isSelected ? '#fff1e6' : '#fff',
                          color: isSelected ? '#ea580c' : '#4a4036',
                          padding: '0.75rem',
                          fontSize: '0.78rem',
                          fontWeight: 800,
                          cursor: 'pointer',
                          transition: 'all 200ms ease',
                        }}
                      >
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => handleSubcategoryCheckbox(sub.id)}
                          className="sr-only"
                          style={{ display: 'none' }}
                        />
                        <span>{sub.label}</span>
                      </label>
                    );
                  })}
                </div>
              </div>

              {/* Ratings */}
              <div className="mb-6" style={{ marginBottom: '1.5rem' }}>
                <h3 className="font-display text-xs font-extrabold text-gray-800 mb-3" style={{ fontFamily: 'var(--font-display)', fontSize: '0.8rem', fontWeight: 800, color: '#2d2418', marginBottom: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.02em' }}>
                  Minimum Rating
                </h3>
                <div className="flex flex-wrap gap-2.5" style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                  {[4.8, 4.5, 4.0].map((rating) => {
                    const isSelected = minRating === rating;
                    return (
                      <button
                        key={rating}
                        onClick={() => setMinRating(rating)}
                        className={`flex items-center gap-1.5 rounded-full border px-4 py-2 text-xs font-bold transition-all ${
                          isSelected
                            ? 'bg-amber-500 border-amber-500 text-white shadow-sm'
                            : 'bg-white border-gray-200 text-gray-500'
                        }`}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.3rem',
                          borderRadius: 9999,
                          border: isSelected ? '1.5px solid #d97706' : '1.5px solid rgba(0,0,0,0.08)',
                          backgroundColor: isSelected ? '#d97706' : '#fff',
                          color: isSelected ? '#fff' : '#8a7e72',
                          padding: '0.5rem 1rem',
                          fontSize: '0.75rem',
                          fontWeight: 800,
                          cursor: 'pointer',
                        }}
                      >
                        <Star className={`h-3.5 w-3.5 ${isSelected ? 'fill-white text-white' : 'fill-amber-400 text-amber-400'}`} style={{ height: 14, width: 14, fill: isSelected ? '#fff' : '#f59e0b', color: isSelected ? '#fff' : '#f59e0b' }} />
                        <span>{rating}+</span>
                      </button>
                    );
                  })}
                  <button
                    onClick={() => setMinRating(0)}
                    className={`rounded-full border px-4 py-2 text-xs font-bold transition-all ${
                      minRating === 0
                        ? 'bg-amber-500 border-amber-500 text-white shadow-sm'
                        : 'bg-white border-gray-200 text-gray-500'
                    }`}
                    style={{
                      borderRadius: 9999,
                      border: minRating === 0 ? '1.5px solid #d97706' : '1.5px solid rgba(0,0,0,0.08)',
                      backgroundColor: minRating === 0 ? '#d97706' : '#fff',
                      color: minRating === 0 ? '#fff' : '#8a7e72',
                      padding: '0.5rem 1.25rem',
                      fontSize: '0.75rem',
                      fontWeight: 800,
                      cursor: 'pointer',
                    }}
                  >
                    <span>Any</span>
                  </button>
                </div>
              </div>

              {/* Sales Toggles */}
              <div className="mb-6 pt-3 border-t border-gray-200" style={{ marginBottom: '1.5rem', paddingTop: '1rem', borderTop: '1px solid #f3ebe1' }}>
                <button
                  onClick={() => handleSaleToggle(!onlySale)}
                  className={`flex w-full items-center justify-center gap-2 rounded-xl border p-4 text-xs font-extrabold transition-all ${
                    onlySale
                      ? 'bg-red-50 border-red-500 text-red-600 shadow-sm'
                      : 'bg-white border-gray-200 text-gray-500'
                  }`}
                  style={{
                    display: 'flex',
                    width: '100%',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.5rem',
                    borderRadius: 12,
                    border: onlySale ? '1.5px solid #fca5a5' : '1.5px solid rgba(0,0,0,0.08)',
                    backgroundColor: onlySale ? '#fef2f2' : '#fff',
                    color: onlySale ? '#ef4444' : '#8a7e72',
                    padding: '1rem',
                    fontSize: '0.78rem',
                    fontWeight: 800,
                    cursor: 'pointer',
                    transition: 'all 200ms ease',
                  }}
                >
                  <Tag className="h-4 w-4" />
                  <span>Only Special Offers & Sale</span>
                </button>
              </div>

              <button
                onClick={() => setMobileFiltersOpen(false)}
                className="w-full rounded-full bg-orange-500 py-3.5 font-display text-sm font-extrabold text-white shadow-md hover:bg-orange-600 active:scale-95 transition-all"
                style={{
                  display: 'block',
                  width: '100%',
                  borderRadius: 9999,
                  backgroundColor: '#f97316',
                  padding: '1rem',
                  fontFamily: 'var(--font-display)',
                  fontSize: '0.9rem',
                  fontWeight: 900,
                  color: '#fff',
                  border: 'none',
                  cursor: 'pointer',
                  boxShadow: '0 4px 14px rgba(249, 115, 22, 0.3)',
                  transition: 'all 200ms ease',
                }}
              >
                Apply Filters ({sortedProducts.length} Results)
              </button>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
