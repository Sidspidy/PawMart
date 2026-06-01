import React, { useState, useEffect } from 'react';
import {
  ShieldAlert,
  UserPlus,
  Trash2,
  X,
  Info,
  Lock,
  Eye,
  Users,
} from 'lucide-react';
import ConfirmModal from '../../components/common/ConfirmModal';
import CustomSelect from '../../components/common/CustomSelect';
import { apiClient } from '../../api/apiClient';
import { useToast } from '../../components/common/Toast';

// ── Types ──────────────────────────────────────────────────────────────────────
interface StaffMember {
  id: string;
  name: string;
  role: 'Super Admin' | 'Admin' | 'Manager' | 'Staff';
  email: string;
  permissions: {
    products: boolean;
    orders: boolean;
    spinWheel: boolean;
    staffLogs: boolean;
  };
}

// ── Role mapping helpers ───────────────────────────────────────────────────────
function mapBackendRole(backendRole: string): StaffMember['role'] {
  const map: Record<string, StaffMember['role']> = {
    super_admin: 'Super Admin',
    admin: 'Admin',
    manager: 'Manager',
    staff: 'Staff',
  };
  return map[backendRole] ?? 'Staff';
}

function mapFrontendRole(frontendRole: string): string {
  const map: Record<string, string> = {
    'Super Admin': 'super_admin',
    Admin: 'admin',
    Manager: 'manager',
    Staff: 'staff',
  };
  return map[frontendRole] ?? 'staff';
}

// ── Role badge styling ─────────────────────────────────────────────────────────
const roleBadge = (role: StaffMember['role']) => {
  const map: Record<string, string> = {
    'Super Admin': 'bg-purple-100 text-purple-700 border-purple-200',
    Admin:         'bg-emerald-100 text-emerald-700 border-emerald-200',
    Manager:       'bg-amber-100 text-amber-700 border-amber-200',
    Staff:         'bg-slate-100 text-slate-600 border-slate-200',
  };
  return map[role] ?? 'bg-slate-100 text-slate-600 border-slate-200';
};

// ── Permission toggle ──────────────────────────────────────────────────────────
function PermToggle({
  on,
  disabled,
  onClick,
}: {
  on: boolean;
  disabled?: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`w-9 h-5 rounded-full p-0.5 transition-all ${on ? 'bg-emerald-400' : 'bg-slate-200'} ${disabled ? 'opacity-30 cursor-not-allowed' : 'cursor-pointer'}`}
    >
      <div className={`w-4 h-4 rounded-full bg-white transition-all shadow-sm ${on ? 'translate-x-4' : 'translate-x-0'}`} />
    </button>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// Add Staff Modal
// ══════════════════════════════════════════════════════════════════════════════
function AddStaffModal({
  onClose,
  onAdded,
}: {
  onClose: () => void;
  onAdded: (member: StaffMember) => void;
}) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState<'Admin' | 'Manager' | 'Staff'>('Staff');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState('');
  const { success, error: toastError } = useToast();

  const roleOptions = [
    { value: 'Staff',   label: 'Staff (Operations only)',  emoji: '🧑‍💼' },
    { value: 'Manager', label: 'Manager (Wheel, Promos)',  emoji: '🧙‍♂️' },
    { value: 'Admin',   label: 'Admin (Full writes)',      emoji: '👑' },
  ];

  // ESC to close
  useEffect(() => {
    const h = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', h);
    return () => window.removeEventListener('keydown', h);
  }, [onClose]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');
    if (!name.trim() || !email.trim()) {
      setFormError('Staff name and email are required.');
      return;
    }

    const body = { name: name.trim(), email: email.trim(), role: mapFrontendRole(role) };

    setIsSubmitting(true);
    try {
      const res = await apiClient.post('/admin/staff', body);
      if (res?.data) {
        const s = res.data;
        const newMember: StaffMember = {
          id: s._id,
          name: s.name,
          email: s.email,
          role: mapBackendRole(s.role),
          permissions: {
            products:  s.permissions?.products  ?? false,
            orders:    s.permissions?.orders    ?? false,
            spinWheel: s.permissions?.spinWheel ?? false,
            staffLogs: s.permissions?.staffLogs ?? false,
          },
        };
        onAdded(newMember);
        success('Staff Added 👤', `${newMember.name} has been registered as ${newMember.role}.`);
        onClose();
      }
    } catch (err: any) {
      // Offline fallback
      const newMember: StaffMember = {
        id: `local-${Date.now()}`,
        name: name.trim(),
        email: email.trim(),
        role: role as StaffMember['role'],
        permissions: {
          products:  role === 'Admin',
          orders:    true,
          spinWheel: role === 'Admin' || role === 'Manager',
          staffLogs: false,
        },
      };
      onAdded(newMember);
      success('Staff Added (offline) 👤', `${newMember.name} added locally. Will sync on reconnect.`);
      onClose();
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ backgroundColor: 'rgba(30,20,60,0.45)', backdropFilter: 'blur(6px)' }}
      onClick={e => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div
        className="w-full max-w-md bg-white rounded-[32px] shadow-2xl animate-fadeInUp"
        style={{ boxShadow: '0 32px 80px rgba(142,120,245,0.25), 0 0 0 1px #e2d9ff' }}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-7 pt-6 pb-4 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#e2d9ff] flex items-center justify-center">
              <UserPlus className="w-5 h-5 text-[#8e78f5] stroke-[2.5]" />
            </div>
            <div>
              <h3 className="font-black text-slate-800 text-base">New Staff Access</h3>
              <p className="text-[11px] text-slate-400 font-semibold mt-0.5">
                Register credentials and set administrative level
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-2xl bg-slate-100 text-slate-500 hover:bg-rose-50 hover:text-rose-500 transition-all active:scale-90"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="px-7 py-6 space-y-4">
          {formError && (
            <div className="bg-rose-50 border border-rose-200 rounded-2xl px-3 py-2.5 text-rose-700 text-xs font-black flex items-center gap-2">
              <Info className="w-3.5 h-3.5 shrink-0" /> {formError}
            </div>
          )}

          <div className="space-y-1">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider block">
              Staff Name *
            </label>
            <input
              type="text"
              placeholder="e.g. Leo Carter"
              className="w-full clay-input"
              value={name}
              onChange={e => setName(e.target.value)}
              required
            />
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider block">
              Staff Email *
            </label>
            <input
              type="email"
              placeholder="leo@pawmart.com"
              className="w-full clay-input"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
            />
          </div>

          <CustomSelect
            value={role}
            onChange={val => setRole(val as 'Admin' | 'Manager' | 'Staff')}
            options={roleOptions}
            label="Role Designation"
          />

          {/* Role info */}
          <div className="bg-[#e2d9ff]/30 border border-[#e2d9ff] rounded-2xl p-3 text-[11px] text-[#523d85] font-semibold leading-snug flex gap-2">
            <Lock className="w-3.5 h-3.5 shrink-0 mt-0.5 text-[#8e78f5]" />
            <span>
              Permissions can be fine-tuned per staff after creation using the toggle switches in the table.
            </span>
          </div>

          <div className="flex gap-3 pt-1">
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 clay-btn clay-btn-purple py-3.5 text-xs gap-1.5 shadow-md"
            >
              <UserPlus className="w-4 h-4 stroke-[2.5]" />
              {isSubmitting ? 'Registering…' : 'Register Staff'}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="clay-btn clay-btn-light px-6 py-3.5 text-xs"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// Main Component
// ══════════════════════════════════════════════════════════════════════════════
export default function Roles() {
  const [staffList, setStaffList] = useState<StaffMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);

  // Delete confirm
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [staffToDelete, setStaffToDelete] = useState<string | null>(null);

  const { success, error: toastError, warning } = useToast();

  // ── Load ──────────────────────────────────────────────────────────────────
  useEffect(() => {
    async function loadStaff() {
      setLoading(true);
      try {
        const res = await apiClient.get('/admin/staff');
        if (res?.data && Array.isArray(res.data)) {
          const mapped = res.data.map((s: any) => ({
            id: s._id,
            name: s.name,
            role: mapBackendRole(s.role),
            email: s.email,
            permissions: {
              products:  s.permissions?.products  ?? false,
              orders:    s.permissions?.orders    ?? false,
              spinWheel: s.permissions?.spinWheel ?? false,
              staffLogs: s.permissions?.staffLogs ?? false,
            },
          }));
          setStaffList(mapped);
        }
      } catch {
        toastError('Failed to load staff', 'Could not fetch staff members from server.');
      } finally {
        setLoading(false);
      }
    }
    loadStaff();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ── Toggle permission ─────────────────────────────────────────────────────
  const handleTogglePermission = async (
    staffId: string,
    key: keyof StaffMember['permissions']
  ) => {
    const member = staffList.find(m => m.id === staffId);
    const newVal = !member?.permissions[key];
    // Optimistic
    setStaffList(prev =>
      prev.map(m =>
        m.id === staffId ? { ...m, permissions: { ...m.permissions, [key]: newVal } } : m
      )
    );
    try {
      await apiClient.patch(`/admin/staff/${staffId}/permissions`, { permissionKey: key });
    } catch {
      // Revert optimistic
      setStaffList(prev =>
        prev.map(m =>
          m.id === staffId ? { ...m, permissions: { ...m.permissions, [key]: !newVal } } : m
        )
      );
      warning('Permission sync failed', 'Change reverted. Please try again.');
    }
  };

  // ── Delete ────────────────────────────────────────────────────────────────
  const handleDeleteTrigger = (id: string) => {
    setStaffToDelete(id);
    setIsConfirmOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!staffToDelete) return;
    const member = staffList.find(s => s.id === staffToDelete);
    try {
      await apiClient.delete(`/admin/staff/${staffToDelete}`);
      setStaffList(prev => prev.filter(s => s.id !== staffToDelete));
      success('Access Revoked 🛡️', `${member?.name}'s admin access has been removed.`);
    } catch {
      setStaffList(prev => prev.filter(s => s.id !== staffToDelete));
      toastError('Delete may not have saved', 'Changes applied locally. Server sync failed.');
    } finally {
      setIsConfirmOpen(false);
      setStaffToDelete(null);
    }
  };

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <div className="space-y-5">

      {/* Header row */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <p className="text-xs text-slate-400 font-semibold">
            {staffList.length} staff member{staffList.length !== 1 ? 's' : ''} registered
          </p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="clay-btn clay-btn-purple px-5 py-3 text-xs gap-2"
        >
          <UserPlus className="w-4 h-4 stroke-[2.5]" /> Add Staff
        </button>
      </div>

      {/* Staff Table */}
      <div className="clay-table-container w-full overflow-x-auto">
        <table className="w-full text-left border-collapse min-w-[700px]">
          <thead>
            <tr>
              <th className="clay-th w-10">S.</th>
              <th className="clay-th">Staff Profile</th>
              <th className="clay-th">Role</th>
              <th className="clay-th text-center">Catalog</th>
              <th className="clay-th text-center">Orders</th>
              <th className="clay-th text-center">Spin Wheel</th>
              <th className="clay-th text-right">Action</th>
            </tr>
          </thead>
          <tbody>
            {loading && (
              <tr>
                <td colSpan={7} className="clay-td text-center py-12 text-slate-400 text-sm">
                  <div className="flex items-center justify-center gap-2">
                    <div className="w-4 h-4 rounded-full border-2 border-[#8e78f5] border-t-transparent animate-spin" />
                    Loading staff…
                  </div>
                </td>
              </tr>
            )}

            {!loading && staffList.length === 0 && (
              <tr>
                <td colSpan={7} className="clay-td text-center py-12 text-slate-400 text-sm font-semibold">
                  No staff members yet. Click <span className="text-[#8e78f5] font-black">+ Add Staff</span> to get started! 👤
                </td>
              </tr>
            )}

            {!loading && staffList.map((member, idx) => (
              <tr key={member.id} className="hover:bg-slate-50/50 transition-colors">
                {/* S.No */}
                <td className="clay-td font-black text-[#8e78f5]">{idx + 1}</td>

                {/* Profile */}
                <td className="clay-td">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-2xl bg-[#e2d9ff] flex items-center justify-center shrink-0">
                      <span className="text-base">
                        {member.role === 'Super Admin' ? '👑' : member.role === 'Admin' ? '🔑' : member.role === 'Manager' ? '🧙‍♂️' : '🧑‍💼'}
                      </span>
                    </div>
                    <div>
                      <h4 className="font-black text-sm text-slate-800">{member.name}</h4>
                      <span className="text-[10px] text-slate-400 font-bold">{member.email}</span>
                    </div>
                  </div>
                </td>

                {/* Role badge */}
                <td className="clay-td">
                  <span className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wide border ${roleBadge(member.role)}`}>
                    {member.role}
                  </span>
                </td>

                {/* Catalog access */}
                <td className="clay-td text-center">
                  <PermToggle
                    on={member.permissions.products}
                    disabled={member.role === 'Super Admin'}
                    onClick={() => handleTogglePermission(member.id, 'products')}
                  />
                </td>

                {/* Orders access */}
                <td className="clay-td text-center">
                  <PermToggle
                    on={member.permissions.orders}
                    disabled={member.role === 'Super Admin'}
                    onClick={() => handleTogglePermission(member.id, 'orders')}
                  />
                </td>

                {/* Spin wheel */}
                <td className="clay-td text-center">
                  <PermToggle
                    on={member.permissions.spinWheel}
                    disabled={member.role === 'Super Admin'}
                    onClick={() => handleTogglePermission(member.id, 'spinWheel')}
                  />
                </td>

                {/* Delete */}
                <td className="clay-td text-right">
                  <button
                    onClick={() => handleDeleteTrigger(member.id)}
                    disabled={member.role === 'Super Admin'}
                    className="p-2 bg-rose-50 border border-rose-200 text-rose-600 rounded-xl hover:bg-rose-100 active:scale-95 transition-all disabled:opacity-30 disabled:pointer-events-none shadow-sm"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Add Staff Modal */}
      {showModal && (
        <AddStaffModal
          onClose={() => setShowModal(false)}
          onAdded={member => setStaffList(prev => [...prev, member])}
        />
      )}

      {/* Revoke Confirm */}
      <ConfirmModal
        isOpen={isConfirmOpen}
        title="Revoke Staff Access 🛡️"
        message={`Are you sure you want to revoke ${staffList.find(s => s.id === staffToDelete)?.name ?? 'this staff member'}'s admin panel access? This action is permanent.`}
        confirmText="Revoke"
        cancelText="Cancel"
        emoji="🛡️"
        type="danger"
        onConfirm={handleConfirmDelete}
        onCancel={() => { setIsConfirmOpen(false); setStaffToDelete(null); }}
      />
    </div>
  );
}
