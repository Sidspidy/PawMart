import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import {
  Package, Heart, User, Star, Zap, Tag, MapPin, LogOut, ChevronRight, ShoppingBag
} from 'lucide-react';
import { useAuthStore } from '../../store/auth.store';

const NAV_ITEMS = [
  { to: '/dashboard/orders',   label: 'My Orders',          icon: Package,  desc: 'Track your orders' },
  { to: '/dashboard/wishlist', label: 'Wishlist',            icon: Heart,    desc: 'Saved items' },
  { to: '/dashboard/profile',  label: 'Profile & Addresses', icon: User,     desc: 'Personal info' },
  { to: '/dashboard/points',   label: 'Points & Rewards',    icon: Star,     desc: 'Your PawPoints' },
  { to: '/dashboard/spin',     label: 'Spin Wheel',          icon: Zap,      desc: 'Daily lucky spin' },
  { to: '/dashboard/coupons',  label: 'Coupons & Gifts',     icon: Tag,      desc: 'Deals for you' },
];

export default function DashboardLayout() {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const displayName = user?.name || 'Pet Lover';
  const displayEmail = user?.email || 'guest@pawmart.in';
  const avatarLetter = displayName.charAt(0).toUpperCase();

  const s = {
    page: {
      minHeight: '100vh',
      backgroundColor: '#f7f2ec',
      paddingTop: '2rem',
      paddingBottom: '4rem',
    } as React.CSSProperties,
    container: {
      width: '100%',
      maxWidth: '1200px',
      margin: '0 auto',
      padding: '0 1.5rem',
      display: 'grid',
      gridTemplateColumns: '280px 1fr',
      gap: '1.75rem',
      alignItems: 'start',
    } as React.CSSProperties,
    // Sidebar
    sidebar: {
      position: 'sticky' as const,
      top: '100px',
      display: 'flex',
      flexDirection: 'column' as const,
      gap: '1rem',
    } as React.CSSProperties,
    profileCard: {
      backgroundColor: '#ffffff',
      borderRadius: '20px',
      border: '1px solid #e5ddd4',
      padding: '1.5rem',
      boxShadow: '0 4px 16px rgba(0,0,0,0.06)',
      background: 'linear-gradient(135deg, #ffffff 0%, #fff7ed 100%)',
    } as React.CSSProperties,
    avatarWrap: {
      width: '60px',
      height: '60px',
      borderRadius: '50%',
      background: 'linear-gradient(135deg, #f97316, #ea580c)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: '1.5rem',
      fontWeight: 900,
      color: '#ffffff',
      fontFamily: "'Nunito', sans-serif",
      marginBottom: '0.875rem',
      boxShadow: '0 4px 12px rgba(249,115,22,0.35)',
    } as React.CSSProperties,
    profileName: {
      fontSize: '1rem',
      fontWeight: 800,
      color: '#2d2418',
      fontFamily: "'Nunito', sans-serif",
      marginBottom: '0.2rem',
    } as React.CSSProperties,
    profileEmail: {
      fontSize: '0.75rem',
      color: '#8a7e72',
      marginBottom: '0.875rem',
    } as React.CSSProperties,
    pointsBadge: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: '0.375rem',
      padding: '0.3rem 0.75rem',
      borderRadius: '99px',
      backgroundColor: '#fff7ed',
      border: '1px solid #fed7aa',
      fontSize: '0.78rem',
      fontWeight: 700,
      color: '#c2410c',
    } as React.CSSProperties,
    navCard: {
      backgroundColor: '#ffffff',
      borderRadius: '20px',
      border: '1px solid #e5ddd4',
      overflow: 'hidden',
      boxShadow: '0 4px 16px rgba(0,0,0,0.06)',
    } as React.CSSProperties,
    navHeader: {
      padding: '0.875rem 1.25rem',
      borderBottom: '1px solid #f0ebe4',
      fontSize: '0.72rem',
      fontWeight: 700,
      color: '#8a7e72',
      textTransform: 'uppercase' as const,
      letterSpacing: '0.08em',
    } as React.CSSProperties,
    logoutBtn: {
      display: 'flex',
      alignItems: 'center',
      gap: '0.75rem',
      width: '100%',
      padding: '0.875rem 1.25rem',
      border: 'none',
      background: 'transparent',
      cursor: 'pointer',
      color: '#ef4444',
      fontSize: '0.875rem',
      fontWeight: 600,
      transition: 'background 0.2s',
      textAlign: 'left' as const,
    } as React.CSSProperties,
  };

  return (
    <div style={s.page}>
      <div style={s.container}>
        {/* ── Sidebar ──────────────────────────── */}
        <aside style={s.sidebar}>
          {/* Profile card */}
          <div style={s.profileCard}>
            <div style={s.avatarWrap}>
              {user?.avatar ? (
                <img
                  src={user.avatar}
                  alt={displayName}
                  style={{
                    width: '100%',
                    height: '100%',
                    borderRadius: '50%',
                    objectFit: 'cover',
                  }}
                />
              ) : (
                avatarLetter
              )}
            </div>
            <div style={s.profileName}>{displayName}</div>
            <div style={s.profileEmail}>{displayEmail}</div>
            <div style={s.pointsBadge}>
              <Star size={12} fill="#f97316" color="#f97316" />
              {(user?.pointsBalance || 0).toLocaleString('en-IN')} PawPoints
            </div>
          </div>

          {/* Nav card */}
          <div style={s.navCard}>
            <div style={s.navHeader}>My Account</div>
            {NAV_ITEMS.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  style={({ isActive }) => ({
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.75rem',
                    padding: '0.875rem 1.25rem',
                    borderBottom: '1px solid #f0ebe4',
                    textDecoration: 'none',
                    backgroundColor: isActive ? '#fff7ed' : 'transparent',
                    borderLeft: `3px solid ${isActive ? '#f97316' : 'transparent'}`,
                    transition: 'all 0.2s',
                    color: 'inherit',
                  })}
                >
                  {({ isActive }) => (
                    <>
                      <div style={{
                        width: '34px', height: '34px', borderRadius: '10px',
                        backgroundColor: isActive ? '#fff1e6' : '#f7f2ec',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        flexShrink: 0, transition: 'all 0.2s',
                      }}>
                        <Icon size={16} color={isActive ? '#f97316' : '#8a7e72'} />
                      </div>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: '0.875rem', fontWeight: isActive ? 700 : 500, color: isActive ? '#2d2418' : '#4a4a4a', fontFamily: "'Nunito', sans-serif" }}>
                          {item.label}
                        </div>
                        <div style={{ fontSize: '0.7rem', color: '#8a7e72' }}>{item.desc}</div>
                      </div>
                      <ChevronRight size={14} color={isActive ? '#f97316' : '#c0b8b0'} />
                    </>
                  )}
                </NavLink>
              );
            })}

            {/* Logout */}
            <button style={s.logoutBtn} onClick={handleLogout}>
              <div style={{ width: '34px', height: '34px', borderRadius: '10px', backgroundColor: '#fef2f2', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <LogOut size={16} color="#ef4444" />
              </div>
              <span>Sign Out</span>
            </button>
          </div>

          {/* Shop CTA */}
          <NavLink
            to="/products"
            style={{
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem',
              padding: '0.75rem', borderRadius: '16px',
              background: 'linear-gradient(135deg, #f97316, #ea580c)',
              color: '#ffffff', fontWeight: 800, fontSize: '0.85rem',
              fontFamily: "'Nunito', sans-serif", textDecoration: 'none',
              boxShadow: '0 4px 14px rgba(249,115,22,0.3)',
            }}
          >
            <ShoppingBag size={15} /> Continue Shopping
          </NavLink>
        </aside>

        {/* ── Page Content ─────────────────────── */}
        <main>
          <Outlet />
        </main>
      </div>
    </div>
  );
}
