import React from 'react';
import { Bell, Shield, Volume2, Save, Send } from 'lucide-react';
import { NotificationConfig } from '../types';

interface NotificationSettingsProps {
  config: NotificationConfig;
  setConfig: React.Dispatch<React.SetStateAction<NotificationConfig>>;
  isOpen: boolean;
  onClose: () => void;
  onTriggerMockPush: (title: string, message: string, type: 'payment' | 'maintenance' | 'system' | 'booking') => void;
}

export default function NotificationSettings({
  config,
  setConfig,
  isOpen,
  onClose,
  onTriggerMockPush
}: NotificationSettingsProps) {
  if (!isOpen) return null;

  const handleToggle = (key: keyof NotificationConfig) => {
    setConfig(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const simOptions = [
    { title: "Tagihan Air & Listrik", message: "Tagihan Kamar Anda bulan Juni senilai Rp 186.000 sudah terbit.", type: "payment" as const },
    { title: "Fogging Nyamuk DBD", message: "Fogging area halaman luar kos akan dilaksanakan besok pukul 09:00 WIB.", type: "maintenance" as const },
    { title: "Layanan Wi-Fi Selesai Upgrade", message: "Wi-Fi utama sekarang sudah ditingkatkan kecepatan menjadi 100 Mbps.", type: "system" as const },
    { title: "Booking Dikonfirmasi Admin", message: "Selamat! Pembayaran booking Kamar Deluxe Anda telah disetujui.", type: "booking" as const }
  ];

  return (
    <div id="notification-settings-modal" className="fixed inset-0 z-50 flex items-center justify-center p-4 font-sans">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-stone-950/75 backdrop-blur-xs transition-opacity" 
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal Container */}
      <div 
        className="relative w-full max-w-md rounded-none bg-[#FAF7F2] p-6 shadow-2xl transition-all dark:bg-[#0A0A0A] border border-stone-300 dark:border-white/10"
        role="dialog"
        aria-modal="true"
        aria-labelledby="notif-title"
      >
        <div className="flex items-center justify-between border-b pb-4 dark:border-white/10 mb-6">
          <div className="flex items-center gap-2">
            <Bell className="h-4 w-4 text-gold" />
            <h3 id="notif-title" className="text-xl font-serif italic text-stone-900 dark:text-white">
              Pengaturan Notifikasi
            </h3>
          </div>
          <button 
            type="button"
            className="rounded-none w-7 h-7 flex items-center justify-center bg-stone-200 dark:bg-stone-900 text-stone-650 cursor-pointer hover:bg-gold hover:text-black hover:dark:text-black hover:dark:bg-gold transition-colors font-bold text-center"
            onClick={onClose}
            aria-label="Tutup pengaturan notifikasi"
          >
            &times;
          </button>
        </div>

        <div className="space-y-6">
          {/* General Toggles */}
          <div className="space-y-4">
            <h4 className="text-[9px] font-bold text-[#d4af37] uppercase tracking-widest">Saluran Pemberitahuan</h4>
            
            {/* Push Toggle */}
            <div className="flex items-center justify-between">
              <div>
                <h5 className="text-xs uppercase tracking-widest font-semibold text-stone-850 dark:text-stone-200">Notifikasi Push In-App</h5>
                <p className="text-[11px] text-stone-500 font-light mt-0.5">Tampilkan banner melayang instan ketika ada info baru</p>
              </div>
              <button
                type="button"
                className={`relative inline-flex h-5 w-10 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-hidden ${
                  config.pushNotify ? 'bg-gold' : 'bg-stone-300 dark:bg-stone-800'
                }`}
                onClick={() => handleToggle('pushNotify')}
                role="switch"
                aria-checked={config.pushNotify}
              >
                <span className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out ${
                  config.pushNotify ? 'translate-x-5' : 'translate-x-0'
                }`} />
              </button>
            </div>

            {/* Email Toggle */}
            <div className="flex items-center justify-between">
              <div>
                <h5 className="text-xs uppercase tracking-widest font-semibold text-stone-850 dark:text-stone-200">Notifikasi Email</h5>
                <p className="text-[11px] text-stone-500 font-light mt-0.5">Kirim salinan ringkasan bulanan kuitansi lewat email Anda</p>
              </div>
              <button
                type="button"
                className={`relative inline-flex h-5 w-10 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-hidden ${
                  config.emailNotify ? 'bg-gold' : 'bg-stone-300 dark:bg-stone-800'
                }`}
                onClick={() => handleToggle('emailNotify')}
                role="switch"
                aria-checked={config.emailNotify}
              >
                <span className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out ${
                  config.emailNotify ? 'translate-x-5' : 'translate-x-0'
                }`} />
              </button>
            </div>
          </div>

          <div className="space-y-4 pt-4 border-t dark:border-white/10">
            <h4 className="text-[9px] font-bold text-[#d4af37] uppercase tracking-widest">Topik Notifikasi</h4>

            {/* Payment Alerts */}
            <div className="flex items-center justify-between">
              <div>
                <h5 className="text-xs uppercase tracking-widest font-semibold text-stone-850 dark:text-stone-200">Tagihan & Sewa</h5>
                <p className="text-[11px] text-stone-500 font-light mt-0.5">Peringatan otomatis H-3 sebelum jatuh tempo pembayaran</p>
              </div>
              <button
                type="button"
                className={`relative inline-flex h-5 w-10 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-hidden ${
                  config.paymentReminder ? 'bg-gold' : 'bg-stone-300 dark:bg-stone-800'
                }`}
                onClick={() => handleToggle('paymentReminder')}
                role="switch"
                aria-checked={config.paymentReminder}
              >
                <span className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out ${
                  config.paymentReminder ? 'translate-x-5' : 'translate-x-0'
                }`} />
              </button>
            </div>

            {/* Maintenance Alerts */}
            <div className="flex items-center justify-between">
              <div>
                <h5 className="text-xs uppercase tracking-widest font-semibold text-stone-850 dark:text-stone-200">Pemeliharaan Pemondokan</h5>
                <p className="text-[11px] text-stone-500 font-light mt-0.5">Berita AC mati, mati listrik, perbaikan Wi-Fi berkala</p>
              </div>
              <button
                type="button"
                className={`relative inline-flex h-5 w-10 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-hidden ${
                  config.maintenanceAlert ? 'bg-gold' : 'bg-stone-300 dark:bg-stone-800'
                }`}
                onClick={() => handleToggle('maintenanceAlert')}
                role="switch"
                aria-checked={config.maintenanceAlert}
              >
                <span className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out ${
                  config.maintenanceAlert ? 'translate-x-5' : 'translate-x-0'
                }`} />
              </button>
            </div>

            {/* Sound Toggles */}
            <div className="flex items-center justify-between">
              <div>
                <h5 className="text-xs uppercase tracking-widest font-semibold text-stone-850 dark:text-stone-200">Efek Suara Notifikasi</h5>
                <p className="text-[11px] text-stone-500 font-light mt-0.5">Bunyi melodi singkat saat rilis banner notifikasi baru</p>
              </div>
              <button
                type="button"
                className={`relative inline-flex h-5 w-10 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-hidden ${
                  config.autoSound ? 'bg-gold' : 'bg-stone-300 dark:bg-stone-800'
                }`}
                onClick={() => handleToggle('autoSound')}
                role="switch"
                aria-checked={config.autoSound}
              >
                <span className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out ${
                  config.autoSound ? 'translate-x-5' : 'translate-x-0'
                }`} />
              </button>
            </div>
          </div>

          {/* Sandbox Mock Notification Simulator (Highly Interactive) */}
          <div className="p-4 rounded-none bg-white dark:bg-[#0E0E0E] border border-dashed border-[#d4af37]/35 space-y-3 font-sans">
            <div className="flex items-center gap-1.5 font-bold text-[10px] uppercase tracking-widest text-[#d4af37]">
              <Shield className="h-3. w-3 text-gold animate-pulse" />
              Simulasi Uji Coba Pemberitahuan
            </div>
            <p className="text-[11px] text-stone-500 dark:text-stone-400 font-light">Ketuk tombol di bawah untuk menyiarkan pemberitahuan tiruan instan secara real-time:</p>
            <div className="grid grid-cols-2 gap-2 pt-1 font-sans">
              {simOptions.map((opt, i) => (
                <button
                  key={i}
                  type="button"
                  className="py-2.5 px-2.5 rounded-none text-left text-[11px] font-semibold text-stone-800 bg-stone-50 dark:bg-[#0A0A0A] border border-stone-200 hover:border-gold dark:border-white/5 dark:hover:border-gold transition-all shadow-xs dark:text-stone-200 flex flex-col justify-between cursor-pointer"
                  onClick={() => {
                    onTriggerMockPush(opt.title, opt.message, opt.type);
                  }}
                >
                  <span className="text-[#d4af37] font-bold mb-1 block truncate text-[10px] uppercase tracking-wider">{opt.title}</span>
                  <span className="text-[9px] text-stone-500 dark:text-stone-405 truncate w-full font-light">{opt.message}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-8 border-t pt-4 dark:border-white/10 flex justify-end gap-3 font-sans">
          <button
            type="button"
            className="border border-stone-300 text-stone-800 text-[10px] uppercase tracking-widest hover:bg-stone-100 dark:border-white/10 dark:text-stone-200 px-5 py-3 rounded-none font-semibold cursor-pointer"
            onClick={onClose}
          >
            Batal
          </button>
          <button
            type="button"
            className="bg-stone-900 text-white dark:bg-white dark:text-black font-semibold text-[10px] uppercase tracking-widest px-6 py-3 rounded-none hover:bg-gold dark:hover:bg-gold dark:hover:text-black transition-all flex items-center gap-1.5 cursor-pointer border border-transparent"
            onClick={onClose}
          >
            <Save className="h-3.5 w-3.5 text-gold" />
            Simpan Konfigurasi
          </button>
        </div>
      </div>
    </div>
  );
}
export {};
