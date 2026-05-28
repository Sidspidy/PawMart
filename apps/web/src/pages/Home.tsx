import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import ExploreTheirWorld from '../components/home/ExploreTheirWorld';
import BestSellers from '../components/home/BestSellers';
import LuckyPawRewards from '../components/home/LuckyPawRewards';
import HappyCustomers from '../components/home/HappyCustomers';

/* ── Top products (right side compact cards) ────────────── */
const topProducts = [
  {
    id: '01',
    title: 'Premium Dog Food',
    subtitle: 'Grain-free, all natural',
    image: '/images/hero/dog.png',
    color: '#d97706',
    lightBg: '#fef3c7',
    to: '/dogs',
  },
  {
    id: '02',
    title: 'Interactive Cat Toys',
    subtitle: 'Feather wand collection',
    image: '/images/hero/cat.png',
    color: '#a855f7',
    lightBg: '#f3e8ff',
    to: '/cats',
  },
  {
    id: '03',
    title: 'Tropical Aquarium',
    subtitle: 'Complete starter kit',
    image: '/images/hero/fish.png',
    color: '#0ea5e9',
    lightBg: '#e0f2fe',
    to: '/fish',
  },
];

/* ── Style tags ─────────────────────────────────────────── */
const styleTags = [
  'Premium Food', 'Organic Treats', 'Grooming',
  'Toys & Play', 'Health Care', 'Accessories',
  'Training', 'Beds & Comfort',
];

/* ── Shared card base ───────────────────────────────────── */
const cardBase: React.CSSProperties = {
  background: '#fff',
  borderRadius: 24,
  border: '1px solid rgba(0,0,0,0.05)',
  boxShadow: '0 1px 4px rgba(0,0,0,0.04)',
  overflow: 'hidden',
  transition: 'all 300ms cubic-bezier(0.16, 1, 0.3, 1)',
};

export default function Home() {
  const [hoveredProduct, setHoveredProduct] = useState<string | null>(null);
  const [hoveredTag, setHoveredTag] = useState<string | null>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setLoaded(true), 80);
    return () => clearTimeout(t);
  }, []);

  const enterAnim = (delay: number): React.CSSProperties => ({
    opacity: loaded ? 1 : 0,
    transform: loaded ? 'translateY(0)' : 'translateY(20px)',
    transition: `all 0.7s cubic-bezier(0.16, 1, 0.3, 1) ${delay}s`,
  });

  return (
    <div style={{ overflow: 'hidden' }}>
      {/* ════════════════════════════════════════════════════════
          HERO — CONNECTED BENTO GRID
          ════════════════════════════════════════════════════════ */}
      <section
        style={{
          maxWidth: 1280,
          margin: '0 auto',
          padding: '0.5rem 1.5rem 2.5rem',
        }}
      >
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 280px',
            gap: '1rem',
          }}
        >
          {/* ── LEFT COLUMN ── */}
          <div style={{ display: 'flex', flexDirection: 'column' }}>

            {/* 1. Main Hero Card */}
            <div
              style={{
                position: 'relative',
                padding: '3rem 3rem 2.5rem',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                background: '#fff',
                borderRadius: '24px 24px 24px 0', // Connects at bottom-left
                border: '1px solid rgba(0,0,0,0.05)',
                zIndex: 1,
                minHeight: 380,
                overflow: 'hidden',
                ...enterAnim(0.1),
              }}
            >
              {/* Decorative gradient orbs */}
              <div style={{
                position: 'absolute', top: -60, right: -60, width: 350, height: 350,
                borderRadius: '50%', background: 'radial-gradient(circle, rgba(249,115,22,0.07) 0%, transparent 65%)',
                pointerEvents: 'none', zIndex: 0,
              }} />
              <div style={{
                position: 'absolute', bottom: -50, left: -50, width: 250, height: 250,
                borderRadius: '50%', background: 'radial-gradient(circle, rgba(168,208,234,0.12) 0%, transparent 65%)',
                pointerEvents: 'none', zIndex: 0,
              }} />

              {/* Decorative pet backgrounds */}
              <div style={{
                position: 'absolute',
                bottom: -20,
                right: '-2%',
                width: '55%',
                height: '110%',
                pointerEvents: 'none',
                zIndex: 1,
              }}>
                <img
                  src="/images/hero/puppy.png"
                  alt="Puppy"
                  style={{
                    position: 'absolute',
                    bottom: 0,
                    right: 0,
                    height: '90%',
                    objectFit: 'contain',
                    zIndex: 2,
                  }}
                />
                <img
                  src="/images/hero/kitten.png"
                  alt="Kitten"
                  style={{
                    position: 'absolute',
                    bottom: '10%',
                    left: '10%',
                    height: '65%',
                    objectFit: 'contain',
                    zIndex: 1,
                  }}
                />
              </div>

              {/* Content */}
              <div style={{ position: 'relative', zIndex: 10 }}>
                {/* Badge */}
                <div
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.4rem',
                    padding: '0.4rem 1rem',
                    borderRadius: 9999,
                    background: '#fff',
                    boxShadow: '0 1px 6px rgba(0,0,0,0.05)',
                    fontSize: '0.8rem',
                    fontWeight: 600,
                    color: '#8a7e72',
                    marginBottom: '1.5rem',
                    width: 'fit-content',
                    border: '1px solid #f0ebe4',
                  }}
                >
                  <span>🐾</span> India's #1 Pet Store
                </div>

                <h1
                  style={{
                    fontFamily: 'var(--font-display)',
                    fontSize: 'clamp(2.2rem, 5vw, 3.5rem)',
                    fontWeight: 900,
                    lineHeight: 1.08,
                    color: '#2d2418',
                    marginBottom: '1.1rem',
                    letterSpacing: '-0.02em',
                    maxWidth: '65%',
                  }}
                >
                  Everything Your Pet{' '}
                  <span
                    style={{
                      background: 'linear-gradient(135deg, #f97316, #ea580c)',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      backgroundClip: 'text',
                    }}
                  >
                    Deserves
                  </span>
                </h1>

                <p
                  style={{
                    fontSize: '1.05rem',
                    color: '#6b5e52',
                    maxWidth: '55%',
                    lineHeight: 1.65,
                    marginBottom: '2rem',
                  }}
                >
                  Premium food, toys & accessories for dogs, cats, fish, birds and small pets — curated by pet lovers, delivered with care.
                </p>

                {/* CTAs */}
                <div style={{ display: 'flex', gap: '0.75rem' }}>
                  <Link
                    to="/products"
                    className="btn btn-primary"
                    style={{ padding: '0.75rem 2rem', fontSize: '0.95rem', borderRadius: 9999 }}
                  >
                    Shop Now →
                  </Link>
                  <Link
                    to="/dogs"
                    className="btn btn-outline"
                    style={{ padding: '0.75rem 2rem', fontSize: '0.95rem', borderRadius: 9999 }}
                  >
                    Explore
                  </Link>
                </div>
              </div>
            </div>

            {/* Bottom Row inside left column (Rating + Tags) */}
            <div style={{ display: 'flex' }}>

              {/* 2. Rating Card (Connected to Main Card) */}
              <div
                style={{
                  width: 250,
                  background: '#fff',
                  borderRadius: '0 0 24px 24px',
                  border: '1px solid rgba(0,0,0,0.05)',
                  borderTop: 'none', // Seamless connection
                  padding: '1.25rem 1.5rem',
                  marginTop: '-1px', // Overlaps bottom border of main card
                  position: 'relative',
                  zIndex: 2,
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  ...enterAnim(0.2),
                }}
              >
                <div>
                  <div style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: '1.5rem', color: '#2d2418', lineHeight: 1.1 }}>
                    4.9<span style={{ fontSize: '1rem', marginLeft: '2px' }}>⭐</span>
                  </div>
                  <div style={{ fontSize: '0.65rem', color: '#8a7e72', fontWeight: 600, marginTop: '0.1rem' }}>
                    50K+ Reviews
                  </div>
                </div>
                <div style={{ width: 1, height: 28, background: '#e5ddd4' }} />
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: '1.4rem', color: '#2d2418', lineHeight: 1.1 }}>
                    10K+
                  </div>
                  <div style={{ fontSize: '0.65rem', color: '#8a7e72', fontWeight: 600, marginTop: '0.1rem' }}>
                    Products
                  </div>
                </div>
              </div>

              {/* 3. Tags Row Card (Next to Rating) */}
              <div
                style={{
                  flex: 1,
                  background: '#fff',
                  borderRadius: '0 24px 24px 24px',
                  border: '1px solid rgba(0,0,0,0.05)',
                  padding: '1rem 1.5rem',
                  marginLeft: '1rem',
                  marginTop: '1rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '1.5rem',
                  ...enterAnim(0.3),
                }}
              >
                <div style={{ flexShrink: 0 }}>
                  <div style={{
                    fontFamily: 'var(--font-display)',
                    fontWeight: 800,
                    fontSize: '0.7rem',
                    textTransform: 'uppercase',
                    letterSpacing: '0.1em',
                    color: '#8a7e72',
                    marginBottom: '0.1rem',
                  }}>
                    Browse by
                  </div>
                  <div style={{
                    fontFamily: 'var(--font-display)',
                    fontWeight: 800,
                    fontSize: '1.05rem',
                    color: '#2d2418',
                  }}>
                    Popular Tags
                  </div>
                </div>

                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.45rem', flex: 1 }}>
                  {styleTags.map((tag) => (
                    <Link
                      key={tag}
                      to="/products"
                      style={{
                        padding: '0.35rem 0.8rem',
                        borderRadius: 9999,
                        border: `1.5px solid ${hoveredTag === tag ? 'var(--color-brand)' : '#e5ddd4'}`,
                        background: hoveredTag === tag ? 'var(--color-brand-light)' : 'transparent',
                        fontSize: '0.75rem',
                        fontWeight: 600,
                        color: hoveredTag === tag ? 'var(--color-brand-dark)' : '#6b5e52',
                        textDecoration: 'none',
                        transition: 'all 200ms ease',
                        whiteSpace: 'nowrap',
                      }}
                      onMouseEnter={() => setHoveredTag(tag)}
                      onMouseLeave={() => setHoveredTag(null)}
                    >
                      {tag}
                    </Link>
                  ))}
                </div>
              </div>

            </div>
          </div>

          {/* ── RIGHT COLUMN (Top Products & Quick Links) ── */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>

            {/* Top Products */}
            <div
              style={{
                ...cardBase,
                padding: '1rem',
                display: 'flex',
                flexDirection: 'column',
                gap: '0.6rem',
                ...enterAnim(0.25),
              }}
            >
              <div style={{
                fontFamily: 'var(--font-display)',
                fontWeight: 800,
                fontSize: '0.7rem',
                textTransform: 'uppercase',
                letterSpacing: '0.1em',
                color: '#8a7e72',
                padding: '0 0.25rem 0.1rem',
              }}>
                Top Products
              </div>

              {topProducts.map((product) => (
                <Link
                  key={product.id}
                  to={product.to}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.6rem',
                    padding: '0.5rem',
                    borderRadius: 16,
                    textDecoration: 'none',
                    background: hoveredProduct === product.id ? product.lightBg : '#fafafa',
                    border: `1.5px solid ${hoveredProduct === product.id ? product.color + '30' : 'transparent'}`,
                    transition: 'all 250ms ease',
                    cursor: 'pointer',
                  }}
                  onMouseEnter={() => setHoveredProduct(product.id)}
                  onMouseLeave={() => setHoveredProduct(null)}
                >
                  {/* Small product thumbnail */}
                  <div
                    style={{
                      width: 52,
                      height: 52,
                      borderRadius: 12,
                      overflow: 'hidden',
                      flexShrink: 0,
                      background: product.lightBg,
                    }}
                  >
                    <img
                      src={product.image}
                      alt={product.title}
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                        transition: 'transform 300ms ease',
                        transform: hoveredProduct === product.id ? 'scale(1.1)' : 'scale(1)',
                      }}
                    />
                  </div>

                  {/* Text */}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{
                      fontFamily: 'var(--font-display)',
                      fontWeight: 700,
                      fontSize: '0.78rem',
                      color: '#2d2418',
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                    }}>
                      {product.title}
                    </div>
                    <div style={{
                      fontSize: '0.65rem',
                      color: '#8a7e72',
                      marginTop: '0.05rem',
                    }}>
                      {product.subtitle}
                    </div>
                  </div>

                  {/* Number badge */}
                  <div
                    style={{
                      width: 26,
                      height: 26,
                      borderRadius: 8,
                      background: product.lightBg,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontFamily: 'var(--font-display)',
                      fontWeight: 800,
                      fontSize: '0.6rem',
                      color: product.color,
                      flexShrink: 0,
                    }}
                  >
                    {product.id}
                  </div>
                </Link>
              ))}
            </div>

            {/* Quick Links */}
            <div
              style={{
                ...cardBase,
                flex: 1,
                padding: '1rem',
                display: 'flex',
                flexDirection: 'column',
                gap: '0.5rem',
                ...enterAnim(0.3),
              }}
            >
              <div style={{
                fontFamily: 'var(--font-display)',
                fontWeight: 800,
                fontSize: '0.7rem',
                textTransform: 'uppercase',
                letterSpacing: '0.1em',
                color: '#8a7e72',
                padding: '0 0.25rem',
              }}>
                Quick Links
              </div>

              {[
                { icon: '🎁', label: 'New Arrivals', color: '#ea580c', bg: '#fff1e6' },
                { icon: '🔥', label: 'Best Sellers', color: '#d97706', bg: '#fef3c7' },
                { icon: '💰', label: 'Deals & Offers', color: '#16a34a', bg: '#dcfce7' },
              ].map((item) => (
                <Link
                  key={item.label}
                  to="/products"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    padding: '0.5rem 0.6rem',
                    borderRadius: 12,
                    background: item.bg,
                    textDecoration: 'none',
                    transition: 'all 200ms ease',
                  }}
                >
                  <span style={{ fontSize: '1rem' }}>{item.icon}</span>
                  <span style={{
                    fontFamily: 'var(--font-display)',
                    fontWeight: 700,
                    fontSize: '0.75rem',
                    color: item.color,
                  }}>
                    {item.label}
                  </span>
                  <span style={{ marginLeft: 'auto', fontSize: '0.7rem', color: item.color, opacity: 0.6 }}>→</span>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════
          EXPLORE THEIR WORLD
          ════════════════════════════════════════════════════════ */}
      <section style={{ padding: '0 1.5rem 3.5rem', maxWidth: 1280, margin: '0 auto' }}>
        <ExploreTheirWorld />
      </section>

      {/* ════════════════════════════════════════════════════════
          BEST SELLERS THIS WEEK
          ════════════════════════════════════════════════════════ */}
      <section style={{ padding: '0 1.5rem 3.5rem', maxWidth: 1280, margin: '0 auto' }}>
        <BestSellers />
      </section>

      {/* ════════════════════════════════════════════════════════
          LUCKY PAW REWARDS
          ════════════════════════════════════════════════════════ */}
      <section style={{ padding: '0 1.5rem 3.5rem', maxWidth: 1280, margin: '0 auto' }}>
        <LuckyPawRewards />
      </section>
      {/* ════════════════════════════════════════════════════════
          PROMO BANNER
          ════════════════════════════════════════════════════════ */}
      <section style={{ padding: '0 1.5rem 3.5rem', maxWidth: 1280, margin: '0 auto' }}>
        <div
          style={{
            background: 'linear-gradient(135deg, #f97316, #ea580c)',
            borderRadius: 24,
            padding: '2.5rem 2.5rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '1.5rem',
            position: 'relative',
            overflow: 'hidden',
            ...enterAnim(0.4),
          }}
        >
          <div style={{
            position: 'absolute', top: -50, right: -50, width: 220, height: 220,
            borderRadius: '50%', background: 'rgba(255,255,255,0.07)', pointerEvents: 'none',
          }} />
          <div style={{
            position: 'absolute', bottom: -30, left: '25%', width: 160, height: 160,
            borderRadius: '50%', background: 'rgba(255,255,255,0.05)', pointerEvents: 'none',
          }} />

          <div style={{ position: 'relative', zIndex: 1 }}>
            <div style={{ fontSize: '0.8rem', fontWeight: 600, color: 'rgba(255,255,255,0.8)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.3rem' }}>
              Limited Offer
            </div>
            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(1.3rem, 3vw, 1.8rem)', fontWeight: 900, color: '#fff', lineHeight: 1.25, marginBottom: '0.3rem' }}>
              20% Off Your First Order! 🎉
            </h3>
            <p style={{ color: 'rgba(255,255,255,0.85)', fontSize: '0.9rem' }}>
              Use code{' '}
              <span style={{ fontWeight: 800, background: 'rgba(255,255,255,0.2)', padding: '0.1rem 0.5rem', borderRadius: 6 }}>
                PAWLOVE
              </span>{' '}
              at checkout
            </p>
          </div>

          <Link
            to="/products"
            style={{
              position: 'relative', zIndex: 1,
              display: 'inline-flex', alignItems: 'center', gap: '0.4rem',
              padding: '0.75rem 1.75rem', borderRadius: 9999,
              background: '#fff', color: '#ea580c',
              fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '0.9rem',
              textDecoration: 'none',
              boxShadow: '0 4px 16px rgba(0,0,0,0.12)',
              transition: 'all 250ms ease',
            }}
          >
            Claim Now →
          </Link>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════
          FEATURES BAR
          ════════════════════════════════════════════════════════ */}
      <section style={{ maxWidth: 1280, margin: '0 auto', padding: '0 1.5rem 4rem' }}>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            gap: '1rem',
          }}
        >
          {[
            { icon: '🚚', title: 'Free Delivery', desc: 'On orders over ₹499' },
            { icon: '⭐', title: 'Top Quality', desc: 'Vet-approved products' },
            { icon: '🔄', title: 'Easy Returns', desc: '7-day return policy' },
            { icon: '🎁', title: 'Reward Points', desc: 'Earn with every order' },
          ].map((feat) => (
            <div
              key={feat.title}
              style={{
                ...cardBase,
                padding: '1.25rem 1rem',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                textAlign: 'center',
                gap: '0.35rem',
              }}
            >
              <span style={{ fontSize: '1.5rem' }}>{feat.icon}</span>
              <span style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '0.82rem', color: '#2d2418' }}>
                {feat.title}
              </span>
              <span style={{ fontSize: '0.75rem', color: '#8a7e72' }}>{feat.desc}</span>
            </div>
          ))}
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════
          HAPPY CUSTOMERS (WITH FOOTER IMAGE BACKDROP)
          ════════════════════════════════════════════════════════ */}
      <section style={{ width: '100%', margin: 0, padding: 0 }}>
        <HappyCustomers />
      </section>
    </div>
  );
}
