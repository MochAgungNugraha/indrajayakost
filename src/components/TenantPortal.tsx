import React, { useState } from 'react';
import { 
  Building, 
  CreditCard, 
  CheckCircle, 
  Activity, 
  Trash2, 
  Hammer, 
  Zap, 
  FileText, 
  Plus, 
  AlertCircle,
  QrCode,
  ArrowRight
} from 'lucide-react';
import { User, Room, Booking, DamageReport, NotificationItem } from '../types';

interface TenantPortalProps {
  currentUser: User;
  rooms: Room[];
  bookings: Booking[];
  reports: DamageReport[];
  notifications: NotificationItem[];
  onSubmitReport: (title: string, description: string) => void;
  onSubmitPayment: (bookingId: string, method: string, proofUrl: string) => void;
  highContrast: boolean;
}

export default function TenantPortal({
  currentUser,
  rooms,
  bookings,
  reports,
  notifications,
  onSubmitReport,
  onSubmitPayment,
  highContrast
}: TenantPortalProps) {
  // Local state for Schaden lapor kerusakan form
  const [reportTitle, setReportTitle] = useState('');
  const [reportDesc, setReportDesc] = useState('');
  
  // Payment modal state
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<'Transfer BCA' | 'Transfer Mandiri' | 'QRIS'>('QRIS');
  const [uploadedReceipt, setUploadedReceipt] = useState('');
  const [isUploading, setIsUploading] = useState(false);

  // Meteran Listrik Simulator state
  const [electricityToken, setElectricityToken] = useState('2849-1058-2940-1049');
  const [kWLeft, setkWLeft] = useState(45.6);
  const [tokenInput, setTokenInput] = useState('');

  // Find tenant's direct room info and active booking matches
  const tenantRoom = rooms.find(r => r.roomNumber === currentUser.roomNumber);
  const tenantBookings = bookings.filter(b => b.tenantId === currentUser.id);
  const tenantReports = reports.filter(r => r.tenantId === currentUser.id);

  const handleReportSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reportTitle || !reportDesc) return;
    onSubmitReport(reportTitle, reportDesc);
    setReportTitle('');
    setReportDesc('');
  };

  const handleSimulatePayment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedBooking) return;

    setIsUploading(true);
    setTimeout(() => {
      // Simulate real-looking invoice receipt path
      const generatedReceipt = "https://lh3.googleusercontent.com/aida-public/AB6AXuDhh6YpgPoUaDFa5gr0cyFdzu4mK07wzku9yYVKa-Xj_6yUxItUUfPdCqSiP8U-Te4ncX9x5iAIGgdeorrcCN5eKbgYBinA-uBw_QiUOn0wrC1-gVDNIQpyWKVK1J8BIG5wo-dI0cidvZjcjgnFCfazVfBSd77H3A1zAiADPpuu8IiumR6Nl83YPrWPJUWIm2pKGaLNeNr-D9OWCoQRAUZio3zygc9xHqWyobaDWvrP2v2HWILKpWtSfkOncKH61zM0KwDXgrtBzhE";
      onSubmitPayment(selectedBooking.id, paymentMethod, generatedReceipt);
      setIsUploading(false);
      setSelectedBooking(null);
    }, 1200);
  };

  const handleBuyTokenSim = (e: React.FormEvent) => {
    e.preventDefault();
    if (!tokenInput || isNaN(Number(tokenInput))) {
      alert("Masukkan nominal angka yang valid.");
      return;
    }
    const rate = 1500; // Rp 1500 per kwh
    const addedKW = Number(tokenInput) / rate;
    setkWLeft(prev => Number((prev + addedKW).toFixed(1)));
    setElectricityToken(`TOKEN PIN: ${Math.floor(1000 + Math.random() * 9000)}-${Math.floor(1000 + Math.random() * 9000)}-${Math.floor(1000 + Math.random() * 9000)}-${Math.floor(1000 + Math.random() * 9000)}`);
    setTokenInput('');
    alert(`Token berhasil dibeli! Pulsa listrik Anda bertambah sebanyak ${addedKW.toFixed(1)} kWh.`);
  };

  return (
    <div className="mx-auto max-w-7xl px-4 md:px-8 pt-24 pb-16 space-y-10 text-left">
      
      {/* 1. Header Banner */}
      <section className="bg-[#0A0A0A] text-white rounded-none p-6 md:p-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 border border-stone-800 shadow-xl">
        <div className="space-y-2">
          <span className="px-3 py-1 text-[9px] font-bold uppercase text-gold bg-stone-950 border border-gold/30 rounded-none tracking-widest">Portal Penyewa Aktif</span>
          <h2 className="text-2xl md:text-3xl font-serif italic text-white tracking-tight flex items-center gap-2">
            Selamat Datang, {currentUser.name}!
          </h2>
          <p className="text-stone-400 text-xs font-light leading-relaxed">
            Ruang kendali sewa, keluhan kerusakan, pembelian daya listrik, dan konfirmasi tagihan Anda.
          </p>
        </div>

        {tenantRoom && (
          <div className="flex gap-4 items-center bg-[#0D0D0D] p-4 rounded-none border border-stone-850">
            <Building className="h-6 w-6 text-gold shrink-0" />
            <div>
              <p className="text-[9px] text-stone-500 font-bold uppercase tracking-widest">Unit Kamar Anda</p>
              <p className="text-sm font-serif italic text-[#d4af37]">Kamar {tenantRoom.roomNumber} ({tenantRoom.location})</p>
              <p className="text-[10px] text-stone-400 font-light">Tipe: {tenantRoom.type} &bull; Luas: {tenantRoom.size}</p>
            </div>
          </div>
        )}
      </section>

      {/* Grid Layouts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Columns (Rent Tracker & Electricity Tracker) */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* Rent & Billings List Card */}
          <div className="rounded-none bg-[#FAF7F2] dark:bg-[#0A0A0A] border border-stone-300 dark:border-white/10 p-6 shadow-xs">
            <div className="flex justify-between items-center pb-4 border-b border-stone-300 dark:border-white/10 mb-6">
              <h3 className="text-lg font-serif italic text-stone-900 dark:text-white flex items-center gap-2">
                <CreditCard className="h-4 w-4 text-gold" />
                Catatan Tagihan & Sewa Bulanan
              </h3>
              <span className="text-[9px] uppercase tracking-widest text-[#d4af37] font-bold">Sync Real-Time</span>
            </div>

            {tenantBookings.length === 0 ? (
              <div className="text-center py-8 text-stone-400">
                <p className="text-xs font-bold font-sans">Belum ada riwayat pembookingan terdaftar pada akun Anda.</p>
                <p className="text-[10px] text-stone-500 mt-1">Silakan cari kamar impian Anda di menu utama dan lakukan booking pertama.</p>
              </div>
            ) : (
              <div className="space-y-4 font-sans">
                {tenantBookings.map((book) => (
                  <div 
                    key={book.id} 
                    className="p-4 rounded-none bg-white dark:bg-[#0D0D0D] border border-stone-250 dark:border-white/5 flex items-center justify-between text-left flex-wrap gap-4"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-serif italic font-bold text-stone-900 dark:text-white">Sewa Kamar {book.roomNumber}</span>
                        <span className={`text-[9px] px-2.5 py-0.5 rounded-none border font-semibold uppercase tracking-wider ${
                          book.paymentStatus === 'Lunas' 
                            ? 'bg-stone-900 text-gold border-gold dark:bg-white dark:text-black dark:border-white' 
                            : book.paymentStatus === 'Menunggu Konfirmasi'
                            ? 'bg-[#FAF7F2] text-stone-800 border-gold/40 dark:bg-stone-950 dark:text-stone-300'
                            : 'bg-rose-50 text-rose-850 border-rose-250 dark:bg-rose-950/20'
                        }`}>
                          {book.paymentStatus}
                        </span>
                      </div>
                      <p className="text-[11px] text-stone-500 dark:text-stone-400 mt-1 font-light">
                        Metode Bayar: {book.paymentMethod || 'Belum Ditentukan'} &bull; Masuk: {book.entryDate}
                      </p>
                      <p className="text-xs font-serif font-bold text-[#d4af37] mt-1.5">
                        Rp {book.price.toLocaleString('id-ID')}
                      </p>
                    </div>

                    {book.paymentStatus === 'Belum Lunas' ? (
                      <button
                        type="button"
                        className="bg-stone-900 text-white dark:bg-white dark:text-black border border-transparent font-semibold text-[10px] uppercase tracking-widest px-5 py-3 rounded-none hover:bg-gold dark:hover:bg-gold dark:hover:text-black transition-all flex items-center gap-1.5 cursor-pointer"
                        onClick={() => setSelectedBooking(book)}
                      >
                        Bayar Sekarang &rarr;
                      </button>
                    ) : book.paymentStatus === 'Menunggu Konfirmasi' ? (
                      <span className="text-[10px] text-stone-700 bg-stone-100 dark:bg-stone-900 dark:text-stone-300 font-semibold uppercase tracking-wider border border-transparent px-3 py-1.5 rounded-none">
                        Sedang Diperiksa Admin
                      </span>
                    ) : (
                      <span className="text-[10px] text-gold dark:text-[#d4af37] font-semibold uppercase tracking-wider bg-stone-900/5 dark:bg-stone-900/40 border border-gold/30 px-3 py-1.5 rounded-none flex items-center gap-1">
                        <CheckCircle className="h-3 w-3 text-gold" /> Lunas Terverifikasi
                      </span>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Electricity Meter Tracker Panel */}
          <div className="rounded-none bg-[#FAF7F2] dark:bg-[#0A0A0A] border border-stone-300 dark:border-white/10 p-6 shadow-xs text-left grid grid-cols-1 md:grid-cols-2 gap-6">
            
            <div className="space-y-4">
              <h3 className="text-lg font-serif italic text-stone-900 dark:text-white flex items-center gap-2">
                <Zap className="h-4 w-4 text-gold fill-gold" />
                Meteran Listrik Kamar Anda
              </h3>
              <p className="text-stone-500 dark:text-stone-400 text-xs font-light leading-relaxed">
                Setiap kamar dilengkapi dengan meteran pulsa KWH mandiri. Harap top-up jika pulsa tersisa sedikit agar aliran listrik tetap lancar.
              </p>

              <div className="p-4 rounded-none bg-white dark:bg-[#0E0E0E] border border-stone-200 dark:border-white/5">
                <p className="text-[9px] text-stone-450 uppercase tracking-widest font-semibold">Sisa KWH Saat Ini</p>
                <div className="flex items-baseline gap-1.5 mt-1">
                  <span className={`text-4xl font-serif italic ${kWLeft < 10 ? 'text-rose-500' : 'text-stone-900 dark:text-[#d4af37]'}`}>
                    {kWLeft}
                  </span>
                  <span className="text-xs font-serif italic text-stone-405">kWh</span>
                </div>
                {kWLeft < 15 && (
                  <p className="text-[10px] text-rose-500 font-semibold mt-1.5 flex items-center gap-1">
                    <AlertCircle className="h-3 w-3" /> Pulsa hampir habis! Segera isi.
                  </p>
                )}
              </div>
            </div>

            <div className="p-4 rounded-none bg-white dark:bg-[#0E0E0E] border border-stone-250 dark:border-white/5 flex flex-col justify-between">
              <form onSubmit={handleBuyTokenSim} className="space-y-3">
                <label className="block text-[9px] font-bold text-[#d4af37] uppercase tracking-widest">Top Up Token Listrik</label>
                <div className="flex gap-2">
                  <input
                    type="number"
                    placeholder="Contoh: 50000"
                    className="flex-1 px-3 py-2 text-xs font-semibold bg-[#FAF7F2] dark:bg-stone-900 border border-stone-300 focus:border-gold focus:ring-1 focus:ring-gold rounded-none dark:border-white/10 text-stone-900 dark:text-white outline-hidden"
                    value={tokenInput}
                    onChange={(e) => setTokenInput(e.target.value)}
                    required
                  />
                  <button
                    type="submit"
                    className="bg-stone-900 text-white dark:bg-white dark:text-black border border-transparent font-semibold text-[10px] uppercase tracking-widest px-4 py-2 rounded-none hover:bg-gold dark:hover:bg-gold dark:hover:text-black cursor-pointer"
                  >
                    Beli Token
                  </button>
                </div>
              </form>

              <div className="pt-4 border-t border-stone-200 dark:border-white/5 mt-4 h-full flex flex-col justify-end">
                <p className="text-[9px] text-stone-450 uppercase tracking-widest font-semibold">Token Terakhir Anda</p>
                <p className="text-xs font-mono font-bold text-stone-700 dark:text-stone-300 select-all mt-0.5">{electricityToken}</p>
                <span className="text-[9px] text-stone-400 font-light mt-1">Gunakan kode di atas pada papan token fisik kamar Anda.</span>
              </div>
            </div>

          </div>

        </div>

        {/* Right Column (Lapor Kerusakan & Damage report list) */}
        <div className="space-y-8">
          
          {/* Lapor Kerusakan Form */}
          <div className="rounded-none bg-[#FAF7F2] dark:bg-[#0A0A0A] border border-stone-300 dark:border-white/10 p-6 shadow-xs">
            <h3 className="text-lg font-serif italic text-stone-900 dark:text-white flex items-center gap-2 pb-4 border-b border-stone-300 dark:border-white/10 mb-6">
              <Hammer className="h-4 w-4 text-gold" />
              Lapor Kerusakan Kamar
            </h3>

            <form onSubmit={handleReportSubmit} className="space-y-4">
              <div>
                <label className="block text-[9px] font-bold text-[#d4af37] uppercase tracking-widest mb-1.5">Fasilitas Bermasalah</label>
                <input
                  type="text"
                  placeholder="Contoh: AC Mati, Lampu Kedip, Wi-Fi Lambat"
                  className="w-full px-4 py-2.5 text-xs font-light bg-white dark:bg-stone-950 border border-stone-300 focus:border-gold focus:ring-1 focus:ring-gold rounded-none dark:border-white/10 text-stone-900 dark:text-white outline-hidden"
                  value={reportTitle}
                  onChange={(e) => setReportTitle(e.target.value)}
                  required
                />
              </div>

              <div>
                <label className="block text-[9px] font-bold text-[#d4af37] uppercase tracking-widest mb-1.5">Deskripsi Kerusakan</label>
                <textarea
                  rows={3}
                  placeholder="Ceritakan detail keluhan Anda, misal: 'fitting lampu putus' atau 'AC tidak keluar angin dingin' ..."
                  className="w-full px-4 py-2.5 text-xs font-light bg-white dark:bg-stone-950 border border-stone-300 focus:border-gold focus:ring-1 focus:ring-gold rounded-none dark:border-white/10 text-stone-900 dark:text-white outline-hidden"
                  value={reportDesc}
                  onChange={(e) => setReportDesc(e.target.value)}
                  required
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-stone-900 text-white dark:bg-white dark:text-black border border-transparent font-semibold text-[10px] uppercase tracking-widest rounded-none hover:bg-gold dark:hover:bg-gold dark:hover:text-black transition-all cursor-pointer flex items-center justify-center gap-1.5"
              >
                <Plus className="h-3.5 w-3.5" />
                Kirim Laporan Kerusakan
              </button>
            </form>
          </div>

          {/* Active Damage report list */}
          <div className="rounded-none bg-[#FAF7F2] dark:bg-[#0A0A0A] border border-stone-300 dark:border-white/10 p-6 shadow-xs text-left">
            <h4 className="text-[9px] font-bold text-stone-455 uppercase tracking-widest mb-4">Riwayat Laporan Kerusakan</h4>
            {tenantReports.length === 0 ? (
              <p className="text-xs text-stone-400 py-6 text-center font-light">Belum ada komplain atau keluhan kerusakan.</p>
            ) : (
              <div className="space-y-3 font-sans">
                {tenantReports.map((rep) => (
                  <div key={rep.id} className="p-3 bg-white dark:bg-stone-950 rounded-none border border-stone-200 dark:border-white/5 text-xs">
                    <div className="flex justify-between items-center mb-1">
                      <span className="font-serif italic font-bold text-stone-850 dark:text-white">{rep.title}</span>
                      <span className={`text-[9px] px-2 py-0.5 rounded-none border font-semibold uppercase tracking-wider ${
                        rep.status === 'Selesai' 
                          ? 'bg-stone-900 text-gold border-gold dark:bg-white dark:text-black' 
                          : rep.status === 'Diproses'
                          ? 'bg-stone-50 text-stone-700 border-gold/40'
                          : 'bg-rose-50 text-rose-800'
                      }`}>
                        {rep.status}
                      </span>
                    </div>
                    <p className="text-[11px] text-stone-500 dark:text-stone-400 leading-normal mb-2 font-light">{rep.description}</p>
                    <span className="text-[9px] text-[#d4af37] tracking-wider uppercase font-semibold block">Dilaporkan: {new Date(rep.createdAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>

      </div>

      {/* 4. Payment Portal Gateway Modal with QRIS and bank transfer mock */}
      {selectedBooking && (
        <div id="payment-receipt-modal" className="fixed inset-0 z-50 flex items-center justify-center p-4 font-sans">
          <div className="absolute inset-0 bg-stone-950/75 backdrop-blur-xs" onClick={() => setSelectedBooking(null)} />
          <div className="relative w-full max-w-lg bg-[#FAF7F2] dark:bg-[#0A0A0A] border border-stone-300 dark:border-white/10 rounded-none p-6 shadow-2xl space-y-6 z-10 text-left">
            
            <div className="flex justify-between items-center border-b border-stone-300 dark:border-white/10 pb-4">
              <h3 className="text-xl font-serif italic text-stone-900 dark:text-white flex items-center gap-2">
                <CreditCard className="h-4 w-4 text-gold" />
                Layanan Pembayaran Sewa
              </h3>
              <button type="button" className="text-2xl text-stone-400 cursor-pointer hover:text-gold" onClick={() => setSelectedBooking(null)}>&times;</button>
            </div>

            <div className="p-4 rounded-none bg-white dark:bg-stone-950 border border-stone-200 dark:border-white/5 flex justify-between items-center">
              <div>
                <span className="text-[9px] text-stone-450 uppercase tracking-widest font-semibold">Unit Kamar</span>
                <h4 className="text-xs font-bold text-stone-900 dark:text-white">Kamar {selectedBooking.roomNumber} - {selectedBooking.location}</h4>
              </div>
              <div className="text-right">
                <span className="text-[9px] text-stone-450 uppercase tracking-widest font-semibold">Jumlah Tagihan</span>
                <p className="text-sm font-serif italic font-bold text-[#d4af37]">Rp {selectedBooking.price.toLocaleString('id-ID')}</p>
              </div>
            </div>

            {/* Methods Switcher */}
            <div className="space-y-3">
              <label className="block text-[9px] uppercase tracking-widest font-bold text-stone-500">Metode Transaksi</label>
              <div className="grid grid-cols-3 gap-2">
                {(['Transfer BCA', 'Transfer Mandiri', 'QRIS'] as const).map((method) => (
                  <button
                    key={method}
                    type="button"
                    className={`py-2 px-1 rounded-none border text-[10px] uppercase tracking-wider font-semibold transition-all cursor-pointer ${
                      paymentMethod === method 
                        ? 'border-gold bg-stone-900 text-[#d4af37] dark:bg-white dark:text-black dark:border-white' 
                        : 'border-stone-300 hover:bg-stone-50 dark:border-white/10 dark:hover:bg-stone-900 text-stone-750 dark:text-stone-300'
                    }`}
                    onClick={() => setPaymentMethod(method)}
                  >
                    {method}
                  </button>
                ))}
              </div>
            </div>

            {/* Simulated instructions details */}
            <div className="p-4 rounded-none bg-white dark:bg-stone-950/60 border border-stone-250 dark:border-white/5 text-xs leading-normal">
              {paymentMethod === 'QRIS' ? (
                <div className="flex flex-col items-center gap-3">
                  <div className="p-3 bg-white rounded-none shadow-xs border border-stone-300">
                    {/* Mock QR generator display */}
                    <QrCode className="h-28 w-28 text-slate-900" />
                  </div>
                  <div className="text-center font-sans">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-stone-800 dark:text-stone-255">SCAN QRIS INDRA JAYA KOST</p>
                    <p className="text-[9px] text-stone-505 dark:text-stone-400 font-light mt-0.5">Mendukung semua e-wallet (Gopay, OVO, Dana, LinkAja, ShopeePay)</p>
                  </div>
                </div>
              ) : paymentMethod === 'Transfer BCA' ? (
                <div className="space-y-1 text-center">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-[#d4af37]">Bank BCA Indra Jaya Kost</p>
                  <p className="text-sm font-mono font-bold text-stone-800 bg-[#FAF7F2] dark:bg-stone-900 p-2 border border-stone-200 dark:border-white/5 rounded-none select-all">12940294021</p>
                  <p className="text-[9px] text-stone-400 font-light mt-0.5">Atas nama: CV INDRA JAYA KOST PERSADA</p>
                </div>
              ) : (
                <div className="space-y-1 text-center">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-[#d4af37]">Bank Mandiri Indra Jaya Kost</p>
                  <p className="text-sm font-mono font-bold text-stone-800 bg-[#FAF7F2] dark:bg-stone-900 p-2 border border-stone-200 dark:border-white/5 rounded-none select-all">18492049284920</p>
                  <p className="text-[9px] text-stone-400 font-light mt-0.5">Atas nama: CV INDRA JAYA KOST PERSADA</p>
                </div>
              )}
            </div>

            {/* Simulated Receipt Upload */}
            <form onSubmit={handleSimulatePayment} className="space-y-4">
              <div className="space-y-2">
                <label className="block text-[9px] font-bold text-stone-500 uppercase tracking-widest">
                  Unggah Bukti Kuitansi Transfer / Scan QRIS
                </label>
                <div 
                  className="border-2 border-dashed border-stone-300 dark:border-white/10 rounded-none p-4 text-center cursor-pointer hover:border-gold transition-all"
                  onClick={() => {
                    setUploadedReceipt("Simulated_Invoice_BCA_Approved_7819.jpg");
                  }}
                >
                  {uploadedReceipt ? (
                    <div className="flex items-center justify-center gap-2 text-gold font-bold text-xs">
                      <CheckCircle className="h-4 w-4" /> {uploadedReceipt} (Uji coba kuitansi terpasang)
                    </div>
                  ) : (
                    <div className="text-stone-400 space-y-1 text-xs font-light">
                      <p>Ketik atau seret berkas bukti transfer di sini</p>
                      <p className="text-[10px] text-stone-500 dark:text-stone-405">Mendukung format PNG, JPG, PDF (Maksimal 5MB)</p>
                      <p className="text-[10px] text-gold font-bold pt-1.5 underline">Klik untuk melampirkan kuitansi uji coba secara otomatis</p>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex gap-3 pt-4 border-t border-stone-300 dark:border-white/10">
                <button
                  type="button"
                  className="flex-1 py-3 text-[10px] bg-stone-200 dark:bg-stone-900 text-stone-800 dark:text-stone-200 rounded-none font-semibold uppercase tracking-widest cursor-pointer"
                  onClick={() => setSelectedBooking(null)}
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3 text-[10px] bg-stone-900 border border-transparent hover:bg-gold text-white hover:text-black rounded-none font-semibold uppercase tracking-widest cursor-pointer transition-all flex items-center justify-center gap-1.5"
                  disabled={isUploading}
                >
                  {isUploading ? 'Sedang Memeriksa...' : 'Kirim Konfirmasi Bayar'}
                  <ArrowRight className="h-3.5 w-3.5" />
                </button>
              </div>
            </form>

          </div>
        </div>
      )}

    </div>
  );
}
export {};
