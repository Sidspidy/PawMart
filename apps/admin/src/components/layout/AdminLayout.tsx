import { useState } from 'react';
import { Outlet, NavLink, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  LayoutDashboard, Package, PlusCircle, Tag, 
  ShoppingBag, Users, Ticket, Sparkles, KeyRound, Settings as SettingsIcon, 
  Menu, X, Bell, Search, PawPrint, LogOut, ChevronRight
} from 'lucide-react';

const NAV_ITEMS = [
  { label: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
  { label: 'Products', path: '/products', icon: Package },
  { label: 'Add Product', path: '/products/new', icon: PlusCircle },
  { label: 'Categories', path: '/categories', icon: Tag },
  { label: 'Orders', path: '/orders', icon: ShoppingBag },
  { label: 'Customers', path: '/customers', icon: Users },
  { label: 'Coupons', path: '/coupons', icon: Ticket },
  { label: 'Spin Wheel', path: '/spin', icon: Sparkles },
  { label: 'Roles & Staff', path: '/settings/roles', icon: KeyRound },
  { label: 'Settings', path: '/settings', icon: SettingsIcon },
];

export default function AdminLayout() {
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const location = useLocation();

  // Floating decoration paw prints
  const floatingPaws = [
    { left: '10%', top: '25%', delay: 0, size: 14 },
    { left: '85%', top: '45%', delay: 1.5, size: 18 },
    { left: '20%', top: '75%', delay: 0.8, size: 12 },
    { left: '75%', top: '90%', delay: 2.2, size: 16 },
  ];

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-[#fbf9ff] to-[#f5f0ff] text-[#3d2c54] overflow-x-hidden antialiased">
      
      {/* 1. DESKTOP SIDEBAR - FLOATING ROUNDED 3D STYLE */}
      <aside className="hidden lg:flex flex-col w-[280px] h-[calc(100vh-2rem)] fixed left-4 top-4 bottom-4 glass-panel rounded-[32px] border border-white/60 shadow-[0_12px_40px_-10px_rgba(138,92,245,0.15)] overflow-hidden z-50">
        
        {/* Sparkles / Ambient Lights inside sidebar */}
        <div className="absolute top-[-10%] left-[-10%] w-[120px] h-[120px] bg-[#ffd6ff] rounded-full blur-[40px] pointer-events-none opacity-60 animate-glow" />
        <div className="absolute bottom-[-15%] right-[-10%] w-[150px] h-[150px] bg-[#e8dbff] rounded-full blur-[45px] pointer-events-none opacity-60 animate-glow" />

        {/* Floating Paws in Sidebar */}
        {floatingPaws.map((paw, i) => (
          <motion.div
            key={i}
            className="absolute text-purple-300/40 pointer-events-none"
            style={{ left: paw.left, top: paw.top }}
            animate={{ 
              y: [0, -6, 0], 
              rotate: [0, 8, 0],
              opacity: [0.3, 0.6, 0.3]
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              delay: paw.delay,
              ease: "easeInOut"
            }}
          >
            <PawPrint size={paw.size} fill="currentColor" />
          </motion.div>
        ))}

        {/* LOGO AREA */}
        <div className="relative px-8 pt-8 pb-5 flex items-center gap-3">
          <motion.div 
            className="w-10 h-10 bg-gradient-to-br from-violet-400 to-orange-400 rounded-2xl flex items-center justify-center shadow-md cursor-pointer"
            whileHover={{ scale: 1.1, rotate: [0, -10, 10, 0] }}
            transition={{ duration: 0.5 }}
          >
            <PawPrint className="text-white fill-white" size={22} />
          </motion.div>
          <div>
            <h1 className="font-extrabold text-xl tracking-tight bg-gradient-to-r from-violet-600 to-orange-500 bg-clip-text text-transparent">
              PawMart
            </h1>
            <span className="text-[10px] uppercase font-bold tracking-widest text-[#9f8fb3] block -mt-1">
              Admin console
            </span>
          </div>
        </div>

        {/* ADMIN PROFILE CARD */}
        <div className="px-6 py-4 relative">
          <div className="p-4 bg-white/60 backdrop-blur-md rounded-[24px] border border-white/80 shadow-sm flex items-center gap-3">
            <div className="relative">
              <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-violet-300 bg-violet-100 flex items-center justify-center">
                {/* 3D avatar mockup */}
                <svg viewBox="0 0 100 100" className="w-full h-full">
                  <defs>
                    <linearGradient id="avatarGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#c8b6ff" />
                      <stop offset="100%" stopColor="#ffd6ff" />
                    </linearGradient>
                  </defs>
                  <circle cx="50" cy="50" r="50" fill="url(#avatarGrad)" />
                  {/* Cute face outline */}
                  <circle cx="50" cy="40" r="18" fill="#ffebd6" />
                  <path d="M50,22 C40,22 34,28 34,36 C34,38 36,40 38,40 C42,40 44,32 50,32 C56,32 58,40 62,40 C64,40 66,38 66,36 C66,28 60,22 50,22 Z" fill="#7a5230" />
                  <circle cx="44" cy="38" r="2" fill="#3d2c54" />
                  <circle cx="56" cy="38" r="2" fill="#3d2c54" />
                  <path d="M48,44 Q50,46 52,44" stroke="#ff8ba7" strokeWidth="2" fill="none" strokeLinecap="round" />
                  <path d="M22,80 C22,60 35,58 50,58 C65,58 78,60 78,80 Z" fill="#8a5cf5" />
                </svg>
              </div>
              <span className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-green-400 border-2 border-white rounded-full animate-pulse" />
            </div>
            <div className="overflow-hidden">
              <h2 className="font-bold text-sm text-[#3d2c54] truncate">Hi, Mia! 👋</h2>
              <span className="text-[11px] font-medium text-[#705e8c] bg-violet-100/60 px-2 py-0.5 rounded-full inline-block mt-0.5">
                Head Curator
              </span>
            </div>
          </div>
        </div>

        {/* NAVIGATION ITEMS */}
        <nav className="flex-1 px-4 py-2 overflow-y-auto space-y-1 relative scrollbar-none">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path || 
              (item.path !== '/dashboard' && location.pathname.startsWith(item.path));
            
            return (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive: linkActive }) => `
                  relative flex items-center justify-between px-5 py-3 rounded-full text-sm font-bold tracking-wide transition-all duration-300 group
                  ${isActive ? 'text-violet-600' : 'text-[#705e8c] hover:text-[#3d2c54] hover:bg-white/40'}
                `}
              >
                {/* Custom glowing background on active via Framer Motion layoutId */}
                {isActive && (
                  <motion.div 
                    layoutId="activePill"
                    className="absolute inset-0 bg-white shadow-[0_8px_25px_-5px_rgba(138,92,245,0.18)] border border-violet-100 rounded-full z-0"
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  />
                )}

                <span className="relative flex items-center gap-3 z-10">
                  <Icon 
                    size={18} 
                    className={`transition-transform duration-300 group-hover:scale-110 ${isActive ? 'text-violet-500 fill-violet-100' : 'text-[#9f8fb3]'}`} 
                  />
                  {item.label}
                </span>

                {isActive && (
                  <ChevronRight size={14} className="relative z-10 text-violet-400" />
                )}
              </NavLink>
            );
          })}
        </nav>

        {/* FOOTER ACTION */}
        <div className="p-6 border-t border-violet-100/40">
          <button className="flex items-center gap-3 w-full px-5 py-3 rounded-full text-sm font-bold text-red-400/90 hover:text-red-500 hover:bg-red-50/60 transition-all duration-200">
            <LogOut size={18} />
            Sign Out
          </button>
        </div>
      </aside>

      {/* 2. MOBILE TOP NAVIGATION BAR */}
      <header className="lg:hidden fixed top-0 left-0 right-0 h-16 bg-white/70 backdrop-blur-md border-b border-violet-100 flex items-center justify-between px-6 z-40">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-gradient-to-br from-violet-400 to-orange-400 rounded-xl flex items-center justify-center text-white shadow-sm">
            <PawPrint size={16} fill="white" />
          </div>
          <span className="font-extrabold text-md bg-gradient-to-r from-violet-600 to-orange-500 bg-clip-text text-transparent">
            PawMart
          </span>
        </div>

        <button 
          onClick={() => setIsMobileOpen(true)}
          className="p-2 bg-violet-50 hover:bg-violet-100 rounded-xl text-violet-600 transition-colors"
        >
          <Menu size={20} />
        </button>
      </header>

      {/* 3. MOBILE SIDEBAR DRAWER */}
      <AnimatePresence>
        {isMobileOpen && (
          <>
            {/* Overlay */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileOpen(false)}
              className="lg:hidden fixed inset-0 bg-violet-950/20 backdrop-blur-sm z-50"
            />

            {/* Sidebar drawer content */}
            <motion.aside 
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 220 }}
              className="lg:hidden fixed top-0 bottom-0 left-0 w-[280px] bg-gradient-to-b from-[#fbf9ff] to-[#f5f0ff] p-6 flex flex-col z-50 shadow-2xl border-r border-violet-100"
            >
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-gradient-to-br from-violet-400 to-orange-400 rounded-xl flex items-center justify-center text-white shadow-sm">
                    <PawPrint size={16} fill="white" />
                  </div>
                  <span className="font-extrabold text-md bg-gradient-to-r from-violet-600 to-orange-500 bg-clip-text text-transparent">
                    PawMart
                  </span>
                </div>
                <button 
                  onClick={() => setIsMobileOpen(false)}
                  className="p-1.5 bg-violet-50 hover:bg-violet-100 text-[#705e8c] rounded-lg transition-colors"
                >
                  <X size={18} />
                </button>
              </div>

              {/* Mobile avatar */}
              <div className="p-3.5 bg-white/60 border border-white rounded-[22px] flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-violet-300 to-pink-300 overflow-hidden border border-white flex items-center justify-center">
                  <svg viewBox="0 0 100 100" className="w-full h-full">
                    <circle cx="50" cy="50" r="50" fill="#c8b6ff" />
                    <circle cx="50" cy="40" r="18" fill="#ffebd6" />
                    <path d="M50,22 C40,22 34,28 34,36 C34,38 36,40 38,40 C42,40 44,32 50,32 C56,32 58,40 62,40 C64,40 66,38 66,36 C66,28 60,22 50,22 Z" fill="#7a5230" />
                    <circle cx="44" cy="38" r="2" fill="#3d2c54" />
                    <circle cx="56" cy="38" r="2" fill="#3d2c54" />
                    <path d="M48,44 Q50,46 52,44" stroke="#ff8ba7" strokeWidth="2" fill="none" />
                    <path d="M22,80 C22,60 35,58 50,58 C65,58 78,60 78,80 Z" fill="#8a5cf5" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-bold text-sm text-[#3d2c54]">Mia 👋</h3>
                  <span className="text-[10px] text-violet-500 font-bold bg-violet-100 px-2 py-0.5 rounded-full">Curator</span>
                </div>
              </div>

              {/* Mobile items */}
              <nav className="flex-1 overflow-y-auto space-y-1">
                {NAV_ITEMS.map((item) => {
                  const Icon = item.icon;
                  const isActive = location.pathname === item.path || 
                    (item.path !== '/dashboard' && location.pathname.startsWith(item.path));
                  
                  return (
                    <NavLink
                      key={item.path}
                      to={item.path}
                      onClick={() => setIsMobileOpen(false)}
                      className={`
                        flex items-center gap-3 px-4 py-2.5 rounded-full text-sm font-bold tracking-wide transition-all duration-200
                        ${isActive ? 'bg-white text-violet-600 shadow-[0_5px_15px_-5px_rgba(138,92,245,0.15)] border border-violet-100' : 'text-[#705e8c] hover:bg-white/40'}
                      `}
                    >
                      <Icon size={16} className={isActive ? 'text-violet-500' : 'text-[#9f8fb3]'} />
                      {item.label}
                    </NavLink>
                  );
                })}
              </nav>

              <div className="pt-4 border-t border-violet-100/40">
                <button className="flex items-center gap-3 w-full px-4 py-2.5 rounded-full text-sm font-bold text-red-400 hover:bg-red-50/60 transition-all">
                  <LogOut size={16} />
                  Sign Out
                </button>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* 4. MAIN CONTAINER & TOP BAR HEADER */}
      <div className="flex-1 lg:ml-[300px] p-4 lg:p-6 flex flex-col min-h-screen pt-20 lg:pt-6">
        
        {/* TOP HEADER (SEARCH & QUICK ACTIONS) */}
        <header className="mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
          
          {/* SEARCH BAR - Cozy 3D pill */}
          <div className="relative w-full md:w-[350px]">
            <input 
              type="text" 
              placeholder="Search pets, orders, configurations..." 
              className="w-full clay-input pr-10 pl-5 text-sm"
            />
            <Search className="absolute right-4 top-1/2 -translate-y-1/2 text-violet-400" size={16} />
          </div>

          {/* RIGHT SIDE ACTIONS */}
          <div className="flex items-center justify-end gap-3 self-end md:self-auto">
            
            {/* Quick Action Button */}
            <NavLink
              to="/products/new"
              className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-orange-400 to-amber-400 text-white rounded-full text-xs font-bold shadow-[0_6px_20px_-4px_rgba(249,115,22,0.3)] hover:shadow-[0_10px_25px_-4px_rgba(249,115,22,0.45)] hover:scale-102 transition-all cursor-pointer duration-200"
            >
              <PlusCircle size={14} />
              Add Product
            </NavLink>

            {/* Magical Spin configuration shortcut */}
            <NavLink
              to="/spin"
              className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-violet-500 to-fuchsia-500 text-white rounded-full text-xs font-bold shadow-[0_6px_20px_-4px_rgba(138,92,245,0.3)] hover:shadow-[0_10px_25px_-4px_rgba(138,92,245,0.45)] hover:scale-102 transition-all cursor-pointer duration-200"
            >
              <Sparkles size={14} className="animate-spin" style={{ animationDuration: '6s' }} />
              Spin Wheel
            </NavLink>

            {/* Notification bell with glowing pulse */}
            <div className="relative">
              <button className="w-10 h-10 bg-white hover:bg-violet-50 text-[#705e8c] border border-violet-100/50 rounded-full flex items-center justify-center shadow-[0_4px_12px_rgba(138,92,245,0.05)] transition-all">
                <Bell size={16} />
              </button>
              <span className="absolute top-0 right-0 w-3 h-3 bg-red-400 border-2 border-white rounded-full animate-bounce" />
            </div>

            {/* Profile trigger */}
            <div className="w-10 h-10 bg-white border border-violet-100/50 rounded-full flex items-center justify-center shadow-[0_4px_12px_rgba(138,92,245,0.05)] overflow-hidden cursor-pointer">
              <svg viewBox="0 0 100 100" className="w-8 h-8">
                <circle cx="50" cy="50" r="50" fill="#ffd6ff" />
                <circle cx="50" cy="40" r="16" fill="#ffebd6" />
                <path d="M50,22 C40,22 34,28 34,36 C34,38 36,40 38,40 C42,40 44,32 50,32 C56,32 58,40 62,40 C64,40 66,38 66,36 C66,28 60,22 50,22 Z" fill="#7a5230" />
                <path d="M26,78 C26,62 36,60 50,60 C64,60 74,62 74,78 Z" fill="#8a5cf5" />
              </svg>
            </div>

          </div>

        </header>

        {/* 5. MAIN PAGE CONTENT */}
        <main className="flex-1 w-full">
          <Outlet />
        </main>
      </div>

    </div>
  );
}
