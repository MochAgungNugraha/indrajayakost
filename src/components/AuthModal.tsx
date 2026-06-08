import React, { useState } from 'react';
import { LogIn, UserPlus, Key, Eye, EyeOff, CheckCircle } from 'lucide-react';
import { User } from '../types';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (user: User, isGoogle?: boolean) => void;
  usersList: User[];
  onRegister: (name: string, email: string, role: 'tenant' | 'admin' | 'guest') => void;
}

export default function AuthModal({
  isOpen,
  onClose,
  onLoginSuccess,
  usersList,
  onRegister
}: AuthModalProps) {
  if (!isOpen) return null;

  const [isRegisterMode, setIsRegisterMode] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('password123'); // Default secure mockup
  const [name, setName] = useState('');
  const [role, setRole] = useState<'admin' | 'tenant' | 'guest'>('guest');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const [isGoogleChooserOpen, setIsGoogleChooserOpen] = useState(false);
  const [customGoogleEmail, setCustomGoogleEmail] = useState('');
  const [customGoogleName, setCustomGoogleName] = useState('');
  const [showCustomGoogleForm, setShowCustomGoogleForm] = useState(false);
  const [googleStep, setGoogleStep] = useState(1);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    // Query in db users list
    const found = usersList.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (found) {
      setSuccessMsg(`Selamat datang kembali, ${found.name}!`);
      setTimeout(() => {
        onLoginSuccess(found);
        onClose();
        resetForm();
      }, 800);
    } else {
      setErrorMsg("Email tidak ditemukan atau password salah. Coba pilih pintasan di bawah!");
    }
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    if (!name || !email) {
      setErrorMsg("Harap isi semua kolom wajib.");
      return;
    }

    if (usersList.some(u => u.email.toLowerCase() === email.toLowerCase())) {
      setErrorMsg("Email sudah digunakan.");
      return;
    }

    onRegister(name, email, role);
    setSuccessMsg("Pendaftaran berhasil! Akun Anda siap digunakan.");
    setTimeout(() => {
      // Find the newly registered user in local state or log it
      const createdUser: User = {
        id: "u_" + Math.random().toString(36).substring(2, 9),
        name,
        email,
        role
      };
      onLoginSuccess(createdUser);
      onClose();
      resetForm();
    }, 1200);
  };

  const selectQuickUser = (quickUser: User) => {
    setEmail(quickUser.email);
    setPassword('••••••••');
    setErrorMsg('');
    setSuccessMsg(`Mempersiapkan masuk sebagai ${quickUser.name}...`);
    setTimeout(() => {
      onLoginSuccess(quickUser);
      onClose();
      resetForm();
    }, 700);
  };

  const resetForm = () => {
    setIsRegisterMode(false);
    setEmail('');
    setPassword('password123');
    setName('');
    setRole('guest');
    setErrorMsg('');
    setSuccessMsg('');
    setIsGoogleChooserOpen(false);
    setCustomGoogleEmail('');
    setCustomGoogleName('');
    setShowCustomGoogleForm(false);
    setGoogleStep(1);
  };

  const handleGoogleSelect = async (gName: string, gEmail: string, gAvatar?: string) => {
    setErrorMsg('');
    setSuccessMsg('');
    setIsGoogleChooserOpen(false);
    setSuccessMsg(`Menghubungkan dengan akun Google ${gEmail}...`);
    
    try {
      const res = await fetch("/api/auth/google", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: gName,
          email: gEmail,
          avatar: gAvatar || `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(gName)}`
        })
      });
      
      if (res.ok) {
        const data = await res.json();
        setSuccessMsg(`Pendaftaran/Masuk Berhasil! Selamat datang, ${data.user.name}.`);
        setTimeout(() => {
          onLoginSuccess(data.user, true);
          onClose();
          resetForm();
        }, 1000);
      } else {
        const errorData = await res.json();
        setErrorMsg(errorData.message || "Gagal masuk menggunakan Google.");
      }
    } catch (err) {
      console.error(err);
      setErrorMsg("Koneksi server gagal saat masuk menggunakan Google.");
    }
  };

  React.useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      const origin = event.origin;
      if (
        !origin.endsWith('.run.app') &&
        !origin.includes('localhost') &&
        !origin.includes('127.0.0.1') &&
        origin !== window.location.origin
      ) {
        return;
      }
      if (event.data?.type === 'OAUTH_AUTH_SUCCESS') {
        const oUser = event.data.user;
        if (oUser && oUser.email) {
          handleGoogleSelect(oUser.name, oUser.email, oUser.avatar);
        }
      }
    };
    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, []);

  const handleGoogleSSO = async () => {
    setErrorMsg('');
    setSuccessMsg('Menghubungkan ke Single Sign-On Google...');
    try {
      const res = await fetch('/api/auth/google/url');
      if (!res.ok) {
        throw new Error('Gagal mendapatkan tautan SSO Google');
      }
      const data = await res.json();
      const url = data.url;
      
      const width = 500;
      const height = 620;
      const left = window.screenX + (window.outerWidth - width) / 2;
      const top = window.screenY + (window.outerHeight - height) / 2;
      
      const popup = window.open(
        url,
        'google_oauth_popup',
        `width=${width},height=${height},left=${left},top=${top},scrollbars=yes,status=no`
      );
      
      if (!popup) {
        throw new Error('Jendela pop-up terblokir! Silakan izinkan pop-up di penjelajah Anda.');
      } else {
        setSuccessMsg('Selesaikan masuk log di jendela Google baru...');
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Gagal memulai login Google');
      setSuccessMsg('');
    }
  };

  return (
    <div id="auth-modal" className="fixed inset-0 z-50 flex items-center justify-center p-4 font-sans">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-stone-950/75 backdrop-blur-xs transition-opacity" 
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal Container */}
      <div className="relative w-full max-w-lg rounded-none bg-[#FAF7F2] p-6 shadow-2xl transition-all dark:bg-[#0A0A0A] border border-stone-300 dark:border-white/10 flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b pb-4 dark:border-white/10 mb-6 shrink-0">
          <div className="flex items-center gap-2">
            <Key className="b-5 w-5 text-gold" />
            <h3 className="text-xl font-serif italic text-stone-900 dark:text-white">
              {isRegisterMode ? "Pendaftaran Anggota Baru" : "Masuk ke Akun Anda"}
            </h3>
          </div>
          <button 
            type="button"
            className="rounded-none w-7 h-7 flex items-center justify-center bg-stone-200 dark:bg-stone-900 text-stone-650 cursor-pointer hover:bg-gold hover:text-black hover:dark:text-black hover:dark:bg-gold transition-colors font-bold text-center"
            onClick={onClose}
            aria-label="Tutup pintu masuk"
          >
            &times;
          </button>
        </div>

        {/* Content Scroll Area */}
        <div className="flex-1 overflow-y-auto pr-1 space-y-6">
          
          {/* Messages */}
          {errorMsg && (
            <div className="p-3.5 rounded-none bg-rose-50 text-rose-700 text-xs font-semibold border border-rose-100 dark:bg-rose-950/20 dark:text-rose-300 dark:border-rose-900/30">
              {errorMsg}
            </div>
          )}

          {successMsg && (
            <div className="p-3.5 rounded-none bg-stone-50 text-gold text-xs font-semibold border border-stone-250 dark:bg-stone-900/20 dark:text-[#d4af37] dark:border-white/5 flex items-center gap-2">
              <CheckCircle className="h-4 w-4 animate-bounce text-gold" />
              {successMsg}
            </div>
          )}

          {/* Core Interactive Forms */}
          {!isRegisterMode ? (
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-[9px] font-bold text-[#d4af37] uppercase tracking-widest mb-1.5">Alamat Email</label>
                <input
                  type="email"
                  className="w-full px-4 py-2.5 rounded-none border border-stone-350 focus:border-gold focus:ring-1 focus:ring-gold bg-white dark:bg-stone-950/30 dark:border-white/15 dark:text-white outline-hidden font-medium text-xs transition-all"
                  placeholder="Contoh: budi@gmail.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <div>
                <label className="block text-[9px] font-bold text-[#d4af37] uppercase tracking-widest mb-1.5">Password Keamanan</label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    className="w-full pl-4 pr-11 py-2.5 rounded-none border border-stone-350 focus:border-gold focus:ring-1 focus:ring-gold bg-white dark:bg-stone-950/30 dark:border-white/15 dark:text-white outline-hidden font-medium text-xs transition-all text-ellipsis"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                  <button
                    type="button"
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
                  </button>
                </div>
              </div>

              <div className="flex justify-between items-center text-[10px] text-stone-450 uppercase tracking-wider font-semibold">
                <span className="flex items-center gap-1.5">
                  <input type="checkbox" defaultChecked className="rounded-none text-gold focus:ring-gold bg-white border-stone-350 dark:bg-stone-850 dark:border-white/10" />
                  Ingat perangkat
                </span>
                <a href="#" onClick={(e) => { e.preventDefault(); alert("Silakan gunakan pintasan cepat atau masukkan email Budi."); }} className="text-gold hover:underline">Lupa password?</a>
              </div>

              <button
                type="submit"
                className="w-full bg-stone-900 text-white dark:bg-white dark:text-black font-semibold text-[10px] uppercase tracking-widest py-3 rounded-none hover:bg-gold dark:hover:bg-gold dark:hover:text-black transition-all cursor-pointer flex items-center justify-center gap-2 mt-2"
              >
                <LogIn className="h-3.5 w-3.5" />
                Masuk Sekarang
              </button>

              <div className="relative my-4 flex py-1 items-center font-sans">
                <div className="flex-grow border-t border-stone-300 dark:border-white/10"></div>
                <span className="flex-shrink mx-4 text-[9px] uppercase tracking-widest text-stone-400 font-bold bg-[#FAF7F2] dark:bg-[#0A0A0A] px-2">Atau</span>
                <div className="flex-grow border-t border-stone-300 dark:border-white/10"></div>
              </div>

              <button
                type="button"
                onClick={handleGoogleSSO}
                className="w-full bg-white dark:bg-stone-900 text-stone-850 dark:text-stone-200 border border-stone-300 dark:border-white/10 font-bold text-[9px] uppercase tracking-widest py-3 rounded-none hover:bg-stone-50 dark:hover:bg-stone-950 transition-all cursor-pointer flex items-center justify-center gap-2.5"
              >
                <svg className="h-4 w-4 shrink-0" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" fill="#FBBC05"/>
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" fill="#EA4335"/>
                </svg>
                Masuk dengan Google
              </button>
            </form>
          ) : (
            <form onSubmit={handleRegister} className="space-y-4">
              <div>
                <label className="block text-[9px] font-bold text-[#d4af37] uppercase tracking-widest mb-1.5">Nama Lengkap</label>
                <input
                  type="text"
                  className="w-full px-4 py-2.5 rounded-none border border-stone-350 focus:border-gold focus:ring-1 focus:ring-gold bg-white dark:bg-stone-950/30 dark:border-white/15 dark:text-white outline-hidden font-medium text-xs transition-all"
                  placeholder="Contoh: Budi Santoso"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>

              <div>
                <label className="block text-[9px] font-bold text-[#d4af37] uppercase tracking-widest mb-1.5">Alamat Email</label>
                <input
                  type="email"
                  className="w-full px-4 py-2.5 rounded-none border border-stone-350 focus:border-gold focus:ring-1 focus:ring-gold bg-white dark:bg-stone-950/30 dark:border-white/15 dark:text-white outline-hidden font-medium text-xs transition-all"
                  placeholder="Contoh: budi@gmail.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <div>
                <label className="block text-[9px] font-bold text-[#d4af37] uppercase tracking-widest mb-1.5">Peran Akun</label>
                <select
                  className="w-full px-4 py-2.5 rounded-none border border-stone-350 focus:border-gold focus:ring-1 focus:ring-gold bg-white dark:bg-stone-950/30 dark:border-white/15 dark:text-white outline-hidden font-medium text-xs transition-all"
                  value={role}
                  onChange={(e) => setRole(e.target.value as any)}
                >
                  <option value="guest">Tamu / Calon Penyewa</option>
                  <option value="tenant">Penyewa Aktif (Jika sudah memiliki kamar)</option>
                </select>
              </div>

              <button
                type="submit"
                className="w-full bg-stone-900 text-white dark:bg-white dark:text-black font-semibold text-[10px] uppercase tracking-widest py-3 rounded-none hover:bg-gold dark:hover:bg-gold dark:hover:text-black transition-all cursor-pointer flex items-center justify-center gap-2 mt-2"
              >
                <UserPlus className="h-3.5 w-3.5" />
                Daftar Akun Baru
              </button>

              <div className="relative my-4 flex py-1 items-center font-sans">
                <div className="flex-grow border-t border-stone-300 dark:border-white/10"></div>
                <span className="flex-shrink mx-4 text-[9px] uppercase tracking-widest text-stone-400 font-bold bg-[#FAF7F2] dark:bg-[#0A0A0A] px-2">Atau</span>
                <div className="flex-grow border-t border-stone-300 dark:border-white/10"></div>
              </div>

              <button
                type="button"
                onClick={handleGoogleSSO}
                className="w-full bg-white dark:bg-stone-900 text-stone-850 dark:text-stone-200 border border-stone-300 dark:border-white/10 font-bold text-[9px] uppercase tracking-widest py-3 rounded-none hover:bg-stone-50 dark:hover:bg-stone-950 transition-all cursor-pointer flex items-center justify-center gap-2.5"
              >
                <svg className="h-4 w-4 shrink-0" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" fill="#FBBC05"/>
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" fill="#EA4335"/>
                </svg>
                Daftar dengan Google
              </button>
            </form>
          )}

          {/* Quick Shortcuts / One-Click Entry (Fabulous for testing) */}
          <div className="pt-6 border-t dark:border-white/10">
            <h4 className="text-[9px] font-bold text-stone-400 uppercase tracking-widest mb-3.5 text-center">
              Pintasan Masuk Cepat (Uji Aplikasi)
            </h4>
            <div className="grid grid-cols-2 gap-2">
              {usersList.map((quickUser) => (
                <button
                  key={quickUser.id}
                  type="button"
                  className="p-3 rounded-none bg-white dark:bg-[#0D0D0D] border border-stone-250 hover:border-gold dark:border-white/5 dark:hover:border-gold transition-all text-left group cursor-pointer"
                  onClick={() => selectQuickUser(quickUser)}
                >
                  <p className="text-xs font-serif italic text-stone-850 dark:text-stone-200 group-hover:text-gold transition-colors font-semibold">
                    {quickUser.name}
                  </p>
                  <div className="flex items-center justify-between mt-1 text-[9px] text-stone-450 uppercase tracking-widest font-medium">
                    <span>{quickUser.role === 'admin' ? 'Manager' : `Penyewa: ${quickUser.roomNumber || 'Baru'}`}</span>
                    <span className="opacity-0 group-hover:opacity-100 text-gold font-bold transition-all">Pilih &rarr;</span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Footer Modes Switcher */}
          <div className="text-center pt-2">
            <p className="text-xs text-stone-500 font-light font-sans">
              {!isRegisterMode ? (
                <>
                  Belum punya akun?{" "}
                  <button type="button" onClick={() => setIsRegisterMode(true)} className="text-gold hover:underline font-bold font-sans cursor-pointer">
                    Daftar di sini
                  </button>
                </>
              ) : (
                <>
                  Sudah punya akun?{" "}
                  <button type="button" onClick={() => setIsRegisterMode(false)} className="text-gold hover:underline font-bold font-sans cursor-pointer">
                    Masuk di sini
                  </button>
                </>
              )}
            </p>
          </div>

        </div>
      </div>

      {/* 4. Google Account Chooser stacked modal */}
      {isGoogleChooserOpen && (
        <div id="google-chooser-overlay" className="fixed inset-0 z-55 flex items-center justify-center bg-[#121212]/95 backdrop-blur-sm transition-all duration-300 font-sans select-none overflow-y-auto py-6">
          <div className="w-full max-w-[820px] bg-[#1f1f1f] rounded-[28px] border border-[#3c4043] shadow-2xl p-8 md:p-10 flex flex-col md:flex-row gap-8 justify-between relative mt-auto mb-auto mx-4 overflow-hidden">
            
            {/* Left side column */}
            <div className="flex-1 flex flex-col justify-between text-left pr-4">
              <div>
                {/* Upper Google G Logo Row */}
                <div className="flex items-center gap-2 mb-8">
                  <svg className="h-[20px] w-auto shrink-0" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" fill="#FBBC05"/>
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" fill="#EA4335"/>
                  </svg>
                  <span className="text-xs font-medium text-stone-400">Login dengan Google</span>
                </div>

                {/* Simulated Custom Deepseek whale or brand logo */}
                <div className="w-12 h-12 rounded-full bg-blue-600 flex items-center justify-center text-white mb-6 shadow-md shadow-blue-500/10">
                  <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M3 13h1v7c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2v-7h1a1 1 0 0 0 .8-1.6l-9-10a1 1 0 0 0-1.6 0l-9 10A1 1 0 0 0 3 13zm3 7v-5h12v5H6z" fill="currentColor" stroke="currentColor" strokeWidth="0.5" />
                  </svg>
                </div>

                {/* Primary display heading */}
                <h2 className="text-[32px] md:text-[37px] font-sans font-light tracking-wide text-[#e8eaed] leading-tight mb-2">
                  {googleStep === 1 ? "Login" : "Selamat datang"}
                </h2>

                <p className="text-sm text-[#9aa0a6] mt-4 font-sans font-light">
                  Lanjutkan ke <span className="text-[#8ab4f8] hover:underline cursor-pointer">indrajayakost.com</span>
                </p>
              </div>

              {/* Back button */}
              <button
                type="button"
                onClick={() => {
                  setIsGoogleChooserOpen(false);
                  setGoogleStep(1);
                }}
                className="mt-12 text-xs font-semibold text-[#8a99ad] hover:text-white transition-colors cursor-pointer text-left w-fit uppercase tracking-widest flex items-center gap-2"
              >
                &larr; Kembali ke login biasa
              </button>
            </div>

            {/* Right side list / form and disclaimer */}
            <div className="flex-1 flex flex-col justify-between text-left min-w-0 md:pl-6 md:border-l border-[#3c4043]/40 min-h-[300px]">
              
              <div className="space-y-0.5">
                {/* 1. Moch Agung Nugraha account option */}
                <button
                  type="button"
                  onClick={() => handleGoogleSelect("Moch Agung Nugraha", "agungnugraha5077@gmail.com")}
                  className="w-full py-3.5 px-4 flex items-center gap-4 hover:bg-[#2e2f32] active:bg-[#343538] rounded-xl transition-all text-left outline-hidden border border-transparent cursor-pointer group"
                >
                  <div className="w-9 h-9 rounded-full bg-[#007b83] text-white flex items-center justify-center font-semibold text-sm shrink-0 select-none uppercase">
                    M
                  </div>
                  <div className="flex-1 min-w-0 font-sans">
                    <div className="flex items-center gap-1.5">
                      <p className="text-sm font-medium text-[#e8eaed] leading-tight truncate">Moch Agung Nugraha</p>
                      <span className="text-[7px] font-bold tracking-widest bg-amber-500/10 text-amber-500 border border-amber-500/20 px-1 py-0.5 rounded-none uppercase shrink-0">Admin</span>
                    </div>
                    <p className="text-xs text-[#9aa0a6] truncate mt-0.5 font-light">agungnugraha5077@gmail.com</p>
                  </div>
                  <span className="text-xs text-[#8ab4f8] font-medium opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap shrink-0">Masuk &rarr;</span>
                </button>

                <div className="border-b border-[#3c4043]/50 mx-1"></div>

                {/* 2. Pembeli Bebas account option */}
                <button
                  type="button"
                  onClick={() => handleGoogleSelect("Pembeli Bebas", "pembeli@gmail.com")}
                  className="w-full py-3.5 px-4 flex items-center gap-4 hover:bg-[#2e2f32] active:bg-[#343538] rounded-xl transition-all text-left outline-hidden border border-transparent cursor-pointer group"
                >
                  <div className="w-9 h-9 rounded-full bg-teal-600 text-white flex items-center justify-center font-semibold text-sm shrink-0 select-none uppercase">
                    P
                  </div>
                  <div className="flex-1 min-w-0 font-sans">
                    <div className="flex items-center gap-1.5">
                      <p className="text-sm font-medium text-[#e8eaed] leading-tight truncate">Pembeli Bebas</p>
                      <span className="text-[7px] font-bold tracking-widest bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 px-1 py-0.5 rounded-none uppercase shrink-0">Penyewa</span>
                    </div>
                    <p className="text-xs text-[#9aa0a6] truncate mt-0.5 font-light">pembeli@gmail.com</p>
                  </div>
                  <span className="text-xs text-[#8ab4f8] font-medium opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap shrink-0">Masuk &rarr;</span>
                </button>

                <div className="border-b border-[#3c4043]/50 mx-1"></div>

                {/* 3. Ir. Indra Jaya (Owner) account option */}
                <button
                  type="button"
                  onClick={() => handleGoogleSelect("Ir. Indra Jaya", "indra@indrajayakost.com")}
                  className="w-full py-3.5 px-4 flex items-center gap-4 hover:bg-[#2e2f32] active:bg-[#343538] rounded-xl transition-all text-left outline-hidden border border-transparent cursor-pointer group"
                >
                  <div className="w-9 h-9 rounded-full bg-amber-600 text-white flex items-center justify-center font-semibold text-sm shrink-0 select-none uppercase">
                    I
                  </div>
                  <div className="flex-1 min-w-0 font-sans">
                    <div className="flex items-center gap-1.5">
                      <p className="text-sm font-medium text-[#e8eaed] leading-tight truncate">Ir. Indra Jaya (Owner)</p>
                      <span className="text-[7px] font-bold tracking-widest bg-yellow-500/10 text-[#ffd700] border border-yellow-500/20 px-1 py-0.5 rounded-none uppercase shrink-0">Owner</span>
                    </div>
                    <p className="text-xs text-[#9aa0a6] truncate mt-0.5 font-light">indra@indrajayakost.com</p>
                  </div>
                  <span className="text-xs text-[#8ab4f8] font-medium opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap shrink-0">Masuk &rarr;</span>
                </button>

                <div className="border-b border-[#3c4043]/50 mx-1"></div>

                {/* Gunakan akun lain button */}
                {!showCustomGoogleForm ? (
                  <button
                    type="button"
                    onClick={() => setShowCustomGoogleForm(true)}
                    className="w-full py-4 px-4 flex items-center gap-4 hover:bg-[#2e2f32] active:bg-[#343538] rounded-xl transition-all text-left outline-hidden border border-transparent cursor-pointer group"
                  >
                    <div className="w-9 h-9 rounded-full bg-transparent border border-[#5f6368] text-[#e8eaed] flex items-center justify-center shrink-0">
                      <svg className="h-4 w-4 text-[#9aa0a6] group-hover:text-white transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                      </svg>
                    </div>
                    <p className="text-sm font-medium text-[#e8eaed] leading-none group-hover:text-white transition-colors font-sans">
                      Gunakan akun lain
                    </p>
                  </button>
                ) : (
                  <div className="p-4 border border-[#3c4043] bg-[#2d2e30]/50 rounded-xl space-y-3 mt-2 font-sans animate-fade-in">
                    <div className="flex justify-between items-center pb-1">
                      <p className="text-[10px] text-[#8ab4f8] font-bold uppercase tracking-wider">Gunakan Akun Google Kustom</p>
                      <button 
                        type="button" 
                        onClick={() => setShowCustomGoogleForm(false)} 
                        className="text-stone-400 hover:text-white text-xs px-1 cursor-pointer"
                      >
                        Batal
                      </button>
                    </div>
                    
                    <div>
                      <label className="block text-[8px] font-bold text-stone-400 uppercase tracking-widest mb-1.5">Nama Akun Lengkap</label>
                      <input
                        type="text"
                        className="w-full px-3 py-2 bg-[#1f1f1f] border border-[#3c4043] rounded-lg text-white font-medium text-xs focus:border-[#8ab4f8] outline-none"
                        placeholder="Contoh: Rian Hidayat"
                        value={customGoogleName}
                        onChange={(e) => setCustomGoogleName(e.target.value)}
                      />
                    </div>
                    <div>
                      <label className="block text-[8px] font-bold text-stone-400 uppercase tracking-widest mb-1.5">Email Google (@gmail.com)</label>
                      <input
                        type="email"
                        className="w-full px-3 py-2 bg-[#1f1f1f] border border-[#3c4043] rounded-lg text-white font-medium text-xs focus:border-[#8ab4f8] outline-none"
                        placeholder="Contoh: rian@gmail.com"
                        value={customGoogleEmail}
                        onChange={(e) => setCustomGoogleEmail(e.target.value)}
                      />
                    </div>
                    
                    <div className="flex gap-2 pt-1">
                      <button
                        type="button"
                        onClick={() => {
                          if (!customGoogleEmail || !customGoogleEmail.includes("@")) {
                            alert("Masukkan alamat email valid!");
                            return;
                          }
                          handleGoogleSelect(customGoogleName || customGoogleEmail.split("@")[0], customGoogleEmail);
                        }}
                        className="flex-1 bg-[#8ab4f8] text-neutral-950 hover:bg-[#a1c4fd] text-[9.5px] font-bold uppercase py-2.5 rounded-lg cursor-pointer transition-all text-center"
                      >
                        Konfirmasi &amp; Masuk &rarr;
                      </button>
                    </div>
                  </div>
                )}
              </div>

              <div className="mt-6 border-t border-[#3c4043]/55 pt-5">
                {/* Google bottom disclaimer */}
                <p className="text-[11px] text-[#9aa0a6] leading-relaxed font-sans font-light">
                  Sebelum menggunakan aplikasi ini, Anda dapat meninjau <span className="text-[#8ab4f8] hover:underline cursor-pointer">Kebijakan Privasi</span> dan <span className="text-[#8ab4f8] hover:underline cursor-pointer">Persyaratan Layanan</span> indrajayakost.com.
                </p>
              </div>

            </div>

            {/* Simulated Google External Bottom Frame */}
            <div className="absolute left-8 bottom-4 text-[10px] text-[#9aa0a6] font-light flex items-center gap-1 opacity-0 pointer-events-none">
              <span>Indonesia</span>
              <svg className="w-2.5 h-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M19 9l-7 7-7-7" /></svg>
            </div>

          </div>

          {/* Genuine Chooser footer bar matching Google's actual design */}
          <div className="absolute bottom-4 left-0 right-0 max-w-[820px] mx-auto px-6 flex justify-between items-center text-[11px] text-[#9aa0a6] font-normal font-sans pointer-events-auto">
            <div className="flex items-center gap-1 hover:text-white cursor-pointer transition-colors">
              <span>Indonesia</span>
              <svg className="w-2.5 h-2.5 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" /></svg>
            </div>
            <div className="flex gap-4">
              <a href="#" onClick={(e) => e.preventDefault()} className="hover:text-white transition-colors">Bantuan</a>
              <a href="#" onClick={(e) => e.preventDefault()} className="hover:text-white transition-colors">Privasi</a>
              <a href="#" onClick={(e) => e.preventDefault()} className="hover:text-white transition-colors">Persyaratan</a>
            </div>
          </div>

        </div>
      )}
    </div>
  );
}
export {};
