import React, { useState } from 'react';
import { 
  Bell, 
  Home, 
  Bed, 
  MapPin, 
  LogOut, 
  User as UserIcon, 
  Settings, 
  Eye, 
  Moon, 
  Sun,
  LayoutDashboard,
  Wallet
} from 'lucide-react';
import { User, NotificationItem } from '../types';

interface HeaderProps {
  currentUser: User | null;
  onLogout: () => void;
  onOpenAuth: () => void;
  isDarkMode: boolean;
  onToggleDarkMode: () => void;
  onOpenAccessibility: () => void;
  onOpenNotificationSettings: () => void;
  notifications: NotificationItem[];
  onMarkNotificationRead: (id: string) => void;
  activeView: 'home' | 'tenant' | 'admin' | 'finance';
  setActiveView: (view: 'home' | 'tenant' | 'admin' | 'finance') => void;
  highContrast: boolean;
}

export default function Header({
  currentUser,
  onLogout,
  onOpenAuth,
  isDarkMode,
  onToggleDarkMode,
  onOpenAccessibility,
  onOpenNotificationSettings,
  notifications,
  onMarkNotificationRead,
  activeView,
  setActiveView,
  highContrast
}: HeaderProps) {
  const [showNotifications, setShowNotifications] = useState(false);

  const unreadCount = notifications.filter(n => !n.isRead).length;

  return (
    <header className={`fixed top-0 left-0 right-0 z-40 bg-[#FAF7F2]/95 dark:bg-[#0A0A0A]/95 border-b shadow-xs transition-colors backdrop-blur-xs ${
      highContrast ? 'border-amber-400 border-b-2' : 'border-stone-200 dark:border-white/10'
    }`}>
      <div className="mx-auto max-w-7xl px-4 md:px-8 h-18 flex items-center justify-between">
        
        {/* Brand Logo & Name */}
        <button 
          type="button"
          onClick={() => setActiveView('home')} 
          className="flex items-center gap-3 group text-left outline-hidden cursor-pointer"
        >
          <div className="w-8 h-8 rounded-none border border-stone-850 dark:border-stone-200 flex items-center justify-center text-stone-900 dark:text-white font-serif text-lg font-light group-hover:bg-stone-950 group-hover:text-white dark:group-hover:bg-white dark:group-hover:text-black transition-all">
            I
          </div>
          <div>
            <h1 className="text-xl font-serif italic text-stone-900 dark:text-white flex items-center tracking-wide gap-1 leading-none">
              Indra Jaya <span className="text-gold dark:text-gold font-normal font-sans not-italic text-xs tracking-widest uppercase mb-0.5">Kost</span>
            </h1>
            <p className="text-[9px] text-[#d4af37] dark:text-gold font-medium uppercase tracking-[0.25em] mt-0.5 font-sans">ESTATE & RESIDENCES</p>
          </div>
        </button>

        {/* Global Navigation - Client and Actions */}
        <nav className="hidden md:flex items-center gap-6 font-sans">
          <button 
            type="button"
            className={`text-[10px] uppercase tracking-[0.2em] font-semibold transition-all px-2 py-1 flex items-center gap-1.5 bg-transparent border-0 cursor-pointer outline-hidden ${
              activeView === 'home' 
                ? 'text-gold border-b border-gold dark:text-gold font-bold' 
                : 'text-stone-600 dark:text-stone-300 hover:text-gold dark:hover:text-gold'
            }`}
            onClick={() => setActiveView('home')}
          >
            <Home className="h-3.5 w-3.5" />
            Home
          </button>
          
          {/* Quick links when logged in */}
          {currentUser && currentUser.role === 'tenant' && (
            <button 
              type="button"
              className={`text-[10px] uppercase tracking-[0.2em] font-semibold transition-all px-2 py-1 flex items-center gap-1.5 bg-transparent border-0 cursor-pointer outline-hidden ${
                activeView === 'tenant' 
                  ? 'text-gold border-b border-gold dark:text-gold font-bold' 
                  : 'text-stone-600 dark:text-stone-300 hover:text-gold dark:hover:text-gold'
              }`}
              onClick={() => setActiveView('tenant')}
            >
              <LayoutDashboard className="h-3.5 w-3.5" />
              Portal Penyewa
            </button>
          )}

          {currentUser && currentUser.role === 'admin' && (
            <>
              <button 
                type="button"
                className={`text-[10px] uppercase tracking-[0.2em] font-semibold transition-all px-2 py-1 flex items-center gap-1.5 bg-transparent border-0 cursor-pointer outline-hidden ${
                  activeView === 'admin' 
                    ? 'text-gold border-b border-gold dark:text-gold font-bold' 
                    : 'text-stone-600 dark:text-stone-300 hover:text-gold dark:hover:text-gold'
                }`}
                onClick={() => setActiveView('admin')}
              >
                <LayoutDashboard className="h-3.5 w-3.5" />
                Portal Admin
              </button>

              <button 
                type="button"
                className={`text-[10px] uppercase tracking-[0.2em] font-semibold transition-all px-2 py-1 flex items-center gap-1.5 bg-transparent border-0 cursor-pointer outline-hidden ${
                  activeView === 'finance' 
                    ? 'text-gold border-b border-gold dark:text-gold font-bold' 
                    : 'text-stone-600 dark:text-stone-300 hover:text-gold dark:hover:text-gold'
                }`}
                onClick={() => setActiveView('finance')}
              >
                <Wallet className="h-3.5 w-3.5" />
                Laporan Keuangan
              </button>
            </>
          )}
        </nav>

        {/* Global Toolbar */}
        <div className="flex items-center gap-3">
          
          {/* Dark Mode toggle */}
          <button 
            type="button"
            className="w-9 h-9 rounded-none border border-stone-200 dark:border-white/10 text-stone-550 dark:text-stone-400 hover:bg-stone-100 dark:hover:bg-stone-900 flex items-center justify-center transition-all cursor-pointer outline-hidden"
            onClick={onToggleDarkMode}
            title={isDarkMode ? "Nyalakan Mode Terang" : "Nyalakan Mode Gelap"}
            aria-label="Mode gelap"
          >
            {isDarkMode ? <Sun className="h-4 w-4 text-gold" /> : <Moon className="h-4 w-4" />}
          </button>

          {/* Accessibility Settings toggle */}
          <button 
            type="button"
            className="w-9 h-9 rounded-none border border-stone-200 dark:border-white/10 text-stone-550 dark:text-stone-400 hover:bg-stone-100 dark:hover:bg-stone-900 flex items-center justify-center transition-all cursor-pointer outline-hidden"
            onClick={onOpenAccessibility}
            title="Aksesibilitas dan Kejelasan"
            aria-label="Alat bantu aksesibilitas"
          >
            <Eye className="h-4 w-4 text-gold-hover" />
          </button>

          {/* Notification settings panel config */}
          <button 
            type="button"
            className="w-9 h-9 rounded-none border border-stone-200 dark:border-white/10 text-stone-550 dark:text-stone-400 hover:bg-stone-100 dark:hover:bg-stone-900 flex items-center justify-center transition-all cursor-pointer outline-hidden"
            onClick={onOpenNotificationSettings}
            title="Pengaturan Notifikasi Kustom"
            aria-label="Pengaturan notifikasi"
          >
            <Settings className="h-4 w-4 text-gold" />
          </button>

          {/* Real-time Notifications Bell with interactive Dropdown */}
          <div className="relative">
            <button 
              type="button"
              className="w-9 h-9 rounded-none border border-stone-200 dark:border-white/10 text-stone-550 dark:text-stone-400 hover:bg-stone-100 dark:hover:bg-stone-900 flex items-center justify-center transition-all relative cursor-pointer outline-hidden"
              onClick={() => setShowNotifications(!showNotifications)}
              title="Notifikasi Masuk"
              aria-label="Semua notifikasi"
            >
              <Bell className="h-4 w-4" />
              {unreadCount > 0 && (
                <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-[#d4af37] animate-pulse" />
              )}
            </button>

            {showNotifications && (
              <div className="absolute right-0 mt-3 w-80 rounded-none bg-[#FAF7F2] dark:bg-[#0A0A0A] shadow-2xl border border-stone-200 dark:border-white/10 p-4 transition-all z-50">
                <div className="flex items-center justify-between pb-3 border-b mb-3 dark:border-white/10">
                  <h4 className="text-[10px] uppercase tracking-widest font-bold text-stone-900 dark:text-white">Pemberitahuan Terkini</h4>
                  <span className="px-1.5 py-0.5 rounded-none bg-stone-100 text-stone-800 dark:bg-stone-900 dark:text-gold text-[9px] font-bold uppercase tracking-wider">Sync Aktif</span>
                </div>

                <div className="max-h-64 overflow-y-auto space-y-2.5">
                  {notifications.length === 0 ? (
                    <p className="text-xs text-stone-400 text-center py-6 font-serif italic">Tidak ada pemberitahuan baru.</p>
                  ) : (
                    notifications.map((notif) => (
                      <div 
                        key={notif.id}
                        onClick={() => onMarkNotificationRead(notif.id)}
                        className={`p-2.5 rounded-none border text-left cursor-pointer transition-all ${
                          !notif.isRead 
                            ? 'bg-stone-50 dark:bg-stone-900/40 border-gold/40' 
                            : 'bg-transparent border-stone-100 dark:border-white/5 opacity-60'
                        }`}
                      >
                        <h5 className="text-[11px] uppercase tracking-wider font-bold text-stone-900 dark:text-white">{notif.title}</h5>
                        <p className="text-xs text-stone-500 dark:text-stone-400 mt-1">{notif.message}</p>
                        <span className="text-[9px] text-[#d4af37] font-medium block mt-2 tracking-widest">
                          {new Date(notif.createdAt).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>

          <div className="h-6 w-px bg-stone-250 dark:bg-white/10" />

          {/* User Section */}
          {currentUser ? (
            <div className="flex items-center gap-3">
              <div className="hidden lg:block text-right">
                <p className="text-[11px] uppercase tracking-wide font-bold text-stone-900 dark:text-stone-200 leading-tight">
                  {currentUser.name}
                </p>
                <span className="text-[9px] font-semibold uppercase text-gold tracking-widest block mt-0.5">
                  {currentUser.role === 'admin' ? 'Property Manager' : `Penyewa: ${currentUser.roomNumber || 'Akun Baru'}`}
                </span>
              </div>

              {/* Avatar or profile pic */}
              <div className="w-8 h-8 rounded-none overflow-hidden border border-gold bg-stone-100 dark:bg-[#141414] flex items-center justify-center">
                {currentUser.avatar ? (
                  <img src={currentUser.avatar} alt="User Avatar" className="w-full h-full object-cover" />
                ) : (
                  <UserIcon className="h-3.5 w-3.5 text-gold" />
                )}
              </div>

              {/* Logout */}
              <button 
                type="button"
                className="w-8 h-8 rounded-none border border-red-200 hover:bg-red-50 text-red-500 flex items-center justify-center transition-all cursor-pointer outline-hidden dark:border-red-950/20 dark:hover:bg-red-950/25"
                onClick={onLogout}
                title="Keluar dari Portal"
                aria-label="Tombol keluar"
              >
                <LogOut className="h-3.5 w-3.5" />
              </button>
            </div>
          ) : (
            <button 
              type="button"
              className="px-4 py-2 rounded-none bg-stone-900 text-white dark:bg-white dark:text-black font-extrabold text-[10px] tracking-widest uppercase transition-all cursor-pointer hover:opacity-90 hover:bg-gold dark:hover:bg-gold dark:hover:text-black border border-transparent"
              onClick={onOpenAuth}
            >
              Portal Masuk
            </button>
          )}

        </div>
      </div>
    </header>
  );
}
export {};
