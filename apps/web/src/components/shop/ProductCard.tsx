import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, Star, ShoppingCart, Check } from 'lucide-react';
import { Product } from '../../data/mockProducts';
import { useCartStore } from '../../store/cart.store';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const addItem = useCartStore((s) => s.addItem);
  const toggleCartDrawer = useCartStore((s) => s.toggleDrawer);

  const discount = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsAdding(true);

    const defaultSku = `${product.id}${product.sizes?.[0] ? `-${product.sizes[0].replace(/\s+/g, '')}` : ''}${
      product.flavors?.[0] ? `-${product.flavors[0].replace(/\s+/g, '')}` : ''
    }`;

    const defaultVariant = [product.sizes?.[0], product.flavors?.[0]]
      .filter(Boolean)
      .join(' / ');

    addItem({
      product: product.id,
      name: product.name,
      image: product.image,
      sku: defaultSku,
      quantity: 1,
      price: product.price,
      variant: defaultVariant || undefined,
    });

    setTimeout(() => {
      setIsAdding(false);
      toggleCartDrawer();
    }, 800);
  };

  const handleWishlistToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsWishlisted(!isWishlisted);
  };

  // Map badge style
  const getBadgeBg = () => {
    switch (product.badge) {
      case 'sale':
        return '#ef4444'; // Red
      case 'new':
        return '#10b981'; // Green
      case 'bestseller':
        return '#f59e0b'; // Amber
      default:
        return 'var(--color-brand)';
    }
  };

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

  return (
    <motion.div
      data-theme={getCategoryTheme()}
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        position: 'relative',
        background: '#fff',
        borderRadius: 24,
        border: isHovered ? '1px solid var(--color-brand)' : '1px solid rgba(0,0,0,0.05)',
        overflow: 'hidden',
        transition: 'all 300ms cubic-bezier(0.16, 1, 0.3, 1)',
        display: 'flex',
        flexDirection: 'column',
        padding: '1.25rem',
        gap: '1rem',
        cursor: 'pointer',
        transform: isHovered ? 'translateY(-6px)' : 'translateY(0)',
        boxShadow: isHovered
          ? '0 20px 40px rgba(0,0,0,0.08), 0 0 0 1px rgba(0,0,0,0.02)'
          : '0 1px 4px rgba(0,0,0,0.04)',
      }}
    >
      <Link to={`/products/${product.slug}`} className="block h-full" style={{ textDecoration: 'none', color: 'inherit' }}>
        {/* Visual Badge / Discount */}
        <div style={{ position: 'absolute', top: 12, left: 12, zIndex: 2, display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
          {product.badge && (
            <span
              style={{
                fontSize: '0.65rem',
                fontWeight: 800,
                color: '#fff',
                backgroundColor: getBadgeBg(),
                padding: '3px 8px',
                borderRadius: 8,
                textTransform: 'uppercase',
                letterSpacing: '0.02em',
                boxShadow: '0 2px 4px rgba(0,0,0,0.08)',
              }}
            >
              {product.badge}
            </span>
          )}
          {discount > 0 && (
            <span
              style={{
                fontSize: '0.65rem',
                fontWeight: 800,
                color: '#ef4444',
                backgroundColor: '#fef2f2',
                border: '1.5px solid #fee2e2',
                padding: '2px 6px',
                borderRadius: 8,
              }}
            >
              -{discount}% OFF
            </span>
          )}
        </div>

        {/* Wishlist Button */}
        <button
          onClick={handleWishlistToggle}
          style={{
            position: 'absolute',
            top: 12,
            right: 12,
            zIndex: 2,
            width: 32,
            height: 32,
            borderRadius: '50%',
            border: '1.5px solid rgba(0,0,0,0.06)',
            background: 'rgba(255, 255, 255, 0.95)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            color: isWishlisted ? '#ef4444' : '#ccc',
            transition: 'all 200ms ease',
          }}
        >
          <Heart
            className="h-4.5 w-4.5"
            style={{
              fill: isWishlisted ? '#ef4444' : 'none',
              strokeWidth: 2.5,
            }}
          />
        </button>

        {/* Image Container with Hover zoom */}
        <div
          style={{
            height: 180,
            width: '100%',
            borderRadius: 20,
            background: isHovered ? 'var(--color-brand-light)' : '#faf8f5',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            position: 'relative',
            overflow: 'hidden',
            transition: 'background-color 300ms ease',
          }}
        >
          <img
            src={product.image}
            alt={product.name}
            style={{
              width: '75%',
              height: '75%',
              objectFit: 'contain',
              transition: 'transform 500ms ease',
              transform: isHovered ? 'scale(1.08)' : 'scale(1)',
            }}
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.src = 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?q=80&w=400&auto=format&fit=crop';
            }}
          />
        </div>

        {/* Product Details */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', marginTop: '0.5rem' }}>
          {/* Subcategory & Rating */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span
              style={{
                fontSize: '0.7rem',
                fontWeight: 700,
                color: '#8a7e72',
                textTransform: 'uppercase',
                letterSpacing: '0.08em',
              }}
            >
              {product.subcategory}
            </span>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.2rem',
                borderRadius: 9999,
                backgroundColor: '#fffbeb',
                padding: '2px 8px',
                color: '#b45309',
                fontSize: '0.72rem',
                fontWeight: 700,
              }}
            >
              <Star className="h-3.5 w-3.5 fill-amber-500 text-amber-500" />
              <span>{product.rating}</span>
            </div>
          </div>

          {/* Product Name */}
          <h3
            style={{
              fontSize: '1.02rem',
              fontWeight: 800,
              color: isHovered ? 'var(--color-brand)' : '#2d2418',
              margin: 0,
              fontFamily: 'var(--font-display)',
              letterSpacing: '-0.01em',
              lineHeight: 1.35,
              height: '2.7rem',
              overflow: 'hidden',
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              transition: 'color 200ms ease',
            }}
          >
            {product.name}
          </h3>

          {/* Price Block */}
          <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginTop: '0.4rem' }}>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              {product.originalPrice && (
                <span style={{ fontSize: '0.75rem', fontWeight: 600, color: '#ccc', textDecoration: 'line-through' }}>
                  ₹{product.originalPrice.toLocaleString('en-IN')}
                </span>
              )}
              <span style={{ fontSize: '1.3rem', fontWeight: 900, color: '#2d2418', letterSpacing: '-0.02em', lineHeight: 1.1 }}>
                ₹{product.price.toLocaleString('en-IN')}
              </span>
            </div>

            {/* Quick Add Button */}
            <motion.button
              whileTap={{ scale: 0.92 }}
              onClick={handleAddToCart}
              disabled={isAdding}
              style={{
                width: 36,
                height: 36,
                borderRadius: 12,
                border: 'none',
                background: isAdding ? '#10b981' : 'var(--color-brand)',
                color: '#fff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                transition: 'all 200ms ease',
                boxShadow: isHovered ? '0 8px 16px var(--color-brand-light)' : '0 2px 4px rgba(0,0,0,0.05)',
              }}
            >
              <AnimatePresence mode="wait" initial={false}>
                {isAdding ? (
                  <motion.div
                    key="check"
                    initial={{ scale: 0, rotate: -45 }}
                    animate={{ scale: 1, rotate: 0 }}
                    exit={{ scale: 0, rotate: 45 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Check className="h-4.5 w-4.5 stroke-[3]" />
                  </motion.div>
                ) : (
                  <motion.div
                    key="cart"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    exit={{ scale: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <ShoppingCart className="h-4 w-4" />
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.button>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
