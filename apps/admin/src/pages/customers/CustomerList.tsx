import { useState } from 'react';
import { motion } from 'framer-motion';
import { Users, Search, Award, Star, Mail, Calendar } from 'lucide-react';

const MOCK_CUSTOMERS = [
  { id: '1', name: 'Ava Mitchell', email: 'ava.mitchell@gmail.com', pet: 'Dog (Golden Retriever)', points: 1540, spent: 482.50, joinDate: 'Feb 12, 2026', avatar: '👩', tier: 'Gold Paw' },
  { id: '2', name: 'Liam Davies', email: 'liam.davies@outlook.com', pet: 'Cat (Persian)', points: 890, spent: 210.99, joinDate: 'Mar 05, 2026', avatar: '👨', tier: 'Silver Whiskers' },
  { id: '3', name: 'Sophia Smith', email: 'sophia.smith@yahoo.com', pet: 'Bird (Budgerigar)', points: 350, spent: 89.50, joinDate: 'Apr 20, 2026', avatar: '👩', tier: 'Bronze Feather' },
  { id: '4', name: 'Oliver Johnson', email: 'oliver.j@gmail.com', pet: 'Dog (Labrador)', points: 2100, spent: 752.40, joinDate: 'Jan 08, 2026', avatar: '👨', tier: 'Gold Paw' },
  { id: '5', name: 'Emma Wilson', email: 'emma.w@gmail.com', pet: 'Cat (Siamese)', points: 120, spent: 34.99, joinDate: 'May 14, 2026', avatar: '👩', tier: 'Guest' },
];

export default function CustomerList() {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredCustomers = MOCK_CUSTOMERS.filter(c => 
    c.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    c.pet.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <motion.div 
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
      className="space-y-6 pb-12"
    >
      {/* HEADER */}
      <div>
        <h2 className="text-2xl font-extrabold text-[#3d2c54] flex items-center gap-2">
          <Users className="text-violet-500 fill-violet-100" />
          Customer Database
        </h2>
        <p className="text-xs text-[#705e8c]">Monitor pet owners, loyalty points, and purchase preferences</p>
      </div>

      {/* FILTER CONTROLS */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white/40 p-4 rounded-[28px] border border-white/60">
        <div className="relative w-full md:w-[350px]">
          <input 
            type="text" 
            placeholder="Search owners or pet types..." 
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full clay-input pr-10 pl-5 text-xs py-2.5"
          />
          <Search className="absolute right-4 top-1/2 -translate-y-1/2 text-violet-400" size={14} />
        </div>
      </div>

      {/* CUSTOMERS TABLE */}
      <div className="glass-panel rounded-[32px] border border-white/60 shadow-soft overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-violet-100">
                <th className="py-4 px-6 text-xs font-bold uppercase tracking-wider text-[#9f8fb3] bg-white/20">Customer Profile</th>
                <th className="py-4 px-6 text-xs font-bold uppercase tracking-wider text-[#9f8fb3] bg-white/20">Pet preference</th>
                <th className="py-4 px-6 text-xs font-bold uppercase tracking-wider text-[#9f8fb3] bg-white/20">Loyalty Balance</th>
                <th className="py-4 px-6 text-xs font-bold uppercase tracking-wider text-[#9f8fb3] bg-white/20">Total Spent</th>
                <th className="py-4 px-6 text-xs font-bold uppercase tracking-wider text-[#9f8fb3] bg-white/20">Registration Date</th>
                <th className="py-4 px-6 text-xs font-bold uppercase tracking-wider text-[#9f8fb3] bg-white/20">Status Tier</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-violet-50">
              {filteredCustomers.map(c => (
                <tr key={c.id} className="hover:bg-white/40 transition-colors">
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-violet-100 flex items-center justify-center text-md shadow-inner">
                        {c.avatar}
                      </div>
                      <div>
                        <span className="font-extrabold text-sm text-[#3d2c54] block">{c.name}</span>
                        <span className="text-[10px] text-[#9f8fb3] font-bold flex items-center gap-1 mt-0.5">
                          <Mail size={10} />
                          {c.email}
                        </span>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <span className={`
                      inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-extrabold
                      ${c.pet.includes('Dog') && 'bg-orange-50 text-orange-500'}
                      ${c.pet.includes('Cat') && 'bg-violet-50 text-violet-500'}
                      ${c.pet.includes('Bird') && 'bg-amber-50 text-amber-500'}
                    `}>
                      {c.pet.includes('Dog') ? '🐶' : c.pet.includes('Cat') ? '🐱' : '🦜'}
                      {c.pet}
                    </span>
                  </td>
                  <td className="py-4 px-6 font-extrabold text-sm text-violet-600">
                    {c.points} pts
                  </td>
                  <td className="py-4 px-6 font-extrabold text-sm text-[#3d2c54]">
                    ${c.spent.toFixed(2)}
                  </td>
                  <td className="py-4 px-6 text-xs font-bold text-[#705e8c]">
                    <span className="flex items-center gap-1">
                      <Calendar size={12} className="text-[#9f8fb3]" />
                      {c.joinDate}
                    </span>
                  </td>
                  <td className="py-4 px-6">
                    <span className={`
                      inline-flex items-center gap-1 px-3 py-1 rounded-full text-[10px] font-extrabold shadow-sm border
                      ${c.tier === 'Gold Paw' && 'bg-amber-50 text-amber-600 border-amber-200'}
                      ${c.tier === 'Silver Whiskers' && 'bg-violet-50 text-violet-500 border-violet-200'}
                      ${c.tier === 'Bronze Feather' && 'bg-orange-50 text-orange-500 border-orange-200'}
                      ${c.tier === 'Guest' && 'bg-white text-[#705e8c] border-violet-100'}
                    `}>
                      <Star size={10} className="fill-current" />
                      {c.tier}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </motion.div>
  );
}
