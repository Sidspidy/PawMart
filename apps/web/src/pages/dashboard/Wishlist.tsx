import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Heart, ShoppingCart, Trash2, Star, Tag, ShoppingBag } from 'lucide-react';
import { useCartStore } from '../../store/cart.store';

interface WishlistItem {
  id: string;
  name: string;
  slug: string;
  image: string;
  price: number;
  originalPrice?: number;
  rating: number;
  reviewCount: number;
  badge?: string;
  category: string;
}

const MOCK_WISHLIST: WishlistItem[] = [
  { id: 'dog-1', name: 'Premium Grain-Free Salmon Kibble', slug: 'premium-grain-free-salmon-kibble', image: '/images/hero/dog.png', price: 1899, originalPrice: 2299, rating: 4.8, reviewCount: 124, badge: 'bestseller', category: 'Dogs' },
  { id: 'cat-1', name: 'Interactive Multi-Level Scratch Tree', slug: 'interactive-multi-level-scratch-tree', image: '/images/hero/kitten.png', price: 4599, originalPrice: 5499, rating: 4.7, reviewCount: 92, badge: 'bestseller', category: 'Cats' },
  { id: 'dog-2', name: 'Orthopedic Memory Foam Pet Bed', slug: 'orthopedic-memory-foam-pet-bed', image: '/images/hero/puppy.png', price: 3499, originalPrice: 4299, rating: 4.9, reviewCount: 88, badge: 'sale', category: 'Dogs' },
  { id: 'fish-1', name: 'Dynamic LED Curved Glass Aquarium Kit', slug: 'dynamic-led-curved-glass-aquarium-kit', image: '/images/hero/fish.png', price: 6499, originalPrice: 7999, rating: 4.8, reviewCount: 39, badge: 'bestseller', category: 'Fish' },
];

const BADGE_CONFIG: Record<string, { label: string; bg: string; color: string }> = {
  bestseller: { label: 'Bestseller', bg: '#fff7ed', color: '#c2410c' },
  sale:       { label: 'Sale',       bg: '#fef2f2', color: '#ef4444' },
  new:        { label: 'New',        bg: '#f0fdf4', color: '#16a34a' },
};

export default function Wishlist() {
  const [items, setItems] = useState<WishlistItem[]>(MOCK_WISHLIST);
  const [addedIds, setAddedIds] = useState<Set<string>>(new Set());
  const { addItem } = useCartStore();

  const handleRemove = (id: string) => {
    setItems(prev => prev.filter(i => i.id !== id));
  };

  const handleAddToCart = (item: WishlistItem) => {
    addItem({
      product: item.id,
      name: item.name,
      image: item.image,
      sku: item.id,
      quantity: 1,
      price: item.price,
    });
    setAddedIds(prev => new Set(prev).add(item.id));
    setTimeout(() => {
      setAddedIds(prev => {
        const next = new Set(prev);
        next.delete(item.id);
        return next;
      });
    }, 2000);
  };

  const s = {
    title: { fontSize: '1.5rem', fontWeight: 900, color: '#2d2418', fontFamily: "'Nunito', sans-serif", marginBottom: '0.25rem' } as React.CSSProperties,
    subtitle: { fontSize: '0.82rem', color: '#8a7e72', marginBottom: '1.5rem' } as React.CSSProperties,
    grid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(2, 1fr)',
      gap: '1rem',
    } as React.CSSProperties,
    card: {
      backgroundColor: '#ffffff', borderRadius: '20px',
      border: '1px solid #e5ddd4', overflow: 'hidden',
      boxShadow: '0 4px 16px rgba(0,0,0,0.05)',
      transition: 'all 0.25s',
      position: 'relative' as const,
    } as React.CSSProperties,
    imageWrap: { position: 'relative' as const, height: '180px', overflow: 'hidden' } as React.CSSProperties,
    image: {
      width: '100%', height: '100%', objectFit: 'cover' as const,
      backgroundColor: '#f0ebe4', transition: 'transform 0.4s',
    } as React.CSSProperties,
    removeBtn: {
      position: 'absolute' as const, top: '10px', right: '10px',
      width: '32px', height: '32px', borderRadius: '50%',
      backgroundColor: 'rgba(255,255,255,0.9)', border: 'none',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      cursor: 'pointer', color: '#ef4444', boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
    } as React.CSSProperties,
    badgeWrap: { position: 'absolute' as const, top: '10px', left: '10px' } as React.CSSProperties,
    badge: (type: string) => ({
      display: 'inline-flex', alignItems: 'center', gap: '0.3rem',
      padding: '0.2rem 0.6rem', borderRadius: '99px',
      fontSize: '0.65rem', fontWeight: 700, textTransform: 'capitalize' as const,
      color: BADGE_CONFIG[type]?.color || '#8a7e72',
      backgroundColor: BADGE_CONFIG[type]?.bg || '#f0ebe4',
    } as React.CSSProperties),
    cardBody: { padding: '1rem' } as React.CSSProperties,
    category: { fontSize: '0.68rem', fontWeight: 700, color: '#8a7e72', textTransform: 'uppercase' as const, letterSpacing: '0.06em', marginBottom: '0.3rem' } as React.CSSProperties,
    name: {
      fontSize: '0.88rem', fontWeight: 800, color: '#2d2418',
      fontFamily: "'Nunito', sans-serif", lineHeight: 1.3,
      marginBottom: '0.5rem', display: '-webkit-box', WebkitLineClamp: 2,
      WebkitBoxOrient: 'vertical' as const, overflow: 'hidden',
    } as React.CSSProperties,
    ratingRow: { display: 'flex', alignItems: 'center', gap: '0.375rem', marginBottom: '0.75rem' } as React.CSSProperties,
    ratingNum: { fontSize: '0.75rem', fontWeight: 700, color: '#2d2418' } as React.CSSProperties,
    reviewCount: { fontSize: '0.68rem', color: '#8a7e72' } as React.CSSProperties,
    priceRow: { display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.875rem' } as React.CSSProperties,
    price: { fontSize: '1rem', fontWeight: 900, color: '#f97316', fontFamily: "'Nunito', sans-serif" } as React.CSSProperties,
    originalPrice: { fontSize: '0.78rem', color: '#b0a99f', textDecoration: 'line-through' } as React.CSSProperties,
    discount: { fontSize: '0.72rem', fontWeight: 700, color: '#22c55e', backgroundColor: '#f0fdf4', padding: '0.15rem 0.4rem', borderRadius: '6px' } as React.CSSProperties,
    addBtn: (added: boolean) => ({
      display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem',
      width: '100%', padding: '0.625rem',
      borderRadius: '10px',
      background: added ? '#22c55e' : 'linear-gradient(135deg, #f97316, #ea580c)',
      color: '#ffffff', fontWeight: 700, fontSize: '0.8rem',
      fontFamily: "'Nunito', sans-serif", border: 'none', cursor: 'pointer',
      transition: 'all 0.25s',
    } as React.CSSProperties),
    // Empty
    emptyState: {
      display: 'flex', flexDirection: 'column' as const, alignItems: 'center',
      justifyContent: 'center', padding: '4rem 2rem', gap: '1rem',
      backgroundColor: '#ffffff', borderRadius: '20px', border: '1px solid #e5ddd4',
    } as React.CSSProperties,
    emptyIcon: {
      width: '72px', height: '72px', borderRadius: '50%',
      background: 'linear-gradient(135deg, #fff1e6, #fde8d0)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
    } as React.CSSProperties,
    shopBtn: {
      display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
      padding: '0.7rem 1.5rem', borderRadius: '99px',
      background: 'linear-gradient(135deg, #f97316, #ea580c)',
      color: '#ffffff', fontWeight: 700, fontSize: '0.88rem',
      fontFamily: "'Nunito', sans-serif", textDecoration: 'none',
    } as React.CSSProperties,
  };

  return (
    <div>
      <h1 style={s.title}>My Wishlist</h1>
      <p style={s.subtitle}>{items.length} saved item{items.length !== 1 ? 's' : ''}</p>

      {items.length === 0 ? (
        <div style={s.emptyState}>
          <div style={s.emptyIcon}><Heart size={32} color="#f97316" strokeWidth={1.5} /></div>
          <div style={{ fontSize: '1.1rem', fontWeight: 800, color: '#2d2418', fontFamily: "'Nunito', sans-serif" }}>Your wishlist is empty</div>
          <div style={{ fontSize: '0.85rem', color: '#8a7e72' }}>Save products you love for later.</div>
          <Link to="/products" style={s.shopBtn}><ShoppingBag size={15} /> Explore Products</Link>
        </div>
      ) : (
        <div style={s.grid}>
          {items.map(item => {
            const discount = item.originalPrice
              ? Math.round(((item.originalPrice - item.price) / item.originalPrice) * 100)
              : 0;
            const added = addedIds.has(item.id);

            return (
              <div key={item.id} style={s.card}>
                {/* Image */}
                <div style={s.imageWrap}>
                  <Link to={`/products/${item.slug}`}>
                    <img src={item.image} alt={item.name} style={s.image}
                      onError={e => { (e.target as HTMLImageElement).src = '/images/hero/dog.png'; }} />
                  </Link>
                  {item.badge && (
                    <div style={s.badgeWrap}>
                      <div style={s.badge(item.badge)}>
                        <Tag size={9} /> {BADGE_CONFIG[item.badge]?.label}
                      </div>
                    </div>
                  )}
                  <button style={s.removeBtn} onClick={() => handleRemove(item.id)}>
                    <Trash2 size={14} />
                  </button>
                </div>

                {/* Body */}
                <div style={s.cardBody}>
                  <div style={s.category}>{item.category}</div>
                  <Link to={`/products/${item.slug}`} style={{ textDecoration: 'none' }}>
                    <div style={s.name}>{item.name}</div>
                  </Link>
                  <div style={s.ratingRow}>
                    <Star size={12} fill="#f97316" color="#f97316" />
                    <span style={s.ratingNum}>{item.rating}</span>
                    <span style={s.reviewCount}>({item.reviewCount})</span>
                  </div>
                  <div style={s.priceRow}>
                    <span style={s.price}>₹{item.price.toLocaleString('en-IN')}</span>
                    {item.originalPrice && <span style={s.originalPrice}>₹{item.originalPrice.toLocaleString('en-IN')}</span>}
                    {discount > 0 && <span style={s.discount}>{discount}% OFF</span>}
                  </div>
                  <button style={s.addBtn(added)} onClick={() => handleAddToCart(item)}>
                    {added ? '✓ Added to Cart' : <><ShoppingCart size={14} /> Add to Cart</>}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
