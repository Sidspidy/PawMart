import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getProducts } from '../../api/webApi';
import { Product } from '../../data/mockProducts';

export default function BestSellers() {
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    let active = true;
    const fetchBestsellers = async () => {
      try {
        const res = await getProducts({ sort: 'bestseller', limit: 6 });
        if (active) {
          setProducts(res.products);
          setLoading(false);
        }
      } catch (err) {
        console.error('Failed to load best sellers:', err);
        if (active) setLoading(false);
      }
    };
    fetchBestsellers();
    return () => {
      active = false;
    };
  }, []);

  if (loading) {
    return (
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.5rem', minHeight: '180px' }}>
        {[...Array(3)].map((_, i) => (
          <div key={i} className="animate-pulse" style={{ background: '#fff', borderRadius: 24, height: 160, border: '1px solid rgba(0,0,0,0.05)' }} />
        ))}
      </div>
    );
  }

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
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3" style={{ gap: '1.5rem' }}>
        {products.map((product) => {
          const isHovered = hoveredId === product.id;
          const badge = product.isBestseller ? '🔥 Hot' : product.isFeatured ? '💎 Premium' : '🐾 Choice';
          const badgeColor = product.isBestseller ? '#ef4444' : '#0ea5e9';

          return (
            <Link
              key={product.id}
              to={`/products/${product.slug}`}
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
                textDecoration: 'none',
                color: 'inherit',
                transform: isHovered ? 'translateY(-4px)' : 'translateY(0)',
                boxShadow: isHovered
                  ? '0 20px 40px rgba(0,0,0,0.08), 0 0 0 1px rgba(0,0,0,0.02)'
                  : '0 1px 4px rgba(0,0,0,0.04)',
              }}
            >
              {/* Product Image */}
              <div style={{
                width: 120,
                height: 120,
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
                  fontSize: '0.62rem', fontWeight: 800,
                  color: '#fff', backgroundColor: badgeColor,
                  padding: '2px 6px', borderRadius: 6,
                  letterSpacing: '0.02em',
                }}>
                  {badge}
                </span>

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
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = '/images/placeholder.png';
                  }}
                />
              </div>

              {/* Product Info */}
              <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', flex: 1, gap: '0.25rem', minWidth: 0 }}>
                {/* Category Tag */}
                <span style={{
                  fontSize: '0.68rem', fontWeight: 700,
                  color: '#8a7e72', textTransform: 'uppercase',
                  letterSpacing: '0.08em',
                }}>
                  {product.subcategory}
                </span>

                {/* Name */}
                <h3 style={{
                  fontSize: '0.98rem', fontWeight: 800,
                  color: isHovered ? 'var(--color-brand)' : '#2d2418', margin: 0,
                  fontFamily: 'var(--font-display)',
                  letterSpacing: '-0.01em',
                  lineHeight: 1.25,
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  transition: 'color 200ms ease'
                }}>
                  {product.name}
                </h3>

                {/* Brand */}
                <span style={{ fontSize: '0.75rem', color: '#8a7e72', fontWeight: 600 }}>
                  {product.brand || 'PawMart Premium'}
                </span>

                {/* Rating */}
                <div className="flex items-center" style={{ gap: '0.3rem', marginTop: '0.05rem' }}>
                  <div className="flex" style={{ gap: 1 }}>
                    {[...Array(5)].map((_, i) => (
                      <svg key={i} width="11" height="11" viewBox="0 0 24 24" fill={i < Math.floor(product.rating) ? '#f59e0b' : '#e5e7eb'} stroke="none">
                        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                      </svg>
                    ))}
                  </div>
                  <span style={{ fontSize: '0.7rem', fontWeight: 700, color: '#2d2418' }}>{product.rating}</span>
                  <span style={{ fontSize: '0.65rem', color: '#8a7e72' }}>({product.reviewCount})</span>
                </div>

                {/* Price Row */}
                <div className="flex items-center" style={{ gap: '0.5rem', marginTop: '0.2rem' }}>
                  <span style={{ fontSize: '1.2rem', fontWeight: 900, color: '#2d2418', letterSpacing: '-0.03em' }}>
                    ₹{product.price.toLocaleString('en-IN')}
                  </span>
                  {product.originalPrice && (
                    <span style={{ fontSize: '0.8rem', fontWeight: 600, color: '#ccc', textDecoration: 'line-through' }}>
                      ₹{product.originalPrice.toLocaleString('en-IN')}
                    </span>
                  )}
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
