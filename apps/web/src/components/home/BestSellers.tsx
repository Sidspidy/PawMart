import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const bestSellers = [
  {
    id: 'bs-1',
    name: 'Royal Canin Adult',
    brand: 'Royal Canin',
    price: '$54',
    originalPrice: '$68',
    image: '/images/hero/dog.png',
    category: 'Dogs',
    rating: 4.9,
    reviews: 1240,
    badge: '🔥 Hot',
    badgeColor: '#ef4444',
  },
  {
    id: 'bs-2',
    name: 'Interactive Feather Wand',
    brand: 'Jackson Galaxy',
    price: '$12',
    originalPrice: '$18',
    image: '/images/hero/cat.png',
    category: 'Cats',
    rating: 4.8,
    reviews: 856,
    badge: '⭐ Top Rated',
    badgeColor: '#f59e0b',
  },
  {
    id: 'bs-3',
    name: 'Aqueon LED Aquarium',
    brand: 'Aqueon',
    price: '$120',
    originalPrice: '$159',
    image: '/images/hero/fish.png',
    category: 'Fish',
    rating: 4.7,
    reviews: 432,
    badge: '💎 Premium',
    badgeColor: '#0ea5e9',
  },
  {
    id: 'bs-4',
    name: 'Orthopedic Dog Bed',
    brand: 'FurHaven',
    price: '$89',
    originalPrice: '$110',
    image: '/images/hero/dog.png',
    category: 'Dogs',
    rating: 4.9,
    reviews: 2103,
    badge: '🏆 Best',
    badgeColor: '#22c55e',
  },
  {
    id: 'bs-5',
    name: 'Premium Salmon Pate',
    brand: 'Purina Pro Plan',
    price: '$24',
    originalPrice: '$32',
    image: '/images/hero/cat.png',
    category: 'Cats',
    rating: 4.6,
    reviews: 678,
    badge: '🆕 New',
    badgeColor: '#a855f7',
  },
  {
    id: 'bs-6',
    name: 'Tropical Flake Food',
    brand: 'TetraMin',
    price: '$9',
    originalPrice: '$14',
    image: '/images/hero/fish.png',
    category: 'Fish',
    rating: 4.5,
    reviews: 389,
    badge: '💰 Value',
    badgeColor: '#d97706',
  },
];

export default function BestSellers() {
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  return (
    <div className="w-full">
      {/* Section Header */}
      <div className="flex items-end justify-between" style={{ marginBottom: '2rem' }}>
        <div>
          <span
            className="block"
            style={{ fontSize: '0.8rem', fontWeight: 700, color: '#d97706', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.25rem' }}
          >
            Trending Now
          </span>
          <h2 style={{ fontSize: 'clamp(1.8rem, 3.5vw, 2.5rem)', fontWeight: 900, color: '#2d2418', fontFamily: 'var(--font-display)', letterSpacing: '-0.02em', margin: 0, lineHeight: 1.2 }}>
            Best Sellers This Week
          </h2>
        </div>
        <Link
          to="/products"
          className="inline-flex items-center"
          style={{
            gap: '0.4rem',
            padding: '0.65rem 1.5rem',
            borderRadius: 9999,
            background: '#fef3c7',
            color: '#d97706',
            fontWeight: 700,
            fontSize: '0.85rem',
            textDecoration: 'none',
            transition: 'all 250ms ease',
          }}
        >
          View All →
        </Link>
      </div>

      {/* Products Grid: 3 columns, 2 rows */}
      <div className="grid grid-cols-3" style={{ gap: '1.5rem' }}>
        {bestSellers.map((product) => {
          const isHovered = hoveredId === product.id;
          return (
            <div
              key={product.id}
              onMouseEnter={() => setHoveredId(product.id)}
              onMouseLeave={() => setHoveredId(null)}
              style={{
                background: '#fff',
                borderRadius: 24,
                border: '1px solid rgba(0,0,0,0.05)',
                overflow: 'hidden',
                transition: 'all 300ms cubic-bezier(0.16, 1, 0.3, 1)',
                display: 'flex',
                flexDirection: 'row',
                padding: '1rem',
                gap: '1.25rem',
                cursor: 'pointer',
                transform: isHovered ? 'translateY(-4px)' : 'translateY(0)',
                boxShadow: isHovered
                  ? '0 20px 40px rgba(0,0,0,0.08), 0 0 0 1px rgba(0,0,0,0.02)'
                  : '0 1px 4px rgba(0,0,0,0.04)',
              }}
            >
              {/* Product Image */}
              <div style={{
                width: 140,
                height: 140,
                flexShrink: 0,
                borderRadius: 20,
                background: '#faf8f5',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                position: 'relative',
                overflow: 'hidden',
              }}>
                {/* Badge */}
                <span style={{
                  position: 'absolute', top: 8, left: 8, zIndex: 2,
                  fontSize: '0.65rem', fontWeight: 800,
                  color: '#fff', backgroundColor: product.badgeColor,
                  padding: '3px 8px', borderRadius: 8,
                  letterSpacing: '0.02em',
                }}>
                  {product.badge}
                </span>

                {/* Heart */}
                <button style={{
                  position: 'absolute', top: 8, right: 8, zIndex: 2,
                  width: 28, height: 28,
                  borderRadius: '50%', border: '1.5px solid rgba(0,0,0,0.08)',
                  background: '#fff',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  cursor: 'pointer', color: '#ccc',
                  transition: 'all 200ms ease',
                }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                  </svg>
                </button>

                <img
                  src={product.image}
                  alt={product.name}
                  style={{
                    width: '80%',
                    height: '80%',
                    objectFit: 'contain',
                    transition: 'transform 300ms ease',
                    transform: isHovered ? 'scale(1.08)' : 'scale(1)',
                  }}
                />
              </div>

              {/* Product Info */}
              <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', flex: 1, gap: '0.3rem' }}>
                {/* Category Tag */}
                <span style={{
                  fontSize: '0.7rem', fontWeight: 700,
                  color: '#8a7e72', textTransform: 'uppercase',
                  letterSpacing: '0.08em',
                }}>
                  {product.category}
                </span>

                {/* Name */}
                <h3 style={{
                  fontSize: '1.05rem', fontWeight: 800,
                  color: '#2d2418', margin: 0,
                  fontFamily: 'var(--font-display)',
                  letterSpacing: '-0.01em',
                  lineHeight: 1.3,
                }}>
                  {product.name}
                </h3>

                {/* Brand */}
                <span style={{ fontSize: '0.8rem', color: '#8a7e72', fontWeight: 500 }}>
                  {product.brand}
                </span>

                {/* Rating */}
                <div className="flex items-center" style={{ gap: '0.4rem', marginTop: '0.15rem' }}>
                  <div className="flex" style={{ gap: 1 }}>
                    {[...Array(5)].map((_, i) => (
                      <svg key={i} width="12" height="12" viewBox="0 0 24 24" fill={i < Math.floor(product.rating) ? '#f59e0b' : '#e5e7eb'} stroke="none">
                        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                      </svg>
                    ))}
                  </div>
                  <span style={{ fontSize: '0.72rem', fontWeight: 700, color: '#2d2418' }}>{product.rating}</span>
                  <span style={{ fontSize: '0.68rem', color: '#8a7e72' }}>({product.reviews.toLocaleString()})</span>
                </div>

                {/* Price Row */}
                <div className="flex items-center" style={{ gap: '0.6rem', marginTop: '0.35rem' }}>
                  <span style={{ fontSize: '1.35rem', fontWeight: 900, color: '#2d2418', letterSpacing: '-0.03em' }}>
                    {product.price}
                  </span>
                  <span style={{ fontSize: '0.85rem', fontWeight: 600, color: '#ccc', textDecoration: 'line-through' }}>
                    {product.originalPrice}
                  </span>

                  {/* Add to Cart */}
                  <button style={{
                    marginLeft: 'auto',
                    width: 34, height: 34,
                    borderRadius: 12,
                    border: 'none',
                    background: '#2d2418',
                    color: '#fff',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    cursor: 'pointer',
                    transition: 'all 200ms ease',
                    transform: isHovered ? 'scale(1.1)' : 'scale(1)',
                  }}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
                      <line x1="3" y1="6" x2="21" y2="6" />
                      <path d="M16 10a4 4 0 0 1-8 0" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
