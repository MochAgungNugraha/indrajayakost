import React, { useState } from 'react';
import { 
  Building2, 
  Users, 
  Clock, 
  Plus, 
  UserPlus, 
  Trash2, 
  Compass, 
  Hammer, 
  TrendingUp, 
  Check, 
  X,
  PlusCircle,
  Eye,
  DollarSign
} from 'lucide-react';
import { Room, User, Booking, DamageReport } from '../types';

interface AdminPortalProps {
  currentUser: User;
  rooms: Room[];
  users: User[];
  bookings: Booking[];
  reports: DamageReport[];
  onAddRoom: (roomData: Partial<Room>) => void;
  onApproveBooking: (id: string) => void;
  onUpdateReport: (id: string, status: 'Pending' | 'Diproses' | 'Selesai') => void;
  onUpdateRoom: (roomId: string, updatedData: { price?: number; image?: string; description?: string }) => void;
  highContrast: boolean;
}

export default function AdminPortal({
  currentUser,
  rooms,
  users,
  bookings,
  reports,
  onAddRoom,
  onApproveBooking,
  onUpdateReport,
  onUpdateRoom,
  highContrast
}: AdminPortalProps) {
  // New Room modal
  const [isAddRoomOpen, setIsAddRoomOpen] = useState(false);
  const [newRoomNum, setNewRoomNum] = useState('');
  const [newRoomType, setNewRoomType] = useState<'Standard' | 'Deluxe' | 'Executive' | 'Suite'>('Standard');
  const [newRoomPrice, setNewRoomPrice] = useState('1500000');
  const [newRoomLoc, setNewRoomLoc] = useState<'Jimbaran' | 'Pagerwojo Ngemplak' | 'Perumahan Magersari'>('Jimbaran');
  const [newRoomSize, setNewRoomSize] = useState('3x4m²');
  const [newRoomBed, setNewRoomBed] = useState('Single');

  // Interactive Room snapshot tracker
  const [selectedSnapshotRoom, setSelectedSnapshotRoom] = useState<Room | null>(null);

  // States for editing price & photo
  const [isEditingRoom, setIsEditingRoom] = useState(false);
  const [editPrice, setEditPrice] = useState('');
  const [editImage, setEditImage] = useState('');
  const [editDescription, setEditDescription] = useState('');

  const getFallbackDescription = (room: Room) => {
    if (room.description) return room.description;
    if (room.type === 'Suite') return 'Suite mewah dengan ruang tamu terpisah, smart tv ultra HD, kulkas dua pintu, meja kerja eksekutif, dan pemandangan luar yang estetik.';
    if (room.type === 'Executive') return 'Kamar eksekutif yang luas dilengkapi dengan tempat tidur berkualitas, area kerja kondusif, water heater, serta pendingin udara hemat energi.';
    if (room.type === 'Deluxe') return 'Kamar berkualitas istimewa dengan ranjang ukuran Queen, fasilitas wifi kencang, laundry gratis terpadu, serta kebersihan yang selalu terjaga.';
    return 'Kamar standard nyaman ber-AC dengan perlengkapan lengkap siap huni. Cocok untuk mahasiswa maupun karyawan profesional.';
  };

  React.useEffect(() => {
    if (selectedSnapshotRoom) {
      setEditPrice(selectedSnapshotRoom.price.toString());
      setEditImage(selectedSnapshotRoom.image || '');
      setEditDescription(selectedSnapshotRoom.description || '');
      setIsEditingRoom(false);
    }
  }, [selectedSnapshotRoom]);

  const handleSaveRoomEdits = () => {
    if (!selectedSnapshotRoom) return;
    onUpdateRoom(selectedSnapshotRoom.id, {
      price: Number(editPrice),
      image: editImage,
      description: editDescription
    });
    setIsEditingRoom(false);
    setSelectedSnapshotRoom({
      ...selectedSnapshotRoom,
      price: Number(editPrice),
      image: editImage,
      description: editDescription
    });
  };

  // Stats calculation
  const totalRoomsCount = rooms.length; // standard is 21
  const occupiedRoomsCount = rooms.filter(r => !r.isAvailable).length;
  const availableRoomsCount = rooms.filter(r => r.isAvailable).length;
  const occupancyPercentage = totalRoomsCount > 0 ? Math.round((occupiedRoomsCount / totalRoomsCount) * 100) : 0;

  // Pending approval booking requests
  const pendingConfirmBookings = bookings.filter(b => b.paymentStatus === 'Menunggu Konfirmasi' || b.status === 'pending');

  const handleCreateRoom = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRoomNum) return;

    onAddRoom({
      roomNumber: newRoomNum,
      type: newRoomType,
      price: Number(newRoomPrice),
      location: newRoomLoc,
      size: newRoomSize,
      bedType: newRoomBed,
      facilities: ['AC', 'Wifi', newRoomType === 'Suite' || newRoomType === 'Executive' ? 'Water Heater' : '', 'Laundry'].filter(Boolean),
      image: newRoomType === 'Standard' ? 'https://lh3.googleusercontent.com/aida-public/AB6AXuAh9N3-596klyO7g-ayWyqOtHnMN1rHY0pQtBv7jSfLktClWWBGPUSxBw_S0Jg9sEEGxcd21bUxQkgH11MnUefUtSKIvf9Seyl4kLYMnzCYLECHpcBQHY5vtp_HkSgxJyEar0hfsSrVMqQXFvt_stbFvyBFO-hDW5wDUyUy3NG-huJwopTWYD7AVHBbcmZgzJiHwdfATuUOyuPo3WrYysE7u7aY3ETrqof18deJPaDhccM1rAaF-Vm502atr3rxcvTzFr4l9ZrTDpg' : 'https://lh3.googleusercontent.com/aida-public/AB6AXuDoBhIrnJ7zaLAkOgIyPb7UX6AQJKWe05NElS6J28LE6bfxg87p8Yrp7loEMMdDcS5xSIX0736i1xEEk_kn_T2r_a__s4HfqMF2OCf1NY-Xybcrfzr9dSrL5VJ6sV6sQPPu3jSt4j_2AqdDGOx-9bxrcBQYK5K5RQ6kLM7g2B7zG7anY_afq18mT1NGrOsMssi1IYD33syNO67fSqi9X0dOgR99W84Z_AnhE3tLnRmcpZN9eBRZAmbQKwuiKuJ8B8sJzESrxnttD7o'
    });

    setNewRoomNum('');
    setNewRoomPrice('1500000');
    setIsAddRoomOpen(false);
  };

  // Find exact current tenant details for snapshot
  const getTenantForRoom = (room: Room) => {
    if (room.isAvailable) return null;
    return users.find(u => u.roomNumber === room.roomNumber || u.id === room.tenantId);
  };

  return (
    <div className="mx-auto max-w-7xl px-4 md:px-8 pt-24 pb-16 space-y-10 text-left">
      
      {/* 1. Header Admin Overview Section */}
      <section className="bg-[#FAF7F2] dark:bg-[#0A0A0A] rounded-none p-6 md:p-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 border border-stone-300 dark:border-white/10 shadow-xs">
        <div className="space-y-1.5">
          <span className="px-3 py-1 text-[9px] font-bold uppercase text-gold bg-stone-900 dark:bg-stone-950 border border-gold/30 rounded-none tracking-widest">Panel Manajemen Utama</span>
          <h2 className="text-2xl md:text-3xl font-serif italic text-[#d4af37] tracking-tight">Otoritas Pengelola Indra Jaya Kost</h2>
          <p className="text-stone-550 dark:text-stone-400 text-xs font-light leading-relaxed">
            Kelola unit harian, pantau persentase hunian sewa, konfirmasi pengiriman kuitansi, dan respon agenda kerusakan.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setIsAddRoomOpen(true)}
          className="bg-stone-900 border border-transparent hover:bg-gold text-white hover:text-black font-semibold text-[10px] uppercase tracking-widest px-6 py-3.5 rounded-none shadow-md flex items-center gap-2 transition-all outline-hidden cursor-pointer"
        >
          <PlusCircle className="h-4 w-4" />
          Tambah Kamar Baru (Total: {rooms.length})
        </button>
      </section>

      {/* 2. Key Statistical Matrix Dashboard Grid */}
      <section className="grid grid-cols-1 md:grid-cols-4 gap-6 font-sans">
        
        <div className="p-6 rounded-none bg-[#FAF7F2] dark:bg-[#0A0A0A] border border-stone-300 dark:border-white/10 shadow-xs flex items-center gap-4">
          <div className="w-10 h-10 rounded-none bg-white dark:bg-stone-900 text-gold border border-stone-200 dark:border-white/5 flex items-center justify-center shrink-0">
            <Building2 className="h-5 w-5" />
          </div>
          <div>
            <p className="text-[9px] text-[#d4af37] tracking-widest font-bold uppercase">Total Unit Kamar</p>
            <h4 className="text-2xl font-serif italic text-stone-900 dark:text-white mt-0.5">{totalRoomsCount} <span className="text-xs font-sans text-stone-400 font-light">Kamar</span></h4>
          </div>
        </div>

        <div className="p-6 rounded-none bg-[#FAF7F2] dark:bg-[#0A0A0A] border border-stone-300 dark:border-white/10 shadow-xs flex items-center gap-4">
          <div className="w-10 h-10 rounded-none bg-white dark:bg-stone-900 text-gold border border-stone-200 dark:border-white/5 flex items-center justify-center shrink-0">
            <Users className="h-5 w-5" />
          </div>
          <div>
            <p className="text-[9px] text-[#d4af37] tracking-widest font-bold uppercase">Penghuni Aktif</p>
            <h4 className="text-2xl font-serif italic text-stone-900 dark:text-white mt-0.5">{occupiedRoomsCount} / {totalRoomsCount} <span className="text-xs font-sans text-[#d4af37] font-semibold">Terisi</span></h4>
          </div>
        </div>

        <div className="p-6 rounded-none bg-[#FAF7F2] dark:bg-[#0A0A0A] border border-stone-300 dark:border-white/10 shadow-xs flex items-center gap-4">
          <div className="w-10 h-10 rounded-none bg-white dark:bg-stone-900 text-gold border border-stone-200 dark:border-white/5 flex items-center justify-center shrink-0">
            <TrendingUp className="h-5 w-5" />
          </div>
          <div>
            <p className="text-[9px] text-[#d4af37] tracking-widest font-bold uppercase">Persentase Hunian</p>
            <h4 className="text-2xl font-serif italic text-stone-900 dark:text-white mt-0.5">{occupancyPercentage}% <span className="text-xs font-sans text-stone-500 font-light">Tingkat Okupansi</span></h4>
          </div>
        </div>

        <div className="p-6 rounded-none bg-[#FAF7F2] dark:bg-[#0A0A0A] border border-stone-300 dark:border-white/10 shadow-xs flex items-center gap-4">
          <div className="w-10 h-10 rounded-none bg-white dark:bg-stone-900 text-gold border border-stone-200 dark:border-white/5 flex items-center justify-center shrink-0">
            <Clock className="h-5 w-5" />
          </div>
          <div>
            <p className="text-[9px] text-[#d4af37] tracking-widest font-bold uppercase">Unit Kosong Tersedia</p>
            <h4 className="text-2xl font-serif italic text-stone-900 dark:text-white mt-0.5">{availableRoomsCount} <span className="text-xs font-sans text-rose-500 font-light">Siap Sewa</span></h4>
          </div>
        </div>

      </section>

      {/* 3. Room Snapshots Grid layout (Bakat Istimewa & Interactive map dashboard) */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Dynamic Matrix Layout */}
        <div className="lg:col-span-2 rounded-none bg-[#FAF7F2] dark:bg-[#0A0A0A] p-6 border border-stone-300 dark:border-white/10 shadow-xs">
          <div className="flex justify-between items-center pb-4 border-b border-stone-200 dark:border-white/5 mb-6 flex-wrap gap-4 font-sans">
            <div>
              <h3 className="text-lg font-serif italic text-stone-900 dark:text-white">Peta Status Snapshots Kamar</h3>
              <p className="text-[11px] text-stone-500 dark:text-stone-400 mt-0.5 font-light">Klik salah satu kamar di grid untuk melihat rincian penyewa dan snap unit secara langsung!</p>
            </div>
            
            <div className="flex items-center gap-3 text-[9px] font-bold uppercase tracking-widest text-stone-600 dark:text-stone-300">
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-none bg-[#d4af37]" /> Tersedia</span>
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-none bg-stone-400 animate-pulse" /> Terisi</span>
            </div>
          </div>

          <div className="space-y-6 text-left">
            {/* Division by Location - Highly professional */}
            {['Jimbaran', 'Pagerwojo Ngemplak', 'Perumahan Magersari'].map((locName) => {
              const locRooms = rooms.filter(r => r.location === locName);
              return (
                <div key={locName} className="space-y-2">
                  <h4 className="text-[10px] font-bold text-[#d4af37] uppercase tracking-widest">{locName} ({locRooms.length} Kamar)</h4>
                  <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-2">
                    {locRooms.map((room) => {
                      const isSel = selectedSnapshotRoom?.id === room.id;
                      return (
                        <button
                          key={room.id}
                          type="button"
                          className={`p-3 rounded-none font-bold text-xs transition-all flex flex-col items-center justify-center outline-hidden border cursor-pointer ${
                            room.isAvailable
                              ? isSel 
                                ? 'border-gold bg-stone-900 text-gold' 
                                : 'border-stone-250 bg-white text-stone-800 dark:bg-stone-900 dark:text-stone-205 dark:border-white/5 hover:border-gold'
                              : isSel
                              ? 'border-stone-900 bg-stone-500 text-white'
                              : 'border-transparent bg-stone-200 text-stone-450 dark:bg-stone-950 dark:text-stone-600'
                          }`}
                          onClick={() => setSelectedSnapshotRoom(room)}
                        >
                          <span className="font-bold">{room.roomNumber}</span>
                          <span className="text-[8px] opacity-75 font-light leading-none mt-1 capitalize">{room.type.substring(0, 3)}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Selected Room Snapshot sidebar (Interactive Inspection card) */}
        <div>          <div className="rounded-none bg-[#FAF7F2] dark:bg-[#0A0A0A] p-6 border border-stone-300 dark:border-white/10 shadow-xs h-full flex flex-col justify-between font-sans">
            {selectedSnapshotRoom ? (
              <div className="space-y-6 text-left h-full flex flex-col justify-between">
                <div>
                  <h3 className="text-lg font-serif italic text-stone-900 dark:text-white">Rincian Kamar {selectedSnapshotRoom.roomNumber}</h3>
                  
                  {isEditingRoom ? (
                    <div className="space-y-4 mt-4 bg-white dark:bg-stone-950 p-4 border border-stone-200 dark:border-white/15">
                      <h4 className="text-[9px] font-bold text-[#d4af37] uppercase tracking-widest font-sans">Edit Rincian Unit</h4>
                      
                      <div>
                        <label className="block text-[8px] font-bold text-stone-400 dark:text-stone-500 uppercase tracking-widest mb-1.5 font-sans">Tarif Sewa (Rp / Bulan)</label>
                        <input
                          type="number"
                          className="w-full px-3 py-2 bg-[#FAF7F2] dark:bg-stone-900 border border-stone-300 dark:border-white/10 text-stone-900 dark:text-white font-semibold text-xs outline-hidden"
                          value={editPrice}
                          onChange={(e) => setEditPrice(e.target.value)}
                        />
                      </div>

                      <div>
                        <label className="block text-[8px] font-bold text-stone-400 dark:text-stone-500 uppercase tracking-widest mb-1.5 font-sans">URL Foto Kamar</label>
                        <textarea
                          rows={2}
                          className="w-full px-3 py-2 bg-[#FAF7F2] dark:bg-stone-900 border border-stone-300 dark:border-white/10 text-stone-900 dark:text-white font-semibold text-xs outline-hidden resize-none"
                          value={editImage}
                          onChange={(e) => setEditImage(e.target.value)}
                        />
                      </div>

                      <div>
                        <label className="block text-[8px] font-bold text-stone-400 dark:text-stone-500 uppercase tracking-widest mb-1.5 font-sans">Keterangan / Deskripsi Unit</label>
                        <textarea
                          rows={3}
                          className="w-full px-3 py-2 bg-[#FAF7F2] dark:bg-stone-900 border border-stone-300 dark:border-white/10 text-stone-900 dark:text-white font-medium text-xs outline-hidden resize-y font-sans"
                          placeholder="Deskripsi kustom kamar..."
                          value={editDescription}
                          onChange={(e) => setEditDescription(e.target.value)}
                        />
                      </div>

                      <div className="flex gap-2">
                        <button
                          type="button"
                          onClick={handleSaveRoomEdits}
                          className="flex-1 py-2 bg-stone-900 text-[#d4af37] border border-[#d4af37]/30 hover:bg-gold hover:text-black font-bold text-[9px] uppercase tracking-wider transition-all text-center cursor-pointer"
                        >
                          Simpan
                        </button>
                        <button
                          type="button"
                          onClick={() => setIsEditingRoom(false)}
                          className="flex-1 py-2 bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300 font-bold text-[9px] uppercase tracking-wider hover:bg-stone-200 transition-all text-center cursor-pointer"
                        >
                          Batal
                        </button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <div className="relative rounded-none overflow-hidden h-36 border border-stone-250 dark:border-white/5 mt-4">
                        <img src={selectedSnapshotRoom.image} alt="room visual" className="w-full h-full object-cover" />
                        <span className="absolute bottom-2 left-2 bg-stone-900 border border-gold/30 text-gold font-bold text-[8px] uppercase tracking-widest px-2.5 py-1 rounded-none">
                          {selectedSnapshotRoom.location}
                        </span>
                      </div>

                      <div className="mt-4 space-y-1.5 font-light text-xs text-stone-700 dark:text-stone-350">
                        <p className="flex justify-between"><span>Tipe Kamar:</span> <span className="font-serif italic font-semibold text-stone-900 dark:text-white">{selectedSnapshotRoom.type}</span></p>
                        <p className="flex justify-between"><span>Ukuran Unit:</span> <span className="font-medium text-stone-900 dark:text-white">{selectedSnapshotRoom.size}</span></p>
                        <p className="flex justify-between"><span>Kasur / Bed:</span> <span className="font-medium text-stone-900 dark:text-white">{selectedSnapshotRoom.bedType}</span></p>
                        <p className="flex justify-between"><span>Tarif Sewa:</span> <span className="font-serif italic font-semibold text-[#d4af37]">Rp {selectedSnapshotRoom.price.toLocaleString('id-ID')}/bln</span></p>
                        <div className="pt-2.5 border-t border-stone-250 dark:border-white/10">
                          <p className="text-[8px] font-bold text-stone-400 dark:text-stone-405 uppercase tracking-widest mb-1">Deskripsi Unit:</p>
                          <p className="text-[10px] text-stone-600 dark:text-stone-350 leading-relaxed font-sans font-normal italic">
                            {selectedSnapshotRoom.description || getFallbackDescription(selectedSnapshotRoom)}
                          </p>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => {
                          setEditPrice(selectedSnapshotRoom.price.toString());
                          setEditImage(selectedSnapshotRoom.image || '');
                          setEditDescription(selectedSnapshotRoom.description || '');
                          setIsEditingRoom(true);
                        }}
                        className="mt-4 w-full bg-stone-900 hover:bg-gold text-white hover:text-black font-semibold text-[9px] uppercase tracking-widest py-3.5 tracking-widest border border-gold/30 hover:border-transparent transition-all text-center cursor-pointer"
                      >
                        Edit Harga & Foto
                      </button>
                    </>
                  )}
                </div>

                <div className="p-3.5 rounded-none bg-white dark:bg-stone-950/45 border border-stone-200 dark:border-white/5 mt-4 h-full flex flex-col justify-center">
                  {getTenantForRoom(selectedSnapshotRoom) ? (
                    <div className="text-left space-y-2">
                      <p className="text-[8px] text-[#d4af37] tracking-widest font-bold uppercase mb-1">Penyewa Terdaftar</p>
                      <div className="flex gap-2.5 items-center">
                        <div className="w-8 h-8 rounded-none bg-stone-100 border border-stone-250 flex items-center justify-center shrink-0 overflow-hidden">
                          {getTenantForRoom(selectedSnapshotRoom)?.avatar ? (
                            <img src={getTenantForRoom(selectedSnapshotRoom)?.avatar} alt="avatar" className="w-full h-full object-cover" />
                          ) : (
                            <Users className="h-4 w-4 text-gold" />
                          )}
                        </div>
                        <div>
                          <p className="text-xs font-bold text-stone-900 dark:text-white leading-none">{getTenantForRoom(selectedSnapshotRoom)?.name}</p>
                          <p className="text-[10px] text-stone-500 mt-1 leading-none">{getTenantForRoom(selectedSnapshotRoom)?.email}</p>
                        </div>
                      </div>
                      <p className="text-[10px] text-stone-400 font-light pt-1">Tercatat Masuk: {getTenantForRoom(selectedSnapshotRoom)?.entryDate || 'Kuartal ini'}</p>
                    </div>
                  ) : (
                    <div className="text-center py-4 text-stone-400">
                      <p className="text-xs font-bold text-stone-850 dark:text-stone-300">Kamar masih Kosong</p>
                      <p className="text-[9px] text-stone-550 mt-0.5">Belum ada penyewa terikat pada unit nomor ini.</p>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center text-center h-full text-stone-400 py-16">
                <Compass className="h-8 w-8 text-gold animate-pulse mb-3" />
                <p className="text-xs font-bold text-stone-850 dark:text-stone-300">Klik salah satu unit kamar</p>
                <p className="text-[10px] text-stone-500 mt-1 w-48 leading-relaxed font-light">
                  Peta status interaktif di sebelah kiri dapat mempercepat peninjauan profil harian hunian.
                </p>
              </div>
            )}
          </div>
        </div>

      </section>

      {/* 4. Manage Bookings Request and Agenda task tracker */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Bookings Approvals */}
        <div className="rounded-3xl bg-white dark:bg-slate-900 p-6 border border-slate-200 dark:border-slate-800 shadow-xs">
          <h3 className="text-lg font-black text-slate-900 dark:text-white pb-4 border-b dark:border-slate-800 mb-6">
            Persetujuan Slip & Kuitansi Sewa
          </h3>

          {pendingConfirmBookings.length === 0 ? (
            <p className="text-xs text-slate-400 py-8 text-center font-semibold">Tidak ada pengajuan sewa atau pembayaran tertunda.</p>
          ) : (
            <div className="space-y-4 max-h-[350px] overflow-y-auto pr-1">
              {pendingConfirmBookings.map((book) => (
                <div key={book.id} className="p-4 rounded-2xl border border-slate-100 dark:border-slate-850 flex items-center justify-between text-left">
                  <div>
                    <h4 className="text-xs font-bold text-slate-900 dark:text-white leading-tight">Sewa {book.roomNumber} - {book.tenantName}</h4>
                    <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-1">
                      Jumlah: Rp {book.price.toLocaleString('id-ID')} &bull; Lokasi: {book.location}
                    </p>
                    <span className="inline-block text-[9px] px-2 py-0.5 bg-orange-50 text-orange-800 dark:bg-orange-950/20 mt-2 font-black rounded-sm">
                      {book.paymentStatus} via {book.paymentMethod || 'QRIS'}
                    </span>
                  </div>

                  <div className="flex gap-2">
                    <button
                      type="button"
                      className="w-8 h-8 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center hover:bg-emerald-100 cursor-pointer"
                      onClick={() => onApproveBooking(book.id)}
                      title="Setujui Pembayaran"
                    >
                      <Check className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Maintenance / Agenda reports */}
        <div className="rounded-3xl bg-white dark:bg-slate-900 p-6 border border-slate-200 dark:border-slate-800 shadow-xs">
          <h3 className="text-lg font-black text-slate-900 dark:text-white pb-4 border-b dark:border-slate-800 mb-6">
            Antrean Laporan & Keluhan Kerusakan
          </h3>

          {reports.length === 0 ? (
            <p className="text-xs text-slate-400 py-8 text-center font-semibold">Semua laporan kerusakan dalam kondisi bersih & teratasi.</p>
          ) : (
            <div className="space-y-4 max-h-[350px] overflow-y-auto pr-1">
              {reports.map((rep) => (
                <div key={rep.id} className="p-4 rounded-2xl border border-slate-100 dark:border-slate-850 flex justify-between items-start text-left">
                  <div className="space-y-1">
                    <p className="text-xs font-bold text-slate-950 dark:text-white">{rep.title}</p>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 font-semibold">Tindakan Kamar: <span className="font-extrabold">{rep.roomNumber}</span> &bull; Pelapor: {rep.tenantName}</p>
                    <p className="text-[11px] text-slate-550 dark:text-slate-400 bg-slate-50 dark:bg-slate-950 p-2 rounded-lg italic">"{rep.description}"</p>
                  </div>

                  <div className="flex flex-col items-end gap-2.5">
                    <span className={`text-[9px] px-2 py-0.5 rounded-full font-black uppercase ${
                      rep.status === 'Selesai' 
                        ? 'bg-emerald-50 text-emerald-800 dark:bg-emerald-950/20' 
                        : rep.status === 'Diproses'
                        ? 'bg-orange-50 text-orange-850 dark:bg-orange-950/20'
                        : 'bg-rose-50 text-rose-800'
                    }`}>
                      {rep.status}
                    </span>

                    {rep.status !== 'Selesai' && (
                      <div className="flex gap-1.5">
                        <button
                          type="button"
                          className="px-2.5 py-1 rounded bg-orange-600 text-white text-[10px] font-extrabold"
                          onClick={() => onUpdateReport(rep.id, 'Diproses')}
                        >
                          Proses
                        </button>
                        <button
                          type="button"
                          className="px-2.5 py-1 rounded bg-emerald-600 text-white text-[10px] font-extrabold"
                          onClick={() => onUpdateReport(rep.id, 'Selesai')}
                        >
                          Selesai
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      </section>

      {/* 5. Add Room Form Modal (Launcher) */}
      {isAddRoomOpen && (
        <div id="add-room-modal" className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-950/50 backdrop-blur-xs" onClick={() => setIsAddRoomOpen(false)} />
          <div className="relative w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl transition-all dark:bg-slate-900 border border-slate-200 dark:border-slate-850 z-10 text-left">
            <div className="flex justify-between items-center pb-4 border-b dark:border-slate-800 mb-6 font-bold text-slate-850">
              <h3 className="text-lg font-black text-slate-900 dark:text-white">Tambah Unit Kamar Baru</h3>
              <button type="button" className="text-xl text-slate-400 font-bold" onClick={() => setIsAddRoomOpen(false)}>&times;</button>
            </div>

            <form onSubmit={handleCreateRoom} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5">Nomor / Label Unit Kamar</label>
                <input
                  type="text"
                  className="w-full px-4 py-2.5 text-xs font-semibold bg-slate-50 dark:bg-slate-950 border border-slate-200 focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 rounded-xl dark:border-slate-800 text-slate-900 dark:text-white outline-hidden"
                  placeholder="Contoh: J-13, P-05, M-06 ..."
                  value={newRoomNum}
                  onChange={(e) => setNewRoomNum(e.target.value)}
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5">Tipe Spesifikasi Kamar</label>
                <select
                  className="w-full px-4 py-2.5 text-xs font-semibold bg-slate-50 dark:bg-slate-950 border border-slate-200 focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 rounded-xl dark:border-slate-800 text-slate-900 dark:text-white outline-hidden"
                  value={newRoomType}
                  onChange={(e) => setNewRoomType(e.target.value as any)}
                >
                  <option value="Standard">Standard (Harian/Min)</option>
                  <option value="Deluxe">Deluxe (Medium)</option>
                  <option value="Executive">Executive (Premium Executive)</option>
                  <option value="Suite">Suite (Keluarga/Maks)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5">Pilih Lokasi Cabang</label>
                <select
                  className="w-full px-4 py-2.5 text-xs font-semibold bg-slate-50 dark:bg-slate-950 border border-slate-200 focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 rounded-xl dark:border-slate-800 text-slate-900 dark:text-white outline-hidden"
                  value={newRoomLoc}
                  onChange={(e) => setNewRoomLoc(e.target.value as any)}
                >
                  <option value="Jimbaran">Jimbaran (Denpasar Selatan)</option>
                  <option value="Pagerwojo Ngemplak">Pagerwojo Ngemplak (Solo Baru)</option>
                  <option value="Perumahan Magersari">Perumahan Magersari (Sidoarjo Kota)</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5">Tarif Sewa (Rp / Bulan)</label>
                  <input
                    type="number"
                    className="w-full px-4 py-2.5 text-xs font-semibold bg-slate-50 dark:bg-slate-950 border border-slate-200 focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 rounded-xl dark:border-slate-800 text-slate-900 dark:text-white outline-hidden"
                    value={newRoomPrice}
                    onChange={(e) => setNewRoomPrice(e.target.value)}
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5 font-sans">Luas Dimensi Kamar</label>
                  <input
                    type="text"
                    className="w-full px-4 py-2.5 text-xs font-semibold bg-slate-50 dark:bg-slate-950 border border-slate-200 focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 rounded-xl dark:border-slate-800 text-slate-900 dark:text-white outline-hidden"
                    value={newRoomSize}
                    onChange={(e) => setNewRoomSize(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5">Spesifikasi Ukuran Kasur</label>
                <input
                  type="text"
                  className="w-full px-4 py-2.5 text-xs font-semibold bg-slate-50 dark:bg-slate-950 border border-slate-200 focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 rounded-xl dark:border-slate-800 text-slate-900 dark:text-white outline-hidden"
                  value={newRoomBed}
                  onChange={(e) => setNewRoomBed(e.target.value)}
                  required
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  className="flex-1 py-3 text-xs bg-slate-100 text-slate-600 rounded-xl font-bold dark:bg-slate-800 dark:text-slate-300"
                  onClick={() => setIsAddRoomOpen(false)}
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3 text-xs bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold"
                >
                  Simpan Unit Baru &rarr;
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
