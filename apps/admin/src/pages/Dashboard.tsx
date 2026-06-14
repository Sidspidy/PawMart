import React, { useState, useEffect } from 'react';
import { 
  BarChart, 
  Bar,
  LineChart,
  Line,
  Cell,
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie
} from 'recharts';
import { 
  ShoppingBag,
  Clock,
  Flame,
  Users
} from 'lucide-react';
import { apiClient } from '../api/apiClient';

function getMockRevenueData(range: 'this_week' | 'last_week' | 'this_month') {
  const fills = ['#9d7df9', '#ff8da1', '#ffb076', '#ffd27d', '#aae297', '#8bc4f9'];
  if (range === 'this_week') {
    return [
      { name: 'Mon', value: 12500, fill: fills[0] },
      { name: 'Tue', value: 18400, fill: fills[1] },
      { name: 'Wed', value: 15200, fill: fills[2] },
      { name: 'Thu', value: 22000, fill: fills[3] },
      { name: 'Fri', value: 29800, fill: fills[4] },
      { name: 'Sat', value: 35400, fill: fills[5] },
      { name: 'Sun', value: 31000, fill: fills[0] },
    ];
  } else if (range === 'last_week') {
    return [
      { name: 'Mon', value: 9500, fill: fills[0] },
      { name: 'Tue', value: 14200, fill: fills[1] },
      { name: 'Wed', value: 11000, fill: fills[2] },
      { name: 'Thu', value: 18500, fill: fills[3] },
      { name: 'Fri', value: 24500, fill: fills[4] },
      { name: 'Sat', value: 29800, fill: fills[5] },
      { name: 'Sun', value: 26500, fill: fills[0] },
    ];
  } else {
    return [
      { name: 'Week 1', value: 98000, fill: fills[0] },
      { name: 'Week 2', value: 124000, fill: fills[1] },
      { name: 'Week 3', value: 115000, fill: fills[2] },
      { name: 'Week 4', value: 148000, fill: fills[3] },
    ];
  }
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-[#faf6f0] border-[3px] border-[#8e78f5] px-3.5 py-2 rounded-2xl shadow-clay-card text-xs font-black text-slate-800">
        <p className="text-[10px] text-slate-400 uppercase tracking-wider mb-0.5">{label || payload[0].payload.name}</p>
        <div className="flex items-center gap-1 text-[#f97316]">
          <span>₹{payload[0].value.toLocaleString('en-IN')}</span>
        </div>
      </div>
    );
  }
  return null;
};

const CustomPieTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-[#faf6f0] border-[3px] border-[#ff8da1] px-3.5 py-2 rounded-2xl shadow-clay-card text-xs font-black text-slate-800">
        <p className="text-[10px] text-slate-400 uppercase tracking-wider mb-0.5">{payload[0].name}</p>
        <div className="flex items-center gap-1 text-[#c2410c]">
          <span>{payload[0].value}% of sales</span>
        </div>
      </div>
    );
  }
  return null;
};

function getPetCategoryByName(name: string): string {
  const n = name.toLowerCase();
  if (n.includes('dog') || n.includes('puppy') || n.includes('kibble') || n.includes('bone') || n.includes('bark')) return 'dogs';
  if (n.includes('cat') || n.includes('kitten') || n.includes('litter') || n.includes('meow') || n.includes('scratch')) return 'cats';
  if (n.includes('fish') || n.includes('aquarium') || n.includes('flake')) return 'fish';
  if (n.includes('bird') || n.includes('parrot') || n.includes('seed') || n.includes('cage')) return 'birds';
  if (n.includes('hamster') || n.includes('rabbit') || n.includes('guinea') || n.includes('hay')) return 'small_pets';
  return 'dogs';
}

export default function Dashboard() {
  const [stats, setStats] = useState<any>(null);
  const [revenueData, setRevenueData] = useState<any[]>([]);
  const [categoryData, setCategoryData] = useState<any[]>([]);
  const [recentOrders, setRecentOrders] = useState<any[]>([]);
  const [dateRange, setDateRange] = useState<'this_week' | 'last_week' | 'this_month'>('this_week');
  const [loading, setLoading] = useState(true);
  const [chartType, setChartType] = useState<'bar' | 'line'>('bar');

  // Fetch KPI Stats
  useEffect(() => {
    async function loadStats() {
      try {
        const statsRes = await apiClient.get('/admin/dashboard/stats');
        if (statsRes && statsRes.data) {
          setStats(statsRes.data);
        }
      } catch (err) {
        console.warn('Could not load live dashboard stats, using mock fallback', err);
      }
    }
    loadStats();
  }, []);

  // Fetch Revenue data based on selected Date Range
  useEffect(() => {
    async function fetchRevenue() {
      let fromDate: Date;
      let toDate: Date = new Date();
      
      const now = Date.now();
      if (dateRange === 'this_week') {
        fromDate = new Date(now - 7 * 24 * 60 * 60 * 1000);
      } else if (dateRange === 'last_week') {
        fromDate = new Date(now - 14 * 24 * 60 * 60 * 1000);
        toDate = new Date(now - 7 * 24 * 60 * 60 * 1000);
      } else { // this_month
        fromDate = new Date(now - 30 * 24 * 60 * 60 * 1000);
      }

      try {
        const fromStr = fromDate.toISOString().split('T')[0];
        const toStr = toDate.toISOString().split('T')[0];
        const revenueRes = await apiClient.get(`/admin/dashboard/revenue?from=${fromStr}&to=${toStr}`);
        
        if (revenueRes && revenueRes.data && Array.isArray(revenueRes.data) && revenueRes.data.length > 0) {
          const fills = ['#9d7df9', '#ff8da1', '#ffb076', '#ffd27d', '#aae297', '#8bc4f9'];
          const mapped = revenueRes.data.map((item: any, idx: number) => {
            const dateObj = new Date(item._id);
            const dayLabel = dateRange === 'this_month'
              ? dateObj.toLocaleDateString('en-US', { day: 'numeric', month: 'short' })
              : dateObj.toLocaleDateString('en-US', { weekday: 'short' });
            return {
              name: dayLabel || item._id,
              value: item.revenue,
              fill: fills[idx % fills.length]
            };
          });
          setRevenueData(mapped);
        } else {
          setRevenueData(getMockRevenueData(dateRange));
        }
      } catch (err) {
        console.warn('Could not load live dashboard revenue, using mock fallback', err);
        setRevenueData(getMockRevenueData(dateRange));
      }
    }
    fetchRevenue();
  }, [dateRange]);

  // Fetch and calculate Category Distribution and Recent Orders
  useEffect(() => {
    async function loadCategoryAndOrders() {
      setLoading(true);
      try {
        // Fetch products & orders to matches categories
        const [prodRes, ordersRes] = await Promise.all([
          apiClient.get('/admin/products?limit=250'),
          apiClient.get('/admin/orders?limit=100')
        ]);
        
        const products = prodRes?.data || [];
        const orders = ordersRes?.data || [];

        // Save recent 5 orders
        const sortedOrders = [...orders]
          .sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        setRecentOrders(sortedOrders.slice(0, 5));

        // Category Distribution (Major Categories only)
        const productCategoryMap: Record<string, string> = {};
        products.forEach((p: any) => {
          productCategoryMap[p._id] = p.petCategory;
        });

        const categorySales: Record<string, number> = {
          dogs: 0,
          cats: 0,
          fish: 0,
          birds: 0,
          small_pets: 0
        };

        let totalSalesCount = 0;
        orders.forEach((order: any) => {
          if (order.items && Array.isArray(order.items)) {
            order.items.forEach((item: any) => {
              const petCat = productCategoryMap[item.product] || getPetCategoryByName(item.productName);
              if (petCat && categorySales[petCat] !== undefined) {
                const qty = item.quantity || 1;
                categorySales[petCat] += qty;
                totalSalesCount += qty;
              }
            });
          }
        });

        const fills = ['#9d7df9', '#ff8da1', '#ffb076', '#ffd27d', '#8bc4f9'];
        const labels: Record<string, string> = {
          dogs: 'Dogs 🐕',
          cats: 'Cats 🐈',
          fish: 'Fish 🐠',
          birds: 'Birds 🦜',
          small_pets: 'Small Pets 🐹'
        };

        if (totalSalesCount > 0) {
          const mapped = Object.keys(categorySales)
            .map((key, idx) => {
              const val = categorySales[key];
              const pct = Math.round((val / totalSalesCount) * 100);
              return {
                name: labels[key],
                value: pct,
                color: fills[idx % fills.length]
              };
            })
            .filter(item => item.value > 0);
          setCategoryData(mapped);
        } else {
          // Mock major categories distribution
          setCategoryData([
            { name: 'Dogs 🐕', value: 45, color: fills[0] },
            { name: 'Cats 🐈', value: 30, color: fills[1] },
            { name: 'Fish 🐠', value: 12, color: fills[2] },
            { name: 'Birds 🦜', value: 8, color: fills[3] },
            { name: 'Small Pets 🐹', value: 5, color: fills[4] }
          ]);
        }
      } catch (err) {
        console.warn('Could not load categories or orders, using mock fallbacks', err);
        const fills = ['#9d7df9', '#ff8da1', '#ffb076', '#ffd27d', '#8bc4f9'];
        setCategoryData([
          { name: 'Dogs 🐕', value: 45, color: fills[0] },
          { name: 'Cats 🐈', value: 30, color: fills[1] },
          { name: 'Fish 🐠', value: 12, color: fills[2] },
          { name: 'Birds 🦜', value: 8, color: fills[3] },
          { name: 'Small Pets 🐹', value: 5, color: fills[4] }
        ]);
      } finally {
        setLoading(false);
      }
    }
    loadCategoryAndOrders();
  }, []);

  return (
    <div className="space-y-6">
      
      {/* 1. KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        
        {/* Card 1: Total Revenue */}
        <div className="clay-card-purple rounded-[28px] p-5 flex flex-col justify-between min-h-[140px] relative overflow-hidden group border border-white/45 shadow-clay-card">
          <div className="flex items-start justify-between">
            <div className="space-y-1">
              <span className="text-[11px] font-extrabold tracking-wider opacity-70">Total Revenue</span>
              <h2 className="text-2xl font-black tracking-tight text-[#3b2b5c]">
                {stats ? `₹${stats.totalRevenue.toLocaleString()}` : '₹0'}
              </h2>
            </div>
            <div className="w-10 h-10 rounded-xl bg-white/45 flex items-center justify-center text-purple-700 shadow-sm border border-white">
              <ShoppingBag className="w-4 h-4 stroke-[2.5]" />
            </div>
          </div>
          <div className="flex items-center gap-1 mt-4 text-[11px] font-black text-emerald-700">
            <span>+18%</span>
            <span className="opacity-70 font-bold">this week</span>
          </div>
        </div>

        {/* Card 2: Customers */}
        <div className="clay-card-peach rounded-[28px] p-5 flex flex-col justify-between min-h-[140px] relative overflow-hidden group border border-white/45 shadow-clay-card">
          <div className="flex items-start justify-between">
            <div className="space-y-1">
              <span className="text-[11px] font-extrabold tracking-wider opacity-70">Total Customers</span>
              <h2 className="text-2xl font-black tracking-tight text-[#3b2b5c]">
                {stats ? stats.totalUsers.toLocaleString() : '0'}
              </h2>
            </div>
            <div className="w-10 h-10 rounded-xl bg-white/45 flex items-center justify-center text-rose-700 shadow-sm border border-white">
              <Users className="w-4 h-4 stroke-[2.5]" />
            </div>
          </div>
          <div className="flex items-center gap-1 mt-4 text-[11px] font-black text-emerald-700">
            <span>+8%</span>
            <span className="opacity-70 font-bold">this week</span>
          </div>
        </div>

        {/* Card 3: Active Products */}
        <div className="clay-card-yellow rounded-[28px] p-5 flex flex-col justify-between min-h-[140px] relative overflow-hidden group border border-white/45 shadow-clay-card">
          <div className="flex items-start justify-between">
            <div className="space-y-1">
              <span className="text-[11px] font-extrabold tracking-wider opacity-70">Active Products</span>
              <h2 className="text-2xl font-black tracking-tight text-[#3b2b5c]">
                {stats ? stats.totalProducts.toLocaleString() : '0'}
              </h2>
            </div>
            <div className="w-10 h-10 rounded-xl bg-white/45 flex items-center justify-center text-amber-700 shadow-sm border border-white">
              <Clock className="w-4 h-4 stroke-[2.5]" />
            </div>
          </div>
          <div className="flex items-center gap-1 mt-4 text-[11px] font-black text-amber-800">
            <span>{stats ? `${stats.lowStockCount} low stock` : '0 low stock'}</span>
          </div>
        </div>

        {/* Card 4: Pending Orders */}
        <div className="clay-card-blue rounded-[28px] p-5 flex flex-col justify-between min-h-[140px] relative overflow-hidden group border border-white/45 shadow-clay-card">
          <div className="flex items-start justify-between">
            <div className="space-y-1">
              <span className="text-[11px] font-extrabold tracking-wider opacity-70">Pending Orders</span>
              <h2 className="text-2xl font-black tracking-tight text-[#3b2b5c]">
                {stats ? stats.pendingOrders.toLocaleString() : '0'}
              </h2>
            </div>
            <div className="w-10 h-10 rounded-xl bg-white/45 flex items-center justify-center text-blue-700 shadow-sm border border-white">
              <Flame className="w-4 h-4 stroke-[2.5] fill-blue-700" />
            </div>
          </div>
          <div className="flex items-center gap-1 mt-4 text-[11px] font-black text-blue-800">
            <span className="font-extrabold">needs processing</span>
          </div>
        </div>

      </div>

      {/* 2. Main Chart Sections */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        
        {/* Sales Performance */}
        <div className="xl:col-span-2 clay-white-card rounded-[32px] p-6 min-h-[380px] flex flex-col justify-between border-[3px] border-white shadow-clay-card bg-[#faf6f0]">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-black text-lg text-slate-800">Sales Performance</h3>
            </div>
            
            <div className="flex items-center gap-3">
              {/* Chart Type Toggle */}
              <div className="bg-slate-100 p-1 rounded-xl flex gap-1 border border-slate-200">
                <button
                  type="button"
                  onClick={() => setChartType('bar')}
                  className={`px-3 py-1 text-[10px] font-black rounded-lg transition-all ${
                    chartType === 'bar'
                      ? 'bg-[#8e78f5] text-white shadow-sm'
                      : 'text-slate-500 hover:text-slate-700'
                  }`}
                >
                  Bar Chart
                </button>
                <button
                  type="button"
                  onClick={() => setChartType('line')}
                  className={`px-3 py-1 text-[10px] font-black rounded-lg transition-all ${
                    chartType === 'line'
                      ? 'bg-[#8e78f5] text-white shadow-sm'
                      : 'text-slate-500 hover:text-slate-700'
                  }`}
                >
                  Line Chart
                </button>
              </div>

              {/* Date Filter */}
              <select 
                value={dateRange}
                onChange={(e) => setDateRange(e.target.value as any)}
                className="px-3.5 py-1.5 bg-white border-2 border-slate-200 text-slate-700 text-xs font-black rounded-xl shadow-sm outline-none cursor-pointer hover:bg-slate-50 transition-colors"
              >
                <option value="this_week">This Week</option>
                <option value="last_week">Last Week</option>
                <option value="this_month">This Month</option>
              </select>
            </div>
          </div>

          {/* Chart Section */}
          <div className="flex-1 w-full h-[240px] mt-4">
            {loading ? (
              <div className="w-full h-full flex items-center justify-center">
                <div className="w-8 h-8 border-4 border-[#8e78f5] border-t-transparent rounded-full animate-spin" />
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                {chartType === 'bar' ? (
                  <BarChart data={revenueData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                    <XAxis 
                      dataKey="name" 
                      tickLine={false} 
                      axisLine={false} 
                      tick={{ fill: '#6b7280', fontSize: 11, fontWeight: 'bold' }} 
                    />
                    <YAxis 
                      tickLine={false} 
                      axisLine={false} 
                      tick={{ fill: '#6b7280', fontSize: 11, fontWeight: 'bold' }}
                    />
                    <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(142,120,245,0.05)' }} />
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
                ) : (
                  <LineChart data={revenueData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                    <XAxis 
                      dataKey="name" 
                      tickLine={false} 
                      axisLine={false} 
                      tick={{ fill: '#6b7280', fontSize: 11, fontWeight: 'bold' }} 
                    />
                    <YAxis 
                      tickLine={false} 
                      axisLine={false} 
                      tick={{ fill: '#6b7280', fontSize: 11, fontWeight: 'bold' }}
                    />
                    <Tooltip content={<CustomTooltip />} />
                    <Line 
                      type="monotone" 
                      dataKey="value" 
                      stroke="#8e78f5" 
                      strokeWidth={4} 
                      dot={{ r: 6, fill: '#fff', stroke: '#8e78f5', strokeWidth: 3 }} 
                      activeDot={{ r: 8 }} 
                    />
                  </LineChart>
                )}
              </ResponsiveContainer>
            )}
          </div>
        </div>

        {/* Top Selling Categories (Major Categories Donut) */}
        <div className="clay-white-card rounded-[32px] p-6 min-h-[380px] flex flex-col justify-between border-[3px] border-white shadow-clay-card bg-[#faf6f0]">
          <div>
            <h3 className="font-black text-lg text-slate-800">Top Selling Categories</h3>
          </div>

          <div className="flex-1 w-full h-[180px] flex items-center justify-center relative my-3">
            {loading ? (
              <div className="w-8 h-8 border-4 border-[#8e78f5] border-t-transparent rounded-full animate-spin" />
            ) : categoryData.length > 0 ? (
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
                  <Tooltip content={<CustomPieTooltip />} />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="text-center text-xs font-black text-slate-400 uppercase tracking-wide">
                🌱 No Category Data
              </div>
            )}
          </div>

          {/* List Legends */}
          <div className="space-y-1.5 border-t border-slate-200/60 pt-3">
            {categoryData.length > 0 ? (
              categoryData.map((cat, idx) => (
                <div key={idx} className="flex items-center justify-between text-xs font-black text-slate-600">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full shrink-0 animate-pulse" style={{ backgroundColor: cat.color }} />
                    <span>{cat.name}</span>
                  </div>
                  <span>{cat.value}%</span>
                </div>
              ))
            ) : (
              <p className="text-[10px] text-slate-400 text-center font-bold">Add category order items to view distribution</p>
            )}
          </div>
        </div>

      </div>

      {/* 3. Bottom Row: Recent Orders & Promotions Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Recent 5 Orders */}
        <div className="clay-white-card rounded-[32px] p-6 min-h-[320px] flex flex-col justify-between border-[3px] border-white shadow-clay-card bg-[#faf6f0]">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-black text-lg text-slate-800">Recent 5 Orders</h3>
            <button 
              onClick={() => window.dispatchEvent(new CustomEvent('admin-nav', { detail: 'Orders' }))}
              className="text-xs font-black text-[#8e78f5] hover:underline cursor-pointer"
            >
              See All
            </button>
          </div>

          <div className="space-y-3 flex-grow justify-center flex flex-col">
            {recentOrders.length > 0 ? (
              recentOrders.map((order) => {
                const dateStr = new Date(order.createdAt).toLocaleDateString('en-IN', {
                  day: 'numeric',
                  month: 'short',
                  hour: '2-digit',
                  minute: '2-digit'
                });
                
                const statusColors: Record<string, { bg: string, text: string }> = {
                  pending: { bg: '#fffbeb', text: '#d97706' },
                  confirmed: { bg: '#eff6ff', text: '#3b82f6' },
                  packed: { bg: '#faf5ff', text: '#8b5cf6' },
                  shipped: { bg: '#f0fdf4', text: '#16a34a' },
                  out_for_delivery: { bg: '#ecfeff', text: '#0891b2' },
                  delivered: { bg: '#f0fdf4', text: '#16a34a' },
                  cancelled: { bg: '#fef2f2', text: '#ef4444' }
                };
                
                const statusInfo = statusColors[order.status.toLowerCase()] || { bg: '#f3f4f6', text: '#4b5563' };

                return (
                  <div key={order._id} className="flex items-center justify-between p-2.5 hover:bg-slate-50/50 rounded-2xl transition-colors border border-transparent hover:border-slate-100">
                    <div className="flex items-center gap-3.5 min-w-0">
                      <div className="w-10 h-10 rounded-xl bg-[#e2d9ff]/30 text-[#8e78f5] flex items-center justify-center font-black text-xs shrink-0 border border-slate-100 shadow-inner select-none">
                        📦
                      </div>
                      <div className="min-w-0">
                        <h4 className="font-black text-sm text-slate-800 tracking-tight flex items-center gap-2">
                          {order.orderNumber}
                          <span 
                            className="px-2 py-0.5 rounded-lg text-[9px] font-black uppercase tracking-wider" 
                            style={{ backgroundColor: statusInfo.bg, color: statusInfo.text }}
                          >
                            {order.status}
                          </span>
                        </h4>
                        <p className="text-[10px] text-slate-400 font-extrabold mt-0.5 truncate">
                          {order.shippingAddress?.fullName || 'Anonymous Customer'} • {dateStr}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3">
                      <span className="font-black text-sm text-[#f97316]">₹{order.total.toLocaleString()}</span>
                    </div>
                  </div>
                );
              })
            ) : (
              // Realistic mock data fallback if database is empty
              [
                { num: 'PAW-0842', name: 'Rahul Sharma', date: 'Just now', total: 1250, status: 'pending', emoji: '📦' },
                { num: 'PAW-0841', name: 'Priya Patel', date: '12 min ago', total: 3400, status: 'confirmed', emoji: '🐕' },
                { num: 'PAW-0840', name: 'Amit Kumar', date: '1 hr ago', total: 850, status: 'delivered', emoji: '🐈' },
                { num: 'PAW-0839', name: 'Sneha Reddy', date: '3 hrs ago', total: 1950, status: 'shipped', emoji: '🐠' },
                { num: 'PAW-0838', name: 'Vikram Singh', date: 'Yesterday', total: 5400, status: 'delivered', emoji: '🦜' }
              ].map((mockOrder, idx) => (
                <div key={idx} className="flex items-center justify-between p-2.5 hover:bg-slate-50/50 rounded-2xl transition-colors border border-transparent hover:border-slate-100">
                  <div className="flex items-center gap-3.5 min-w-0">
                    <div className="w-10 h-10 rounded-xl text-lg flex items-center justify-center shrink-0 border border-slate-100 shadow-inner select-none bg-slate-50">
                      {mockOrder.emoji}
                    </div>
                    <div className="min-w-0">
                      <h4 className="font-black text-sm text-slate-800 tracking-tight flex items-center gap-2">
                        {mockOrder.num}
                        <span 
                          className="px-2 py-0.5 rounded-lg text-[9px] font-black uppercase tracking-wider" 
                          style={{ 
                            backgroundColor: mockOrder.status === 'delivered' ? '#f0fdf4' : mockOrder.status === 'confirmed' ? '#eff6ff' : '#fffbeb', 
                            color: mockOrder.status === 'delivered' ? '#16a34a' : mockOrder.status === 'confirmed' ? '#3b82f6' : '#d97706' 
                          }}
                        >
                          {mockOrder.status}
                        </span>
                      </h4>
                      <p className="text-[10px] text-slate-400 font-extrabold mt-0.5 truncate">
                        {mockOrder.name} • {mockOrder.date}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <span className="font-black text-sm text-[#f97316]">₹{mockOrder.total.toLocaleString()}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Promotions & Quick Actions shortcuts */}
        <div className="clay-white-card rounded-[32px] p-6 min-h-[320px] flex flex-col justify-between border-[3px] border-white shadow-clay-card bg-[#faf6f0]">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-black text-lg text-slate-800">Promotions & Quick Actions</h3>
            <span className="px-2.5 py-1 bg-emerald-50 text-emerald-600 border border-emerald-100 rounded-xl text-[10px] font-black uppercase tracking-wider animate-pulse select-none">
              ● Campaigns Active
            </span>
          </div>

          <div className="grid grid-cols-2 gap-4 my-2.5">
            {/* Promo code stat */}
            <div className="bg-[#faf6f0] border-2 border-slate-100 rounded-2xl p-4 flex flex-col justify-between">
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-wide">Active Coupons</span>
              <div className="flex items-baseline gap-1 mt-2">
                <span className="text-xl font-black text-slate-800">3</span>
                <span className="text-[10px] font-bold text-slate-400">codes</span>
              </div>
              <div className="text-[9px] text-[#8e78f5] font-black mt-2 select-none">
                Top Code: PAWCOZY 🎁
              </div>
            </div>

            {/* Spin wheel stat */}
            <div className="bg-[#faf6f0] border-2 border-slate-100 rounded-2xl p-4 flex flex-col justify-between">
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-wide">Spin Wheel</span>
              <div className="flex items-baseline gap-1 mt-2">
                <span className="text-xl font-black text-slate-800">8</span>
                <span className="text-[10px] font-bold text-slate-400">prizes</span>
              </div>
              <div className="text-[9px] text-[#8e78f5] font-black mt-2 select-none">
                Active 🎡
              </div>
            </div>
          </div>

          {/* Quick Actions List */}
          <div className="space-y-2.5">
            <label className="text-[9px] font-black text-slate-400 uppercase tracking-wider block pl-1 select-none">
              Shortcuts
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button 
                onClick={() => {
                  window.dispatchEvent(new CustomEvent('admin-nav', { detail: 'Add Product' }));
                }}
                className="py-2 px-3 bg-[#e2d9ff]/40 hover:bg-[#e2d9ff]/60 text-[#8e78f5] font-black text-xs rounded-xl border border-[#e2d9ff]/50 shadow-sm transition-all text-left flex items-center gap-2 cursor-pointer"
              >
                <span>➕</span> Add Product
              </button>
              <button 
                onClick={() => {
                  window.dispatchEvent(new CustomEvent('admin-nav', { detail: 'Coupons' }));
                }}
                className="py-2 px-3 bg-[#ffdce0]/40 hover:bg-[#ffdce0]/60 text-rose-500 font-black text-xs rounded-xl border border-[#ffdce0]/50 shadow-sm transition-all text-left flex items-center gap-2 cursor-pointer"
              >
                <span>🎁</span> Create Coupon
              </button>
              <button 
                onClick={() => {
                  window.dispatchEvent(new CustomEvent('admin-nav', { detail: 'Spin Wheel' }));
                }}
                className="py-2 px-3 bg-[#fffbe5]/40 hover:bg-[#fffbe5]/60 text-amber-600 font-black text-xs rounded-xl border border-[#fffbe5]/50 shadow-sm transition-all text-left flex items-center gap-2 cursor-pointer"
              >
                <span>🎡</span> Configure Spin
              </button>
              <button 
                onClick={() => {
                  window.dispatchEvent(new CustomEvent('admin-nav', { detail: 'Settings' }));
                }}
                className="py-2 px-3 bg-[#e0f2fe]/40 hover:bg-[#e0f2fe]/60 text-sky-600 font-black text-xs rounded-xl border border-[#e0f2fe]/50 shadow-sm transition-all text-left flex items-center gap-2 cursor-pointer"
              >
                <span>⚙️</span> Admin Settings
              </button>
            </div>
          </div>
        </div>

      </div>

      {/* 4. Discover New Supplies Bottom Banner */}
      <div className="clay-star-banner rounded-[32px] p-6 flex flex-col sm:flex-row items-center justify-between gap-6 border-[4px] border-white relative overflow-hidden group shadow-clay-card">
        <div className="flex items-center gap-5 z-10">
          
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

        <button 
          onClick={() => window.dispatchEvent(new CustomEvent('admin-nav', { detail: 'Products' }))}
          className="px-6 py-3 bg-[#8e78f5] text-white border border-white/50 font-black text-xs rounded-2xl shadow-md hover:bg-[#7d67e5] active:scale-95 transition-all shrink-0 z-10 cursor-pointer"
        >
          Explore Now
        </button>

        {/* Skewed stripe details */}
        <div className="absolute right-[-10%] top-0 bottom-0 w-1/4 bg-white/10 skew-x-12 pointer-events-none" />
      </div>

    </div>
  );
}
