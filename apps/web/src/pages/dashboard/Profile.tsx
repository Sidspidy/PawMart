import { useState } from 'react';
import { User, Phone, Mail, Camera, Plus, Edit3, Trash2, Home, Building2, MapPin, Check, Shield } from 'lucide-react';
import { useAuthStore } from '../../store/auth.store';

interface Address {
  id: string;
  type: 'Home' | 'Work' | 'Other';
  name: string;
  phone: string;
  line1: string;
  line2?: string;
  city: string;
  state: string;
  pin: string;
  isDefault: boolean;
}

const MOCK_ADDRESSES: Address[] = [
  {
    id: 'addr-1', type: 'Home', name: 'Rahul Sharma', phone: '9876543210',
    line1: 'Flat 4B, Sunrise Apartments, MG Road', city: 'Mumbai',
    state: 'Maharashtra', pin: '400001', isDefault: true,
  },
  {
    id: 'addr-2', type: 'Work', name: 'Rahul Sharma', phone: '9876543210',
    line1: '3rd Floor, TechPark Tower, BKC', city: 'Mumbai',
    state: 'Maharashtra', pin: '400051', isDefault: false,
  },
];

export default function Profile() {
  const { user } = useAuthStore();
  const [addresses, setAddresses] = useState<Address[]>(MOCK_ADDRESSES);
  const [editingProfile, setEditingProfile] = useState(false);
  const [profileForm, setProfileForm] = useState({
    name: user?.name || 'Rahul Sharma',
    email: user?.email || 'rahul@example.com',
    phone: '9876543210',
    dob: '1995-03-15',
  });

  const handleSetDefault = (id: string) => {
    setAddresses(prev => prev.map(a => ({ ...a, isDefault: a.id === id })));
  };

  const handleDeleteAddress = (id: string) => {
    setAddresses(prev => prev.filter(a => a.id !== id));
  };

  const AddrTypeIcon = ({ type }: { type: Address['type'] }) => {
    if (type === 'Home') return <Home size={14} />;
    if (type === 'Work') return <Building2 size={14} />;
    return <MapPin size={14} />;
  };

  const s = {
    title: { fontSize: '1.5rem', fontWeight: 900, color: '#2d2418', fontFamily: "'Nunito', sans-serif", marginBottom: '0.25rem' } as React.CSSProperties,
    subtitle: { fontSize: '0.82rem', color: '#8a7e72', marginBottom: '1.5rem' } as React.CSSProperties,
    card: {
      backgroundColor: '#ffffff', borderRadius: '20px',
      border: '1px solid #e5ddd4', boxShadow: '0 4px 16px rgba(0,0,0,0.05)',
      overflow: 'hidden', marginBottom: '1.25rem',
    } as React.CSSProperties,
    cardHeader: {
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      padding: '1rem 1.25rem', borderBottom: '1px solid #f0ebe4', backgroundColor: '#fafaf9',
    } as React.CSSProperties,
    cardTitleRow: { display: 'flex', alignItems: 'center', gap: '0.625rem' } as React.CSSProperties,
    cardTitle: { fontSize: '0.875rem', fontWeight: 800, color: '#2d2418', fontFamily: "'Nunito', sans-serif" } as React.CSSProperties,
    editBtn: {
      display: 'inline-flex', alignItems: 'center', gap: '0.3rem',
      padding: '0.4rem 0.875rem', borderRadius: '99px',
      border: '1.5px solid #e5ddd4', backgroundColor: '#ffffff',
      color: '#8a7e72', fontWeight: 600, fontSize: '0.75rem', cursor: 'pointer',
    } as React.CSSProperties,
    cardBody: { padding: '1.5rem' } as React.CSSProperties,
    // Avatar
    avatarSection: { display: 'flex', alignItems: 'center', gap: '1.25rem', marginBottom: '1.5rem' } as React.CSSProperties,
    avatarWrap: {
      position: 'relative' as const, width: '80px', height: '80px',
      borderRadius: '50%', background: 'linear-gradient(135deg, #f97316, #ea580c)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontSize: '1.75rem', fontWeight: 900, color: '#ffffff', fontFamily: "'Nunito', sans-serif",
      boxShadow: '0 4px 16px rgba(249,115,22,0.3)', flexShrink: 0,
    } as React.CSSProperties,
    cameraBtn: {
      position: 'absolute' as const, bottom: 0, right: 0,
      width: '26px', height: '26px', borderRadius: '50%',
      backgroundColor: '#ffffff', border: '2px solid #e5ddd4',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      cursor: 'pointer',
    } as React.CSSProperties,
    avatarName: { fontSize: '1.1rem', fontWeight: 800, color: '#2d2418', fontFamily: "'Nunito', sans-serif" } as React.CSSProperties,
    avatarSub: { fontSize: '0.78rem', color: '#8a7e72', marginTop: '0.2rem' } as React.CSSProperties,
    verifiedBadge: {
      display: 'inline-flex', alignItems: 'center', gap: '0.3rem',
      padding: '0.2rem 0.625rem', borderRadius: '99px',
      backgroundColor: '#f0fdf4', border: '1px solid #bbf7d0',
      fontSize: '0.68rem', fontWeight: 700, color: '#16a34a', marginTop: '0.375rem',
    } as React.CSSProperties,
    // Form fields
    formGrid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' } as React.CSSProperties,
    formGroup: { marginBottom: '0' } as React.CSSProperties,
    label: {
      display: 'block', fontSize: '0.72rem', fontWeight: 700, color: '#8a7e72',
      textTransform: 'uppercase' as const, letterSpacing: '0.06em', marginBottom: '0.375rem',
    } as React.CSSProperties,
    inputWrap: { position: 'relative' as const } as React.CSSProperties,
    inputIcon: {
      position: 'absolute' as const, left: '0.75rem', top: '50%',
      transform: 'translateY(-50%)', color: '#8a7e72', pointerEvents: 'none' as const,
    } as React.CSSProperties,
    input: (editable: boolean) => ({
      width: '100%', padding: '0.7rem 0.875rem 0.7rem 2.5rem',
      borderRadius: '12px',
      border: `1.5px solid ${editable ? '#f97316' : '#e5ddd4'}`,
      fontSize: '0.875rem', fontFamily: "'Inter', sans-serif", color: '#2d2418',
      backgroundColor: editable ? '#fffbf8' : '#f7f2ec', outline: 'none',
      boxSizing: 'border-box' as const,
    } as React.CSSProperties),
    saveBtn: {
      display: 'inline-flex', alignItems: 'center', gap: '0.375rem',
      marginTop: '1.25rem', padding: '0.7rem 1.5rem', borderRadius: '99px',
      background: 'linear-gradient(135deg, #f97316, #ea580c)',
      color: '#ffffff', fontWeight: 700, fontSize: '0.875rem',
      fontFamily: "'Nunito', sans-serif", border: 'none', cursor: 'pointer',
      boxShadow: '0 4px 12px rgba(249,115,22,0.3)',
    } as React.CSSProperties,
    // Addresses
    addrCard: {
      padding: '1.25rem', borderRadius: '14px',
      border: '1.5px solid #e5ddd4', backgroundColor: '#ffffff',
      marginBottom: '0.875rem', transition: 'border 0.2s',
    } as React.CSSProperties,
    addrCardDefault: {
      padding: '1.25rem', borderRadius: '14px',
      border: '1.5px solid #f97316', backgroundColor: '#fffbf8',
      marginBottom: '0.875rem',
    } as React.CSSProperties,
    addrHeader: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' } as React.CSSProperties,
    addrTypePill: {
      display: 'inline-flex', alignItems: 'center', gap: '0.3rem',
      padding: '0.2rem 0.625rem', borderRadius: '99px',
      backgroundColor: '#f7f2ec', border: '1px solid #e5ddd4',
      fontSize: '0.7rem', fontWeight: 700, color: '#8a7e72',
    } as React.CSSProperties,
    addrDefault: {
      display: 'inline-flex', alignItems: 'center', gap: '0.3rem',
      padding: '0.2rem 0.625rem', borderRadius: '99px',
      backgroundColor: '#fff7ed', border: '1px solid #fed7aa',
      fontSize: '0.7rem', fontWeight: 700, color: '#c2410c',
    } as React.CSSProperties,
    addrName: { fontSize: '0.875rem', fontWeight: 700, color: '#2d2418', marginBottom: '0.25rem' } as React.CSSProperties,
    addrText: { fontSize: '0.82rem', color: '#8a7e72', lineHeight: 1.6 } as React.CSSProperties,
    addrActions: { display: 'flex', gap: '0.5rem', marginTop: '0.875rem', flexWrap: 'wrap' as const } as React.CSSProperties,
    addrBtn: {
      display: 'inline-flex', alignItems: 'center', gap: '0.3rem',
      padding: '0.4rem 0.875rem', borderRadius: '99px',
      border: '1.5px solid #e5ddd4', backgroundColor: '#ffffff',
      color: '#8a7e72', fontWeight: 600, fontSize: '0.72rem', cursor: 'pointer',
    } as React.CSSProperties,
    addrDeleteBtn: {
      display: 'inline-flex', alignItems: 'center', gap: '0.3rem',
      padding: '0.4rem 0.875rem', borderRadius: '99px',
      border: '1.5px solid #fecaca', backgroundColor: '#fef2f2',
      color: '#ef4444', fontWeight: 600, fontSize: '0.72rem', cursor: 'pointer',
    } as React.CSSProperties,
    addAddrBtn: {
      display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem',
      width: '100%', padding: '0.875rem',
      borderRadius: '14px', border: '1.5px dashed #e5ddd4',
      backgroundColor: 'transparent', color: '#8a7e72',
      fontWeight: 600, fontSize: '0.85rem', cursor: 'pointer', transition: 'all 0.2s',
    } as React.CSSProperties,
  };

  return (
    <div>
      <h1 style={s.title}>Profile & Addresses</h1>
      <p style={s.subtitle}>Manage your personal information and delivery addresses</p>

      {/* Profile Card */}
      <div style={s.card}>
        <div style={s.cardHeader}>
          <div style={s.cardTitleRow}>
            <User size={16} color="#f97316" />
            <span style={s.cardTitle}>Personal Information</span>
          </div>
          <button style={s.editBtn} onClick={() => setEditingProfile(!editingProfile)}>
            <Edit3 size={12} /> {editingProfile ? 'Cancel' : 'Edit'}
          </button>
        </div>
        <div style={s.cardBody}>
          {/* Avatar */}
          <div style={s.avatarSection}>
            <div style={s.avatarWrap}>
              {profileForm.name.charAt(0).toUpperCase()}
              <div style={s.cameraBtn}><Camera size={12} color="#8a7e72" /></div>
            </div>
            <div>
              <div style={s.avatarName}>{profileForm.name}</div>
              <div style={s.avatarSub}>PawMart Member since 2026</div>
              <div style={s.verifiedBadge}><Check size={10} /> Verified Account</div>
            </div>
          </div>

          {/* Form grid */}
          <div style={s.formGrid}>
            <div style={s.formGroup}>
              <label style={s.label}>Full Name</label>
              <div style={s.inputWrap}>
                <User size={14} style={s.inputIcon} />
                <input type="text" value={profileForm.name}
                  onChange={e => setProfileForm(p => ({ ...p, name: e.target.value }))}
                  readOnly={!editingProfile} style={s.input(editingProfile)} />
              </div>
            </div>
            <div style={s.formGroup}>
              <label style={s.label}>Mobile Number</label>
              <div style={s.inputWrap}>
                <Phone size={14} style={s.inputIcon} />
                <input type="tel" value={profileForm.phone}
                  onChange={e => setProfileForm(p => ({ ...p, phone: e.target.value }))}
                  readOnly={!editingProfile} style={s.input(editingProfile)} />
              </div>
            </div>
            <div style={s.formGroup}>
              <label style={s.label}>Email Address</label>
              <div style={s.inputWrap}>
                <Mail size={14} style={s.inputIcon} />
                <input type="email" value={profileForm.email}
                  onChange={e => setProfileForm(p => ({ ...p, email: e.target.value }))}
                  readOnly={!editingProfile} style={s.input(editingProfile)} />
              </div>
            </div>
            <div style={s.formGroup}>
              <label style={s.label}>Date of Birth</label>
              <div style={s.inputWrap}>
                <Shield size={14} style={s.inputIcon} />
                <input type="date" value={profileForm.dob}
                  onChange={e => setProfileForm(p => ({ ...p, dob: e.target.value }))}
                  readOnly={!editingProfile} style={s.input(editingProfile)} />
              </div>
            </div>
          </div>

          {editingProfile && (
            <button style={s.saveBtn} onClick={() => setEditingProfile(false)}>
              <Check size={14} /> Save Changes
            </button>
          )}
        </div>
      </div>

      {/* Addresses Card */}
      <div style={s.card}>
        <div style={s.cardHeader}>
          <div style={s.cardTitleRow}>
            <MapPin size={16} color="#f97316" />
            <span style={s.cardTitle}>Saved Addresses ({addresses.length})</span>
          </div>
        </div>
        <div style={s.cardBody}>
          {addresses.map(addr => (
            <div key={addr.id} style={addr.isDefault ? s.addrCardDefault : s.addrCard}>
              <div style={s.addrHeader}>
                <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                  <div style={s.addrTypePill}><AddrTypeIcon type={addr.type} /> {addr.type}</div>
                  {addr.isDefault && <div style={s.addrDefault}>Default</div>}
                </div>
              </div>
              <div style={s.addrName}>{addr.name}</div>
              <div style={s.addrText}>{addr.line1}</div>
              <div style={s.addrText}>{addr.city}, {addr.state} — {addr.pin}</div>
              <div style={{ ...s.addrText, marginTop: '0.25rem' }}>📞 {addr.phone}</div>
              <div style={s.addrActions}>
                <button style={s.addrBtn}><Edit3 size={11} /> Edit</button>
                {!addr.isDefault && (
                  <button style={s.addrBtn} onClick={() => handleSetDefault(addr.id)}>
                    <Check size={11} /> Set as Default
                  </button>
                )}
                {!addr.isDefault && (
                  <button style={s.addrDeleteBtn} onClick={() => handleDeleteAddress(addr.id)}>
                    <Trash2 size={11} /> Delete
                  </button>
                )}
              </div>
            </div>
          ))}

          {/* Add new */}
          <button style={s.addAddrBtn}>
            <Plus size={16} color="#f97316" /> Add New Address
          </button>
        </div>
      </div>
    </div>
  );
}
