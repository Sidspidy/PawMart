import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { KeyRound, Shield, Users, UserCheck, Plus, Check, Trash2, Mail } from 'lucide-react';

const MOCK_STAFF = [
  { id: '1', name: 'Mia 👋', role: 'Head Curator', email: 'mia@pawmart.com', access: ['All Access', 'Billing', 'Staff Edit'], avatar: '👩', bg: 'from-violet-100 to-pink-100' },
  { id: '2', name: 'Dave 🚚', role: 'Logistics Manager', email: 'dave@pawmart.com', access: ['Orders Access', 'Shipping Print'], avatar: '👨', bg: 'from-orange-100 to-amber-100' },
  { id: '3', name: 'Chloe 📦', role: 'Inventory Specialist', email: 'chloe@pawmart.com', access: ['Catalog Edit', 'Coupons Manage'], avatar: '👩', bg: 'from-blue-100 to-violet-100' },
  { id: '4', name: 'Leo 👥', role: 'Support Curator', email: 'leo@pawmart.com', access: ['Customers View', 'Loyalty Adjust'], avatar: '👨', bg: 'from-emerald-100 to-teal-100' },
];

export default function Roles() {
  const [staff, setStaff] = useState(MOCK_STAFF);
  const [showAddForm, setShowAddForm] = useState(false);
  const [name, setName] = useState('');
  const [role, setRole] = useState('Assistant Curator');
  const [email, setEmail] = useState('');
  const [selectedAccess, setSelectedAccess] = useState<string[]>([]);
  const [successSaved, setSuccessSaved] = useState(false);

  const availablePrivileges = [
    'Catalog Edit', 'Orders Access', 'Shipping Print', 
    'Customers View', 'Loyalty Adjust', 'Coupons Manage'
  ];

  const handleTogglePrivilege = (priv: string) => {
    if (selectedAccess.includes(priv)) {
      setSelectedAccess(selectedAccess.filter(p => p !== priv));
    } else {
      setSelectedAccess([...selectedAccess, priv]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const bgPresets = [
      'from-violet-100 to-pink-100',
      'from-orange-100 to-amber-100',
      'from-blue-100 to-violet-100',
      'from-emerald-100 to-teal-100'
    ];
    const newStaff = {
      id: String(staff.length + 1),
      name,
      role,
      email,
      access: selectedAccess.length > 0 ? selectedAccess : ['View Only'],
      avatar: Math.random() > 0.5 ? '👩' : '👨',
      bg: bgPresets[Math.floor(Math.random() * bgPresets.length)]
    };
    setStaff([...staff, newStaff]);
    setSuccessSaved(true);
    setTimeout(() => {
      setSuccessSaved(false);
      setShowAddForm(false);
      setName('');
      setEmail('');
      setSelectedAccess([]);
    }, 1500);
  };

  const handleDelete = (id: string) => {
    if (id === '1') {
      alert("Mia, you cannot retire yourself! 😮");
      return;
    }
    if (confirm("Remove this curator's dashboard credentials?")) {
      setStaff(staff.filter(s => s.id !== id));
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
      className="space-y-6 pb-12 relative"
    >
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-extrabold text-[#3d2c54] flex items-center gap-2">
            <KeyRound className="text-violet-500 fill-violet-100" />
            Roles & Staff Credentials
          </h2>
          <p className="text-xs text-[#705e8c]">Manage active team curators, credential layers, and backend permissions</p>
        </div>

        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="flex items-center gap-2 px-5 py-3 bg-gradient-to-r from-violet-600 to-fuchsia-500 text-white rounded-full font-bold text-xs shadow-[0_8px_20px_-4px_rgba(138,92,245,0.3)] hover:scale-102 transition-transform cursor-pointer"
        >
          <Plus size={16} />
          Invite Staff
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* LEFT COLUMN: STAFF CARDS GRID */}
        <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4 self-start">
          {staff.map(member => (
            <div 
              key={member.id}
              className="glass-panel p-5 rounded-[28px] border border-white/60 shadow-soft flex flex-col justify-between min-h-[220px]"
            >
              <div>
                <div className="flex justify-between items-start mb-4">
                  <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${member.bg} flex items-center justify-center text-xl font-bold shadow-inner`}>
                    {member.avatar}
                  </div>
                  <button 
                    onClick={() => handleDelete(member.id)}
                    className="p-1.5 bg-red-50 hover:bg-red-100 text-red-500 rounded-full transition-all cursor-pointer"
                    title="Revoke access"
                  >
                    <Trash2 size={13} />
                  </button>
                </div>

                <h3 className="font-extrabold text-sm text-[#3d2c54]">{member.name}</h3>
                <span className="text-[10px] text-violet-500 font-bold bg-violet-100/60 px-2 py-0.5 rounded-full inline-block mt-0.5">
                  {member.role}
                </span>

                <div className="flex items-center gap-1.5 text-[10px] text-[#705e8c] font-bold mt-2">
                  <Mail size={12} className="text-[#9f8fb3]" />
                  {member.email}
                </div>
              </div>

              {/* Access permissions list */}
              <div className="flex flex-wrap gap-1.5 mt-4 pt-4 border-t border-violet-100/40">
                {member.access.map((perm, i) => (
                  <span 
                    key={i} 
                    className={`
                      px-2 py-0.5 rounded-full text-[9px] font-extrabold shadow-sm border
                      ${perm.includes('All') ? 'bg-orange-50 text-orange-500 border-orange-200' : 'bg-violet-50 text-violet-500 border-violet-200'}
                    `}
                  >
                    {perm}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* RIGHT COLUMN: INVITE STAFF FORM */}
        <div className="space-y-6">
          <AnimatePresence mode="wait">
            {showAddForm ? (
              <motion.div 
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.96 }}
                className="glass-panel p-6 rounded-[32px] border border-white/60 shadow-soft space-y-4"
              >
                <h3 className="font-extrabold text-sm text-[#3d2c54] border-b border-violet-100/60 pb-3 flex items-center gap-2">
                  <UserCheck size={16} className="text-orange-400" />
                  Invitation Credentials
                </h3>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="flex flex-col gap-1">
                    <label className="text-[10px] font-bold text-[#705e8c] ml-1">Staff Name</label>
                    <input 
                      type="text" 
                      placeholder="e.g. Leo Henderson" 
                      value={name}
                      onChange={e => setName(e.target.value)}
                      className="clay-input w-full text-xs"
                      required
                    />
                  </div>

                  <div className="flex flex-col gap-1">
                    <label className="text-[10px] font-bold text-[#705e8c] ml-1">Work Email</label>
                    <input 
                      type="email" 
                      placeholder="leo@pawmart.com" 
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      className="clay-input w-full text-xs"
                      required
                    />
                  </div>

                  {/* CHECKBOX PRIVILEGES */}
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-[#705e8c] ml-1 block">Permission Rights</label>
                    <div className="grid grid-cols-1 gap-2 bg-white/40 p-3 rounded-[22px] border border-violet-100/50">
                      {availablePrivileges.map(priv => {
                        const hasIt = selectedAccess.includes(priv);
                        return (
                          <div 
                            key={priv}
                            onClick={() => handleTogglePrivilege(priv)}
                            className="flex items-center justify-between text-[10px] font-bold text-[#705e8c] cursor-pointer p-1 hover:bg-violet-50/50 rounded-lg transition-all"
                          >
                            <span>{priv}</span>
                            <div className={`w-4.5 h-4.5 border rounded flex items-center justify-center transition-all ${hasIt ? 'bg-violet-500 border-violet-500 text-white' : 'border-violet-200 bg-white'}`}>
                              {hasIt && <Check size={10} strokeWidth={3} />}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  <button 
                    type="submit"
                    className="w-full py-3 bg-gradient-to-r from-violet-600 to-fuchsia-500 text-white rounded-full font-extrabold text-xs shadow-md hover:scale-101 cursor-pointer duration-200"
                  >
                    Issue Invitation
                  </button>
                </form>

              </motion.div>
            ) : (
              <div className="glass-panel p-6 rounded-[32px] border border-white/60 shadow-soft text-center py-10 space-y-4 flex flex-col items-center justify-center">
                <div className="w-12 h-12 rounded-2xl bg-orange-100 text-orange-500 flex items-center justify-center text-xl font-bold animate-float">
                  🔑
                </div>
                <div>
                  <h4 className="font-extrabold text-sm text-[#3d2c54]">Add team curators!</h4>
                  <p className="text-[10px] text-[#705e8c] max-w-[180px] mx-auto mt-1 leading-relaxed">
                    Set up credential access details for backend logistics managers or inventory keepers.
                  </p>
                </div>
                <button
                  onClick={() => setShowAddForm(true)}
                  className="px-5 py-2.5 bg-violet-600 hover:bg-violet-700 text-white font-extrabold text-xs rounded-full shadow-sm cursor-pointer"
                >
                  Invite Team Member
                </button>
              </div>
            )}
          </AnimatePresence>

          {/* Success Overlay Alerts */}
          <AnimatePresence>
            {successSaved && (
              <motion.div 
                initial={{ opacity: 0, scale: 0.9, y: 15 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: -15 }}
                className="p-3 bg-green-50 border border-green-200 text-green-600 rounded-[18px] text-[10px] font-bold flex items-center justify-center gap-1.5"
              >
                <Check size={12} strokeWidth={3} className="text-green-500" />
                Invitation credential dispatched successfully!
              </motion.div>
            )}
          </AnimatePresence>
        </div>

      </div>

    </motion.div>
  );
}
