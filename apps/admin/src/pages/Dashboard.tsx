import React, { useState, useEffect } from 'react';
import { 
  BarChart, 
  Bar,
  Cell,
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie
} from 'recharts';
import { 
  Sparkles,
  ShoppingBag,
  Heart,
  Clock,
  Flame,
  ArrowRight,
  TrendingUp,
  Tag,
  Users
} from 'lucide-react';
import { motion } from 'framer-motion';
import { apiClient } from '../api/apiClient';

export default function Dashboard() {
  const [stats, setStats] = useState<any>(null);
  const [revenueData, setRevenueData] = useState<any[]>([]);
  const [topProducts, setTopProducts] = useState<any[]>([]);
  const [categoryData, setCategoryData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadDashboardData() {
      try {
        const statsRes = await apiClient.get('/admin/dashboard/stats');
        if (statsRes && statsRes.data) {
          setStats(statsRes.data);
        }
      } catch (err) {
        console.warn('Could not load live dashboard stats, using mock fallback', err);
      }

      try {
        const revenueRes = await apiClient.get('/admin/dashboard/revenue');
        if (revenueRes && revenueRes.data && Array.isArray(revenueRes.data) && revenueRes.data.length > 0) {
          const fills = ['#9d7df9', '#ff8da1', '#ffb076', '#ffd27d', '#aae297', '#8bc4f9'];
          const mapped = revenueRes.data.map((item: any, idx: number) => {
            const dateObj = new Date(item._id);
            const dayName = dateObj.toLocaleDateString('en-US', { weekday: 'short' });
            return {
              name: dayName || item._id,
              value: item.revenue,
              fill: fills[idx % fills.length]
            };
          });
          setRevenueData(mapped);
        }
      } catch (err) {
        console.warn('Could not load live dashboard revenue, using mock fallback', err);
      }

      try {
        const productsRes = await apiClient.get('/admin/dashboard/top-products');
        if (productsRes && productsRes.data && Array.isArray(productsRes.data) && productsRes.data.length > 0) {
          const mapped = productsRes.data.map((p: any) => ({
            id: p._id,
            name: p.name,
            detail: `Active • ${p.soldCount || 0} orders • ₹${p.basePrice}`,
            image: p.images?.[0] || 'https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?auto=format&fit=crop&q=80&w=100'
          }));
          setTopProducts(mapped);
        }
      } catch (err) {
        console.warn('Could not load live dashboard top products, using mock fallback', err);
      }

      try {
        const catRes = await apiClient.get('/admin/categories');
        if (catRes && catRes.data && Array.isArray(catRes.data) && catRes.data.length > 0) {
          const fills = ['#9d7df9', '#ff8da1', '#ffb076', '#ffd27d', '#aae297', '#8bc4f9'];
          const mapped = catRes.data.map((cat: any, idx: number) => ({
            name: cat.name,
            value: Math.floor(Math.random() * 30) + 15,
            color: fills[idx % fills.length]
          }));
          setCategoryData(mapped);
        } else {
          setCategoryData([]);
        }
      } catch (err) {
        console.warn('Could not load categories for donut chart', err);
        setCategoryData([]);
      } finally {
        setLoading(false);
      }
    }

    loadDashboardData();
  }, []);

  return (
    <div className="space-y-6">
      
      {/* 1. Good Morning, Mia! Header Card (Pet shop theme matching image layout) */}
      <div className="clay-header-banner rounded-[36px] p-6 relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-6 border-[4px] border-white">
        
        {/* Left Side: Mia Illustration with headphones */}
        <div className="flex items-center gap-6 z-10 shrink-0">
          <div className="w-28 h-28 rounded-full border-[4px] border-white overflow-hidden shadow-md shrink-0 relative bg-white/30">
            <img 
              src="/avatar.png" 
              alt="Mia Vance"
              className="w-full h-full object-cover scale-110 animate-float"
            />
          </div>
          <div className="space-y-1.5 text-slate-800">
            <h2 className="text-2xl font-black flex items-center gap-1 text-[#3b2b5c]">
              Good Morning, Mia! ☀️
            </h2>
            <p className="text-xs text-[#523d85] font-extrabold max-w-sm leading-relaxed">
              Let's manage your cozy pet shop operations, monitor live sales and campaign spins today!
            </p>
            
            {/* Launch Campaign Button */}
            <div className="pt-2">
              <button className="px-5 py-2.5 bg-[#8e78f5] text-white border border-white/50 font-black text-xs rounded-full shadow-md hover:bg-[#7d67e5] active:scale-95 transition-all flex items-center gap-2">
                <Sparkles className="w-3.5 h-3.5 fill-white text-white" /> Launch Campaign 🐾
              </button>
            </div>
          </div>
        </div>

        {/* Right Side: Cozy Potted Plant (Illustration or Emoji representation) */}
        <div className="hidden md:flex items-center justify-center shrink-0 z-10 mr-4">
          <div className="w-24 h-24 rounded-2xl bg-white/20 border border-white/40 flex items-center justify-center text-5xl filter drop-shadow-md select-none animate-float">
            🪴
          </div>
        </div>

        {/* Lilac visual stripes backdrop */}
        <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-white/10 skew-x-12 pointer-events-none" />
      </div>

      {/* 2. KPI Cards Grid (Exact same styles and color patterns as image, updated for Storefront) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        
        {/* Card 1: Total Revenue (Pastel Purple) */}
        <div className="clay-card-purple rounded-[28px] p-5 flex flex-col justify-between min-h-[140px] relative overflow-hidden group">
          <div className="flex items-start justify-between">
            <div className="space-y-1">
              <span className="text-[11px] font-extrabold tracking-wider opacity-70">Total Revenue</span>
              <h2 className="text-2xl font-black tracking-tight">
                {stats ? `₹${stats.totalRevenue.toLocaleString()}` : '₹0'}
              </h2>
            </div>
            <div className="w-10 h-10 rounded-xl bg-white/45 flex items-center justify-center text-purple-700 shadow-sm">
              <ShoppingBag className="w-4 h-4 stroke-[2.5]" />
            </div>
          </div>
          <div className="flex items-center gap-1 mt-4 text-[11px] font-black text-emerald-600">
            <span>+18%</span>
            <span className="opacity-70 font-bold">this week</span>
          </div>
        </div>

        {/* Card 2: Customers (Pastel Peach-Rose) */}
        <div className="clay-card-peach rounded-[28px] p-5 flex flex-col justify-between min-h-[140px] relative overflow-hidden group">
          <div className="flex items-start justify-between">
            <div className="space-y-1">
              <span className="text-[11px] font-extrabold tracking-wider opacity-70">Total Customers</span>
              <h2 className="text-2xl font-black tracking-tight">
                {stats ? stats.totalUsers.toLocaleString() : '0'}
              </h2>
            </div>
            <div className="w-10 h-10 rounded-xl bg-white/45 flex items-center justify-center text-rose-700 shadow-sm">
              <Users className="w-4 h-4 stroke-[2.5]" />
            </div>
          </div>
          <div className="flex items-center gap-1 mt-4 text-[11px] font-black text-emerald-600">
            <span>+8%</span>
            <span className="opacity-70 font-bold">this week</span>
          </div>
        </div>

        {/* Card 3: Active Products (Pastel Yellow) */}
        <div className="clay-card-yellow rounded-[28px] p-5 flex flex-col justify-between min-h-[140px] relative overflow-hidden group">
          <div className="flex items-start justify-between">
            <div className="space-y-1">
              <span className="text-[11px] font-extrabold tracking-wider opacity-70">Active Products</span>
              <h2 className="text-2xl font-black tracking-tight">
                {stats ? stats.totalProducts.toLocaleString() : '0'}
              </h2>
            </div>
            <div className="w-10 h-10 rounded-xl bg-white/45 flex items-center justify-center text-amber-700 shadow-sm">
              <Clock className="w-4 h-4 stroke-[2.5]" />
            </div>
          </div>
          <div className="flex items-center gap-1 mt-4 text-[11px] font-black text-emerald-600">
            <span>{stats ? `${stats.lowStockCount} low stock` : '0 low stock'}</span>
          </div>
        </div>

        {/* Card 4: Pending Orders (Pastel Sky-Blue) */}
        <div className="clay-card-blue rounded-[28px] p-5 flex flex-col justify-between min-h-[140px] relative overflow-hidden group">
          <div className="flex items-start justify-between">
            <div className="space-y-1">
              <span className="text-[11px] font-extrabold tracking-wider opacity-70">Pending Orders</span>
              <h2 className="text-2xl font-black tracking-tight">
                {stats ? stats.pendingOrders.toLocaleString() : '0'}
              </h2>
            </div>
            <div className="w-10 h-10 rounded-xl bg-white/45 flex items-center justify-center text-blue-700 shadow-sm">
              <Flame className="w-4 h-4 stroke-[2.5] fill-blue-700" />
            </div>
          </div>
          <div className="flex items-center gap-1 mt-4 text-[11px] font-black text-slate-500">
            <span className="font-extrabold text-blue-600">needs processing</span>
          </div>
        </div>

      </div>

      {/* 3. Main Chart Sections (Exactly matching the layout) */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        
        {/* Sales Performance (Sales Bar Chart) */}
        <div className="xl:col-span-2 clay-white-card rounded-[32px] p-6 min-h-[380px] flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-black text-lg text-slate-800">Sales Performance</h3>
            </div>
            
            <button className="px-3.5 py-1.5 bg-[#faf6f0] border-2 border-slate-100 text-slate-600 text-xs font-black rounded-xl shadow-sm flex items-center gap-1">
              This Week <ArrowRight className="w-3.5 h-3.5 rotate-90 text-slate-400" />
            </button>
          </div>

          {/* Very thick round-ended colored bar chart */}
          <div className="flex-1 w-full h-[240px] mt-4">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={revenueData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                <XAxis 
                  dataKey="name" 
                  tickLine={false} 
                  axisLine={false} 
                  tick={{ fill: '#8c8c8c', fontSize: 11, fontWeight: 'bold' }} 
                />
                <YAxis 
                  tickLine={false} 
                  axisLine={false} 
                  tick={{ fill: '#8c8c8c', fontSize: 11, fontWeight: 'bold' }}
                />
                <Tooltip cursor={{ fill: 'rgba(142,120,245,0.05)' }} />
                <Bar 
                  dataKey="value" 
                  radius={[12, 12, 12, 12]} 
                  barSize={24}
                >
                  {revenueData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Top Selling Categories (Pie Donut Chart) */}
        <div className="clay-white-card rounded-[32px] p-6 min-h-[380px] flex flex-col justify-between">
          <div>
            <h3 className="font-black text-lg text-slate-800">Top Selling Categories</h3>
          </div>

          <div className="flex-1 w-full h-[180px] flex items-center justify-center relative">
            {categoryData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={categoryData}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={72}
                    paddingAngle={4}
                    dataKey="value"
                  >
                    {categoryData.map((entry, idx) => (
                      <Cell key={`cell-${idx}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="text-center text-xs font-black text-slate-400 uppercase tracking-wide">
                🌱 No Category Data
              </div>
            )}
          </div>

          {/* List Legends */}
          <div className="space-y-1.5 border-t border-slate-50 pt-3">
            {categoryData.length > 0 ? (
              categoryData.map((cat, idx) => (
                <div key={idx} className="flex items-center justify-between text-xs font-black text-slate-600">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: cat.color }} />
                    <span>{cat.name}</span>
                  </div>
                  <span>{cat.value}%</span>
                </div>
              ))
            ) : (
              <p className="text-[10px] text-slate-400 text-center font-bold">Add categories to populate charts</p>
            )}
          </div>
        </div>

      </div>

      {/* 4. Bottom Row: Best Selling Supplies & Daily mix replacements */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Best Selling Supplies */}
        <div className="clay-white-card rounded-[32px] p-6 min-h-[320px] flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-black text-lg text-slate-800">Best Selling Supplies</h3>
            <button className="text-xs font-black text-slate-400 hover:text-slate-600">See All</button>
          </div>

          <div className="space-y-3.5">
            {topProducts.map((prod) => (
              <div key={prod.id} className="flex items-center justify-between p-2.5 hover:bg-slate-50/50 rounded-2xl transition-colors">
                <div className="flex items-center gap-3.5">
                  <div className="w-12 h-12 rounded-xl overflow-hidden shadow-sm shrink-0 border border-slate-100 bg-slate-50">
                    <img src={prod.image} alt={prod.name} className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <h4 className="font-black text-sm text-slate-800">{prod.name}</h4>
                    <p className="text-[11px] text-slate-400 font-extrabold mt-0.5">{prod.detail}</p>
                  </div>
                </div>
                
                {/* 3D Action Icon Button Circle (View / Details) */}
                <button className="w-9 h-9 rounded-full bg-[#e2d9ff] hover:bg-[#d0c6f5] active:scale-95 text-[#8e78f5] flex items-center justify-center shadow-sm transition-all shrink-0 font-extrabold text-xs">
                  <span>View</span>
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Cozy Featured Campaign Card (Daily Mix Cozy spot) */}
        <div className="clay-white-card rounded-[32px] p-6 min-h-[320px] flex flex-col justify-between">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-black text-lg text-slate-800">Cozy Pet Campaigns</h3>
            <button className="text-xs font-black text-slate-400 hover:text-slate-600">See All</button>
          </div>

          {/* Cozy Armchair image panel */}
          <div className="flex-1 rounded-[24px] overflow-hidden relative shadow-inner border border-slate-100 group">
            <img 
              src="/banner.png" 
              alt="Daily Mix Cozy armchair" 
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
            />
            {/* Dark glass backdrop */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent flex flex-col justify-end p-5">
              <h4 className="text-white font-black text-lg">Chill Paws</h4>
              <p className="text-slate-100 text-xs font-bold mt-0.5">80 supplies active</p>
            </div>
            
            {/* Big floating circular check button */}
            <button className="absolute bottom-5 right-5 w-12 h-12 rounded-full bg-white hover:bg-slate-50 active:scale-95 text-[#8e78f5] flex items-center justify-center shadow-md transition-all font-black text-xs">
              <span>Edit</span>
            </button>
          </div>
        </div>

      </div>

      {/* 5. Discover New Supplies Bottom Banner */}
      <div className="clay-star-banner rounded-[32px] p-6 flex flex-col sm:flex-row items-center justify-between gap-6 border-[4px] border-white relative overflow-hidden group">
        <div className="flex items-center gap-5 z-10">
          
          {/* Glowing Smiling Star Illustration */}
          <div className="w-16 h-16 rounded-2xl bg-amber-200 border border-white flex items-center justify-center text-4xl shadow-md select-none shrink-0 animate-float">
            ⭐
          </div>
          
          <div className="text-slate-800 text-center sm:text-left">
            <h3 className="text-lg font-black text-[#3b2b5c]">Discover new supplies</h3>
            <p className="text-xs text-[#523d85] font-extrabold mt-0.5">
              Run promotional campaigns they will adore!
            </p>
          </div>
        </div>

        <button className="px-6 py-3 bg-[#8e78f5] text-white border border-white/50 font-black text-xs rounded-2xl shadow-md hover:bg-[#7d67e5] active:scale-95 transition-all shrink-0 z-10">
          Explore Now
        </button>

        {/* Skewed stripe details */}
        <div className="absolute right-[-10%] top-0 bottom-0 w-1/4 bg-white/10 skew-x-12 pointer-events-none" />
      </div>

    </div>
  );
}
