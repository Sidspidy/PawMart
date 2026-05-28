import { motion } from 'framer-motion';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, Cell, PieChart, Pie, Legend
} from 'recharts';
import { 
  DollarSign, ShoppingCart, Users, Package, Ticket, Sparkles, 
  ArrowUpRight, ArrowDownRight, PawPrint, Heart, Star, CloudSun
} from 'lucide-react';

// Mock data for Recharts
const revenueData = [
  { name: 'Mon', revenue: 4200, orders: 120 },
  { name: 'Tue', revenue: 5800, orders: 145 },
  { name: 'Wed', revenue: 5100, orders: 130 },
  { name: 'Thu', revenue: 7400, orders: 190 },
  { name: 'Fri', revenue: 6800, orders: 165 },
  { name: 'Sat', revenue: 9500, orders: 240 },
  { name: 'Sun', revenue: 8900, orders: 210 },
];

const categoryData = [
  { name: 'Dogs 🐶', value: 4500, color: '#e7c6ff' },
  { name: 'Cats 🐱', value: 3800, color: '#ffd6ff' },
  { name: 'Birds 🦜', value: 1600, color: '#ffd8be' },
  { name: 'Small Pets 🐹', value: 1200, color: '#e2f0cb' },
];

const spinRewardData = [
  { name: 'Free Pet Toy', value: 15, color: '#8a5cf5' },
  { name: '10% Off Coupon', value: 35, color: '#f97316' },
  { name: '50 Loyalty Points', value: 25, color: '#4ade80' },
  { name: 'Try Again', value: 25, color: '#c8b6ff' },
];

export default function Dashboard() {
  
  const cardContainerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08
      }
    }
  };

  const cardItemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 260, damping: 20 } }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-6 pb-12 relative"
    >
      {/* Sparkle decorative background elements */}
      <div className="absolute top-[20%] right-[10%] text-amber-300 pointer-events-none opacity-40 animate-float">
        <Star size={24} fill="currentColor" />
      </div>
      <div className="absolute bottom-[40%] left-[2%] text-violet-300 pointer-events-none opacity-30 animate-float-delayed">
        <PawPrint size={32} fill="currentColor" />
      </div>

      {/* 1. GOOD MORNING GREETING HEADER BANNER */}
      <section className="relative overflow-hidden rounded-[32px] p-6 lg:p-8 bg-gradient-to-r from-violet-200 via-fuchsia-100 to-amber-100 border border-white/60 shadow-[0_10px_35px_-10px_rgba(138,92,245,0.12)]">
        {/* Floating clouds / illustrations inside banner */}
        <div className="absolute right-6 top-1/2 -translate-y-1/2 hidden md:block opacity-80 pointer-events-none">
          <svg width="220" height="150" viewBox="0 0 200 150" className="w-full h-auto">
            {/* Soft fluffy cloud */}
            <path d="M 50,110 C 30,110 20,95 25,80 C 15,65 30,45 50,50 C 60,30 90,30 100,50 C 115,40 135,50 130,70 C 145,75 145,95 130,105 C 120,110 50,110 50,110 Z" fill="white" filter="drop-shadow(0px 8px 16px rgba(138, 92, 245, 0.08))" />
            <path d="M 120,120 C 110,120 105,110 108,100 C 100,90 110,75 125,80 C 130,65 150,65 158,80 C 170,72 185,80 180,95 C 190,100 190,115 180,120 Z" fill="white" opacity="0.7" />
            {/* Cute sun peeking */}
            <circle cx="80" cy="50" r="16" fill="#fbcfe8" />
            <circle cx="80" cy="50" r="12" fill="#fef08a" />
          </svg>
        </div>

        <div className="relative z-10 max-w-xl">
          <div className="flex items-center gap-2 text-violet-600 font-bold text-xs uppercase tracking-widest bg-white/60 backdrop-blur-md px-3.5 py-1.5 rounded-full w-fit mb-4 border border-white">
            <CloudSun size={14} className="text-orange-400" />
            Curator Panel Active
          </div>
          <h2 className="text-2xl md:text-3xl font-extrabold text-[#3d2c54] leading-tight">
            Good Morning, Mia! ☀️
          </h2>
          <p className="text-sm text-[#705e8c] mt-2 font-medium">
            Welcome back to the pet universe! Today we have <span className="text-violet-600 font-bold underline">12 new orders</span> and a spike in Cat toy searches. Let's make some tails wag!
          </p>

          <div className="flex flex-wrap gap-3 mt-6">
            <button className="px-5 py-2.5 bg-violet-600 text-white rounded-full text-xs font-bold shadow-[0_4px_15px_rgba(138,92,245,0.3)] hover:scale-102 transition-transform cursor-pointer">
              Launch Campaign 🚀
            </button>
            <button className="px-5 py-2.5 bg-white/80 hover:bg-white text-[#705e8c] rounded-full text-xs font-bold border border-violet-100 hover:scale-102 transition-transform">
              View Feedbacks 🐾
            </button>
          </div>
        </div>
      </section>

      {/* 2. CLAYMORPHIC METRICS CARDS */}
      <motion.section 
        variants={cardContainerVariants}
        initial="hidden"
        animate="show"
        className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4"
      >
        
        {/* Metric 1: Revenue */}
        <motion.div 
          variants={cardItemVariants}
          className="glass-panel p-5 rounded-[28px] border border-white/60 shadow-soft shadow-soft-hover relative overflow-hidden bg-gradient-to-br from-violet-50/50 to-[#e8dbff]/30"
        >
          <div className="absolute top-0 right-0 w-24 h-24 bg-violet-200/30 rounded-full blur-xl pointer-events-none" />
          <div className="flex justify-between items-start mb-4">
            <div className="p-2.5 bg-[#e7c6ff] text-violet-600 rounded-2xl shadow-sm">
              <DollarSign size={20} />
            </div>
            <span className="flex items-center text-[10px] md:text-xs font-bold text-green-500 bg-green-50 px-2 py-0.5 rounded-full">
              <ArrowUpRight size={12} />
              18%
            </span>
          </div>
          <span className="text-xs font-bold text-[#705e8c] block">Total Revenue</span>
          <h3 className="text-lg md:text-2xl font-extrabold text-[#3d2c54] mt-1">$48,248</h3>
          <span className="text-[10px] text-[#9f8fb3] block mt-1">+1.2k this week</span>
        </motion.div>

        {/* Metric 2: Orders */}
        <motion.div 
          variants={cardItemVariants}
          className="glass-panel p-5 rounded-[28px] border border-white/60 shadow-soft shadow-soft-hover relative overflow-hidden bg-gradient-to-br from-orange-50/50 to-[#ffd8be]/30"
        >
          <div className="absolute top-0 right-0 w-24 h-24 bg-orange-200/30 rounded-full blur-xl pointer-events-none" />
          <div className="flex justify-between items-start mb-4">
            <div className="p-2.5 bg-[#ffd8be] text-orange-600 rounded-2xl shadow-sm">
              <ShoppingCart size={20} />
            </div>
            <span className="flex items-center text-[10px] md:text-xs font-bold text-green-500 bg-green-50 px-2 py-0.5 rounded-full">
              <ArrowUpRight size={12} />
              8%
            </span>
          </div>
          <span className="text-xs font-bold text-[#705e8c] block">Orders Count</span>
          <h3 className="text-lg md:text-2xl font-extrabold text-[#3d2c54] mt-1">1,248</h3>
          <span className="text-[10px] text-[#9f8fb3] block mt-1">+92 since yesterday</span>
        </motion.div>

        {/* Metric 3: Customers */}
        <motion.div 
          variants={cardItemVariants}
          className="glass-panel p-5 rounded-[28px] border border-white/60 shadow-soft shadow-soft-hover relative overflow-hidden bg-gradient-to-br from-emerald-50/50 to-[#e2f0cb]/30"
        >
          <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-200/30 rounded-full blur-xl pointer-events-none" />
          <div className="flex justify-between items-start mb-4">
            <div className="p-2.5 bg-[#e2f0cb] text-emerald-600 rounded-2xl shadow-sm">
              <Users size={20} />
            </div>
            <span className="flex items-center text-[10px] md:text-xs font-bold text-green-500 bg-green-50 px-2 py-0.5 rounded-full">
              <ArrowUpRight size={12} />
              6%
            </span>
          </div>
          <span className="text-xs font-bold text-[#705e8c] block">Happy Owners</span>
          <h3 className="text-lg md:text-2xl font-extrabold text-[#3d2c54] mt-1">4,850</h3>
          <span className="text-[10px] text-[#9f8fb3] block mt-1">+140 loyal accounts</span>
        </motion.div>

        {/* Metric 4: Products */}
        <motion.div 
          variants={cardItemVariants}
          className="glass-panel p-5 rounded-[28px] border border-white/60 shadow-soft shadow-soft-hover relative overflow-hidden bg-gradient-to-br from-blue-50/50 to-[#e8dbff]/30"
        >
          <div className="absolute top-0 right-0 w-24 h-24 bg-blue-200/30 rounded-full blur-xl pointer-events-none" />
          <div className="flex justify-between items-start mb-4">
            <div className="p-2.5 bg-blue-100 text-blue-600 rounded-2xl shadow-sm">
              <Package size={20} />
            </div>
            <span className="flex items-center text-[10px] md:text-xs font-bold text-[#705e8c] bg-white px-2 py-0.5 rounded-full">
              Active
            </span>
          </div>
          <span className="text-xs font-bold text-[#705e8c] block">Pet Products</span>
          <h3 className="text-lg md:text-2xl font-extrabold text-[#3d2c54] mt-1">312</h3>
          <span className="text-[10px] text-[#9f8fb3] block mt-1">+4 items added</span>
        </motion.div>

        {/* Metric 5: Coupons */}
        <motion.div 
          variants={cardItemVariants}
          className="glass-panel p-5 rounded-[28px] border border-white/60 shadow-soft shadow-soft-hover relative overflow-hidden bg-gradient-to-br from-pink-50/50 to-[#ffd6ff]/30"
        >
          <div className="absolute top-0 right-0 w-24 h-24 bg-pink-200/30 rounded-full blur-xl pointer-events-none" />
          <div className="flex justify-between items-start mb-4">
            <div className="p-2.5 bg-[#ffd6ff] text-pink-600 rounded-2xl shadow-sm">
              <Ticket size={20} />
            </div>
            <span className="flex items-center text-[10px] md:text-xs font-bold text-red-400 bg-red-50 px-2 py-0.5 rounded-full">
              <ArrowDownRight size={12} />
              2%
            </span>
          </div>
          <span className="text-xs font-bold text-[#705e8c] block">Coupons Claimed</span>
          <h3 className="text-lg md:text-2xl font-extrabold text-[#3d2c54] mt-1">189</h3>
          <span className="text-[10px] text-[#9f8fb3] block mt-1">12 codes expiring</span>
        </motion.div>

        {/* Metric 6: Spin plays */}
        <motion.div 
          variants={cardItemVariants}
          className="glass-panel p-5 rounded-[28px] border border-white/60 shadow-soft shadow-soft-hover relative overflow-hidden bg-gradient-to-br from-yellow-50/50 to-[#fde2e4]/30"
        >
          <div className="absolute top-0 right-0 w-24 h-24 bg-yellow-200/30 rounded-full blur-xl pointer-events-none" />
          <div className="flex justify-between items-start mb-4">
            <div className="p-2.5 bg-yellow-100 text-yellow-600 rounded-2xl shadow-sm animate-spin" style={{ animationDuration: '8s' }}>
              <Sparkles size={20} />
            </div>
            <span className="flex items-center text-[10px] md:text-xs font-bold text-green-500 bg-green-50 px-2 py-0.5 rounded-full">
              <ArrowUpRight size={12} />
              32%
            </span>
          </div>
          <span className="text-xs font-bold text-[#705e8c] block">Wheel Spins</span>
          <h3 className="text-lg md:text-2xl font-extrabold text-[#3d2c54] mt-1">728</h3>
          <span className="text-[10px] text-[#9f8fb3] block mt-1">High conversion!</span>
        </motion.div>

      </motion.section>

      {/* 3. CHARTS LAYOUT ROW */}
      <section className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        
        {/* LEFT CHART: REVENUE AREA CHART */}
        <div className="xl:col-span-2 glass-panel p-6 rounded-[32px] border border-white/60 shadow-soft flex flex-col h-[400px]">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="font-extrabold text-lg text-[#3d2c54] flex items-center gap-2">
                <PawPrint size={18} className="text-violet-500 fill-violet-100" />
                Revenue & Orders Overview
              </h3>
              <p className="text-xs text-[#705e8c]">Daily tracking of earnings vs orders checkout</p>
            </div>
            <select className="text-xs font-bold text-[#705e8c] bg-white border border-violet-100/80 px-3 py-1.5 rounded-full outline-none cursor-pointer">
              <option>This Week</option>
              <option>Last Week</option>
              <option>This Month</option>
            </select>
          </div>

          <div className="flex-1 w-full text-xs font-semibold text-[#9f8fb3]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={revenueData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8a5cf5" stopOpacity={0.25}/>
                    <stop offset="95%" stopColor="#8a5cf5" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorOrders" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f97316" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#f97316" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(200, 182, 255, 0.2)" />
                <XAxis dataKey="name" stroke="#9f8fb3" tickLine={false} axisLine={false} />
                <YAxis stroke="#9f8fb3" tickLine={false} axisLine={false} />
                <Tooltip 
                  contentStyle={{ 
                    background: 'rgba(255, 255, 255, 0.95)', 
                    border: '1px solid rgba(138, 92, 245, 0.15)',
                    borderRadius: '16px',
                    boxShadow: '0 8px 30px rgba(138, 92, 245, 0.08)',
                    color: '#3d2c54'
                  }} 
                />
                <Area type="monotone" dataKey="revenue" name="Revenue ($)" stroke="#8a5cf5" strokeWidth={3} fillOpacity={1} fill="url(#colorRevenue)" />
                <Area type="monotone" dataKey="orders" name="Orders Count" stroke="#f97316" strokeWidth={2.5} fillOpacity={1} fill="url(#colorOrders)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* RIGHT CHART: CATEGORY PERFORMANCE BAR CHART */}
        <div className="glass-panel p-6 rounded-[32px] border border-white/60 shadow-soft flex flex-col h-[400px]">
          <div className="mb-6">
            <h3 className="font-extrabold text-lg text-[#3d2c54] flex items-center gap-2">
              <Heart size={18} className="text-orange-500 fill-orange-100" />
              Category Sales Performance
            </h3>
            <p className="text-xs text-[#705e8c]">Sales distribution among primary pet sectors</p>
          </div>

          <div className="flex-1 w-full text-xs font-semibold text-[#9f8fb3]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={categoryData} margin={{ top: 10, right: 10, left: -25, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(200, 182, 255, 0.2)" />
                <XAxis dataKey="name" stroke="#9f8fb3" tickLine={false} axisLine={false} />
                <YAxis stroke="#9f8fb3" tickLine={false} axisLine={false} />
                <Tooltip 
                  contentStyle={{ 
                    background: 'rgba(255, 255, 255, 0.95)', 
                    border: '1px solid rgba(138, 92, 245, 0.15)',
                    borderRadius: '16px',
                    boxShadow: '0 8px 30px rgba(138, 92, 245, 0.08)',
                    color: '#3d2c54'
                  }}
                  cursor={{ fill: 'rgba(200, 182, 255, 0.1)' }}
                />
                <Bar dataKey="value" name="Sales ($)" radius={[10, 10, 0, 0]} maxBarSize={45}>
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} stroke={entry.color} strokeWidth={1} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

      </section>

      {/* 4. LOWER ROW: SPIN REWARDS & LATEST ACTIVITY */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* LEFT COMPONENT: SPIN REWARD DONUT DIAGRAM */}
        <div className="glass-panel p-6 rounded-[32px] border border-white/60 shadow-soft flex flex-col lg:flex-row items-center gap-6 h-auto min-h-[300px]">
          <div className="flex-1 flex flex-col justify-center">
            <h3 className="font-extrabold text-lg text-[#3d2c54] flex items-center gap-2">
              <Sparkles size={18} className="text-violet-500 fill-violet-100" />
              Spin Wheel Rewards
            </h3>
            <p className="text-xs text-[#705e8c] mt-1">Analytics on reward giveaways from spin plays</p>
            
            <div className="mt-4 space-y-2">
              {spinRewardData.map((reward, i) => (
                <div key={i} className="flex items-center gap-2 text-xs font-bold text-[#705e8c]">
                  <span className="w-3 h-3 rounded-full" style={{ backgroundColor: reward.color }} />
                  <span>{reward.name}: <span className="text-[#3d2c54]">{reward.value}%</span></span>
                </div>
              ))}
            </div>
          </div>

          <div className="w-[180px] h-[180px] shrink-0 relative flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={spinRewardData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {spinRewardData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
            {/* Center decoration */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="w-24 h-24 bg-white rounded-full flex flex-col items-center justify-center border border-violet-100 shadow-sm">
                <Sparkles size={20} className="text-[#8a5cf5]" />
                <span className="text-[10px] font-extrabold text-[#705e8c] mt-0.5">Spins Log</span>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT COMPONENT: ACTIVE CURATORS LOG */}
        <div className="glass-panel p-6 rounded-[32px] border border-white/60 shadow-soft flex flex-col h-auto min-h-[300px]">
          <div>
            <h3 className="font-extrabold text-lg text-[#3d2c54] flex items-center gap-2">
              <Users size={18} className="text-emerald-500 fill-emerald-50" />
              Latest Curator Activity
            </h3>
            <p className="text-xs text-[#705e8c]">Realtime actions performed in the backend</p>
          </div>

          <div className="mt-4 flex-1 space-y-3.5">
            
            {/* Log item 1 */}
            <div className="flex items-center justify-between p-3 bg-white/40 border border-white/60 rounded-2xl hover:bg-white/80 transition-colors duration-200">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-violet-100 flex items-center justify-center text-violet-600">
                  <Star size={16} fill="currentColor" />
                </div>
                <div>
                  <h4 className="text-xs font-extrabold text-[#3d2c54]">Mia changed "Golden Bone Chew" Price</h4>
                  <span className="text-[10px] text-[#9f8fb3] block">10 mins ago • Product edit</span>
                </div>
              </div>
              <span className="text-xs font-extrabold text-violet-600">$18.99</span>
            </div>

            {/* Log item 2 */}
            <div className="flex items-center justify-between p-3 bg-white/40 border border-white/60 rounded-2xl hover:bg-white/80 transition-colors duration-200">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center text-orange-600">
                  <ShoppingCart size={16} fill="currentColor" />
                </div>
                <div>
                  <h4 className="text-xs font-extrabold text-[#3d2c54]">New Order checkout #PW-9801</h4>
                  <span className="text-[10px] text-[#9f8fb3] block">32 mins ago • Sales system</span>
                </div>
              </div>
              <span className="text-xs font-extrabold text-orange-600">$142.50</span>
            </div>

            {/* Log item 3 */}
            <div className="flex items-center justify-between p-3 bg-white/40 border border-white/60 rounded-2xl hover:bg-white/80 transition-colors duration-200">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600">
                  <Users size={16} fill="currentColor" />
                </div>
                <div>
                  <h4 className="text-xs font-extrabold text-[#3d2c54]">Toby (Golden Retriever owner) Registered</h4>
                  <span className="text-[10px] text-[#9f8fb3] block">1 hr ago • Account creation</span>
                </div>
              </div>
              <span className="text-xs font-bold text-emerald-500 bg-emerald-50 px-2 py-0.5 rounded-full text-[10px]">New Owner</span>
            </div>

          </div>
        </div>

      </section>

      {/* 5. CUTE FLOATING MOTIVATION BANNER */}
      <section className="glass-panel p-5 rounded-[28px] border border-white/80 bg-gradient-to-r from-[#ffd6ff]/20 to-[#c8b6ff]/20 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-orange-400 shadow-sm animate-float">
            <Star size={24} fill="currentColor" />
          </div>
          <div>
            <h4 className="font-extrabold text-sm text-[#3d2c54]">Did you know? 🐕</h4>
            <p className="text-xs text-[#705e8c] mt-0.5">Customers buy 40% more items when a matching sticker pack is added as a spin reward!</p>
          </div>
        </div>
        <button className="px-5 py-2.5 bg-white text-[#8a5cf5] hover:bg-violet-50 rounded-full text-xs font-extrabold shadow-[0_4px_12px_rgba(138,92,245,0.06)] border border-violet-100 flex items-center gap-2 self-start md:self-auto cursor-pointer">
          Optimize Spin Wheel
          <ArrowUpRight size={14} />
        </button>
      </section>

    </motion.div>
  );
}
