import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Star,
  Plus,
  Minus,
  ShoppingCart,
  Heart,
  Check,
  Shield,
  Truck,
  RotateCcw,
  Sparkles,
  Info,
} from 'lucide-react';
import { mockProducts } from '../data/mockProducts';
import { useCartStore } from '../store/cart.store';
import { getProductBySlug, getProducts } from '../api/webApi';
import ProductCard from '../components/shop/ProductCard';
import { useAuthStore } from '../store/auth.store';
import { useWishlistStore } from '../store/wishlist.store';
import { useToastStore } from '../store/toast.store';

export default function ProductDetail() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [product, setProduct] = useState<any | null>(null);
  const [dbProducts, setDbProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const addItem = useCartStore((s) => s.addItem);
  const toggleCartDrawer = useCartStore((s) => s.toggleDrawer);

  const { isAuthenticated } = useAuthStore();
  const { isWishlisted: checkWishlist, addItem: addToWishlist, removeItem: removeFromWishlist } = useWishlistStore();
  const { addToast } = useToastStore();

  // States
  const [selectedImage, setSelectedImage] = useState<string>('');
  const [selectedVariant, setSelectedVariant] = useState<any | null>(null);
  const [quantity, setQuantity] = useState<number>(1);
  const [activeTab, setActiveTab] = useState<'specs' | 'reviews'>('specs');
  const [isAdding, setIsAdding] = useState<boolean>(false);

  // Load product detail live from backend API
  useEffect(() => {
    let active = true;
    const loadDetail = async () => {
      if (!slug) return;
      setLoading(true);
      try {
        const prod = await getProductBySlug(slug);
        if (active) {
          if (prod) {
            setProduct(prod);
            setSelectedImage(prod.image);
            setQuantity(1);
            
            // Set default variant if present
            if (prod.variants && prod.variants.length > 0) {
              setSelectedVariant(prod.variants[0]);
            } else {
              setSelectedVariant(null);
            }
          } else {
            setProduct(null);
          }
          setLoading(false);
        }
      } catch (err) {
        console.error('Failed to load product detail:', err);
        if (active) setLoading(false);
      }
    };
    loadDetail();
    return () => {
      active = false;
    };
  }, [slug]);

  // Load related products live
  useEffect(() => {
    let active = true;
    const loadRelated = async () => {
      if (!product) return;
      try {
        const res = await getProducts({ petCategory: product.category, limit: 10 });
        if (active) {
          const filtered = res.products.filter((p) => p.id !== product.id).slice(0, 4);
          setDbProducts(filtered);
        }
      } catch (err) {
        console.error('Failed to load related products:', err);
      }
    };
    loadRelated();
    return () => {
      active = false;
    };
  }, [product]);

  if (loading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '80vh', backgroundColor: 'var(--color-bg)' }}>
        <div className="spinner" />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6 text-center">
        <div className="bg-white border border-gray-200 rounded-2xl p-12 max-w-md shadow-sm">
          <Info className="h-14 w-14 text-orange-500 mx-auto mb-4 animate-bounce" />
          <h2 className="font-display text-xl font-extrabold text-gray-800">
            Product Not Found
          </h2>
          <p className="text-xs text-gray-400 mt-2">
            The product you are trying to view does not exist or has been moved.
          </p>
          <Link
            to="/products"
            className="mt-6 inline-flex items-center gap-2 rounded-full bg-orange-500 px-6 py-3 font-display text-xs font-bold text-white shadow-md hover:bg-orange-600 transition-colors"
          >
            Back to Shop Catalog
          </Link>
        </div>
      </div>
    );
  }

  // Dynamic calculated key-values based on active selected variant or base product
  const activePrice = selectedVariant ? selectedVariant.price : product.price;
  const activeOriginalPrice = selectedVariant ? selectedVariant.comparePrice : product.originalPrice;
  const activeSku = selectedVariant ? selectedVariant.sku : product.sku || 'N/A';
  const activeStock = selectedVariant ? selectedVariant.stock : product.stock || 0;
  const activeWeight = selectedVariant ? selectedVariant.weight : product.weight;

  const discount = activeOriginalPrice
    ? Math.round(((activeOriginalPrice - activePrice) / activeOriginalPrice) * 100)
    : 0;

  const wish = product ? checkWishlist(product._id || product.id) : false;

  const handleWishlistToggle = () => {
    if (!isAuthenticated) {
      addToast('Please login first to manage your wishlist! 🐾', 'warning');
      navigate('/login');
      return;
    }
    if (wish) {
      removeFromWishlist(product._id || product.id);
      addToast(`Removed "${product.name}" from wishlist`, 'info');
    } else {
      addToWishlist({
        id: product._id || product.id,
        name: product.name,
        slug: product.slug,
        image: product.image,
        price: activePrice,
        originalPrice: activeOriginalPrice,
        rating: product.rating || product.averageRating || 4.8,
        reviewCount: product.reviewCount || 0,
        badge: product.badge || undefined,
        category: product.category,
      });
      addToast(`Added "${product.name}" to wishlist`, 'success');
    }
  };

  // Add item handler using the selected variant SKU & price
  const handleAddToCart = () => {
    if (!isAuthenticated) {
      addToast('Please login first to add items to cart! 🐾', 'warning');
      navigate('/login');
      return;
    }

    setIsAdding(true);

    addItem({
      product: product._id || product.id,
      name: product.name,
      image: product.image,
      sku: activeSku,
      quantity,
      price: activePrice,
      variant: selectedVariant?.label || undefined,
    });

    addToast(`Added ${quantity} x "${product.name}" to cart! 🐾`, 'success');

    setTimeout(() => {
      setIsAdding(false);
      toggleCartDrawer();
    }, 800);
  };

  // Filter related products
  const relatedProducts = dbProducts;

  // Dynamic colors matching categories
  const getCategoryTheme = () => {
    switch (product.category) {
      case 'dogs':
        return 'dogs';
      case 'cats':
        return 'cats';
      case 'fish':
        return 'fish';
      case 'birds':
        return 'birds';
      case 'small_pets':
        return 'small_pets';
      default:
        return '';
    }
  };

  const getThemeColorClass = () => {
    switch (product.category) {
      case 'dogs':
        return 'text-amber-600 bg-amber-50 border-amber-100 hover:bg-amber-100';
      case 'cats':
        return 'text-purple-600 bg-purple-50 border-purple-100 hover:bg-purple-100';
      case 'fish':
        return 'text-sky-600 bg-sky-50 border-sky-100 hover:bg-sky-100';
      case 'birds':
        return 'text-emerald-600 bg-emerald-50 border-emerald-100 hover:bg-emerald-100';
      case 'small_pets':
        return 'text-pink-600 bg-pink-50 border-pink-100 hover:bg-pink-100';
      default:
        return 'text-orange-600 bg-orange-50 border-orange-100 hover:bg-orange-100';
    }
  };

  const getThemeButtonClass = () => {
    switch (product.category) {
      case 'dogs':
        return 'bg-amber-600 hover:bg-amber-700 shadow-amber-500/20';
      case 'cats':
        return 'bg-purple-600 hover:bg-purple-700 shadow-purple-500/20';
      case 'fish':
        return 'bg-sky-500 hover:bg-sky-600 shadow-sky-500/20';
      case 'birds':
        return 'bg-emerald-500 hover:bg-emerald-600 shadow-emerald-500/20';
      case 'small_pets':
        return 'bg-pink-500 hover:bg-pink-600 shadow-pink-500/20';
      default:
        return 'bg-orange-500 hover:bg-orange-600 shadow-orange-500/20';
    }
  };

  const getThemeButtonBgColor = () => {
    switch (product.category) {
      case 'dogs':
        return '#d97706';
      case 'cats':
        return '#9333ea';
      case 'fish':
        return '#0ea5e9';
      case 'birds':
        return '#10b981';
      case 'small_pets':
        return '#ec4899';
      default:
        return '#f97316';
    }
  };

  return (

    <div data-theme={getCategoryTheme()} className="min-h-screen bg-gray-50/50 pb-20 pt-6" style={{ minHeight: '100vh', backgroundColor: 'var(--color-bg)', padding: '2rem 0 5rem 0' }}>
      <div className="container mx-auto px-4" style={{ maxWidth: 1280, margin: '0 auto', padding: '0 1.5rem' }}>
        {/* Breadcrumbs */}
        <nav className="mb-6 flex items-center gap-2 text-[10px] font-extrabold tracking-wider text-gray-400 uppercase" style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem', fontSize: '0.68rem', fontWeight: 800, color: '#8a7e72', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
          <Link to="/" className="hover:text-orange-500 transition-colors">Home</Link>
          <span>/</span>
          <Link to="/products" className="hover:text-orange-500 transition-colors">Shop</Link>
          <span>/</span>
          <Link to={`/${product.category.replace('_', '-')}`} className="hover:text-orange-500 transition-colors">
            {product.category.replace('_', ' ')}
          </Link>
          <span>/</span>
          <span className="text-gray-600 truncate max-w-[200px]">{product.name}</span>
        </nav>

        {/* Product Details Box */}
        <div className="grid grid-cols-1 gap-8 rounded-[36px] bg-white p-6 shadow-sm md:grid-cols-12 md:p-8" style={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap', gap: '3rem', borderRadius: 32, border: '1px solid #f2ebe1', backgroundColor: '#fff', padding: '2.5rem', boxShadow: '0 20px 50px rgba(45,36,24,0.02)' }}>
          {/* Left panel: Image gallery */}
          <div className="md:col-span-6 flex flex-col gap-5" style={{ flex: '1 1 450px', display: 'flex', flexDirection: 'column', gap: '1.25rem', minWidth: '320px' }}>
            <div 
              className="relative flex h-96 w-full items-center justify-center overflow-hidden" 
              style={{ 
                position: 'relative', 
                display: 'flex', 
                height: 400, 
                width: '100%', 
                alignItems: 'center', 
                justifyContent: 'center', 
                overflow: 'hidden', 
                borderRadius: '32px 32px 80px 32px', // Cute asymmetric round corners!
                backgroundColor: '#fff', 
                border: '4px solid #fff', 
                padding: '2rem', 
                boxShadow: '0 20px 40px rgba(45,36,24,0.05), inset 0 4px 20px rgba(0,0,0,0.02)',
                background: 'linear-gradient(135deg, #fdfbf7 0%, #f5efe6 100%)'
              }}
            >
              {/* Soft decorative background sphere */}
              <div style={{ position: 'absolute', bottom: -20, right: -20, width: 140, height: 140, borderRadius: '50%', background: 'radial-gradient(circle, rgba(249,115,22,0.06) 0%, rgba(255,255,255,0) 70%)', pointerEvents: 'none', zIndex: 0 }} />

              {/* Product Badge */}
              {product.badge && (
                <span className="absolute top-4 left-4 z-10 rounded-full bg-gradient-to-r from-orange-500 to-amber-500 px-3.5 py-1 text-[10px] font-extrabold tracking-wider uppercase text-white shadow-md" style={{ position: 'absolute', top: 20, left: 20, zIndex: 10, borderRadius: 9999, background: 'linear-gradient(to right, #f97316, #f59e0b)', padding: '5px 14px', fontSize: '0.65rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em', color: '#fff', boxShadow: '0 4px 12px rgba(249,115,22,0.25)' }}>
                  {product.badge}
                </span>
              )}

              {/* Main zoom image */}
              <motion.img
                key={selectedImage}
                initial={{ opacity: 0, scale: 0.9, rotate: -3 }}
                animate={{ opacity: 1, scale: 1, rotate: 0 }}
                transition={{ type: "spring", stiffness: 220, damping: 20 }}
                src={selectedImage}
                alt={product.name}
                className="h-80 w-80 object-contain"
                style={{ height: '85%', width: '85%', objectFit: 'contain', zIndex: 1, filter: 'drop-shadow(0 12px 24px rgba(0,0,0,0.05))' }}
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = '/images/placeholder.png';
                }}
              />
            </div>

            {/* Thumbnails row */}
            {product.images && product.images.length > 1 && (
              <div className="flex justify-center gap-3 overflow-x-auto pb-2 scrollbar-none" style={{ display: 'flex', justifyContent: 'center', gap: '0.8rem', overflowX: 'auto', paddingBottom: '0.5rem', paddingTop: '0.5rem' }}>
                {product.images.map((img: string, idx: number) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImage(img)}
                    style={{
                      height: 70,
                      width: 70,
                      flexShrink: 0,
                      borderRadius: '16px',
                      border: selectedImage === img ? '2.5px solid var(--color-brand)' : '2px solid rgba(0,0,0,0.04)',
                      padding: '3px',
                      backgroundColor: '#fff',
                      cursor: 'pointer',
                      boxShadow: selectedImage === img ? '0 8px 20px rgba(249,115,22,0.15)' : '0 4px 10px rgba(0,0,0,0.02)',
                      transform: selectedImage === img ? 'scale(1.08) translateY(-2px)' : 'scale(1)',
                      transition: 'all 300ms cubic-bezier(0.175, 0.885, 0.32, 1.275)',
                      overflow: 'hidden'
                    }}
                  >
                    <img
                      src={img}
                      alt={`${product.name} gallery ${idx + 1}`}
                      className="h-full w-full object-cover rounded-xl"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = '/images/placeholder.png';
                      }}
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right panel: Controls & Descriptions */}
          <div className="md:col-span-6 flex flex-col justify-between" style={{ flex: '1 1 450px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', minWidth: '320px' }}>
            <div>
              {/* Product Title */}
              <h1 className="font-display text-2xl font-extrabold text-gray-800 md:text-3xl leading-snug" style={{ margin: 0, fontFamily: 'var(--font-display)', fontSize: '1.8rem', fontWeight: 900, color: '#2d2418', lineHeight: 1.3, letterSpacing: '-0.02em' }}>
                {product.name}
              </h1>

              {/* Price block & Live Availability Tag */}
              <div className="mt-4 flex items-center justify-between" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '1.25rem', gap: '1rem', flexWrap: 'wrap' }}>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.75rem' }}>
                  <span className="text-2xl font-extrabold text-gray-900" style={{ fontSize: '1.8rem', fontWeight: 950, color: '#2d2418', letterSpacing: '-0.02em' }}>
                    ₹{activePrice.toLocaleString('en-IN')}
                  </span>
                  {activeOriginalPrice && (
                    <>
                      <span className="text-sm font-semibold text-gray-400 line-through" style={{ fontSize: '0.9rem', fontWeight: 650, color: '#bbb', textDecoration: 'line-through' }}>
                        ₹{activeOriginalPrice.toLocaleString('en-IN')}
                      </span>
                      <span className="text-xs font-bold text-red-500 rounded-md bg-red-50 px-2 py-0.5 border border-red-100" style={{ fontSize: '0.75rem', fontWeight: 800, color: '#ef4444', backgroundColor: '#fef2f2', border: '1px solid #fee2e2', borderRadius: 6, padding: '2px 8px' }}>
                        -{discount}% OFF
                      </span>
                    </>
                  )}
                </div>

                <div>
                  {activeStock === 0 ? (
                    <span style={{ fontSize: '0.72rem', fontWeight: 900, color: '#fff', backgroundColor: '#ef4444', padding: '5px 12px', borderRadius: 9999, boxShadow: '0 4px 10px rgba(239,68,68,0.15)', display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}>🐾 Out of Stock</span>
                  ) : activeStock <= (product.lowStockThreshold || 5) ? (
                    <span style={{ fontSize: '0.72rem', fontWeight: 900, color: '#d97706', backgroundColor: '#fffbeb', border: '1.5px dashed #f59e0b', padding: '4px 12px', borderRadius: 9999, display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}>⚠️ Only {activeStock} Left!</span>
                  ) : (
                    <span style={{ fontSize: '0.72rem', fontWeight: 900, color: '#16a34a', backgroundColor: '#f0fdf4', border: '1.5px solid #bbf7d0', padding: '4px 12px', borderRadius: 9999, display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}>🐾 In Stock</span>
                  )}
                </div>
              </div>

              {/* Description */}
              <p className="mt-5 text-xs text-gray-500 leading-relaxed" style={{ margin: '1.25rem 0 0 0', fontSize: '0.82rem', color: '#8a7e72', lineHeight: 1.6, fontWeight: 500 }}>
                {product.description}
              </p>

              {/* Tags Badges Row */}
              {product.tags && product.tags.length > 0 && (
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem', marginTop: '1.25rem' }}>
                  {product.tags.map((tag: string) => (
                    <span key={tag} style={{ fontSize: '0.7rem', padding: '5px 12px', borderRadius: '12px', backgroundColor: '#fdfbf7', border: '1px dashed #e8e0d5', color: '#8a7e72', fontWeight: 800, display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}>
                      <span>🐾</span> #{tag}
                    </span>
                  ))}
                </div>
              )}

              {/* Dynamic Option Variant Selector */}
              {product.variants && product.variants.length > 0 && (
                <div className="mt-6" style={{ marginTop: '1.75rem' }}>
                  <h4 className="text-[10px] font-extrabold tracking-wider text-gray-400 uppercase mb-3" style={{ margin: '0 0 0.5rem 0', fontSize: '0.65rem', fontWeight: 800, color: '#8a7e72', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                    Select Option / Pack Size
                  </h4>
                  <div className="flex flex-wrap gap-3" style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem' }}>
                    {product.variants.map((v: any) => (
                      <button
                        key={v.sku}
                        onClick={() => setSelectedVariant(v)}
                        className={`rounded-full px-4 py-2 text-xs font-extrabold transition-all border`}
                        style={{
                          borderRadius: 9999,
                          padding: '0.5rem 1.25rem',
                          fontFamily: 'var(--font-display)',
                          fontSize: '0.78rem',
                          fontWeight: 800,
                          cursor: 'pointer',
                          transition: 'all 200ms ease',
                          border: selectedVariant?.sku === v.sku ? '1.5px solid var(--color-brand)' : '1.5px solid rgba(0,0,0,0.08)',
                          backgroundColor: selectedVariant?.sku === v.sku ? 'var(--color-brand)' : '#fff',
                          color: selectedVariant?.sku === v.sku ? '#fff' : '#4a4036',
                          boxShadow: selectedVariant?.sku === v.sku ? '0 4px 10px var(--color-brand-light)' : 'none',
                        }}
                      >
                        {v.label} (₹{v.price})
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Quantity Adjuster & Add to Cart button */}
            <div className="mt-8 pt-6 border-t border-gray-100 flex flex-col sm:flex-row items-center gap-4" style={{ marginTop: '2rem', paddingTop: '1.5rem', borderTop: '1px solid #f3ebe1', display: 'flex', flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center', gap: '1rem' }}>
              {/* Qty count */}
              <div className="flex items-center gap-1 bg-gray-50 border border-gray-200 rounded-full p-2 flex-shrink-0" style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', backgroundColor: '#faf8f5', border: '1px solid rgba(0,0,0,0.06)', borderRadius: 9999, padding: '0.4rem', flexShrink: 0 }}>
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="flex h-8 w-8 items-center justify-center rounded-full bg-white text-gray-500 shadow-sm border border-gray-100 hover:text-orange-500 active:scale-90 transition-all"
                  style={{ display: 'flex', height: 32, width: 32, alignItems: 'center', justifyContent: 'center', borderRadius: '50%', backgroundColor: '#fff', border: '1px solid rgba(0,0,0,0.06)', cursor: 'pointer', boxShadow: '0 1px 3px rgba(0,0,0,0.02)' }}
                >
                  <Minus className="h-4 w-4" style={{ height: 14, width: 14 }} />
                </button>
                <span className="font-display font-extrabold text-gray-800 px-4 min-w-[32px] text-center text-sm" style={{ padding: '0 0.5rem', minWidth: 36, textAlign: 'center', fontSize: '0.85rem', fontWeight: 800, color: '#2d2418', fontFamily: 'var(--font-display)' }}>
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="flex h-8 w-8 items-center justify-center rounded-full bg-white text-gray-500 shadow-sm border border-gray-100 hover:text-orange-500 active:scale-90 transition-all"
                  style={{ display: 'flex', height: 32, width: 32, alignItems: 'center', justifyContent: 'center', borderRadius: '50%', backgroundColor: '#fff', border: '1px solid rgba(0,0,0,0.06)', cursor: 'pointer', boxShadow: '0 1px 3px rgba(0,0,0,0.02)' }}
                >
                  <Plus className="h-4 w-4" style={{ height: 14, width: 14 }} />
                </button>
              </div>

              {/* Add to Cart button */}
              <button
                onClick={handleAddToCart}
                disabled={isAdding}
                className={`flex-1 w-full flex items-center justify-center gap-2 rounded-full py-3.5 font-display text-sm font-extrabold text-white transition-all duration-300 shadow-md ${getThemeButtonClass()}`}
                style={{
                  flex: 1,
                  minHeight: 48,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.5rem',
                  borderRadius: 9999,
                  fontFamily: 'var(--font-display)',
                  fontSize: '0.9rem',
                  fontWeight: 800,
                  color: '#fff',
                  backgroundColor: getThemeButtonBgColor(),
                  border: 'none',
                  cursor: 'pointer',
                  transition: 'all 200ms ease',
                }}
              >
                <AnimatePresence mode="wait" initial={false}>
                  {isAdding ? (
                    <motion.div
                      key="check"
                      initial={{ scale: 0, rotate: -45 }}
                      animate={{ scale: 1, rotate: 0 }}
                      exit={{ scale: 0, rotate: 45 }}
                      className="flex items-center gap-2"
                      style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}
                    >
                      <Check className="h-4 w-4 stroke-[3]" />
                      <span>Added Successfully</span>
                    </motion.div>
                  ) : (
                    <motion.div
                      key={`cart-${activePrice}-${quantity}`}
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      exit={{ scale: 0 }}
                      className="flex items-center gap-2"
                      style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}
                    >
                      <ShoppingCart className="h-4 w-4" />
                      <span>Add {quantity} to Cart — ₹{(activePrice * quantity).toLocaleString('en-IN')}</span>
                    </motion.div>
                  )}
                </AnimatePresence>
              </button>

              {/* Wishlist button */}
              <button
                onClick={handleWishlistToggle}
                className={`flex h-12 w-12 items-center justify-center rounded-full border bg-white shadow-sm transition-all active:scale-90 flex-shrink-0 ${wish ? 'border-red-100 text-red-500 bg-red-50/50' : 'border-gray-200 text-gray-400 hover:text-red-500'
                  }`}
                style={{
                  display: 'flex',
                  height: 48,
                  width: 48,
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderRadius: '50%',
                  border: wish ? '1.5px solid #fecaca' : '1.5px solid rgba(0,0,0,0.08)',
                  backgroundColor: wish ? '#fef2f2' : '#fff',
                  color: wish ? '#ef4444' : '#ccc',
                  cursor: 'pointer',
                  flexShrink: 0,
                  transition: 'all 200ms ease',
                }}
              >
                <Heart className={`h-5 w-5 ${wish ? 'fill-red-500 text-red-500' : ''}`} style={{ fill: wish ? '#ef4444' : 'none' }} />
              </button>
            </div>
          </div>
        </div>

        {/* Specifications & Reviews Tab Container */}
        <section className="mt-12 bg-white rounded-3xl border border-gray-100 p-6 md:p-8 shadow-sm" style={{ marginTop: '3rem', border: '1px solid rgba(0,0,0,0.05)', backgroundColor: '#fff', borderRadius: 24, padding: '2rem', boxShadow: '0 4px 20px rgba(0,0,0,0.02)' }}>
          {/* Tabs row */}
          <div className="flex gap-6 border-b border-gray-100 mb-6" style={{ display: 'flex', gap: '2rem', borderBottom: '1px solid #f3ebe1', marginBottom: '1.5rem' }}>
            <button
              onClick={() => setActiveTab('specs')}
              className={`pb-4 font-display text-sm font-extrabold transition-all relative ${activeTab === 'specs' ? 'text-gray-800' : 'text-gray-400 hover:text-gray-600'
                }`}
              style={{
                paddingBottom: '1rem',
                fontFamily: 'var(--font-display)',
                fontSize: '0.9rem',
                fontWeight: 800,
                color: activeTab === 'specs' ? '#2d2418' : '#8a7e72',
                cursor: 'pointer',
                transition: 'all 200ms ease',
                position: 'relative',
                border: 'none',
                backgroundColor: 'transparent',
              }}
            >
              <span>Specifications</span>
              {activeTab === 'specs' && (
                <motion.div
                  layoutId="activeTabUnderline"
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-orange-500"
                  style={{
                    position: 'absolute',
                    bottom: 0,
                    left: 0,
                    right: 0,
                    height: 3,
                    backgroundColor: 'var(--color-brand)',
                    borderRadius: 999,
                  }}
                />
              )}
            </button>
            <button
              onClick={() => setActiveTab('reviews')}
              className={`pb-4 font-display text-sm font-extrabold transition-all relative ${activeTab === 'reviews' ? 'text-gray-800' : 'text-gray-400 hover:text-gray-600'
                }`}
              style={{
                paddingBottom: '1rem',
                fontFamily: 'var(--font-display)',
                fontSize: '0.9rem',
                fontWeight: 800,
                color: activeTab === 'reviews' ? '#2d2418' : '#8a7e72',
                cursor: 'pointer',
                transition: 'all 200ms ease',
                position: 'relative',
                border: 'none',
                backgroundColor: 'transparent',
              }}
            >
              <span>Customer Reviews ({product.reviews.length})</span>
              {activeTab === 'reviews' && (
                <motion.div
                  layoutId="activeTabUnderline"
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-orange-500"
                  style={{
                    position: 'absolute',
                    bottom: 0,
                    left: 0,
                    right: 0,
                    height: 3,
                    backgroundColor: 'var(--color-brand)',
                    borderRadius: 999,
                  }}
                />
              )}
            </button>
          </div>

          {/* Tab contents */}
          <AnimatePresence mode="wait">
            {activeTab === 'specs' ? (
              <motion.div
                key="specs"
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -5 }}
                transition={{ duration: 0.2 }}
                className="grid gap-4 sm:grid-cols-2"
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                  gap: '2rem',
                }}
              >
                {/* Specifications List */}
                <div className="flex flex-col gap-3" style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  <h3 className="text-xs font-bold text-gray-800 uppercase tracking-wider mb-2" style={{ fontSize: '0.75rem', fontWeight: 800, color: '#2d2418', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.5rem' }}>Technical Specs</h3>
                  {Object.entries(product.specs).map(([key, val]) => (
                    <div key={key} className="flex justify-between border-b border-gray-50 pb-2 text-xs" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid #f3ebe1', paddingBottom: '0.5rem', fontSize: '0.8rem' }}>
                      <span className="text-gray-400 font-medium" style={{ color: '#8a7e72', fontWeight: 550 }}>{key}</span>
                      <span className="text-gray-700 font-extrabold" style={{ color: '#2d2418', fontWeight: 800 }}>{val as any}</span>
                    </div>
                  ))}
                </div>

                {/* Features Highlights */}
                <div className="rounded-2xl bg-orange-50/20 border border-orange-100/40 p-5" style={{ borderRadius: 16, backgroundColor: 'var(--color-brand-light)', border: '1px solid rgba(249, 115, 22, 0.15)', padding: '1.25rem', opacity: 0.9 }}>
                  <h3 className="text-xs font-bold text-gray-800 uppercase tracking-wider mb-3 flex items-center gap-1" style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--color-brand-dark)', textTransform: 'uppercase', letterSpacing: '0.05em', display: 'flex', alignItems: 'center', gap: '0.25rem', marginBottom: '0.75rem' }}>
                    <Sparkles className="h-4 w-4 text-orange-500" style={{ color: 'var(--color-brand)' }} />
                    <span>Product Highlights</span>
                  </h3>
                  <ul className="flex flex-col gap-3" style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', listStyle: 'none' }}>
                    {product.features.map((feat: string, idx: number) => (
                      <li key={idx} className="flex items-start gap-2 text-xs text-gray-600" style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem', fontSize: '0.8rem', color: '#4a4036', fontWeight: 550 }}>
                        <Check className="h-4 w-4 text-emerald-500 mt-0.5 flex-shrink-0 stroke-[3]" style={{ color: '#22c55e', flexShrink: 0, marginTop: 2 }} />
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="reviews"
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -5 }}
                transition={{ duration: 0.2 }}
                className="flex flex-col gap-6"
                style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}
              >
                {product.reviews.map((rev: any) => (
                  <div key={rev.id} className="border-b border-gray-100 pb-5 last:border-b-0 last:pb-0" style={{ borderBottom: '1px solid #f3ebe1', paddingBottom: '1.25rem' }}>
                    <div className="flex items-center justify-between mb-2" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <span className="text-xs font-extrabold text-gray-800" style={{ fontSize: '0.85rem', fontWeight: 800, color: '#2d2418' }}>{rev.author}</span>
                        {rev.verified && (
                          <span className="ml-2 rounded-full bg-emerald-50 border border-emerald-100 px-2 py-0.5 text-[9px] font-extrabold text-emerald-600 uppercase tracking-widest" style={{ borderRadius: 9999, backgroundColor: '#e6fcf0', border: '1px solid #a7f3d0', padding: '2px 8px', fontSize: '0.6rem', fontWeight: 800, color: '#10b981', letterSpacing: '0.05em' }}>
                            Verified Buyer
                          </span>
                        )}
                      </div>
                      <span className="text-xs text-gray-400 font-medium" style={{ fontSize: '0.75rem', color: '#8a7e72', fontWeight: 550 }}>{rev.date}</span>
                    </div>

                    {/* Ratings */}
                    <div className="flex items-center gap-0.5 text-amber-500 mb-2" style={{ display: 'flex', alignItems: 'center', gap: '2px', color: '#d97706', marginBottom: '0.5rem' }}>
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star
                          key={i}
                          className={`h-3.5 w-3.5 ${i < rev.rating ? 'fill-amber-400 text-amber-400' : 'text-gray-200'
                            }`}
                          style={{ height: 14, width: 14, fill: i < rev.rating ? '#f59e0b' : 'none', color: i < rev.rating ? '#f59e0b' : '#ccc' }}
                        />
                      ))}
                    </div>

                    <p className="text-xs text-gray-600 leading-relaxed" style={{ fontSize: '0.8rem', color: '#4a4036', lineHeight: 1.5, fontStyle: 'italic', fontWeight: 500 }}>
                      "{rev.comment}"
                    </p>
                  </div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </section>

        {/* You May Also Like Related Section */}
        {relatedProducts.length > 0 && (
          <section style={{ marginTop: '3rem', marginBottom: '1rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2rem' }}>
              <div style={{ textAlign: 'left' }}>
                <h2 style={{ fontSize: '1.6rem', fontWeight: 900, color: '#2d2418', fontFamily: 'var(--font-display)', margin: 0 }}>
                  You May Also Like
                </h2>
                <p style={{ fontSize: '0.8rem', color: '#8a7e72', marginTop: '4px', fontWeight: 500 }}>
                  Essentials from the same category that other buyers loved
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4" style={{ display: 'grid', gap: '1.5rem' }}>
              {relatedProducts.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
