import { Outlet, NavLink } from 'react-router-dom';

const NAV_ITEMS = [
  { label: 'Dashboard', path: '/dashboard', icon: '📊' },
  { label: 'Products', path: '/products', icon: '📦' },
  { label: 'Categories', path: '/categories', icon: '🏷️' },
  { label: 'Orders', path: '/orders', icon: '🛒' },
  { label: 'Customers', path: '/customers', icon: '👥' },
  { label: 'Coupons', path: '/coupons', icon: '🎫' },
  { label: 'Spin Config', path: '/spin', icon: '🎡' },
  { label: 'Roles', path: '/settings/roles', icon: '🔑' },
];

export default function AdminLayout() {
  return (
    <div className="admin-layout">
      {/* Sidebar */}
      <aside className="admin-sidebar">
        <div style={{ padding: '1.25rem 1.5rem', borderBottom: '1px solid var(--color-border)' }}>
          <span style={{ fontWeight: 800, fontSize: '1.15rem', color: 'var(--color-brand)' }}>🐾 PawMart</span>
          <div style={{ fontSize: '0.7rem', color: 'var(--color-text-muted)', marginTop: '2px' }}>Admin Console</div>
        </div>
        <nav style={{ padding: '1rem 0.75rem', flex: 1 }}>
          {NAV_ITEMS.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              style={({ isActive }) => ({
                display: 'flex', alignItems: 'center', gap: '0.75rem',
                padding: '0.6rem 0.75rem',
                borderRadius: 'var(--radius-sm)',
                marginBottom: '2px',
                fontSize: '0.875rem',
                fontWeight: isActive ? 600 : 400,
                background: isActive ? 'rgba(249,115,22,0.12)' : 'transparent',
                color: isActive ? 'var(--color-brand)' : 'var(--color-text-muted)',
                transition: 'all 0.15s',
              })}
            >
              <span>{item.icon}</span>
              <span>{item.label}</span>
            </NavLink>
          ))}
        </nav>
      </aside>

      {/* Main */}
      <div className="admin-main">
        <header className="admin-topbar">
          <span style={{ marginLeft: 'auto', fontSize: '0.875rem', color: 'var(--color-text-muted)' }}>
            PawMart Admin
          </span>
        </header>
        <main className="admin-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
