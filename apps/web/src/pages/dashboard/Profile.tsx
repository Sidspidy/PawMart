import { useState, useEffect } from 'react';
import { User, Phone, Mail, Camera, Plus, Edit3, Trash2, Home, Building2, MapPin, Check, Shield, Star, Navigation, FileText } from 'lucide-react';
import { useAuthStore } from '../../store/auth.store';
import { useToastStore } from '../../store/toast.store';
import { api } from '../../api';

interface AddressDB {
  _id: string;
  label: 'Home' | 'Work' | 'Other';
  fullName: string;
  phone: string;
  line1: string;
  line2?: string;
  landmark?: string;
  city: string;
  state: string;
  pincode: string;
  isDefault: boolean;
}

interface AddressForm {
  fullName: string;
  phone: string;
  pincode: string;
  city: string;
  state: string;
  addressLine1: string;
  addressLine2: string;
  landmark: string;
  addressType: 'Home' | 'Work' | 'Other';
  isDefault: boolean;
}

const INITIAL_FORM: AddressForm = {
  fullName: '',
  phone: '',
  pincode: '',
  city: '',
  state: '',
  addressLine1: '',
  addressLine2: '',
  landmark: '',
  addressType: 'Home',
  isDefault: false,
};

const STATES = [
  'Andhra Pradesh', 'Assam', 'Bihar', 'Chhattisgarh', 'Delhi', 'Goa', 'Gujarat',
  'Haryana', 'Himachal Pradesh', 'Jharkhand', 'Karnataka', 'Kerala', 'Madhya Pradesh',
  'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram', 'Nagaland', 'Odisha', 'Punjab',
  'Rajasthan', 'Sikkim', 'Tamil Nadu', 'Telangana', 'Tripura', 'Uttar Pradesh',
  'Uttarakhand', 'West Bengal',
];

export default function Profile() {
  const { user, updateUser } = useAuthStore();
  const { addToast } = useToastStore();

  const [addresses, setAddresses] = useState<AddressDB[]>([]);
  const [addressLoading, setAddressLoading] = useState(true);
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [editingAddress, setEditingAddress] = useState<AddressDB | null>(null);
  const [form, setForm] = useState<AddressForm>(INITIAL_FORM);
  const [errors, setErrors] = useState<Partial<AddressForm>>({});
  const [pincodeLoading, setPincodeLoading] = useState(false);
  const [isSavingAddress, setIsSavingAddress] = useState(false);

  const [editingProfile, setEditingProfile] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [profileForm, setProfileForm] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    dob: '1995-03-15',
    avatar: user?.avatar || '',
  });

  useEffect(() => {
    if (user) {
      setProfileForm({
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || '',
        dob: '1995-03-15',
        avatar: user.avatar || '',
      });
    }
  }, [user]);

  const handleSaveChanges = async () => {
    setIsSaving(true);
    try {
      const response = await api.patch('/auth/me', {
        name: profileForm.name,
        phone: profileForm.phone,
        avatar: profileForm.avatar
      });
      if (response.data?.success) {
        updateUser(response.data.data);
        addToast('Profile updated successfully! 🐾', 'success');
        setEditingProfile(false);
      } else {
        addToast(response.data?.message || 'Failed to update profile', 'error');
      }
    } catch (err: any) {
      console.error(err);
      addToast(err.response?.data?.message || 'Error updating profile', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  const fetchAddresses = async () => {
    try {
      setAddressLoading(true);
      const res = await api.get('/addresses');
      if (res.data?.success) {
        setAddresses(res.data.data || []);
      }
    } catch (err: any) {
      console.error('Failed to load addresses:', err);
      addToast('Failed to load saved addresses', 'error');
    } finally {
      setAddressLoading(false);
    }
  };

  useEffect(() => {
    fetchAddresses();
  }, []);

  const handleAddressChange = (field: keyof AddressForm, val: any) => {
    setForm(prev => ({ ...prev, [field]: val }));
    if (errors[field]) setErrors(prev => ({ ...prev, [field]: '' }));
  };

  const handlePincodeBlur = () => {
    if (form.pincode.length === 6) {
      setPincodeLoading(true);
      setTimeout(() => {
        const pincodeMap: Record<string, { city: string; state: string }> = {
          '400001': { city: 'Mumbai', state: 'Maharashtra' },
          '110001': { city: 'New Delhi', state: 'Delhi' },
          '560001': { city: 'Bangalore', state: 'Karnataka' },
          '600001': { city: 'Chennai', state: 'Tamil Nadu' },
          '700001': { city: 'Kolkata', state: 'West Bengal' },
          '500001': { city: 'Hyderabad', state: 'Telangana' },
        };
        const match = pincodeMap[form.pincode];
        if (match) {
          setForm(prev => ({ ...prev, city: match.city, state: match.state }));
        }
        setPincodeLoading(false);
      }, 600);
    }
  };

  const validateAddress = () => {
    const e: Partial<AddressForm> = {};
    if (!form.fullName.trim()) e.fullName = 'Full name is required';
    if (!form.phone.match(/^[6-9]\d{9}$/)) e.phone = 'Enter valid 10-digit mobile number';
    if (!form.pincode.match(/^\d{6}$/)) e.pincode = 'Enter valid 6-digit pincode';
    if (!form.city.trim()) e.city = 'City is required';
    if (!form.state) e.state = 'Please select a state';
    if (!form.addressLine1.trim()) e.addressLine1 = 'Street address is required';
    return e;
  };

  const handleSaveAddressSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validateAddress();
    if (Object.keys(errs).length) {
      setErrors(errs);
      return;
    }

    setIsSavingAddress(true);
    try {
      const payload = {
        label: form.addressType,
        fullName: form.fullName,
        phone: form.phone,
        line1: form.addressLine1,
        line2: form.addressLine2,
        landmark: form.landmark,
        city: form.city,
        state: form.state,
        pincode: form.pincode,
        isDefault: form.isDefault,
      };

      let res;
      if (editingAddress) {
        res = await api.put(`/addresses/${editingAddress._id}`, payload);
      } else {
        res = await api.post('/addresses', payload);
      }

      if (res.data?.success) {
        addToast(editingAddress ? 'Address updated! 🐾' : 'Address added! 🐾', 'success');
        setForm(INITIAL_FORM);
        setShowAddressForm(false);
        setEditingAddress(null);
        await fetchAddresses();
      }
    } catch (err: any) {
      console.error(err);
      addToast(err.response?.data?.message || 'Failed to save address', 'error');
    } finally {
      setIsSavingAddress(false);
    }
  };

  const handleEditAddress = (addr: AddressDB) => {
    setEditingAddress(addr);
    setForm({
      fullName: addr.fullName,
      phone: addr.phone,
      pincode: addr.pincode,
      city: addr.city,
      state: addr.state,
      addressLine1: addr.line1,
      addressLine2: addr.line2 || '',
      landmark: addr.landmark || '',
      addressType: addr.label,
      isDefault: addr.isDefault,
    });
    setShowAddressForm(true);
  };

  const handleDeleteAddress = async (id: string) => {
    if (!confirm('Are you sure you want to delete this address?')) return;

    try {
      const res = await api.delete(`/addresses/${id}`);
      if (res.data?.success) {
        addToast('Address deleted successfully 🐾', 'info');
        await fetchAddresses();
      }
    } catch (err: any) {
      console.error(err);
      addToast('Failed to delete address', 'error');
    }
  };

  const handleSetDefaultAddress = async (id: string) => {
    try {
      const res = await api.patch(`/addresses/${id}/default`);
      if (res.data?.success) {
        addToast('Default address updated 🐾', 'success');
        await fetchAddresses();
      }
    } catch (err: any) {
      console.error(err);
      addToast('Failed to update default address', 'error');
    }
  };

  const AddrTypeIcon = ({ type }: { type: AddressDB['label'] }) => {
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
    backBtn: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: '0.375rem',
      padding: '0.7rem 1.25rem',
      borderRadius: '9999px',
      border: '1.5px solid #e5ddd4',
      backgroundColor: '#ffffff',
      color: '#8a7e72',
      fontWeight: 700,
      fontSize: '0.875rem',
      fontFamily: "'Nunito', sans-serif",
      cursor: 'pointer',
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
              {profileForm.avatar ? (
                <img
                  src={profileForm.avatar}
                  alt={profileForm.name}
                  style={{
                    width: '100%',
                    height: '100%',
                    borderRadius: '50%',
                    objectFit: 'cover',
                  }}
                />
              ) : (
                profileForm.name.charAt(0).toUpperCase()
              )}
            </div>
            <div>
              <div style={s.avatarName}>{profileForm.name}</div>
              <div style={s.avatarSub}>PawMart Member since 2026</div>
              <div style={s.verifiedBadge}><Check size={10} /> Verified Account</div>
            </div>
          </div>

          {editingProfile && (
            <div style={{ marginBottom: '1.5rem', backgroundColor: '#fff7ed', border: '1.5px solid #fed7aa', padding: '1rem', borderRadius: '16px' }}>
              <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: 700, color: '#8a7e72', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '0.625rem' }}>Select Profile Avatar 🐾</label>
              <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                {[
                  { label: 'Female Owner 👩‍💼', path: '/avatar_female.png' },
                  { label: 'Male Owner 👨‍💼', path: '/avatar_male.png' },
                  { label: 'Cozy Puppy 🐶', path: '/avatar_pet.png' },
                ].map(item => (
                  <button
                    key={item.path}
                    type="button"
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      gap: '0.4rem',
                      padding: '0.5rem',
                      border: `2.5px solid ${profileForm.avatar === item.path ? '#f97316' : '#e5ddd4'}`,
                      borderRadius: '16px',
                      backgroundColor: '#ffffff',
                      cursor: 'pointer',
                      transition: 'all 0.2s',
                    }}
                    onClick={() => setProfileForm(prev => ({ ...prev, avatar: item.path }))}
                  >
                    <img src={item.path} alt={item.label} style={{ width: '40px', height: '40px', borderRadius: '50%', objectFit: 'cover' }} />
                    <span style={{ fontSize: '0.7rem', fontWeight: 700, color: '#2d2418' }}>{item.label}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

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
            <button style={s.saveBtn} onClick={handleSaveChanges} disabled={isSaving}>
              {isSaving ? 'Saving...' : <><Check size={14} /> Save Changes</>}
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
          {addressLoading ? (
            <div style={{ display: 'flex', justifyContent: 'center', padding: '3rem' }}>
              <div style={{ width: '28px', height: '28px', border: '3px solid #e5ddd4', borderTopColor: '#f97316', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
            </div>
          ) : !showAddressForm ? (
            <>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1rem', marginBottom: '1.5rem' }}>
                {addresses.map(addr => (
                  <div key={addr._id} style={addr.isDefault ? s.addrCardDefault : s.addrCard}>
                    <div style={s.addrHeader}>
                      <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                        <div style={s.addrTypePill}><AddrTypeIcon type={addr.label} /> {addr.label}</div>
                        {addr.isDefault && <div style={s.addrDefault}>Default</div>}
                      </div>
                    </div>
                    <div style={s.addrName}>{addr.fullName}</div>
                    <div style={s.addrText}>{addr.line1}{addr.line2 ? `, ${addr.line2}` : ''}</div>
                    <div style={s.addrText}>{addr.city}, {addr.state} — {addr.pincode}</div>
                    <div style={{ ...s.addrText, marginTop: '0.25rem' }}>📞 {addr.phone}</div>
                    <div style={s.addrActions}>
                      <button style={s.addrBtn} onClick={() => handleEditAddress(addr)}><Edit3 size={11} /> Edit</button>
                      {!addr.isDefault && (
                        <button style={s.addrBtn} onClick={() => handleSetDefaultAddress(addr._id)}>
                          <Check size={11} /> Set Default
                        </button>
                      )}
                      {!addr.isDefault && (
                        <button style={s.addrDeleteBtn} onClick={() => handleDeleteAddress(addr._id)}>
                          <Trash2 size={11} /> Delete
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* Add new */}
              <button
                style={s.addAddrBtn}
                onClick={() => {
                  setEditingAddress(null);
                  setForm(INITIAL_FORM);
                  setErrors({});
                  setShowAddressForm(true);
                }}
              >
                <Plus size={16} color="#f97316" /> Add New Address
              </button>
            </>
          ) : (
            /* Inline Form */
            <form onSubmit={handleSaveAddressSubmit} noValidate>
              {/* Row 1: Name + Phone */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: 700, color: '#8a7e72', textTransform: 'uppercase' as const, letterSpacing: '0.06em', marginBottom: '0.375rem' }}>Full Name *</label>
                  <div style={{ position: 'relative' }}>
                    <User size={14} style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: '#8a7e72', pointerEvents: 'none' }} />
                    <input
                      type="text"
                      placeholder="Rahul Sharma"
                      value={form.fullName}
                      onChange={e => handleAddressChange('fullName', e.target.value)}
                      style={{ width: '100%', padding: '0.7rem 0.875rem 0.7rem 2.5rem', borderRadius: '12px', border: `1.5px solid ${errors.fullName ? '#ef4444' : '#e5ddd4'}`, fontSize: '0.875rem', color: '#2d2418', backgroundColor: '#f7f2ec', outline: 'none', boxSizing: 'border-box' }}
                    />
                  </div>
                  {errors.fullName && <div style={{ fontSize: '0.73rem', color: '#ef4444', marginTop: '0.25rem' }}>{errors.fullName}</div>}
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: 700, color: '#8a7e72', textTransform: 'uppercase' as const, letterSpacing: '0.06em', marginBottom: '0.375rem' }}>Mobile Number *</label>
                  <div style={{ position: 'relative' }}>
                    <Phone size={14} style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: '#8a7e72', pointerEvents: 'none' }} />
                    <input
                      type="tel"
                      placeholder="9876543210"
                      maxLength={10}
                      value={form.phone}
                      onChange={e => handleAddressChange('phone', e.target.value.replace(/\D/g, ''))}
                      style={{ width: '100%', padding: '0.7rem 0.875rem 0.7rem 2.5rem', borderRadius: '12px', border: `1.5px solid ${errors.phone ? '#ef4444' : '#e5ddd4'}`, fontSize: '0.875rem', color: '#2d2418', backgroundColor: '#f7f2ec', outline: 'none', boxSizing: 'border-box' }}
                    />
                  </div>
                  {errors.phone && <div style={{ fontSize: '0.73rem', color: '#ef4444', marginTop: '0.25rem' }}>{errors.phone}</div>}
                </div>
              </div>

              {/* Row 2: Pincode + City */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: 700, color: '#8a7e72', textTransform: 'uppercase' as const, letterSpacing: '0.06em', marginBottom: '0.375rem' }}>PIN Code *</label>
                  <div style={{ position: 'relative' }}>
                    <Navigation size={14} style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: '#8a7e72', pointerEvents: 'none' }} />
                    <input
                      type="text"
                      placeholder="400001"
                      maxLength={6}
                      value={form.pincode}
                      onChange={e => handleAddressChange('pincode', e.target.value.replace(/\D/g, ''))}
                      onBlur={handlePincodeBlur}
                      style={{ width: '100%', padding: '0.7rem 0.875rem 0.7rem 2.5rem', borderRadius: '12px', border: `1.5px solid ${errors.pincode ? '#ef4444' : '#e5ddd4'}`, fontSize: '0.875rem', color: '#2d2418', backgroundColor: '#f7f2ec', outline: 'none', boxSizing: 'border-box' }}
                    />
                    {pincodeLoading && (
                      <div style={{ position: 'absolute', right: '0.75rem', top: '50%', transform: 'translateY(-50%)', width: '16px', height: '16px', border: '2px solid #e5ddd4', borderTopColor: '#f97316', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
                    )}
                  </div>
                  {errors.pincode && <div style={{ fontSize: '0.73rem', color: '#ef4444', marginTop: '0.25rem' }}>{errors.pincode}</div>}
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: 700, color: '#8a7e72', textTransform: 'uppercase' as const, letterSpacing: '0.06em', marginBottom: '0.375rem' }}>City *</label>
                  <div style={{ position: 'relative' }}>
                    <Building2 size={14} style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: '#8a7e72', pointerEvents: 'none' }} />
                    <input
                      type="text"
                      placeholder="Mumbai"
                      value={form.city}
                      onChange={e => handleAddressChange('city', e.target.value)}
                      style={{ width: '100%', padding: '0.7rem 0.875rem 0.7rem 2.5rem', borderRadius: '12px', border: `1.5px solid ${errors.city ? '#ef4444' : '#e5ddd4'}`, fontSize: '0.875rem', color: '#2d2418', backgroundColor: '#f7f2ec', outline: 'none', boxSizing: 'border-box' }}
                    />
                  </div>
                  {errors.city && <div style={{ fontSize: '0.73rem', color: '#ef4444', marginTop: '0.25rem' }}>{errors.city}</div>}
                </div>
              </div>

              {/* State */}
              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: 700, color: '#8a7e72', textTransform: 'uppercase' as const, letterSpacing: '0.06em', marginBottom: '0.375rem' }}>State *</label>
                <select
                  value={form.state}
                  onChange={e => handleAddressChange('state', e.target.value)}
                  style={{ width: '100%', padding: '0.7rem 0.875rem', borderRadius: '12px', border: `1.5px solid ${errors.state ? '#ef4444' : '#e5ddd4'}`, fontSize: '0.875rem', color: '#2d2418', backgroundColor: '#f7f2ec', outline: 'none', cursor: 'pointer', boxSizing: 'border-box' }}
                >
                  <option value="">Select State</option>
                  {STATES.map(st => (
                    <option key={st} value={st}>{st}</option>
                  ))}
                </select>
                {errors.state && <div style={{ fontSize: '0.73rem', color: '#ef4444', marginTop: '0.25rem' }}>{errors.state}</div>}
              </div>

              {/* Street Address */}
              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: 700, color: '#8a7e72', textTransform: 'uppercase' as const, letterSpacing: '0.06em', marginBottom: '0.375rem' }}>Street Address *</label>
                <div style={{ position: 'relative' }}>
                  <Home size={14} style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: '#8a7e72', pointerEvents: 'none' }} />
                  <input
                    type="text"
                    placeholder="Flat no., Building name, Street"
                    value={form.addressLine1}
                    onChange={e => handleAddressChange('addressLine1', e.target.value)}
                    style={{ width: '100%', padding: '0.7rem 0.875rem 0.7rem 2.5rem', borderRadius: '12px', border: `1.5px solid ${errors.addressLine1 ? '#ef4444' : '#e5ddd4'}`, fontSize: '0.875rem', color: '#2d2418', backgroundColor: '#f7f2ec', outline: 'none', boxSizing: 'border-box' }}
                  />
                </div>
                {errors.addressLine1 && <div style={{ fontSize: '0.73rem', color: '#ef4444', marginTop: '0.25rem' }}>{errors.addressLine1}</div>}
              </div>

              {/* Area / Colony */}
              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: 700, color: '#8a7e72', textTransform: 'uppercase' as const, letterSpacing: '0.06em', marginBottom: '0.375rem' }}>Area / Colony (Optional)</label>
                <input
                  type="text"
                  placeholder="Colony, Area, Locality"
                  value={form.addressLine2}
                  onChange={e => handleAddressChange('addressLine2', e.target.value)}
                  style={{ width: '100%', padding: '0.7rem 0.875rem', borderRadius: '12px', border: '1.5px solid #e5ddd4', fontSize: '0.875rem', color: '#2d2418', backgroundColor: '#f7f2ec', outline: 'none', boxSizing: 'border-box' }}
                />
              </div>

              {/* Landmark */}
              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: 700, color: '#8a7e72', textTransform: 'uppercase' as const, letterSpacing: '0.06em', marginBottom: '0.375rem' }}>Landmark (Optional)</label>
                <div style={{ position: 'relative' }}>
                  <FileText size={14} style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: '#8a7e72', pointerEvents: 'none' }} />
                  <input
                    type="text"
                    placeholder="Near Metro Station, Park etc."
                    value={form.landmark}
                    onChange={e => handleAddressChange('landmark', e.target.value)}
                    style={{ width: '100%', padding: '0.7rem 0.875rem 0.7rem 2.5rem', borderRadius: '12px', border: '1.5px solid #e5ddd4', fontSize: '0.875rem', color: '#2d2418', backgroundColor: '#f7f2ec', outline: 'none', boxSizing: 'border-box' }}
                  />
                </div>
              </div>

              {/* Address Type */}
              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: 700, color: '#8a7e72', textTransform: 'uppercase' as const, letterSpacing: '0.06em', marginBottom: '0.375rem' }}>Save As</label>
                <div style={{ display: 'flex', gap: '0.625rem' }}>
                  {(['Home', 'Work', 'Other'] as const).map(type => (
                    <button
                      key={type}
                      type="button"
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.375rem',
                        padding: '0.5rem 1rem',
                        borderRadius: '9999px',
                        border: `1.5px solid ${form.addressType === type ? '#f97316' : '#e5ddd4'}`,
                        backgroundColor: form.addressType === type ? '#fff7ed' : '#ffffff',
                        color: form.addressType === type ? '#f97316' : '#8a7e72',
                        fontSize: '0.82rem',
                        fontWeight: 700,
                        cursor: 'pointer',
                        transition: 'all 0.2s',
                      }}
                      onClick={() => handleAddressChange('addressType', type)}
                    >
                      {type === 'Home' ? <Home size={13} /> : type === 'Work' ? <Building2 size={13} /> : <MapPin size={13} />}
                      {type}
                    </button>
                  ))}
                </div>
              </div>

              {/* Is Default Checkbox */}
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.84rem', color: '#2d2418', fontWeight: 600, cursor: 'pointer', margin: '1rem 0' }}>
                <input
                  type="checkbox"
                  checked={form.isDefault}
                  onChange={e => handleAddressChange('isDefault', e.target.checked)}
                  style={{ cursor: 'pointer', width: '16px', height: '16px' }}
                />
                Save as default shipping address
              </label>

              {/* Actions */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '1.5rem', paddingTop: '1.25rem', borderTop: '1px solid #f0ebe4' }}>
                <button
                  type="button"
                  style={s.backBtn}
                  onClick={() => { setShowAddressForm(false); setEditingAddress(null); }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSavingAddress}
                  style={s.saveBtn}
                >
                  {isSavingAddress ? 'Saving...' : 'Save Address'}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
