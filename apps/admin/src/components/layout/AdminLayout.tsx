import React, { useState } from 'react';
import { 
  LayoutDashboard, 
  ShoppingBag, 
  FolderHeart, 
  ShoppingBag as OrderIcon, 
  Users, 
  Ticket, 
  Disc, 
  ShieldAlert, 
  Settings as SettingsIcon,
  Search,
  Bell,
  Menu,
  X,
  LogOut
} from 'lucide-react';
import ConfirmModal from '../common/ConfirmModal';

interface SidebarItem {
  name: string;
  icon: React.ComponentType<any>;
}

interface AdminLayoutProps {
  children: React.ReactNode;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  maintenanceMode: boolean;
  onBellClick: () => void;
  onLogout?: () => void;
}

export default function AdminLayout({ 
  children, 
  activeTab, 
  setActiveTab,
  maintenanceMode,
  onBellClick,
  onLogout
}: AdminLayoutProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLogoutConfirmOpen, setIsLogoutConfirmOpen] = useState(false);

  const menuItems: SidebarItem[] = [
    { name: 'Dashboard', icon: LayoutDashboard },
    { name: 'Products', icon: ShoppingBag },
    { name: 'Categories', icon: FolderHeart },
    { name: 'Orders', icon: OrderIcon },
    { name: 'Customers', icon: Users },
    { name: 'Coupons', icon: Ticket },
    { name: 'Spin Wheel', icon: Disc },
    { name: 'Roles & Staff', icon: ShieldAlert },
    { name: 'Settings', icon: SettingsIcon },
  ];

  return (
    <div className="h-screen w-screen max-h-screen bg-[#caaef6] flex p-4 md:p-6 lg:p-8 gap-6 relative overflow-hidden font-sans">
      
      {/* Decorative background stripes */}
      <div className="absolute top-[-10%] left-[-10%] w-[350px] h-[350px] bg-white/10 rounded-full blur-[80px] pointer-events-none animate-float" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[400px] h-[400px] bg-white/5 rounded-full blur-[100px] pointer-events-none" />

      {/* Sidebar - Solid medium lavender curved capsule (Independently scrollable with scrollbar-hide) */}
      <aside className="hidden lg:flex flex-col w-60 clay-sidebar rounded-[40px] p-6 shrink-0 h-full relative overflow-hidden">
        
        {/* Brand Logo Container Section (Aligned to header height, rounding, border and cream color) */}
        <div className="shrink-0 flex items-center justify-center bg-[#faf6f0] border-[3px] border-white rounded-[32px] px-6 py-4 shadow-clay-card h-[78px] mb-8">
          <div className="flex items-center gap-3">
            <span className="text-3xl filter drop-shadow-sm select-none">🐾</span>
            <span className="font-extrabold text-[#3b2b5c] text-lg tracking-tight select-none">PawMart</span>
          </div>
        </div>

        {/* Navigation list (Scrollable sidebar menu with scrollbar-hide) */}
        <nav className="flex-1 space-y-2.5 overflow-y-auto mt-2 pr-1 scrollbar-hide">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.name;
            return (
              <button
                key={item.name}
                onClick={() => setActiveTab(item.name)}
                className={`w-full flex items-center gap-3.5 px-4.5 py-2.5 rounded-2xl text-[13.5px] font-black transition-all duration-300 group ${
                  isActive 
                    ? 'clay-active-button' 
                    : 'text-white/80 hover:text-white hover:bg-white/10'
                }`}
              >
                <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${
                  isActive ? 'bg-[#9c87f2]/10 text-[#8e78f5]' : 'bg-white/20 text-white shadow-[0_2px_4px_rgba(255,255,255,0.2)]'
                }`}>
                  <Icon className="w-3.5 h-3.5 stroke-[2.5]" />
                </div>
                <span>{item.name}</span>
              </button>
            );
          })}
        </nav>

        {/* Tactical 3D Logout Button */}
        <div className="shrink-0 pt-4 mt-2 border-t border-white/20">
          <button
            onClick={() => setIsLogoutConfirmOpen(true)}
            className="w-full flex items-center gap-3.5 px-4.5 py-2.5 rounded-2xl text-[13.5px] font-black text-white/85 hover:text-white hover:bg-rose-500/25 hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200 group"
          >
            <div className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0 bg-white/20 text-white shadow-[0_2px_4px_rgba(255,255,255,0.2)] group-hover:bg-rose-600/30">
              <LogOut className="w-3.5 h-3.5 stroke-[2.5]" />
            </div>
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Mobile Menu Drawer */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm z-50 lg:hidden flex">
          <aside className="w-72 bg-[#8e78f5] h-full flex flex-col p-6 shadow-2xl relative">
            <button 
              onClick={() => setIsMobileMenuOpen(false)}
              className="absolute top-5 right-5 p-1.5 rounded-xl bg-white/20 hover:bg-white/30 text-white"
            >
              <X className="w-5 h-5" />
            </button>
            
            {/* Logo frame */}
            <div className="flex flex-col items-center mt-8 mb-6">
              <div className="w-20 h-20 rounded-full border-[3px] border-white/95 overflow-hidden shadow-md flex items-center justify-center bg-white/30">
                <span className="text-4xl">🐾</span>
              </div>
            </div>

            {/* Navigation list */}
            <nav className="flex-1 space-y-2 overflow-y-auto mt-2 pr-1 scrollbar-hide">
              {menuItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.name;
                return (
                  <button
                    key={item.name}
                    onClick={() => {
                      setActiveTab(item.name);
                      setIsMobileMenuOpen(false);
                    }}
                    className={`w-full flex items-center gap-3.5 px-4 py-2.5 rounded-xl text-xs font-black transition-all ${
                      isActive ? 'clay-active-button' : 'text-white/80 hover:text-white'
                    }`}
                  >
                    <div className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${
                      isActive ? 'bg-[#9c87f2]/10 text-[#8e78f5]' : 'bg-white/20 text-white'
                    }`}>
                      <Icon className="w-3.5 h-3.5 stroke-[2.5]" />
                    </div>
                    <span>{item.name}</span>
                  </button>
                );
              })}
            </nav>
          </aside>
        </div>
      )}

      {/* Main Content Pane (Locked Height layout) */}
      <div className="flex-1 flex flex-col min-w-0 h-full gap-6 overflow-hidden">
        
        {/* ISOLATED FLOATING HEADER CARD (Cohesive background matching main page cream: bg-[#faf6f0]) */}
        <header className="shrink-0 flex items-center justify-between gap-4 bg-[#faf6f0] border-[3px] border-white rounded-[32px] px-6 py-4 shadow-clay-card">
          <div className="flex items-center gap-3">
            <button 
              onClick={() => setIsMobileMenuOpen(true)}
              className="p-2.5 rounded-2xl bg-white border border-slate-200 shadow-sm text-[#8e78f5] lg:hidden hover:bg-slate-50 transition-colors"
            >
              <Menu className="w-5 h-5" />
            </button>
            
            {/* Dynamic Premium Header Page Title Text */}
            <h1 className="text-2xl md:text-3xl font-black text-gradient-purple tracking-tight">
              {activeTab === 'Edit Product' || activeTab === 'Add Product' ? 'Products' : activeTab}
            </h1>
          </div>

          {/* Search bar inside header (Global Search Placeholder) */}
          <div className="hidden md:flex items-center flex-1 max-w-sm bg-white border-2 border-white rounded-full px-5 py-2.5 gap-2.5 shadow-[inset_0_2px_4px_rgba(0,0,0,0.03),0_8px_16px_rgba(0,0,0,0.02)]">
            <Search className="w-4 h-4 text-slate-400 shrink-0" />
            <input 
              type="text" 
              placeholder="Search for products, orders, categories..."
              className="bg-transparent border-none outline-none text-xs w-full placeholder-slate-400 text-slate-700 font-extrabold"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          {/* Right side controls */}
          <div className="flex items-center gap-3.5">
            {/* Blinking Maintenance Mode Badge */}
            {maintenanceMode && (
              <div className="flex items-center gap-1.5 px-3 py-2 rounded-2xl bg-amber-500 text-white text-[10px] font-black uppercase tracking-wider shadow-[0_4px_12px_rgba(245,158,11,0.3),inset_0_2px_4px_rgba(255,255,255,0.4)] animate-pulse select-none">
                <span className="w-1.5 h-1.5 rounded-full bg-white block animate-ping shrink-0" />
                <span className="hidden sm:inline">⚡ Maintenance Active</span>
                <span className="sm:hidden">⚡ Maint.</span>
              </div>
            )}

            {/* Notification bell button */}
            <button 
              onClick={onBellClick}
              className="p-3.5 rounded-full bg-white text-[#8e78f5] shadow-[inset_0_2px_4px_rgba(255,255,255,0.8),0_6px_12px_rgba(0,0,0,0.04)] relative group hover:scale-105 active:scale-95 transition-all cursor-pointer"
              title="Click to view new placed orders"
            >
              <Bell className="w-4 h-4 stroke-[2.5]" />
              <span className="absolute top-1 right-1 w-4 h-4 bg-rose-500 rounded-full border-2 border-white text-[9px] font-black text-white flex items-center justify-center">
                3
              </span>
            </button>

            {/* User profile picture */}
            <div className="w-10 h-10 rounded-full border-2 border-white overflow-hidden shadow-md shrink-0 bg-purple-100">
              <img 
                src="/avatar.png" 
                alt="Mia Admin Mini" 
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </header>

        {/* Separately Scrollable main console card with scrollbar-hide (solves radius clip/suitability) */}
        <div className="flex-1 min-h-0 clay-dashboard-shell rounded-[40px] p-6 md:p-8 lg:p-10 overflow-y-auto relative scrollbar-hide">
          {children}
        </div>
      </div>

      {/* Logout Confirmation Modal */}
      <ConfirmModal
        isOpen={isLogoutConfirmOpen}
        title="Confirm Logout 🚪"
        message="Are you sure you want to log out of the PawMart Admin Panel? All active configurations will remain safe."
        confirmText="Logout"
        cancelText="Stay Here"
        emoji="🚪"
        type="danger"
        onConfirm={() => {
          setIsLogoutConfirmOpen(false);
          if (onLogout) onLogout();
        }}
        onCancel={() => setIsLogoutConfirmOpen(false)}
      />

    </div>
  );
}
