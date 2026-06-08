import React, { useState, useEffect } from 'react';
import { 
  X,
  Radio, 
  MapPin, 
  Mail, 
  Phone, 
  ShieldCheck,
  CheckCircle,
  BellRing
} from 'lucide-react';
import { 
  Room, 
  User, 
  Booking, 
  DamageReport, 
  Transaction, 
  NotificationItem, 
  NotificationConfig 
} from './types';

// Importing custom components
import Header from './components/Header';
import HomeSection from './components/HomeSection';
import TenantPortal from './components/TenantPortal';
import AdminPortal from './components/AdminPortal';
import FinancePortal from './components/FinancePortal';
import AuthModal from './components/AuthModal';
import AccessibilitySettings from './components/AccessibilitySettings';
import NotificationSettings from './components/NotificationSettings';

export default function App() {
  // Sync Data State representation
  const [rooms, setRooms] = useState<Room[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [reports, setReports] = useState<DamageReport[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);

  // Session & UI States
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [activeView, setActiveView] = useState<'home' | 'tenant' | 'admin' | 'finance'>('home');
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isAccessibilityOpen, setIsAccessibilityOpen] = useState(false);
  const [isNotifSettingsOpen, setIsNotifSettingsOpen] = useState(false);
  
  // Google / Gmail Security Notification States
  const [gmailAlert, setGmailAlert] = useState<{
    email: string;
    name: string;
    time: string;
    location: string;
    device: string;
  } | null>(null);
  const [showGmailModal, setShowGmailModal] = useState(false);
  const [showGmailToast, setShowGmailToast] = useState(false);
  
  // Custom Dynamic Toasts
  const [toastNotification, setToastNotification] = useState<{title: string, message: string} | null>(null);

  // Preference Settings States
  const [isDarkMode, setIsDarkMode] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('theme') === 'dark' || 
        (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches);
    }
    return false;
  });

  const [textSize, setTextSize] = useState<number>(1); // 1 = 100%, 1.2 = 120%, 1.4 = 140%
  const [highContrast, setHighContrast] = useState<boolean>(false);
  const [dyslexicFont, setDyslexicFont] = useState<boolean>(false);
  const [screenReaderHelp, setScreenReaderHelp] = useState<boolean>(false);

  const [notifConfig, setNotifConfig] = useState<NotificationConfig>({
    emailNotify: true,
    pushNotify: true,
    paymentReminder: true,
    maintenanceAlert: true,
    autoSound: true
  });

  // Load and apply Dark Mode css class
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [isDarkMode]);

  // Fetch / Sync API Core (Keeps all tabs & users synchronized in real-time)
  const syncDataFromServer = async () => {
    try {
      const res = await fetch("/api/sync");
      if (res.ok) {
        const data = await res.json();
        
        // Safety check to avoid overwriting or infinite state triggers
        setRooms(data.rooms);
        setUsers(data.users);
        setBookings(data.bookings);
        setReports(data.reports);
        setTransactions(data.transactions);

        // Check if there are newly generated notifications to trigger push toast!
        if (data.notifications && data.notifications.length > 0) {
          const oldFirstId = notifications[0]?.id;
          const newFirst = data.notifications[0];
          
          if (oldFirstId && newFirst.id !== oldFirstId && !newFirst.isRead) {
            // New notification from server action! Let's display push banner
            if (notifConfig.pushNotify) {
              setToastNotification({
                title: newFirst.title,
                message: newFirst.message
              });
              if (notifConfig.autoSound) {
                playSimulatedChime();
              }
            }
          }
          setNotifications(data.notifications);
        }
      }
    } catch (err) {
      console.warn("Sync failed. Using memory fallback...", err);
    }
  };

  // Run on Boot
  useEffect(() => {
    syncDataFromServer();

    // Polling sync every 3.5 seconds
    const interval = setInterval(() => {
      syncDataFromServer();
    }, 3500);

    return () => clearInterval(interval);
  }, [notifications, notifConfig]);

  // Sound chime creator
  const playSimulatedChime = () => {
    try {
      const context = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = context.createOscillator();
      const gain = context.createGain();
      osc.connect(gain);
      gain.connect(context.destination);
      osc.type = 'sine';
      osc.frequency.setValueAtTime(587.33, context.currentTime); // D5
      osc.frequency.setValueAtTime(880, context.currentTime + 0.1);  // A5
      gain.gain.setValueAtTime(0.1, context.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, context.currentTime + 0.4);
      osc.start();
      osc.stop(context.currentTime + 0.4);
    } catch (e) {
      console.log("Audio not allowed yet.", e);
    }
  };

  // Actions implementations
  const handleLoginSuccess = (user: User, isGoogle?: boolean) => {
    setCurrentUser(user);
    // Redirect to respective portals automatically for awesome usability
    if (user.role === 'admin') {
      setActiveView('admin');
    } else if (user.role === 'tenant') {
      setActiveView('tenant');
    } else {
      setActiveView('home');
    }

    if (isGoogle) {
      const formattedTime = new Date().toLocaleString('id-ID', {
        timeZone: 'Asia/Jakarta',
        day: '2-digit',
        month: 'long',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
      }) + ' WIB';

      setGmailAlert({
        email: user.email,
        name: user.name,
        time: formattedTime,
        location: 'Sidoarjo, Jawa Timur (Alamat Cabang Utama)',
        device: 'Google Chrome di Windows PC'
      });

      // Show Google Mail notification banner slide-in
      setTimeout(() => {
        setShowGmailToast(true);
        if (notifConfig.autoSound) {
          playSimulatedChime();
        }
      }, 1600);
    }
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setActiveView('home');
  };

  const handleBookRoom = async (roomId: string, tenantName: string, email: string) => {
    try {
      const res = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          roomId,
          tenantId: currentUser?.id,
          tenantName,
          email
        })
      });
      if (res.ok) {
        const result = await res.json();
        if (currentUser) {
          // Keep current session updated
          setCurrentUser(result.user);
        } else {
          setCurrentUser(result.user);
        }
        await syncDataFromServer();
        
        // Show success alert
        setToastNotification({
          title: "Booking Terdaftar!",
          message: `Kamar Anda berhasil dipesan. Menunggu konfirmasi kuitansi pembayaran.`
        });
        playSimulatedChime();
        setActiveView('tenant');
      }
    } catch (err) {
      console.error(err);
      alert("Gagal memproses booking.");
    }
  };

  const handleSubmitReport = async (title: string, description: string) => {
    if (!currentUser) return;
    try {
      const res = await fetch("/api/reports", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          tenantId: currentUser.id,
          tenantName: currentUser.name,
          roomNumber: currentUser.roomNumber,
          title,
          description
        })
      });
      if (res.ok) {
        await syncDataFromServer();
        setToastNotification({
          title: "Aduan Dikirim",
          message: "Laporan kerusakan berhasil diteruskan ke tim pemeliharaan."
        });
        playSimulatedChime();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleSubmitPayment = async (bookingId: string, method: string, proofUrl: string) => {
    try {
      const res = await fetch(`/api/bookings/${bookingId}/pay`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          paymentMethod: method,
          paymentProof: proofUrl
        })
      });
      if (res.ok) {
        await syncDataFromServer();
        setToastNotification({
          title: "Kuitansi Terkirim!",
          message: "Bukti transfer telah diterima server. Sedang diteliti oleh Admin."
        });
        playSimulatedChime();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleAddRoom = async (roomData: Partial<Room>) => {
    try {
      const res = await fetch("/api/rooms/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(roomData)
      });
      if (res.ok) {
        await syncDataFromServer();
        setToastNotification({
          title: "Kamar Baru Ditambahkan",
          message: `Nomor Unit ${roomData.roomNumber} sukses didaftarkan.`
        });
        playSimulatedChime();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleApproveBooking = async (id: string) => {
    try {
      const res = await fetch(`/api/bookings/${id}/approve`, {
        method: "POST"
      });
      if (res.ok) {
        await syncDataFromServer();
        setToastNotification({
          title: "Sewa Kamar Aktif!",
          message: "Pembayaran telah divalidasi dan dicatat sebagai lunas."
        });
        playSimulatedChime();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleUpdateReport = async (id: string, status: 'Pending' | 'Diproses' | 'Selesai') => {
    try {
      const res = await fetch(`/api/reports/${id}/update`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status })
      });
      if (res.ok) {
        await syncDataFromServer();
        setToastNotification({
          title: "Status Agenda Diperbarui",
          message: `Laporan keluhan disetel ke status: ${status}.`
        });
        playSimulatedChime();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleUpdateRoom = async (roomId: string, updatedData: { price?: number; image?: string; description?: string }) => {
    try {
      const res = await fetch(`/api/rooms/${roomId}/update`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedData)
      });
      if (res.ok) {
        await syncDataFromServer();
        setToastNotification({
          title: "Kamar Diperbarui",
          message: `Rincian unit kamar berhasil disimpan.`
        });
        playSimulatedChime();
      }
    } catch (err) {
      console.error(err);
      alert("Gagal memperbarui kamar.");
    }
  };

  const handleMarkNotificationRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, isRead: true } : n));
  };

  // Sandbox simulation push triggering
  const handleTriggerMockPush = async (title: string, message: string, type: 'payment' | 'maintenance' | 'system' | 'booking') => {
    try {
      const res = await fetch("/api/notifications/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, message, type })
      });
      if (res.ok) {
        await syncDataFromServer();
      }
    } catch (e) {
      console.log("Mock push broadcast failed", e);
    }
  };

  return (
    <div 
      className={`min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 transition-all font-sans relative pb-2 bg-gradient-to-b from-white to-slate-50 dark:from-slate-950 dark:to-slate-900 ${
        dyslexicFont ? 'font-mono' : 'font-sans'
      }`}
      style={{ fontSize: `${textSize}rem` }}
    >
      
      {/* Real-time Dynamic Push Notification Toast Banner */}
      {toastNotification && (
        <div 
          className="fixed top-22 right-4 z-50 max-w-sm w-full bg-slate-900 text-white rounded-2xl p-4 shadow-2xl border border-slate-800 flex justify-between items-start animate-slide-in"
          role="alert"
        >
          <div className="flex gap-3">
            <BellRing className="h-5 w-5 text-emerald-400 shrink-0 mt-0.5 animate-pulse" />
            <div className="text-left">
              <h4 className="text-xs font-extrabold tracking-tight text-white">{toastNotification.title}</h4>
              <p className="text-[11px] text-slate-300 mt-1 leading-normal font-semibold">{toastNotification.message}</p>
            </div>
          </div>
          <button 
            type="button" 
            className="text-slate-400 hover:text-white"
            onClick={() => setToastNotification(null)}
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      )}

      {/* Header element */}
      <Header
        currentUser={currentUser}
        onLogout={handleLogout}
        onOpenAuth={() => setIsAuthOpen(true)}
        isDarkMode={isDarkMode}
        onToggleDarkMode={() => setIsDarkMode(!isDarkMode)}
        onOpenAccessibility={() => setIsAccessibilityOpen(true)}
        onOpenNotificationSettings={() => setIsNotifSettingsOpen(true)}
        notifications={notifications}
        onMarkNotificationRead={handleMarkNotificationRead}
        activeView={activeView}
        setActiveView={setActiveView}
        highContrast={highContrast}
      />

      {/* Main content display blocks dynamically based on state */}
      <main className="min-h-[80vh]">
        {activeView === 'home' && (
          <HomeSection 
            rooms={rooms} 
            currentUser={currentUser}
            onBookRoom={handleBookRoom}
            highContrast={highContrast}
            textSize={textSize}
          />
        )}

        {activeView === 'tenant' && currentUser && (
          <TenantPortal
            currentUser={currentUser}
            rooms={rooms}
            bookings={bookings}
            reports={reports}
            notifications={notifications}
            onSubmitReport={handleSubmitReport}
            onSubmitPayment={handleSubmitPayment}
            highContrast={highContrast}
          />
        )}

        {activeView === 'admin' && currentUser && currentUser.role === 'admin' && (
          <AdminPortal
            currentUser={currentUser}
            rooms={rooms}
            users={users}
            bookings={bookings}
            reports={reports}
            onAddRoom={handleAddRoom}
            onApproveBooking={handleApproveBooking}
            onUpdateReport={handleUpdateReport}
            onUpdateRoom={handleUpdateRoom}
            highContrast={highContrast}
          />
        )}

        {activeView === 'finance' && currentUser && currentUser.role === 'admin' && (
          <FinancePortal
            transactions={transactions}
            highContrast={highContrast}
          />
        )}
      </main>

      {/* Accessibility Adjustment popup settings panel */}
      <AccessibilitySettings
        textSize={textSize}
        setTextSize={setTextSize}
        highContrast={highContrast}
        setHighContrast={setHighContrast}
        dyslexicFont={dyslexicFont}
        setDyslexicFont={setDyslexicFont}
        screenReaderHelp={screenReaderHelp}
        setScreenReaderHelp={setScreenReaderHelp}
        isOpen={isAccessibilityOpen}
        onClose={() => setIsAccessibilityOpen(false)}
      />

      {/* Custom customizable push notification preference modal */}
      <NotificationSettings
        config={notifConfig}
        setConfig={setNotifConfig}
        isOpen={isNotifSettingsOpen}
        onClose={() => setIsNotifSettingsOpen(false)}
        onTriggerMockPush={handleTriggerMockPush}
      />

      {/* Authenticator / quick switcher login Modal */}
      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        onLoginSuccess={handleLoginSuccess}
        usersList={users} // Passes real synchronised users list
        onRegister={async (name, email, role) => {
          try {
            await fetch("/api/auth/register", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ name, email, role })
            });
            await syncDataFromServer();
          } catch(e) {
            console.log(e);
          }
        }}
      />

      {/* Gmail notification toast with sliding feedback */}
      {showGmailToast && gmailAlert && (
        <div 
          id="gmail-notification-toast" 
          className="fixed top-6 right-6 z-60 w-96 bg-white dark:bg-[#1a1a1a] rounded-xl shadow-2xl border border-stone-200 dark:border-stone-800 p-4 font-sans cursor-pointer hover:border-blue-500/30 transition-all group animate-slide-in hover:shadow-blue-500/5 select-none"
          onClick={() => {
            setShowGmailToast(false);
            setShowGmailModal(true);
          }}
        >
          <div className="flex items-start gap-3">
            {/* Red Gmail envelope logo */}
            <div className="w-10 h-10 rounded-lg bg-red-500/10 dark:bg-red-500/20 flex items-center justify-center shrink-0">
              <svg className="w-5 h-5 text-red-600 dark:text-red-400" fill="currentColor" viewBox="0 0 24 24">
                <path d="M20 4c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2h16m0 4l-8 5-8-5v10h16V8m-8 3L4 6h16l-8 5z"/>
              </svg>
            </div>
            
            <div className="flex-1 min-w-0 text-left">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold text-red-600 dark:text-red-400 font-sans tracking-widest uppercase">Gmail • Baru Saja</span>
                <span className="text-[9px] text-stone-400">1m lalu</span>
              </div>
              <h4 className="text-xs font-bold text-stone-850 dark:text-stone-100 mt-1 truncate">Lansiran Keamanan Google</h4>
              <p className="text-[11px] text-stone-500 dark:text-stone-300 leading-relaxed mt-1">
                Baru saja mendeteksi login baru pada akun <strong>{gmailAlert.email}</strong>. Klik untuk membuka surat masuk &rarr;
              </p>
            </div>
            
            <button 
              type="button" 
              onClick={(e) => { 
                e.stopPropagation(); 
                setShowGmailToast(false); 
              }} 
              className="text-stone-400 hover:text-stone-600 dark:hover:text-stone-200 text-xs shrink-0 p-1 hover:bg-stone-100 dark:hover:bg-stone-800 rounded"
              aria-label="Tutup notifikasi"
            >
              &times;
            </button>
          </div>
        </div>
      )}

      {/* Gmail Inbox Web simulation Modal view */}
      {showGmailModal && gmailAlert && (
        <div id="gmail-inbox-modal" className="fixed inset-0 z-55 flex items-center justify-center p-4 bg-stone-950/80 backdrop-blur-xs font-sans overflow-y-auto">
          <div className="relative w-full max-w-4xl bg-[#f6f8fc] dark:bg-[#0f0f0f] rounded-2xl shadow-2xl border border-stone-200 dark:border-stone-850 flex flex-col max-h-[92vh] overflow-hidden animate-slide-up">
            
            {/* Fake Gmail Top Search and Header */}
            <div className="flex items-center justify-between p-4 bg-white dark:bg-[#1a1a1a] border-b border-stone-150 dark:border-stone-850 shrink-0 select-none">
              <div className="flex items-center gap-3">
                {/* Red Gmail Logo Icon */}
                <div className="w-8 h-8 rounded-full bg-red-600/10 flex items-center justify-center">
                  <svg className="w-4 h-4 text-red-600" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M20 4c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2h16m0 4l-8 5-8-5v10h16V8m-8 3L4 6h16l-8 5z"/>
                  </svg>
                </div>
                <span className="text-sm font-semibold text-stone-750 dark:text-stone-205 font-sans">Surat Masuk Gmail - {gmailAlert.email}</span>
              </div>
              
              {/* Fake search query inside Google layout */}
              <div className="hidden md:flex flex-grow max-w-md mx-6 bg-stone-100 dark:bg-stone-900 rounded-full py-1.5 px-4 items-center gap-2 border border-transparent focus-within:border-stone-300 dark:focus-within:border-white/10">
                <svg className="w-4 h-4 text-stone-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                <input type="text" readOnly className="bg-transparent border-none outline-none text-xs text-stone-750 dark:text-stone-300 w-full cursor-not-allowed" value="Cari dalam email" />
              </div>

              <button 
                type="button" 
                onClick={() => setShowGmailModal(false)}
                className="w-8 h-8 rounded-full bg-stone-100 dark:bg-stone-850 hover:bg-stone-200 dark:hover:bg-stone-800 text-stone-650 dark:text-stone-300 flex items-center justify-center transition-colors cursor-pointer text-sm font-bold"
                aria-label="Tutup Gmail"
              >
                &times;
              </button>
            </div>

            {/* Split Panel Area */}
            <div className="flex-1 flex min-h-0 select-none">
              
              {/* Left sidebar rail */}
              <div className="hidden sm:flex flex-col w-48 p-3 bg-white dark:bg-[#1a1a1a] border-r border-stone-150 dark:border-stone-850 shrink-0 text-left">
                <button type="button" className="py-2.5 px-4 rounded-xl bg-sky-100 dark:bg-sky-950 text-[#001d35] dark:text-sky-200 font-bold text-xs flex items-center gap-2 mb-4 w-fit shadow-xs uppercase tracking-wider cursor-default">
                  ✏ Tulis
                </button>
                <div className="space-y-0.5 text-xs">
                  <div className="py-1.5 px-3 rounded-r-full bg-[#e8f0fe] dark:bg-[#2b3a4a] text-blue-600 dark:text-blue-300 font-bold flex items-center justify-between">
                    <span> Kotak Masuk</span>
                    <span className="bg-blue-600 text-white font-mono text-[9px] px-1.5 py-0.5 rounded">1</span>
                  </div>
                  <div className="py-1.5 px-3 rounded-r-full text-stone-600 dark:text-stone-400 hover:bg-stone-50 dark:hover:bg-stone-900 flex items-center gap-2">⭐ Berbintang</div>
                  <div className="py-1.5 px-3 rounded-r-full text-stone-600 dark:text-stone-400 hover:bg-stone-50 dark:hover:bg-stone-900 flex items-center gap-2">⏰ Ditangguhkan</div>
                  <div className="py-1.5 px-3 rounded-r-full text-stone-600 dark:text-stone-400 hover:bg-stone-50 dark:hover:bg-stone-900 flex items-center gap-2">🛫 Terkirim</div>
                  <div className="py-1.5 px-3 rounded-r-full text-stone-600 dark:text-stone-400 hover:bg-stone-50 dark:hover:bg-stone-900 flex items-center gap-2">📝 Draf</div>
                </div>
              </div>

              {/* Main Active Envelope Content */}
              <div className="flex-1 bg-white dark:bg-[#151515] p-5 md:p-8 overflow-y-auto text-left">
                
                {/* Email Subject Title */}
                <div className="border-b border-stone-150 dark:border-stone-850 pb-4 mb-5">
                  <h1 className="text-base md:text-xl font-medium text-stone-900 dark:text-stone-100">
                    Lansiran keamanan baru: Login baru terdeteksi pada CV Indra Jaya Kost
                  </h1>
                  <p className="text-xs text-stone-500 dark:text-stone-400 mt-2 font-mono flex items-center gap-1.5 select-text">
                    <span className="font-bold text-stone-700 dark:text-stone-300">Google Accounts</span> 
                    <span>&lt;no-reply@accounts.google.com&gt;</span>
                    <span>kepada saya</span>
                    <span>▼</span>
                  </p>
                </div>

                {/* Simulated Google Letterhead Container */}
                <div className="max-w-[580px] mx-auto border border-stone-200 dark:border-stone-800 rounded-2xl bg-white dark:bg-[#202124] p-6 shadow-sm font-sans select-text">
                  <div className="flex justify-center mb-5 select-none">
                    {/* Official Multi-Color Google Letters logo */}
                    <div className="flex gap-0.5 text-lg font-black tracking-normal select-none">
                      <span className="text-[#4285F4]">G</span>
                      <span className="text-[#EA4335]">o</span>
                      <span className="text-[#FBBC05]">o</span>
                      <span className="text-[#4285F4]">g</span>
                      <span className="text-[#34A853]">l</span>
                      <span className="text-[#EA4335]">e</span>
                    </div>
                  </div>

                  <div className="flex justify-center mb-4">
                    {/* Blue Security Check Badge Shield */}
                    <div className="w-16 h-16 rounded-full bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center">
                      <svg className="w-10 h-10 text-[#4285F4]" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.57-.598-3.75h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
                      </svg>
                    </div>
                  </div>

                  <h2 className="text-[20px] font-sans font-light text-center text-stone-850 dark:text-stone-100 mb-6 tracking-tight leading-tight">
                    Lansiran keamanan terbaru
                  </h2>

                  <p className="text-xs text-stone-600 dark:text-stone-300 leading-relaxed mb-4 text-center">
                    Halo <strong>{gmailAlert.name}</strong>, akun Google Anda baru saja digunakan untuk mengautentikasi masuk ke dasbor <strong>CV Indra Jaya Kost Persada</strong> melalui browser web Anda.
                  </p>

                  {/* Details matrix display */}
                  <div className="bg-stone-50 dark:bg-stone-900/50 rounded-xl p-4 border border-stone-150 dark:border-stone-850 space-y-2.5 mb-6 text-xs text-stone-700 dark:text-stone-300">
                    <div className="flex justify-between border-b border-stone-200/50 dark:border-white/5 pb-1.5">
                      <span className="font-bold">Aplikasi Konsumen</span>
                      <span className="text-stone-900 dark:text-white font-medium">indrajayakost.com</span>
                    </div>
                    <div className="flex justify-between border-b border-stone-200/50 dark:border-white/5 pb-1.5">
                      <span className="font-bold">Waktu Autentikasi</span>
                      <span className="text-stone-900 dark:text-white font-medium">{gmailAlert.time}</span>
                    </div>
                    <div className="flex justify-between border-b border-stone-200/50 dark:border-white/5 pb-1.5">
                      <span className="font-bold">Perangkat Seluler/PC</span>
                      <span className="text-stone-900 dark:text-white font-medium">{gmailAlert.device}</span>
                    </div>
                    <div className="flex justify-between pb-0.5">
                      <span className="font-bold">Lokasi Deteksi</span>
                      <span className="text-stone-900 dark:text-white font-medium text-right">{gmailAlert.location}</span>
                    </div>
                  </div>

                  {/* Yes command button and alert safety guidelines */}
                  <div className="flex flex-col items-center gap-3">
                    <button 
                      type="button"
                      onClick={() => setShowGmailModal(false)}
                      className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-semibold text-xs rounded-lg shadow-md hover:shadow-lg transition-all uppercase tracking-wider cursor-pointer"
                    >
                      Dua Langkah Verifikasi Terbuka: Konfirmasi ini adalah saya
                    </button>
                    <p className="text-[10px] text-stone-450 dark:text-stone-400 text-center leading-normal max-w-[420px] mt-2 select-none">
                      Pemberitahuan keamanan terdeteksi terenkripsi TLS 1.3 standard. Jika login di atas bukan Anda, segeralah ubah sandi Gmail utama Anda untuk menghindari akses tidak dikenal.
                    </p>
                  </div>

                </div>

                {/* Footer disclaimer at container block */}
                <div className="mt-8 text-center text-[10px] text-stone-400 dark:text-stone-500 font-light max-w-md mx-auto select-none border-t border-stone-100 dark:border-white/5 pt-4">
                  <p>Menerima email ini karena akun Google Anda terhubung ke API Client Oauth indrajayakost.com.</p>
                  <p className="mt-1">&copy; Google LLC, 1600 Amphitheatre Parkway, Mountain View, CA 94043, USA.</p>
                </div>

              </div>

            </div>
          </div>
        </div>
      )}

      {/* Real-time Connection status indicator rail (Discreet and elegant) */}
      <div className="fixed bottom-4 left-4 z-30 flex items-center gap-1.5 px-3 py-1.5 bg-slate-900/90 text-white text-[10px] font-bold rounded-full border border-slate-800 shadow-md">
        <Radio className="h-3 w-3 text-emerald-400 animate-ping" />
        <span>Sinkronisasi Real-Time Aktif</span>
      </div>

      {/* Authentic, Beautiful Footer */}
      <footer className="border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 py-12 transition-all mt-12">
        <div className="max-w-7xl mx-auto px-4 md:px-8 grid grid-cols-1 md:grid-cols-3 gap-8 text-left">
          
          <div className="space-y-4">
            <h3 className="text-lg font-black text-slate-900 dark:text-white">Indra Jaya Kost</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed font-semibold">
              Sistem Portofolio Manajemen Hunian Kost Mandiri Terpercaya Sidoarjo, Yogyakarta dan Jimbaran Bali. Menghadirkan asrama bersih, kencang stabil internet serta tertib administrasi keuangan.
            </p>
          </div>

          <div className="space-y-4 text-xs font-semibold">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">Kontak Pengurus</h4>
            <ul className="space-y-2.5 text-slate-600 dark:text-slate-300">
              <li className="flex items-center gap-2"><MapPin className="h-4 w-4 text-emerald-500" /> Jimbaran Nusa Dua, Bali, Sidoarjo, Sleman</li>
              <li className="flex items-center gap-2"><Phone className="h-4 w-4 text-emerald-500" /> +62 811-3940-294</li>
              <li className="flex items-center gap-2"><Mail className="h-4 w-4 text-emerald-500" /> support@indrajayakost.com</li>
            </ul>
          </div>

          <div className="space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">Lisensi & Jaminan</h4>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed font-semibold">
              Seluruh rekam data diproteksi SSL 256-bit dan tersinkronisasi antar cabang secara instan.
            </p>
            <div className="flex gap-2 items-center text-[10px] font-bold text-slate-400 bg-slate-50 dark:bg-slate-900/50 p-2.5 rounded-xl border border-mate">
              <ShieldCheck className="h-4 w-4 text-emerald-600" />
              <span>Verified Secure Connection Standard</span>
            </div>
          </div>

        </div>

        <div className="max-w-7xl mx-auto px-4 md:px-8 border-t border-slate-150 dark:border-slate-850 pt-6 mt-8 flex flex-col sm:flex-row justify-between items-center text-[10px] font-bold text-slate-400 gap-4">
          <p>&copy; {new Date().getFullYear()} CV Indra Jaya Kost Persada. Hak Cipta Dilindungi Undang-Undang.</p>
          <div className="flex gap-4">
            <a href="#" className="hover:underline">Syarat & Ketentuan</a>
            <a href="#" className="hover:underline">Kebijakan Privasi</a>
          </div>
        </div>
      </footer>

    </div>
  );
}
export {};
