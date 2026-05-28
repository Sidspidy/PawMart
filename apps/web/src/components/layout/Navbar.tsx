import { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCartStore } from '../../store/cart.store';
import { useAuthStore } from '../../store/auth.store';

/* ── SVG Icon Components ──────────────────────────────────── */

const SearchIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="8" />
    <line x1="21" y1="21" x2="16.65" y2="16.65" />
  </svg>
);

const HeartIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
  </svg>
);

const CartIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="9" cy="21" r="1" />
    <circle cx="20" cy="21" r="1" />
    <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
  </svg>
);

const ProfileIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
    <circle cx="12" cy="7" r="4" />
  </svg>
);

const PawIcon = () => (
  <svg width="24" height="24" viewBox="0 0 64 64" fill="var(--color-brand)">
    <ellipse cx="22" cy="14" rx="7" ry="9" />
    <ellipse cx="42" cy="14" rx="7" ry="9" />
    <ellipse cx="11" cy="30" rx="6.5" ry="8" />
    <ellipse cx="53" cy="30" rx="6.5" ry="8" />
    <path d="M32 56c-12 0-20-10-20-18 0-6 4-10 8-10 3 0 6 1 8 4 2 3 2 3 4 3s2 0 4-3c2-3 5-4 8-4 4 0 8 4 8 10 0 8-8 18-20 18z" />
  </svg>
);

/* ── Navbar Component ─────────────────────────────────────── */

export default function Navbar() {
  const itemCount = useCartStore((s) => s.itemCount());
  const toggleDrawer = useCartStore((s) => s.toggleDrawer);
  const { isAuthenticated } = useAuthStore();
  const [hoveredLink, setHoveredLink] = useState<string | null>(null);
  const [hoveredIcon, setHoveredIcon] = useState<string | null>(null);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const searchInputRef = useRef<HTMLInputElement>(null);
  const searchContainerRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  const categories = [
    { label: 'Dogs', to: '/dogs' },
    { label: 'Cats', to: '/cats' },
    { label: 'Fish', to: '/fish' },
    { label: 'Birds', to: '/birds' },
    { label: 'Small Pets', to: '/small-pets' },
  ];

  /* Focus input when search opens */
  useEffect(() => {
    let t: NodeJS.Timeout | undefined;
    if (searchOpen) {
      // Slight delay so the width transition starts first, then focus
      t = setTimeout(() => searchInputRef.current?.focus(), 150);
    }
    return () => {
      if (t) clearTimeout(t);
    };
  }, [searchOpen]);

  /* Close search on click outside */
  useEffect(() => {
    if (!searchOpen) return;
    const handler = (e: MouseEvent) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(e.target as Node)) {
        setSearchOpen(false);
        setSearchQuery('');
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [searchOpen]);

  /* Close on Escape */
  useEffect(() => {
    if (!searchOpen) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setSearchOpen(false);
        setSearchQuery('');
      }
    };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [searchOpen]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchOpen(false);
      setSearchQuery('');
    }
  };

  /* Shared pill style for left and right (even sizing) */
  const pillStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    background: '#ffffff',
    borderRadius: 9999,
    boxShadow: '0 1px 8px rgba(0,0,0,0.06)',
    border: '1px solid rgba(0,0,0,0.04)',
    flexShrink: 0,
    height: 48,
  };

  const iconBtnStyle = (key: string): React.CSSProperties => ({
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '0.05rem',
    padding: '0.3rem 0.6rem',
    borderRadius: 9999,
    color: hoveredIcon === key ? 'var(--color-brand)' : '#555',
    background: hoveredIcon === key ? 'var(--color-brand-light)' : 'transparent',
    transition: 'all 200ms ease',
    textDecoration: 'none',
    border: 'none',
    cursor: 'pointer',
  });

  const iconLabelStyle: React.CSSProperties = {
    fontSize: '0.55rem',
    fontWeight: 600,
    fontFamily: 'var(--font-body)',
  };

  return (
    <header
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 100,
        background: 'transparent',
        padding: '0.9rem 1.5rem',
      }}
    >
      <nav
        style={{
          maxWidth: 1280,
          margin: '0 auto',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '1rem',
        }}
      >
        {/* ── Logo Pill (Left) ── */}
        <Link
          to="/"
          style={{
            ...pillStyle,
            gap: '0.5rem',
            padding: '0 1.25rem',
            textDecoration: 'none',
            transition: 'box-shadow 250ms ease',
          }}
        >
          <PawIcon />
          <span
            style={{
              fontFamily: 'var(--font-display)',
              fontWeight: 800,
              fontSize: '1.05rem',
              color: '#2d2418',
            }}
          >
            PawMart
          </span>
        </Link>

        {/* ── Center Category Pill (separate navbar) ── */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.2rem',
            background: '#ffffff',
            borderRadius: 9999,
            padding: '0.3rem 0.4rem',
            boxShadow: '0 1px 8px rgba(0,0,0,0.06)',
            border: '1px solid rgba(0,0,0,0.04)',
          }}
        >
          {categories.map((cat) => (
            <Link
              key={cat.to}
              to={cat.to}
              style={{
                fontFamily: 'var(--font-body)',
                fontWeight: 600,
                fontSize: '0.88rem',
                color: hoveredLink === cat.to ? 'var(--color-brand)' : '#4a4a4a',
                textDecoration: 'none',
                padding: '0.42rem 1rem',
                borderRadius: 9999,
                transition: 'all 200ms ease',
                whiteSpace: 'nowrap',
                background: hoveredLink === cat.to ? 'var(--color-brand-light)' : 'transparent',
              }}
              onMouseEnter={() => setHoveredLink(cat.to)}
              onMouseLeave={() => setHoveredLink(null)}
            >
              {cat.label}
            </Link>
          ))}
        </div>

        {/* ── Right Pill (with smooth expanding search) ── */}
        <div
          ref={searchContainerRef}
          style={{
            ...pillStyle,
            position: 'relative',
            padding: '0 0.35rem',
            width: searchOpen ? 360 : 'auto',
            transition: 'width 400ms cubic-bezier(0.4, 0, 0.2, 1), box-shadow 400ms cubic-bezier(0.4, 0, 0.2, 1)',
            boxShadow: searchOpen
              ? '0 2px 16px rgba(249,115,22,0.12), 0 1px 8px rgba(0,0,0,0.06)'
              : '0 1px 8px rgba(0,0,0,0.06)',
            overflow: 'hidden',
          }}
        >
          {/* Icons container - slides out when search opens */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0',
              opacity: searchOpen ? 0 : 1,
              transform: searchOpen ? 'scale(0.9)' : 'scale(1)',
              transition: 'opacity 250ms ease, transform 250ms ease',
              pointerEvents: searchOpen ? 'none' : 'auto',
              position: searchOpen ? 'absolute' : 'relative',
            }}
          >
            {/* Search */}
            <button
              onClick={() => setSearchOpen(true)}
              style={iconBtnStyle('search')}
              onMouseEnter={() => setHoveredIcon('search')}
              onMouseLeave={() => setHoveredIcon(null)}
            >
              <SearchIcon />
              <span style={iconLabelStyle}>Search</span>
            </button>

            {/* Wishlist */}
            <Link
              to="/dashboard/wishlist"
              style={iconBtnStyle('wishlist')}
              onMouseEnter={() => setHoveredIcon('wishlist')}
              onMouseLeave={() => setHoveredIcon(null)}
            >
              <HeartIcon />
              <span style={iconLabelStyle}>Wishlist</span>
            </Link>

            {/* Cart */}
            <Link
              to="/cart"
              style={{ ...iconBtnStyle('cart'), position: 'relative' }}
              onMouseEnter={() => setHoveredIcon('cart')}
              onMouseLeave={() => setHoveredIcon(null)}
            >
              <CartIcon />
              {itemCount > 0 && (
                <span
                  style={{
                    position: 'absolute',
                    top: 0,
                    right: 2,
                    background: 'var(--color-brand)',
                    color: '#fff',
                    borderRadius: '50%',
                    width: 16,
                    height: 16,
                    fontSize: '0.5rem',
                    fontWeight: 700,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    border: '2px solid #fff',
                  }}
                >
                  {itemCount}
                </span>
              )}
              <span style={iconLabelStyle}>Cart</span>
            </Link>

            {/* Profile */}
            <Link
              to={isAuthenticated ? '/dashboard/orders' : '/login'}
              style={iconBtnStyle('profile')}
              onMouseEnter={() => setHoveredIcon('profile')}
              onMouseLeave={() => setHoveredIcon(null)}
            >
              <ProfileIcon />
              <span style={iconLabelStyle}>
                {isAuthenticated ? 'Account' : 'Profile'}
              </span>
            </Link>
          </div>

          {/* Search form - slides in when search opens */}
          <form
            onSubmit={handleSearchSubmit}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              width: '100%',
              padding: '0 0.5rem',
              opacity: searchOpen ? 1 : 0,
              transform: searchOpen ? 'translateX(0)' : 'translateX(20px)',
              transition: 'opacity 300ms ease 100ms, transform 300ms ease 100ms',
              pointerEvents: searchOpen ? 'auto' : 'none',
              position: searchOpen ? 'relative' : 'absolute',
              left: 0,
              top: 0,
              height: '100%',
            }}
          >
            <div style={{ flexShrink: 0, color: '#8a7e72', display: 'flex' }}>
              <SearchIcon />
            </div>
            <input
              ref={searchInputRef}
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search products..."
              style={{
                flex: 1,
                border: 'none',
                outline: 'none',
                background: 'transparent',
                fontFamily: 'var(--font-body)',
                fontSize: '0.88rem',
                color: '#2d2418',
                padding: '0.3rem 0',
                minWidth: 0,
              }}
            />
            <button
              type="button"
              onClick={() => {
                setSearchOpen(false);
                setSearchQuery('');
              }}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: 28,
                height: 28,
                padding: 0,
                borderRadius: 9999,
                background: '#f0ebe4',
                border: 'none',
                cursor: 'pointer',
                color: '#8a7e72',
                transition: 'all 200ms ease',
                flexShrink: 0,
              }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          </form>
        </div>
      </nav>
    </header>
  );
}
