import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer style={{ marginTop: 'auto', position: 'relative', overflow: 'hidden' }}>

      {/* ── Dark Footer Content ────────────────────────────── */}
      <div style={{
        background: '#1a1510',
        paddingTop: '4.5rem',
        position: 'relative',
      }}>

        {/* ── Main Footer Grid ─────────────────────────────── */}
        <div style={{
          maxWidth: 1280, margin: '0 auto', padding: '0 1.5rem',
        }}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1.8fr 1fr 1fr 1fr 1.5fr',
            gap: '2.5rem',
            paddingTop: '1.5rem',
            paddingBottom: '4rem',
          }}>

            {/* Column 1: Brand */}
            <div>
              <div style={{
                fontFamily: 'var(--font-display)', fontWeight: 900,
                fontSize: '1.6rem', color: '#f97316',
                marginBottom: '1rem',
                display: 'flex', alignItems: 'center', gap: '0.5rem',
              }}>
                🐾 PawMart
              </div>
              <p style={{
                color: 'rgba(255,255,255,0.5)', fontSize: '0.88rem',
                lineHeight: 1.7, marginBottom: '1.25rem', maxWidth: 280,
              }}>
                Premium pet supplies for happy pets and happy humans. From food to toys, we've got every paw covered.
              </p>

              {/* Social Icons */}
              <div style={{ display: 'flex', gap: '0.75rem' }}>
                {[
                  { icon: 'M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z', label: 'Twitter' },
                  { icon: 'M22.675 0h-21.35c-.732 0-1.325.593-1.325 1.325v21.351c0 .731.593 1.324 1.325 1.324h11.495v-9.294h-3.128v-3.622h3.128v-2.671c0-3.1 1.893-4.788 4.659-4.788 1.325 0 2.463.099 2.795.143v3.24l-1.918.001c-1.504 0-1.795.715-1.795 1.763v2.313h3.587l-.467 3.622h-3.12v9.293h6.116c.73 0 1.323-.593 1.323-1.325v-21.35c0-.732-.593-1.325-1.325-1.325z', label: 'Facebook' },
                  { icon: 'M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z', label: 'Instagram' },
                ].map((social, i) => (
                  <a
                    key={i}
                    href="#"
                    aria-label={social.label}
                    style={{
                      width: 38, height: 38, borderRadius: '50%',
                      border: '1.5px solid rgba(255,255,255,0.15)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      transition: 'all 250ms ease',
                      color: 'rgba(255,255,255,0.5)',
                    }}
                    onMouseEnter={(e) => {
                      (e.currentTarget as HTMLElement).style.borderColor = '#f97316';
                      (e.currentTarget as HTMLElement).style.color = '#f97316';
                      (e.currentTarget as HTMLElement).style.background = 'rgba(249,115,22,0.1)';
                    }}
                    onMouseLeave={(e) => {
                      (e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,255,255,0.15)';
                      (e.currentTarget as HTMLElement).style.color = 'rgba(255,255,255,0.5)';
                      (e.currentTarget as HTMLElement).style.background = 'transparent';
                    }}
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                      <path d={social.icon} />
                    </svg>
                  </a>
                ))}
              </div>
            </div>

            {/* Column 2: Shop */}
            <div>
              <h4 style={{
                fontFamily: 'var(--font-display)', fontWeight: 800,
                fontSize: '0.9rem', color: '#fff',
                marginBottom: '1.25rem', letterSpacing: '0.02em',
              }}>
                Shop
              </h4>
              {['Dogs', 'Cats', 'Fish', 'Birds', 'Small Pets'].map((item) => (
                <Link
                  key={item}
                  to={`/${item.toLowerCase().replace(' ', '-')}`}
                  style={{
                    display: 'block', color: 'rgba(255,255,255,0.45)',
                    fontSize: '0.88rem', marginBottom: '0.7rem',
                    textDecoration: 'none', transition: 'color 200ms ease',
                  }}
                  onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.color = '#f97316'; }}
                  onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.color = 'rgba(255,255,255,0.45)'; }}
                >
                  {item}
                </Link>
              ))}
            </div>

            {/* Column 3: Company */}
            <div>
              <h4 style={{
                fontFamily: 'var(--font-display)', fontWeight: 800,
                fontSize: '0.9rem', color: '#fff',
                marginBottom: '1.25rem', letterSpacing: '0.02em',
              }}>
                Company
              </h4>
              {['About Us', 'Careers', 'Our Blog', 'Press Kit', 'Affiliates'].map((item) => (
                <Link
                  key={item}
                  to="#"
                  style={{
                    display: 'block', color: 'rgba(255,255,255,0.45)',
                    fontSize: '0.88rem', marginBottom: '0.7rem',
                    textDecoration: 'none', transition: 'color 200ms ease',
                  }}
                  onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.color = '#f97316'; }}
                  onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.color = 'rgba(255,255,255,0.45)'; }}
                >
                  {item}
                </Link>
              ))}
            </div>

            {/* Column 4: Support */}
            <div>
              <h4 style={{
                fontFamily: 'var(--font-display)', fontWeight: 800,
                fontSize: '0.9rem', color: '#fff',
                marginBottom: '1.25rem', letterSpacing: '0.02em',
              }}>
                Support
              </h4>
              {['Contact Us', 'Help Center', 'Privacy Policy', 'Terms & Conditions', 'Return Policy'].map((item) => (
                <Link
                  key={item}
                  to="#"
                  style={{
                    display: 'block', color: 'rgba(255,255,255,0.45)',
                    fontSize: '0.88rem', marginBottom: '0.7rem',
                    textDecoration: 'none', transition: 'color 200ms ease',
                  }}
                  onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.color = '#f97316'; }}
                  onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.color = 'rgba(255,255,255,0.45)'; }}
                >
                  {item}
                </Link>
              ))}
            </div>

            {/* Column 5: Contact Info */}
            <div>
              <h4 style={{
                fontFamily: 'var(--font-display)', fontWeight: 800,
                fontSize: '0.9rem', color: '#fff',
                marginBottom: '1.25rem', letterSpacing: '0.02em',
              }}>
                PawMart HQ
              </h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {[
                  { icon: '📍', text: '42 Pet Paradise Lane, Bengaluru, India' },
                  { icon: '📞', text: '+91 98765 43210' },
                  { icon: '✉️', text: 'support@pawmart.in' },
                  { icon: '🕐', text: 'Mon – Sun, 9AM – 9PM' },
                ].map((info, i) => (
                  <div key={i} style={{
                    display: 'flex', alignItems: 'flex-start', gap: '0.6rem',
                    color: 'rgba(255,255,255,0.45)', fontSize: '0.85rem',
                    lineHeight: 1.5,
                  }}>
                    <span style={{ fontSize: '0.9rem', flexShrink: 0, marginTop: '0.1rem' }}>{info.icon}</span>
                    <span>{info.text}</span>
                  </div>
                ))}
              </div>

              {/* Newsletter mini */}
              <div style={{ marginTop: '1.25rem' }}>
                <span style={{ fontSize: '0.78rem', fontWeight: 700, color: 'rgba(255,255,255,0.6)', display: 'block', marginBottom: '0.5rem' }}>
                  Join our newsletter 🐾
                </span>
                <div style={{
                  display: 'flex', gap: '0.5rem',
                }}>
                  <input
                    type="email"
                    placeholder="your@email.com"
                    style={{
                      flex: 1, padding: '0.6rem 1rem',
                      borderRadius: 12, border: '1.5px solid rgba(255,255,255,0.1)',
                      background: 'rgba(255,255,255,0.05)',
                      color: '#fff', fontSize: '0.82rem',
                      outline: 'none',
                      fontFamily: 'var(--font-body)',
                    }}
                  />
                  <button style={{
                    padding: '0.6rem 1.2rem', borderRadius: 12,
                    border: 'none', background: '#f97316', color: '#fff',
                    fontWeight: 800, fontSize: '0.8rem', cursor: 'pointer',
                    fontFamily: 'var(--font-display)',
                    transition: 'all 200ms ease',
                  }}>
                    Join
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* ── Bottom Bar ──────────────────────────────────── */}
          <div style={{
            borderTop: '1px solid rgba(255,255,255,0.08)',
            paddingTop: '1.5rem', paddingBottom: '1.5rem',
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            flexWrap: 'wrap', gap: '1rem',
          }}>
            {/* Left: Copyright */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
              <span style={{
                fontFamily: 'var(--font-display)', fontWeight: 900,
                fontSize: '1rem', color: '#f97316',
              }}>
                🐾 PawMart
              </span>
              <span style={{ fontSize: '0.78rem', color: 'rgba(255,255,255,0.3)' }}>
                © {new Date().getFullYear()} PawMart. All rights reserved.
              </span>
            </div>

            {/* Center: Legal Links */}
            <div style={{ display: 'flex', gap: '1.5rem' }}>
              {['Privacy Policy', 'Terms of Service', 'Cookie Policy'].map((item) => (
                <Link
                  key={item}
                  to="#"
                  style={{
                    fontSize: '0.78rem', color: 'rgba(255,255,255,0.3)',
                    textDecoration: 'none', transition: 'color 200ms ease',
                  }}
                  onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.color = 'rgba(255,255,255,0.6)'; }}
                  onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.color = 'rgba(255,255,255,0.3)'; }}
                >
                  {item}
                </Link>
              ))}
            </div>

            {/* Right: Payment Icons */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
              {['💳', '🏦', '📱'].map((icon, i) => (
                <span key={i} style={{
                  width: 36, height: 24, borderRadius: 6,
                  background: 'rgba(255,255,255,0.06)',
                  border: '1px solid rgba(255,255,255,0.08)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '0.8rem',
                }}>
                  {icon}
                </span>
              ))}
              <span style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.25)', marginLeft: '0.5rem' }}>
                Made with ❤️ for pets
              </span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
