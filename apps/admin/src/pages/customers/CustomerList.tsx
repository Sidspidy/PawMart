import React, { useState } from 'react';
import { 
  Search, 
  Users, 
  Sparkles,
  Award,
  Heart,
  ChevronRight,
  HeartHandshake
} from 'lucide-react';

interface Customer {
  id: string;
  name: string;
  email: string;
  points: number;
  ordersCount: number;
  totalSpent: number;
  avatar: string;
  petName: string;
  petSpecies: string;
}

const mockCustomers: Customer[] = [
  { id: '1', name: 'Oliver Vance', email: 'oliver@gmail.com', points: 340, ordersCount: 8, totalSpent: 420.50, avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=100', petName: 'Cooper 🦮', petSpecies: 'Golden Retriever' },
  { id: '2', name: 'Sophia Miller', email: 'sophia@gmail.com', points: 580, ordersCount: 12, totalSpent: 980.00, avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=100', petName: 'Luna 🐈', petSpecies: 'Persian Cat' },
  { id: '3', name: 'William Davies', email: 'will@gmail.com', points: 120, ordersCount: 3, totalSpent: 195.00, avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=100', petName: 'Bubbles 🐠', petSpecies: 'Clown Fish' },
  { id: '4', name: 'Charlotte Smith', email: 'char@gmail.com', points: 250, ordersCount: 6, totalSpent: 480.00, avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=100', petName: 'Pip 🦜', petSpecies: 'Parrot' },
];

export default function CustomerList() {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredCustomers = mockCustomers.filter(c => 
    c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.petName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      
      {/* Upper action bar with search */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="w-full sm:w-72 flex items-center bg-white border-[3px] border-white rounded-2xl px-4 py-2.5 gap-2.5 shadow-clay-card">
          <Search className="w-4 h-4 text-slate-400 shrink-0" />
          <input 
            type="text" 
            placeholder="Search name or pet..."
            className="bg-transparent border-none outline-none text-xs w-full placeholder-slate-400 text-slate-700 font-extrabold"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Customer directory Table */}
      <div className="clay-table-container">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr>
              <th className="clay-th w-16">S.No.</th>
              <th className="clay-th">Member profile</th>
              <th className="clay-th">Pet details</th>
              <th className="clay-th text-center">Loyalty Points</th>
              <th className="clay-th text-center">Orders Placed</th>
              <th className="clay-th">Total Spend</th>
              <th className="clay-th text-right">Loyalty rank</th>
            </tr>
          </thead>
          <tbody>
            {filteredCustomers.length > 0 ? (
              filteredCustomers.map((cust, index) => (
                <tr key={cust.id} className="hover:bg-slate-50/50 transition-colors">
                  {/* S.No. */}
                  <td className="clay-td font-black text-[#8e78f5]">{index + 1}</td>
                  
                  {/* Info */}
                  <td className="clay-td">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl overflow-hidden border border-slate-100 shadow-sm shrink-0 bg-slate-100">
                        <img src={cust.avatar} alt={cust.name} className="w-full h-full object-cover" />
                      </div>
                      <div>
                        <h4 className="font-black text-sm text-slate-800">{cust.name}</h4>
                        <span className="text-[10px] text-slate-400 font-bold block">{cust.email}</span>
                      </div>
                    </div>
                  </td>

                  {/* Pet details */}
                  <td className="clay-td">
                    <div>
                      <h5 className="font-black text-xs text-purple-700 flex items-center gap-1">
                        <Heart className="w-3 h-3 fill-purple-500 text-purple-500" /> {cust.petName}
                      </h5>
                      <span className="text-[10px] text-slate-400 font-extrabold">{cust.petSpecies}</span>
                    </div>
                  </td>

                  {/* Loyalty Points */}
                  <td className="clay-td text-center">
                    <span className="px-3 py-1 bg-amber-50 text-amber-700 border border-amber-100 rounded-full text-xs font-black">
                      ⭐ {cust.points} pts
                    </span>
                  </td>

                  {/* Orders */}
                  <td className="clay-td text-center">
                    <span className="font-extrabold text-slate-800">{cust.ordersCount} packages</span>
                  </td>

                  {/* Spend */}
                  <td className="clay-td">
                    <span className="font-black text-[#8e78f5]">${cust.totalSpent.toFixed(2)}</span>
                  </td>

                  {/* Rank Badge */}
                  <td className="clay-td text-right">
                    <span className={`px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wide border ${
                      cust.points > 500 
                        ? 'bg-purple-100 text-purple-700 border-purple-200' 
                        : cust.points > 250 
                        ? 'bg-amber-100 text-amber-700 border-amber-200' 
                        : 'bg-slate-100 text-slate-600 border-slate-200'
                    }`}>
                      {cust.points > 500 ? 'Platinum Pet 👑' : cust.points > 250 ? 'Gold Paws 🥇' : 'Bronze Member'}
                    </span>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={7} className="p-12 text-center text-slate-400 font-extrabold text-sm">
                  No customers found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Referral tip banner */}
      <div className="clay-card p-5 bg-gradient-to-r from-purple-50 to-[#fff8f5] border-[3px] border-white flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-2xl shadow-sm text-purple-500 shrink-0">
            🤝
          </div>
          <div>
            <h4 className="font-black text-sm text-[#3b2b5c]">Loyalty Referral Program</h4>
            <p className="text-[11px] text-slate-400 font-extrabold">Active members earn 100 points for each new pet registration</p>
          </div>
        </div>

        <button className="clay-btn clay-btn-purple px-5 py-2.5 text-xs shrink-0 w-full md:w-auto">
          Manage Rules
        </button>
      </div>

    </div>
  );
}
