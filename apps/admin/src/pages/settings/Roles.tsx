import React, { useState } from 'react';
import { 
  ShieldAlert, 
  UserPlus, 
  Trash2, 
  Check, 
  Sparkles,
  Lock,
  Eye
} from 'lucide-react';
import ConfirmModal from '../../components/common/ConfirmModal';
import CustomSelect from '../../components/common/CustomSelect';

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

const mockStaff: StaffMember[] = [
  { id: '1', name: 'Mia Vance', role: 'Super Admin', email: 'mia@pawmart.com', permissions: { products: true, orders: true, spinWheel: true, staffLogs: true } },
  { id: '2', name: 'Lucas Cooper', role: 'Admin', email: 'lucas@pawmart.com', permissions: { products: true, orders: true, spinWheel: true, staffLogs: false } },
  { id: '3', name: 'Zoe Parker', role: 'Manager', email: 'zoe@pawmart.com', permissions: { products: true, orders: true, spinWheel: false, staffLogs: false } },
  { id: '4', name: 'Nolan Evans', role: 'Staff', email: 'nolan@pawmart.com', permissions: { products: false, orders: true, spinWheel: false, staffLogs: false } },
];

export default function Roles() {
  const [staffList, setStaffList] = useState<StaffMember[]>(mockStaff);
  const [newName, setNewName] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newRole, setNewRole] = useState<'Super Admin' | 'Admin' | 'Manager' | 'Staff'>('Staff');

  // Custom modal states
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [staffToDelete, setStaffToDelete] = useState<string | null>(null);

  const roleOptions = [
    { value: 'Staff', label: 'Staff (Operations only)', emoji: '🧑‍💼' },
    { value: 'Manager', label: 'Manager (Wheel, Promos)', emoji: '🧙‍♂️' },
    { value: 'Admin', label: 'Admin (Full writes)', emoji: '👑' },
  ];

  const handleTogglePermission = (staffId: string, key: 'products' | 'orders' | 'spinWheel' | 'staffLogs') => {
    setStaffList(staffList.map(member => {
      if (member.id === staffId) {
        return {
          ...member,
          permissions: {
            ...member.permissions,
            [key]: !member.permissions[key]
          }
        };
      }
      return member;
    }));
  };

  const handleAddStaff = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName || !newEmail) return;

    const newMember: StaffMember = {
      id: (staffList.length + 1).toString(),
      name: newName,
      email: newEmail,
      role: newRole,
      permissions: {
        products: newRole === 'Admin' || newRole === 'Super Admin',
        orders: true,
        spinWheel: newRole === 'Admin' || newRole === 'Super Admin' || newRole === 'Manager',
        staffLogs: newRole === 'Super Admin'
      }
    };

    setStaffList([...staffList, newMember]);
    setNewName('');
    setNewEmail('');
    setNewRole('Staff');
  };

  const handleDeleteTrigger = (id: string) => {
    setStaffToDelete(id);
    setIsConfirmOpen(true);
  };

  const handleConfirmDelete = () => {
    if (staffToDelete) {
      setStaffList(staffList.filter(s => s.id !== staffToDelete));
    }
    setIsConfirmOpen(false);
    setStaffToDelete(null);
  };

  return (
    <div className="space-y-6">
      


      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Staff registry Table */}
        <div className="lg:col-span-2 clay-table-container">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr>
                <th className="clay-th w-16">S.No.</th>
                <th className="clay-th">Staff profile</th>
                <th className="clay-th">Role Designation</th>
                <th className="clay-th text-center">Catalog Access</th>
                <th className="clay-th text-center">Orders Access</th>
                <th className="clay-th text-center">Wheel Config</th>
                <th className="clay-th text-right">Delete</th>
              </tr>
            </thead>
            <tbody>
              {staffList.map((member, index) => (
                <tr key={member.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="clay-td font-black text-[#8e78f5]">{index + 1}</td>
                  
                  {/* Info */}
                  <td className="clay-td">
                    <div>
                      <h4 className="font-black text-sm text-slate-800">{member.name}</h4>
                      <span className="text-[10px] text-slate-400 font-bold block">{member.email}</span>
                    </div>
                  </td>

                  {/* Role */}
                  <td className="clay-td">
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wide border ${
                      member.role === 'Super Admin' 
                        ? 'bg-purple-100 text-purple-700 border-purple-200' 
                        : member.role === 'Admin' 
                        ? 'bg-emerald-100 text-emerald-700 border-emerald-200'
                        : member.role === 'Manager' 
                        ? 'bg-amber-100 text-amber-700 border-amber-200' 
                        : 'bg-slate-100 text-slate-600 border-slate-200'
                    }`}>
                      {member.role}
                    </span>
                  </td>

                  {/* Products Perm */}
                  <td className="clay-td text-center">
                    <button 
                      onClick={() => handleTogglePermission(member.id, 'products')}
                      className={`w-9 h-5 rounded-full p-0.5 transition-all ${member.permissions.products ? 'bg-emerald-400' : 'bg-slate-200'}`}
                      disabled={member.role === 'Super Admin'}
                    >
                      <div className={`w-4 h-4 rounded-full bg-white transition-all shadow-sm ${member.permissions.products ? 'translate-x-4' : 'translate-x-0'}`} />
                    </button>
                  </td>

                  {/* Orders Perm */}
                  <td className="clay-td text-center">
                    <button 
                      onClick={() => handleTogglePermission(member.id, 'orders')}
                      className={`w-9 h-5 rounded-full p-0.5 transition-all ${member.permissions.orders ? 'bg-emerald-400' : 'bg-slate-200'}`}
                      disabled={member.role === 'Super Admin'}
                    >
                      <div className={`w-4 h-4 rounded-full bg-white transition-all shadow-sm ${member.permissions.orders ? 'translate-x-4' : 'translate-x-0'}`} />
                    </button>
                  </td>

                  {/* SpinWheel Perm */}
                  <td className="clay-td text-center">
                    <button 
                      onClick={() => handleTogglePermission(member.id, 'spinWheel')}
                      className={`w-9 h-5 rounded-full p-0.5 transition-all ${member.permissions.spinWheel ? 'bg-emerald-400' : 'bg-slate-200'}`}
                      disabled={member.role === 'Super Admin'}
                    >
                      <div className={`w-4 h-4 rounded-full bg-white transition-all shadow-sm ${member.permissions.spinWheel ? 'translate-x-4' : 'translate-x-0'}`} />
                    </button>
                  </td>

                  {/* Delete actions */}
                  <td className="clay-td text-right">
                    <button 
                      onClick={() => handleDeleteTrigger(member.id)}
                      disabled={member.role === 'Super Admin'}
                      className="p-2 bg-rose-50 border border-rose-200 text-rose-600 rounded-xl hover:bg-rose-100 active:scale-95 transition-all disabled:opacity-30 disabled:hover:bg-rose-50 disabled:text-rose-400 shadow-sm"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Staff credentials form */}
        <div className="clay-white-card rounded-[32px] p-6 space-y-5 flex flex-col justify-between min-h-[380px]">
          <div>
            <h3 className="font-extrabold text-slate-800 text-base">New Staff Access</h3>
            <p className="text-[11px] text-slate-400 font-semibold mt-0.5">Register staff credentials and select administrative levels</p>
          </div>

          <form onSubmit={handleAddStaff} className="space-y-3.5 flex-1 mt-4">
            <div className="space-y-1">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider block">Staff Name</label>
              <input 
                type="text" 
                placeholder="e.g. Leo Carter"
                className="w-full clay-input"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                required
              />
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider block">Staff Email</label>
              <input 
                type="email" 
                placeholder="leo@pawmart.com"
                className="w-full clay-input"
                value={newEmail}
                onChange={(e) => setNewEmail(e.target.value)}
                required
              />
            </div>

            <div className="space-y-1">
              <CustomSelect
                value={newRole}
                onChange={setNewRole}
                options={roleOptions}
                label="Role Designation"
              />
            </div>

            <button 
              type="submit"
              className="w-full clay-btn clay-btn-purple py-3 text-xs gap-1.5 mt-2"
            >
              <UserPlus className="w-4 h-4 stroke-[2.5]" /> Register Staff
            </button>
          </form>

        </div>

      </div>

      {/* Custom Confirm Delete Modal */}
      <ConfirmModal
        isOpen={isConfirmOpen}
        title="Revoke Staff Access 🛡️"
        message="Are you sure you want to revoke this staff member's administrative panel access credentials? This action is permanent."
        confirmText="Revoke"
        cancelText="Cancel"
        emoji="🛡️"
        type="danger"
        onConfirm={handleConfirmDelete}
        onCancel={() => {
          setIsConfirmOpen(false);
          setStaffToDelete(null);
        }}
      />

    </div>
  );
}
