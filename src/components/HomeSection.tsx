import React, { useState } from 'react';
import { 
  Wifi, 
  Wind, 
  Shirt, 
  ShieldAlert, 
  Search, 
  MapPin, 
  Train, 
  ShoppingBag, 
  Clock, 
  Compass, 
  Star, 
  SlidersHorizontal,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  DollarSign
} from 'lucide-react';
import { Room, User } from '../types';

interface HomeSectionProps {
  rooms: Room[];
  currentUser: User | null;
  onBookRoom: (roomId: string, tenantName: string, email: string) => void;
  highContrast: boolean;
  textSize: number;
}

export default function HomeSection({
  rooms,
  currentUser,
  onBookRoom,
  highContrast,
  textSize
}: HomeSectionProps) {
  // Search & Filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLocation, setSelectedLocation] = useState<string>('Semua');
  const [availabilityFilter, setAvailabilityFilter] = useState<'Semua' | 'Tersedia' | 'Penuh'>('Semua');
  const [maxPrice, setMaxPrice] = useState<number>(5000000);
  
  // Immersive Virtual Tour state
  const [isVirtualTourOpen, setIsVirtualTourOpen] = useState(false);
  const [tourLoc, setTourLoc] = useState<'Jimbaran' | 'Pagerwojo' | 'Magersari'>('Jimbaran');

  // Booking Modal
  const [bookingRoom, setBookingRoom] = useState<Room | null>(null);
  const [guestName, setGuestName] = useState(currentUser?.name || '');
  const [guestEmail, setGuestEmail] = useState(currentUser?.email || '');

  // Selected Room Details view
  const [viewingRoom, setViewingRoom] = useState<Room | null>(null);
  const [activeGalleryIndex, setActiveGalleryIndex] = useState(0);

  const getRoomGallery = (room: Room) => {
    const primaryImg = room.image;
    const isJimbaran = room.location.toLowerCase().includes('jimbaran');
    const isPagerwojo = room.location.toLowerCase().includes('pagerwojo');
    
    if (isJimbaran) {
      return [
        primaryImg,
        "https://lh3.googleusercontent.com/aida-public/AB6AXuDoBhIrnJ7zaLAkOgIyPb7UX6AQJKWe05NElS6J28LE6bfxg87p8Yrp7loEMMdDcS5xSIX0736i1xEEk_kn_T2r_a__s4HfqMF2OCf1NY-Xybcrfzr9dSrL5VJ6sV6sQPPu3jSt4j_2AqdDGOx-9bxrcBQYK5K5RQ6kLM7g2B7zG7anY_afq18mT1NGrOsMssi1IYD33syNO67fSqi9X0dOgR99W84Z_AnhE3tLnRmcpZN9eBRZAmbQKwuiKuJ8B8sJzESrxnttD7o",
        "https://lh3.googleusercontent.com/aida-public/AB6AXuA1UM6uYhwMt0t7efCQSmQskWdAZG3tUyQJuJnR2PLnJCQYFmsI3vn7e8LmFeNu43uVkq0fF0Mf8yQaQSolCG_x_04fpB2KgxuZqQhvPpuB6TKWiKlgMJyrX8OJjgrcworTY7QGrmUXACpBYSwpyEkWGPGgOFEpDIGEFi3OAGGG2DI9vdQWtoZu0W1JbxLeCM0Cf-C0O1Lvp4kWz9HNi6JOQQ5Pu6Oxq_wNDJqKzDkna2Z_fdGBIZBaToInFAYeW-VviGgzd3B5XnY"
      ];
    } else if (isPagerwojo) {
      return [
        primaryImg,
        "https://lh3.googleusercontent.com/aida-public/AB6AXuA1UM6uYhwMt0t7efCQSmQskWdAZG3tUyQJuJnR2PLnJCQYFmsI3vn7e8LmFeNu43uVkq0fF0Mf8yQaQSolCG_x_04fpB2KgxuZqQhvPpuB6TKWiKlgMJyrX8OJjgrcworTY7QGrmUXACpBYSwpyEkWGPGgOFEpDIGEFi3OAGGG2DI9vdQWtoZu0W1JbxLeCM0Cf-C0O1Lvp4kWz9HNi6JOQQ5Pu6Oxq_wNDJqKzDkna2Z_fdGBIZBaToInFAYeW-VviGgzd3B5XnY",
        "https://lh3.googleusercontent.com/aida-public/AB6AXuD9xNVrx29BzFQoK4C_8RoH7xlzl14EMYy_KQ8D0S5D4f0HoYehFDfCTpT8F4tC5ZOQn_Ivt7FDorsdcE0JIWyeCg4owgdrItudp4l2a-qj6U3-c0wDweYzIOgo2xnDv1VXIQU7f3XkNrovE48V7xAUe50j4Ele60ofX74u-PAifvy9jUHDrrJLTtSm1j1CKEXUivzc9SsP5F-IxUpHnwK_p-GHsvquWzWpfrLYXMXoTo7HS9u1UNRZfPHIglNfsDqiNJhSIyfDs5U font-sans"
      ];
    } else {
      return [
        primaryImg,
        "https://lh3.googleusercontent.com/aida-public/AB6AXuDoBhIrnJ7zaLAkOgIyPb7UX6AQJKWe05NElS6J28LE6bfxg87p8Yrp7loEMMdDcS5xSIX0736i1xEEk_kn_T2r_a__s4HfqMF2OCf1NY-Xybcrfzr9dSrL5VJ6sV6sQPPu3jSt4j_2AqdDGOx-9bxrcBQYK5K5RQ6kLM7g2B7zG7anY_afq18mT1NGrOsMssi1IYD33syNO67fSqi9X0dOgR99W84Z_AnhE3tLnRmcpZN9eBRZAmbQKwuiKuJ8B8sJzESrxnttD7o",
        "https://lh3.googleusercontent.com/aida-public/AB6AXuD9xNVrx29BzFQoK4C_8RoH7xlzl14EMYy_KQ8D0S5D4f0HoYehFDfCTpT8F4tC5ZOQn_Ivt7FDorsdcE0JIWyeCg4owgdrItudp4l2a-qj6U3-c0wDweYzIOgo2xnDv1VXIQU7f3XkNrovE48V7xAUe50j4Ele60ofX74u-PAifvy9jUHDrrJLTtSm1j1CKEXUivzc9SsP5F-IxUpHnwK_p-GHsvquWzWpfrLYXMXoTo7HS9u1UNRZfPHIglNfsDqiNJhSIyfDs5U"
      ];
    }
  };

  const getRoomDescription = (room: Room) => {
    if (room.description) {
      return room.description;
    }
    switch (room.type) {
      case 'Standard':
        return "Kamar Standard dirancang khusus bagi Anda yang menginginkan kenyamanan efisien. Dilengkapi kasur berspesifikasi Single yang empuk, pendingin udara AC yang selalu terawat dinginnya, serta akses internet nirkabel (Wifi) yang stabil. Pilihan ideal untuk akomodasi fungsional harian yang hemat namun tetap berkualitas prima.";
      case 'Deluxe':
        return "Kamar Deluxe menawarkan ekstra ruang dengan estetika kenyamanan modern yang lebih matang. Menyediakan kasur tipe Queen, lemari pakaian berkepasitas optimal, sirkulasi udara alami yang segar, meja kerja/belajar fungsional, AC hening, asupan Wifi gigabit, dan layanan laundry gratis harian untuk kemudahan mutlak aktivitas Anda.";
      case 'Executive':
        return "Kamar Executive dirancang dengan keanggunan eksklusif bagi profesional dinamis. Dilengkapi dengan tempat tidur King Size mewah, kenyamanan pemanas air (Water Heater) mandiri di kamar mandi dalam, Smart TV fungsional, lemari pendingin mini, sirkulasi ruangan sejuk, Wifi berkecepatan prima, meja kerja luas ergonomis, serta layanan pembersihan superior berkala.";
      case 'Suite':
      default:
        return "Suite adalah kasta tertinggi kemewahan akomodasi mandiri CV Indra Jaya Kost. Memberikan dimensi ruangan terluas berdekorasi modern kontemporer dengan ranjang tidur Super King. Dilengkapi ruang bersantai / tamu minimalis yang teduh dengan sofa berlapis, dapur pribadi mungil, kamar mandi premium berfasilitas pemanas air (Water Heater), pendingin AC ekstra dingin, jaminan Wifi dengan bandwith mutlak terbaik, serta pembersihan ruangan harian istimewa.";
    }
  };

  // Filtered rooms
  const filteredRooms = rooms.filter(room => {
    const matchesSearch = room.roomNumber.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          room.type.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          room.facilities.some(f => f.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesLocation = selectedLocation === 'Semua' || room.location.toLowerCase().includes(selectedLocation.toLowerCase());
    
    const matchesAvailability = availabilityFilter === 'Semua' || 
                               (availabilityFilter === 'Tersedia' && room.isAvailable) ||
                               (availabilityFilter === 'Penuh' && !room.isAvailable);

    const matchesPrice = room.price <= maxPrice;

    return matchesSearch && matchesLocation && matchesAvailability && matchesPrice;
  });

  const handleBookingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!bookingRoom) return;

    onBookRoom(bookingRoom.id, guestName, guestEmail);
    setBookingRoom(null);
    setGuestName('');
    setGuestEmail('');
  };

  const virtualTourScenes = {
    Jimbaran: {
      title: "Jimbaran Premium Suites",
      desc: "Hunian strategis dekat pantai Jimbaran, dilengkapi dengan fasilitas balkon pribadi, sirkulasi udara optimal, dan view laut yang mewah.",
      img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDoBhIrnJ7zaLAkOgIyPb7UX6AQJKWe05NElS6J28LE6bfxg87p8Yrp7loEMMdDcS5xSIX0736i1xEEk_kn_T2r_a__s4HfqMF2OCf1NY-Xybcrfzr9dSrL5VJ6sV6sQPPu3jSt4j_2AqdDGOx-9bxrcBQYK5K5RQ6kLM7g2B7zG7anY_afq18mT1NGrOsMssi1IYD33syNO67fSqi9X0dOgR99W84Z_AnhE3tLnRmcpZN9eBRZAmbQKwuiKuJ8B8sJzESrxnttD7o'
    },
    Pagerwojo: {
      title: "Pagerwojo Ngemplak Cozy Rooms",
      desc: "Menyuguhkan ketenangan asri khas Ngemplak, bernuansa kayu modern estetik dengan meja kerja ergonomis, sempurna untuk remote work.",
      img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA1UM6uYhwMt0t7efCQSmQskWdAZG3tUyQJuJnR2PLnJCQYFmsI3vn7e8LmFeNu43uVkq0fF0Mf8yQaQSolCG_x_04fpB2KgxuZqQhvPpuB6TKWiKlgMJyrX8OJjgrcworTY7QGrmUXACpBYSwpyEkWGPGgOFEpDIGEFi3OAGGG2DI9vdQWtoZu0W1JbxLeCM0Cf-C0O1Lvp4kWz9HNi6JOQQ5Pu6Oxq_wNDJqKzDkna2Z_fdGBIZBaToInFAYeW-VviGgzd3B5XnY'
    },
    Magersari: {
      title: "Perumahan Magersari Urban House",
      desc: "Kost bernuansa modern minimalis di kluster eksklusif Kota. Akses mudah ke supermarket, mall, dan stasiun komuter utama.",
      img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAh9N3-596klyO7g-ayWyqOtHnMN1rHY0pQtBv7jSfLktClWWBGPUSxBw_S0Jg9sEEGxcd21bUxQkgH11MnUefUtSKIvf9Seyl4kLYMnzCYLECHpcBQHY5vtp_HkSgxJyEar0hfsSrVMqQXFvt_stbFvyBFO-hDW5wDUyUy3NG-huJwopTWYD7AVHBbcmZgzJiHwdfATuUOyuPo3WrYysE7u7aY3ETrqof18deJPaDhccM1rAaF-Vm502atr3rxcvTzFr4l9ZrTDpg'
    }
  };

  return (
    <div className="space-y-20 pb-16 pt-22">
      
      {/* 1. Hero Section */}
      <section className="relative px-4 md:px-8 overflow-hidden max-w-7xl mx-auto">
        <div className="flex flex-col lg:flex-row items-center gap-12 pt-8 lg:pt-16">
          
          <div className="flex-1 space-y-6 text-left">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-stone-100 dark:bg-stone-900 text-stone-850 dark:text-gold border border-stone-200 dark:border-white/10 font-sans font-bold text-[9px] uppercase tracking-[0.25em]">
              <Sparkles className="h-3 w-3 text-gold" />
              Hunian Eksklusif & Strategis di Pusat Kota
            </span>
            <h2 className="text-4xl md:text-5xl lg:text-7xl font-serif font-light text-stone-900 dark:text-white leading-tight tracking-wide">
              Istirahat <span className="italic font-normal text-gold">Nyaman</span>, <br />
              <span className="font-serif italic font-normal text-stone-850 dark:text-stone-300">Produktif Maksimal.</span>
            </h2>
            <p className="text-stone-600 dark:text-stone-400 text-sm md:text-base max-w-lg leading-relaxed font-light font-sans">
              Nikmati fasilitas premium dengan harga terjangkau di Indra Jaya Kost. Hunian strategis dengan pengawasan keamanan 24 jam dan suasana asri yang tenang menunjang kerja dari rumah Anda.
            </p>
            <div className="flex flex-wrap gap-4 font-sans">
              <a 
                href="#kamar-selection"
                className="bg-stone-900 text-white dark:bg-white dark:text-black px-6 py-3.5 rounded-none font-semibold text-[10px] uppercase tracking-widest border border-transparent hover:bg-gold dark:hover:bg-gold dark:hover:text-black transition-all flex items-center gap-2 cursor-pointer"
              >
                Cek Kamar Tersedia &rarr;
              </a>
              <button 
                type="button"
                className="bg-transparent border border-stone-300 dark:border-white/10 text-stone-850 dark:text-white px-6 py-3.5 rounded-none font-semibold text-[10px] uppercase tracking-widest hover:bg-stone-900 hover:text-white dark:hover:bg-white dark:hover:text-black transition-all cursor-pointer"
                onClick={() => setIsVirtualTourOpen(true)}
              >
                Virtual Tour Rumah Kost
              </button>
            </div>
          </div>

          {/* Right Hero Visual Card */}
          <div className="flex-grow w-full lg:max-w-md relative">
            <div className="relative rounded-none overflow-hidden shadow-2xl aspect-4/3 lg:aspect-square border border-stone-200 dark:border-white/10 p-2 bg-white dark:bg-[#0E0E0E]">
              <img 
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuA1UM6uYhwMt0t7efCQSmQskWdAZG3tUyQJuJnR2PLnJCQYFmsI3vn7e8LmFeNu43uVkq0fF0Mf8yQaQSolCG_x_04fpB2KgxuZqQhvPpuB6TKWiKlgMJyrX8OJjgrcworTY7QGrmUXACpBYSwpyEkWGPGgOFEpDIGEFi3OAGGG2DI9vdQWtoZu0W1JbxLeCM0Cf-C0O1Lvp4kWz9HNi6JOQQ5Pu6Oxq_wNDJqKzDkna2Z_fdGBIZBaToInFAYeW-VviGgzd3B5XnY" 
                alt="Bedroom preview" 
                className="w-full h-full object-cover select-none"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-x-6 bottom-6 bg-stone-950/95 backdrop-blur-md p-4 rounded-none border border-white/10 flex justify-between items-center shadow-lg">
                <div>
                  <p className="text-[9px] text-stone-400 font-bold uppercase tracking-wider font-sans">HARGA MULAI</p>
                  <p className="text-lg font-serif font-bold text-[#d4af37]">Rp 1.500.000<span className="text-[10px] text-stone-400 font-medium font-sans"> /bln</span></p>
                </div>
                <div className="flex items-center gap-1 px-2.5 py-1 rounded-none border border-white/20 bg-stone-900 text-[#d4af37] font-semibold text-xs font-sans">
                  <Star className="h-3.5 w-3.5 fill-[#d4af37] text-[#d4af37]" />
                  4.9
                </div>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* 2. Virtual Tour Popup/Simulator Modal */}
      {isVirtualTourOpen && (
        <div id="virtual-tour-modal" className="fixed inset-0 z-50 flex items-center justify-center p-4 font-sans">
          <div className="absolute inset-0 bg-[#0A0A0A]/85 backdrop-blur-md" onClick={() => setIsVirtualTourOpen(false)} />
          <div className="relative w-full max-w-4xl bg-[#FAF7F2] dark:bg-[#0A0A0A] rounded-none overflow-hidden shadow-2xl border border-stone-300 dark:border-white/10 flex flex-col md:flex-row h-[85vh] max-h-[600px] z-10 transition-all">
            
            <div className="flex-1 relative bg-[#090909]">
              <img 
                src={virtualTourScenes[tourLoc].img} 
                alt={tourLoc + " scene"} 
                className="w-full h-full object-cover opacity-90 transition-all duration-700" 
                referrerPolicy="no-referrer"
              />
              <div className="absolute top-4 left-4 bg-stone-950/90 backdrop-blur-md px-3 py-1 rounded-none text-[9px] uppercase tracking-widest text-[#d4af37] border border-white/10 flex items-center gap-1.5 font-bold">
                <Compass className="h-3 w-3 text-gold animate-spin" />
                Mode Simulator Virtual Tour
              </div>
            </div>

            <div className="w-full md:w-80 p-6 flex flex-col justify-between overflow-y-auto dark:text-white bg-[#FAF7F2] dark:bg-[#0D0D0D] border-t md:border-t-0 md:border-l border-stone-200 dark:border-white/10">
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-[9px] font-bold text-gold uppercase tracking-[0.2em] block">SINKRONISASI AKTIF</span>
                  <button 
                    type="button" 
                    onClick={() => setIsVirtualTourOpen(false)} 
                    className="rounded-none w-7 h-7 flex items-center justify-center bg-stone-200 dark:bg-stone-900 text-stone-650 cursor-pointer hover:bg-gold hover:text-black hover:dark:text-black hover:dark:bg-gold transition-colors"
                  >
                    &times;
                  </button>
                </div>
                <div className="pt-2">
                  <span className="text-[9px] font-bold text-stone-400 uppercase tracking-widest block mb-1 font-sans">Pilih Lokasi</span>
                  <p className="text-xl font-serif italic text-stone-900 dark:text-white leading-tight leading-tight">{virtualTourScenes[tourLoc].title}</p>
                </div>
                <p className="text-xs text-stone-600 dark:text-stone-400 leading-relaxed font-light font-sans">
                  {virtualTourScenes[tourLoc].desc}
                </p>

                {/* Locations list selector */}
                <div className="space-y-2 pt-4">
                  {(['Jimbaran', 'Pagerwojo', 'Magersari'] as const).map((loc) => (
                    <button
                      key={loc}
                      type="button"
                      className={`w-full text-left p-3 rounded-none border text-xs font-semibold flex items-center justify-between transition-all cursor-pointer ${
                        tourLoc === loc 
                          ? 'border-gold bg-stone-150/40 text-gold dark:bg-stone-950/40 dark:text-gold' 
                          : 'border-stone-250 hover:bg-stone-100 dark:border-white/5 text-stone-750 dark:text-stone-300 dark:hover:bg-stone-900/40'
                      }`}
                      onClick={() => setTourLoc(loc)}
                    >
                      <span className="font-sans text-[11px] font-medium">{loc === 'Jimbaran' ? 'Jimbaran (12 Kamar)' : loc === 'Pagerwojo' ? 'Pagerwojo Ngemplak (4 Kamar)' : 'Perumahan Magersari (5 Kamar)'}</span>
                      <span className="text-[9px] uppercase font-black tracking-wider text-stone-400">Lihat</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="pt-6">
                <button
                  type="button"
                  className="w-full bg-stone-900 hover:bg-gold hover:text-black dark:bg-white dark:text-black text-white font-semibold text-[10px] uppercase tracking-widest py-3.5 rounded-none hover:opacity-90 transition-all cursor-pointer border border-transparent"
                  onClick={() => {
                    setIsVirtualTourOpen(false);
                    setSelectedLocation(tourLoc === 'Pagerwojo' ? 'Pagerwojo' : tourLoc);
                    const el = document.getElementById('kamar-selection');
                    if (el) el.scrollIntoView({ behavior: 'smooth' });
                  }}
                >
                  Filter Kamar {tourLoc} &rarr;
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* 3. Bento Facilities Section */}
      <section className="bg-stone-100/40 dark:bg-[#070707] py-16 transition-colors border-y border-stone-200 dark:border-white/5">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <div className="text-center max-w-xl mx-auto mb-14">
            <h3 className="text-3xl font-serif font-light text-stone-900 dark:text-white tracking-wide leading-tight">
              Fasilitas <span className="italic font-normal text-gold">Unggulan</span> Hunian
            </h3>
            <p className="text-stone-500 dark:text-stone-450 font-light text-xs font-sans mt-2 tracking-wide">
              Segala kenyamanan eksklusif telah kami siapkan guna menjaga produktivitas kerja dan kenyamanan istirahat Anda.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            
            {/* High-speed internet card */}
            <div className="md:col-span-2 md:row-span-2 p-6 rounded-none bg-white dark:bg-[#0D0D0D] border border-stone-250 dark:border-white/10 flex flex-col justify-between group transition-all text-left">
              <div>
                <div className="w-10 h-10 rounded-none border border-stone-200 dark:border-white/10 bg-stone-50 dark:bg-stone-900 text-gold flex items-center justify-center mb-6">
                  <Wifi className="h-5 w-5" />
                </div>
                <h4 className="text-xl font-serif font-light italic text-stone-900 dark:text-white leading-snug">High-Speed Wi-Fi Up to 100 Mbps</h4>
                <p className="text-stone-500 dark:text-stone-400 font-light font-sans text-xs leading-relaxed mt-2.5">
                  Akses internet khusus fiber optic berkecepatan tinggi menjamin kestabilan aktivitas telekonferensi, telecommuting, dan streaming multimedia tanpa hambatan.
                </p>
              </div>

              <div className="rounded-none overflow-hidden h-40 mt-6 border border-stone-150 dark:border-white/5">
                <img 
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuCcwDJVsfE5o1yHtJEs_R_29nNiR6rmW__XSH0GmtZ-tO5HdGfDmH_fBgqrLfjAK1TKr60HGlsGDK4j_iXvV3U0u3M0dSrqgxJNJM61OnWn33PUuopdC8Qzt-btjbyHoI1Ul3MKQ-2CcEydJ9rNTdReCjCI1OVFIRFagCbo70FvxOs4RG7RzIOpUPwH0Zx5DPXVOIj0cdvlOo7nltpmJqwOymZuliBs5CpqMnkCXspQ8W6SL2k_MTggVF4pjUQOT6aNFXM_FL6cmI8" 
                  alt="Cozy workspace" 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 select-none"
                  referrerPolicy="no-referrer"
                />
              </div>
            </div>

            {/* Smart AC Card */}
            <div className="p-6 rounded-none bg-white dark:bg-[#0D0D0D] border border-stone-250 dark:border-white/10 shadow-xs text-left flex flex-col justify-between transition-all">
              <div className="w-10 h-10 rounded-none border border-stone-200 dark:border-white/10 bg-stone-50 dark:bg-stone-900 text-gold flex items-center justify-center">
                <Wind className="h-5 w-5" />
              </div>
              <div className="pt-6">
                <h4 className="text-sm uppercase tracking-widest font-semibold text-stone-850 dark:text-stone-200 font-sans">Pendingin AC Premium</h4>
                <p className="text-xs text-stone-500 dark:text-stone-400 leading-relaxed font-light mt-1 font-sans">Udaranya segar, sejuk, dan terawat lewat maintenance berkala secara kontinu.</p>
              </div>
            </div>

            {/* Smart Laundry Card */}
            <div className="p-6 rounded-none bg-white dark:bg-[#0D0D0D] border border-stone-250 dark:border-white/10 shadow-xs text-left flex flex-col justify-between transition-all">
              <div className="w-10 h-10 rounded-none border border-stone-200 dark:border-white/10 bg-stone-50 dark:bg-stone-900 text-gold flex items-center justify-center">
                <Shirt className="h-5 w-5" />
              </div>
              <div className="pt-6">
                <h4 className="text-sm uppercase tracking-widest font-semibold text-stone-850 dark:text-stone-200 font-sans">Layanan Laundry Gratis</h4>
                <p className="text-xs text-stone-500 dark:text-stone-400 leading-relaxed font-light mt-1 font-sans">Layanan bersih, rapi, gosok wangi kilat harian tanpa tambahan beban biaya.</p>
              </div>
            </div>

            {/* smart Security Card (landscape span) */}
            <div className="md:col-span-2 p-6 rounded-none bg-stone-950 dark:bg-[#121212] shadow-xl border border-stone-800 dark:border-white/10 flex items-center gap-6 justify-between text-left transition-all">
              <div className="space-y-2 max-w-sm">
                <h4 className="text-lg font-serif italic text-white leading-normal">Sistem Keamanan Berlapis 24/7</h4>
                <p className="text-stone-400 text-xs leading-relaxed font-light font-sans">
                  Dilengkapi kamera pengintai CCTV, gerbang sistem akses kartu pintar, serta petugas jaga mumpuni menjamin privasi rasa aman keluarga Anda.
                </p>
              </div>
              <ShieldAlert className="h-16 w-16 text-white/5 dark:text-[#d4af37]/10 transition-all shrink-0" />
            </div>

          </div>
        </div>
      </section>

      {/* 4. Room Selection & Interactive Filtering */}
      <section id="kamar-selection" className="mx-auto max-w-7xl px-4 md:px-8 font-sans">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-6 mb-10 text-left">
          <div className="space-y-2">
            <h3 className="text-3xl font-serif font-light text-stone-900 dark:text-white tracking-wide">Explore <span className="italic font-normal text-gold">Tipe Kamar</span></h3>
            <p className="text-stone-500 dark:text-stone-405 text-xs font-light max-w-lg leading-relaxed">
              Kami menawarkan 21 kamar premium yang tersebar di 3 lokasi strategis: Jimbaran (12 Unit), Pagerwojo Ngemplak (4 Unit), dan Perumahan Magersari (5 Unit).
            </p>
            <p className="text-[10px] text-stone-550 dark:text-stone-400 font-sans tracking-wide italic flex items-center gap-1">
              <span className="text-[#d4af37] font-bold">ℹ️ Info Aksesibilitas:</span> Tekan tipe kamar/badge atau foto kamar untuk menampilkan galeri beberapa foto, detail lengkap fasilitas, serta rute interaktif Google Maps.
            </p>
          </div>
          
          {/* Quick Stats list */}
          <div className="flex flex-wrap gap-2">
            <span className="px-2.5 py-1 text-[9px] uppercase tracking-widest font-bold border border-stone-250 dark:border-white/10 text-stone-650 bg-stone-50 dark:bg-[#0E0E0E] dark:text-white rounded-none">
              Jimbaran: 12 Kamar
            </span>
            <span className="px-2.5 py-1 text-[9px] uppercase tracking-widest font-bold border border-stone-250 dark:border-white/10 text-stone-650 bg-stone-50 dark:bg-[#0E0E0E] dark:text-white rounded-none">
              Pagerwojo: 4 Kamar
            </span>
            <span className="px-2.5 py-1 text-[9px] uppercase tracking-widest font-bold border border-stone-250 dark:border-white/10 text-stone-650 bg-stone-50 dark:bg-[#0E0E0E] dark:text-white rounded-none">
              Magersari: 5 Kamar
            </span>
          </div>
        </div>

        {/* Filters Controls Panel */}
        <div className="p-6 rounded-none bg-[#FAF7F2]/50 dark:bg-[#0C0C0C]/50 border border-stone-250 dark:border-white/10 shadow-xs mb-8 space-y-6 text-left">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
            
            {/* Search string */}
            <div className="space-y-1.5 font-sans">
              <label className="flex items-center gap-1 font-bold text-[10px] uppercase tracking-widest text-[#d4af37] mb-1.5"><Search className="h-3.5 w-3.5" /> Cari Nomor / Tipe Kamar</label>
              <input
                type="text"
                placeholder="Contoh: Deluxe, Wifi, AC, J-01 ..."
                className="w-full px-4 py-2 text-xs font-semibold bg-white dark:bg-[#0C0C0C] border border-stone-300 focus:border-gold focus:ring-1 focus:ring-gold rounded-none dark:border-white/15 text-stone-900 dark:text-white transition-all outline-hidden"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            {/* Location Filter */}
            <div className="space-y-1.5 font-sans">
              <label className="flex items-center gap-1 font-bold text-[10px] uppercase tracking-widest text-[#d4af37] mb-1.5"><MapPin className="h-3.5 w-3.5" /> Pilih Lokasi</label>
              <select
                className="w-full px-4 py-2 text-xs font-semibold bg-white dark:bg-[#0C0C0C] border border-stone-300 focus:border-gold focus:ring-1 focus:ring-gold rounded-none dark:border-white/15 text-stone-900 dark:text-white transition-all cursor-pointer outline-hidden"
                value={selectedLocation}
                onChange={(e) => setSelectedLocation(e.target.value)}
              >
                <option value="Semua">Semua Lokasi (3 Lokasi)</option>
                <option value="Jimbaran">Jimbaran (12 Kamar)</option>
                <option value="Pagerwojo Ngemplak">Pagerwojo Ngemplak (4 Kamar)</option>
                <option value="Perumahan Magersari">Perumahan Magersari (5 Kamar)</option>
              </select>
            </div>

            {/* Availability Filter */}
            <div className="space-y-1.5 font-sans">
              <label className="flex items-center gap-1 font-bold text-[10px] uppercase tracking-widest text-[#d4af37] mb-1.5"><SlidersHorizontal className="h-3.5 w-3.5" /> Filter Ketersediaan</label>
              <select
                className="w-full px-4 py-2 text-xs font-semibold bg-white dark:bg-[#0C0C0C] border border-stone-300 focus:border-gold focus:ring-1 focus:ring-gold rounded-none dark:border-white/15 text-stone-900 dark:text-white transition-all cursor-pointer outline-hidden"
                value={availabilityFilter}
                onChange={(e) => setAvailabilityFilter(e.target.value as any)}
              >
                <option value="Semua">Semua Status</option>
                <option value="Tersedia">Tersedia Kamar</option>
                <option value="Penuh">Penuh Tersewa</option>
              </select>
            </div>

            {/* Max Price Range Filter Selection */}
            <div className="space-y-1.5 font-sans">
              <div className="flex justify-between font-bold text-[10px] uppercase tracking-widest text-stone-500 dark:text-stone-400 mb-1.5">
                <span className="flex items-center gap-1">&le; Harga Maksimal</span>
                <span className="text-[#d4af37]">{maxPrice >= 5000000 ? 'Tanpa Batas' : `Rp ${(maxPrice/1000000).toFixed(1)}Jt`}</span>
              </div>
              <input
                type="range"
                min="1000000"
                max="5000000"
                step="200000"
                className="w-full accent-[#d4af37] bg-stone-200 dark:bg-stone-850 rounded-none cursor-pointer"
                value={maxPrice}
                onChange={(e) => setMaxPrice(Number(e.target.value))}
              />
            </div>

          </div>
        </div>

        {/* Dynamic Rooms Grid showing filtered results */}
        {filteredRooms.length === 0 ? (
          <div className="p-12 rounded-none border border-dashed border-stone-300 dark:border-white/10 text-center text-stone-450 font-sans">
            <Compass className="h-8 w-8 mx-auto text-gold animate-bounce mb-3" />
            <p className="text-sm font-bold text-stone-600 dark:text-stone-300 font-serif italic">Kamar tidak ditemukan...</p>
            <p className="text-xs text-stone-450 dark:text-stone-500 mt-1">Coba sesuaikan kata kunci pencarian atau bersihkan filter pilihan Anda.</p>
            <button
              type="button"
              className="mt-4 px-4 py-2.5 text-[10px] uppercase tracking-widest font-semibold text-white bg-stone-900 rounded-none dark:bg-white dark:text-black cursor-pointer hover:bg-gold dark:hover:bg-gold dark:hover:text-black"
              onClick={() => {
                setSearchQuery('');
                setSelectedLocation('Semua');
                setAvailabilityFilter('Semua');
                setMaxPrice(5000000);
              }}
            >
              Ulangi Semua Filter
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 font-sans">
            {filteredRooms.map((room) => (
              <div 
                key={room.id}
                className={`flex flex-col justify-between rounded-none overflow-hidden bg-white dark:bg-[#0D0D0D] p-5 border transition-all hover:-translate-y-1 duration-300 ${
                  highContrast ? 'border-amber-400 border-2' : 'border-stone-250 dark:border-white/10'
                }`}
              >
                <div>
                  <div 
                    onClick={() => setViewingRoom(room)}
                    className="relative rounded-none overflow-hidden h-48 mb-4 border border-stone-150 dark:border-white/5 bg-stone-950 cursor-pointer group"
                  >
                    <img 
                      src={room.image} 
                      alt={room.roomNumber} 
                      className="w-full h-full object-cover select-none opacity-90 group-hover:scale-105 group-hover:opacity-75 transition-all duration-500"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 bg-stone-950/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-all duration-300">
                      <span className="text-[9px] font-bold text-[#d4af37] uppercase tracking-widest bg-stone-950/90 border border-gold/30 px-3 py-1.5 font-sans">
                        Lihat Foto & Detail Peta
                      </span>
                    </div>

                    <div className={`absolute top-3 right-3 px-2.5 py-1 rounded-none text-[9px] font-bold uppercase tracking-widest ${
                      room.isAvailable 
                        ? 'bg-[#d4af37] text-stone-950' 
                        : 'bg-stone-850/90 text-stone-400 backdrop-blur-xs'
                    }`}>
                      {room.isAvailable ? 'Tersedia' : 'Penuh'}
                    </div>

                    <div className="absolute left-3 bottom-3 px-2 py-1 rounded-none bg-stone-950/85 backdrop-blur-md text-[9px] uppercase tracking-widest font-extrabold text-white flex items-center gap-1 border border-white/10">
                      <MapPin className="h-2.5 w-2.5 text-gold" />
                      {room.location}
                    </div>
                  </div>

                  <div className="flex justify-between items-start text-left mb-2">
                    <div>
                      <h4 className="text-xl font-serif font-light text-stone-900 dark:text-white flex flex-wrap items-center gap-2 leading-none">
                        Kamar {room.roomNumber}
                        <button
                          type="button"
                          onClick={() => setViewingRoom(room)}
                          className="text-[9px] uppercase tracking-widest px-2 py-0.5 border border-[#d4af37]/45 hover:bg-gold hover:text-black hover:border-transparent text-[#d4af37] bg-transparent font-sans rounded-none font-semibold transition-all cursor-pointer"
                          title="Klik untuk melihat foto-foto dan lokasi Google Maps"
                        >
                          {room.type} (Detail)
                        </button>
                      </h4>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="text-base font-serif font-bold text-gold leading-tight">
                        Rp {(room.price / 1000000).toFixed(1)}Jt<span className="text-[10px] tracking-normal text-stone-450 font-sans font-medium">/bln</span>
                      </p>
                    </div>
                  </div>

                  {/* Room metadata */}
                  <div className="flex gap-2 text-[9px] uppercase tracking-widest text-stone-500 font-bold dark:text-stone-400 pb-3 border-b dark:border-white/5 mb-4 text-left font-sans">
                    <span className="px-2 py-0.5 rounded-none bg-stone-50 dark:bg-stone-900 font-bold">{room.size}</span>
                    <span className="px-2 py-0.5 rounded-none bg-stone-50 dark:bg-stone-900 font-bold">Bed: {room.bedType}</span>
                  </div>

                  {/* facilities checklist */}
                  <div className="flex flex-wrap gap-1.5 mb-6 text-[10px] text-stone-550 font-medium dark:text-stone-300 text-left font-sans">
                    {room.facilities.map((fac, i) => (
                      <span key={i} className="px-2 py-1 rounded-none bg-stone-50 dark:bg-stone-900/40 border border-stone-150 dark:border-white/5">
                        {fac}
                      </span>
                    ))}
                  </div>
                </div>

                <button
                  type="button"
                  className={`w-full py-3.5 rounded-none font-semibold text-[10px] uppercase tracking-widest transition-all flex items-center justify-center gap-1.5 cursor-pointer border border-transparent ${
                    room.isAvailable
                      ? 'bg-stone-900 hover:bg-gold text-white hover:text-black dark:bg-white dark:text-black'
                      : 'bg-stone-100 dark:bg-stone-900 text-stone-400 dark:text-stone-500 cursor-not-allowed'
                  }`}
                  disabled={!room.isAvailable}
                  onClick={() => {
                    setBookingRoom(room);
                    setGuestName(currentUser?.name || '');
                    setGuestEmail(currentUser?.email || '');
                  }}
                >
                  {room.isAvailable ? 'Pesan Sekarang' : 'Habis Terpesan'}
                </button>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* 5. Booking Modal Portal */}
      {bookingRoom && (
        <div id="booking-modal" className="fixed inset-0 z-50 flex items-center justify-center p-4 font-sans">
          <div className="absolute inset-0 bg-stone-950/75 backdrop-blur-xs" onClick={() => setBookingRoom(null)} />
          <div className="relative w-full max-w-md rounded-none bg-[#FAF7F2] p-6 shadow-2xl transition-all dark:bg-[#0A0A0A] border border-stone-300 dark:border-white/10 z-10 text-left">
            <div className="flex items-center justify-between border-b pb-4 dark:border-white/10 mb-6">
              <h3 className="text-xl font-serif italic text-stone-900 dark:text-white">Pendaftaran Booking Kost</h3>
              <button 
                type="button" 
                className="text-2xl text-stone-400 font-light hover:text-gold cursor-pointer" 
                onClick={() => setBookingRoom(null)}
              >
                &times;
              </button>
            </div>

            <div className="mb-4 p-4 rounded-none bg-stone-50 dark:bg-stone-900/65 border border-stone-200 dark:border-white/5 space-y-1.5">
              <p className="text-[9px] text-[#d4af37] font-bold uppercase tracking-[0.2em]">Unit Kamar Pilihan</p>
              <h4 className="text-md font-serif italic text-stone-900 dark:text-white">Kamar {bookingRoom.roomNumber} - {bookingRoom.type}</h4>
              <p className="text-xs text-stone-500 dark:text-stone-400">Lokasi: {bookingRoom.location}</p>
              <p className="text-base font-serif font-bold text-gold pt-1">Rp {bookingRoom.price.toLocaleString('id-ID')} / bulan</p>
            </div>

            <form onSubmit={handleBookingSubmit} className="space-y-4">
              <div>
                <label className="block text-[9px] font-bold text-stone-450 dark:text-stone-400 uppercase tracking-widest mb-1.5">Nama Lengkap Pemohon</label>
                <input
                  type="text"
                  className="w-full px-4 py-2.5 text-xs font-semibold bg-white dark:bg-stone-950 border border-stone-300 focus:border-gold focus:ring-1 focus:ring-gold rounded-none dark:border-white/15 text-stone-900 dark:text-white outline-hidden"
                  placeholder="Masukkan nama Anda"
                  value={guestName}
                  onChange={(e) => setGuestName(e.target.value)}
                  required
                />
              </div>

              <div>
                <label className="block text-[9px] font-bold text-stone-450 dark:text-stone-400 uppercase tracking-widest mb-1.5">Alamat Email Pembayaran</label>
                <input
                  type="email"
                  className="w-full px-4 py-2.5 text-xs font-semibold bg-white dark:bg-stone-950 border border-stone-300 focus:border-gold focus:ring-1 focus:ring-gold rounded-none dark:border-white/15 text-stone-900 dark:text-white outline-hidden"
                  placeholder="Masukkan email untuk tagihan"
                  value={guestEmail}
                  onChange={(e) => setGuestEmail(e.target.value)}
                  required
                />
              </div>

              <div className="bg-[#d4af37]/5 text-stone-700 dark:text-[#d4af37] text-[10px] font-medium p-3 rounded-none border border-[#d4af37]/20 leading-relaxed">
                Catatan: Setelah submit, status peminjaman kamar Anda akan dicatat sebagai pending. Anda dapat membayar lewat menu Portal Penyewa di pojok kanan atas.
              </div>

              <div className="pt-4 flex gap-3">
                <button
                  type="button"
                  className="flex-1 py-3 text-[10px] uppercase tracking-widest bg-stone-150/80 text-stone-600 rounded-none font-semibold dark:bg-stone-900 dark:text-stone-300 cursor-pointer"
                  onClick={() => setBookingRoom(null)}
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3 text-[10px] uppercase tracking-widest bg-stone-900 text-white dark:bg-white dark:text-black font-semibold rounded-none hover:bg-gold dark:hover:bg-gold dark:hover:text-black transition-all cursor-pointer"
                >
                  Konfirmasi Booking &rarr;
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 5.1 Room Details & Google Maps Modal Portal */}
      {viewingRoom && (
        <div id="room-detail-modal" className="fixed inset-0 z-50 flex items-center justify-center p-4 font-sans ring-0 outline-hidden">
          <div className="absolute inset-0 bg-stone-950/80 backdrop-blur-md" onClick={() => setViewingRoom(null)} />
          <div className="relative w-full max-w-4xl bg-[#FAF7F2] dark:bg-[#0A0A0A] rounded-none overflow-hidden shadow-2xl border border-stone-300 dark:border-white/10 z-10 text-left flex flex-col md:flex-row h-[85vh] max-h-[650px] transition-all">
            
            {/* Left side: Gallery and Photos */}
            <div className="flex-1 flex flex-col justify-between bg-stone-950 p-2 md:p-4 border-b md:border-b-0 md:border-r border-stone-200 dark:border-white/10 min-h-[250px] md:min-h-0">
              
              {/* Main Image viewer */}
              <div className="flex-1 relative rounded-none overflow-hidden border border-white/5 bg-stone-950 flex items-center justify-center">
                <img 
                  src={getRoomGallery(viewingRoom)[activeGalleryIndex]} 
                  alt={`Room ${viewingRoom.roomNumber} gallery ${activeGalleryIndex + 1}`} 
                  className="w-full h-full object-cover select-none max-h-[350px] transition-all duration-300"
                  referrerPolicy="no-referrer"
                />
                
                {/* Image overlay details */}
                <div className="absolute top-3 left-3 bg-stone-950/90 text-gold text-[8px] uppercase tracking-widest px-2.5 py-1 rounded-none border border-white/10 font-bold font-sans">
                  Foto {activeGalleryIndex + 1} dari {getRoomGallery(viewingRoom).length}
                </div>
              </div>

              {/* Thumbnails list to switch images */}
              <div className="flex gap-2.5 p-2 mt-2 justify-center bg-stone-900/50">
                {getRoomGallery(viewingRoom).map((imgUrl, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setActiveGalleryIndex(idx)}
                    className={`w-16 h-12 rounded-none overflow-hidden border transition-all cursor-pointer ${
                      activeGalleryIndex === idx 
                        ? 'border-gold ring-1 ring-gold scale-105' 
                        : 'border-white/10 opacity-60 hover:opacity-100'
                    }`}
                  >
                    <img src={imgUrl} alt="thumbnail" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                  </button>
                ))}
              </div>
            </div>

            {/* Right side: Facilities and Google Maps */}
            <div className="w-full md:w-96 p-6 flex flex-col justify-between overflow-y-auto bg-[#FAF7F2] dark:bg-[#0D0D0D] text-stone-900 dark:text-white">
              
              <div className="space-y-5">
                <div className="flex justify-between items-start border-b pb-3 dark:border-white/10">
                  <div>
                    <span className="text-[9px] font-bold text-gold uppercase tracking-widest block mb-1">Eksplorasi Detail</span>
                    <h3 className="text-xl font-serif italic text-stone-900 dark:text-white leading-tight">Kamar {viewingRoom.roomNumber}</h3>
                    <p className="text-[10px] text-stone-500 font-sans tracking-wide mt-1">Tipe: <span className="text-[#d4af37] font-semibold">{viewingRoom.type}</span> &bull; Cabang {viewingRoom.location}</p>
                  </div>
                  <button 
                    type="button" 
                    onClick={() => setViewingRoom(null)} 
                    className="rounded-none w-7 h-7 flex items-center justify-center bg-stone-200 dark:bg-stone-900 text-stone-650 cursor-pointer hover:bg-[#d4af37] hover:text-black hover:dark:text-black hover:dark:bg-[#d4af37] transition-all font-bold"
                  >
                    &times;
                  </button>
                </div>

                {/* Tarif Sewa */}
                <div>
                  <span className="text-[8px] font-bold text-stone-400 dark:text-stone-500 uppercase tracking-widest block mb-0.5">Tarif Sewa Bulanan</span>
                  <p className="text-xl font-serif font-bold text-[#d4af37]">Rp {viewingRoom.price.toLocaleString('id-ID')} / bulan</p>
                </div>

                {/* Deskripsi Fasilitas */}
                <div className="space-y-1.5 text-left border-y py-3.5 dark:border-white/10">
                  <span className="text-[8px] font-bold text-stone-400 dark:text-stone-500 uppercase tracking-widest block">Deskripsi & Spesifikasi Tipe</span>
                  <p className="text-xs text-stone-600 dark:text-stone-350 leading-relaxed font-light font-sans">
                    {getRoomDescription(viewingRoom)}
                  </p>
                </div>

                {/* Checklist Fasilitas */}
                <div>
                  <span className="text-[8px] font-bold text-stone-400 dark:text-stone-500 uppercase tracking-widest block mb-2">Fasilitas Kamar Mandiri</span>
                  <div className="flex flex-wrap gap-1.5">
                    {viewingRoom.facilities.map((fac, i) => (
                      <span key={i} className="text-[10px] font-medium text-stone-750 dark:text-stone-350 px-2.5 py-1 rounded-none bg-stone-150/50 dark:bg-stone-900/40 border border-stone-250 dark:border-white/5">
                        {fac}
                      </span>
                    ))}
                    <span className="text-[10px] font-medium text-stone-750 dark:text-stone-350 px-2.5 py-1 rounded-none bg-stone-150/50 dark:bg-stone-900/40 border border-stone-250 dark:border-white/5">Ukuran: {viewingRoom.size}</span>
                    <span className="text-[10px] font-medium text-stone-750 dark:text-stone-350 px-2.5 py-1 rounded-none bg-stone-150/50 dark:bg-stone-900/40 border border-stone-250 dark:border-white/5">Kasur: {viewingRoom.bedType}</span>
                  </div>
                </div>

                {/* Google Maps Location Embed */}
                <div className="space-y-1.5 pt-1">
                  <span className="text-[8px] font-bold text-stone-400 dark:text-stone-500 uppercase tracking-widest block">Peta Lokasi Google Maps</span>
                  <div className="relative rounded-none overflow-hidden h-36 border border-stone-250 dark:border-white/5 bg-stone-950">
                    <iframe
                      src={
                        viewingRoom.location.toLowerCase().includes('jimbaran')
                          ? "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d15779.467475306351!2d115.15858693892701!3d-8.790933519808605!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2dd244bfb2297afb%3A0x6bba87eb075196!2sJimbaran%2C%20Kuta%20Selatan%2C%20Badung%20Regency%2C%20Bali!5e0!3m2!1sen!2sid!4v1717770000000!5m2!1sen!2sid"
                          : viewingRoom.location.toLowerCase().includes('pagerwojo')
                          ? "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d15818.173872225381!2d110.8122247!3d-7.559388!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e7a168b919dc2fb%3A0xf69ba3db5630303c!2sPagerwojo%2C%25Ngemplak%2C%25Sleman%2CLampung!5e0!3m2!1sen!2sid!4v1717770000001!5m2!1sen!2sid"
                          : "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d15824.238382998634!2d112.7154238!3d-7.458293!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2dd7e13b827e8d2f%3A0xe104724b07fbdf0c!2sMagersari%2C%20Sidoarjo%20Sub-District%2C%20Sidoarjo%20Regency%2C%20East%20Java!5e0!3m2!1sen!2sid!4v1717770000002!5m2!1sen!2sid"
                      }
                      width="100%"
                      height="100%"
                      style={{ border: 0 }}
                      allowFullScreen={false}
                      loading="lazy"
                      referrerPolicy="no-referrer-when-downgrade"
                      title="Lokasi Google Maps"
                    />
                  </div>
                </div>

              </div>

              {/* Action Booking */}
              <div className="pt-6 border-t dark:border-white/10 mt-6 flex gap-3">
                <button
                  type="button"
                  className="flex-1 py-3 text-[9px] uppercase tracking-widest bg-stone-150/80 text-stone-600 dark:bg-stone-900 dark:text-stone-300 font-semibold"
                  onClick={() => setViewingRoom(null)}
                >
                  Tutup
                </button>
                <button
                  type="button"
                  className={`flex-1 py-3 text-[9px] uppercase tracking-widest font-semibold transition-all cursor-pointer ${
                    viewingRoom.isAvailable
                      ? 'bg-stone-900 hover:bg-gold text-white hover:text-black dark:bg-white dark:text-black'
                      : 'bg-stone-200 text-stone-400 dark:bg-stone-900 dark:text-stone-500 cursor-not-allowed'
                  }`}
                  disabled={!viewingRoom.isAvailable}
                  onClick={() => {
                    const temp = viewingRoom;
                    setViewingRoom(null);
                    setBookingRoom(temp);
                    setGuestName(currentUser?.name || '');
                    setGuestEmail(currentUser?.email || '');
                  }}
                >
                  {viewingRoom.isAvailable ? 'Booking Kamar Ini' : 'Penuh'}
                </button>
              </div>

            </div>

          </div>
        </div>
      )}

      {/* 6. Location Section with Styled Map */}
      <section className="mx-auto max-w-7xl px-4 md:px-8 space-y-8">
        <div className="text-left font-sans">
          <span className="text-[10px] font-bold text-gold uppercase tracking-[0.25em] block mb-2">Aksesibilitas Wilayah</span>
          <h3 className="text-3xl font-serif font-light text-stone-900 dark:text-white tracking-wide leading-tight">Lokasi Strategis 3 Cabang Utama</h3>
          <p className="text-stone-500 dark:text-stone-400 text-xs font-light mt-2 max-w-2xl leading-relaxed">
            Pengurusan, administrasi, dan unit hunian mandiri kami tersebar di 3 lokasi premium Jawa-Bali yang sangat dekat dari halte komuter, minimarket harian, universitas megah, dan penanganan medis darurat.
          </p>
        </div>

        {/* The 3 Google Maps display */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Map 1: Jimbaran */}
          <div className="rounded-none border border-stone-250 dark:border-white/10 p-2.5 bg-white dark:bg-[#0E0E0E] flex flex-col justify-between">
            <div className="w-full h-56 rounded-none overflow-hidden relative border border-stone-200 dark:border-white/5 bg-stone-900">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d15779.467475306351!2d115.15858693892701!3d-8.790933519808605!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2dd244bfb2297afb%3A0x6bba87eb075196!2sJimbaran%2C%20Kuta%20Selatan%2C%20Badung%20Regency%2C%20Bali!5e0!3m2!1sen!2sid!4v1717770000000!5m2!1sen!2sid"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen={false}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Peta Cabang Jimbaran"
              />
            </div>
            <div className="mt-3.5 text-left font-sans">
              <span className="text-[8px] font-bold text-gold uppercase tracking-wider block">Cabang Bali</span>
              <h4 className="text-xs font-bold text-stone-900 dark:text-white mt-1">Jimbaran (12 Unit)</h4>
              <p className="text-[10px] text-stone-500 dark:text-stone-400 mt-1 leading-relaxed">Sangat dekat dengan Kampus Universitas Udayana, pantai berselancar Jimbaran yang legendaris, serta deretan kafe kuliner hidangan laut segar.</p>
            </div>
          </div>

          {/* Map 2: Pagerwojo */}
          <div className="rounded-none border border-stone-250 dark:border-white/10 p-2.5 bg-white dark:bg-[#0E0E0E] flex flex-col justify-between">
            <div className="w-full h-56 rounded-none overflow-hidden relative border border-stone-200 dark:border-white/5 bg-stone-900">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d15818.173872225381!2d110.8122247!3d-7.559388!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e7a168b919dc2fb%3A0xf69ba3db5630303c!2sPagerwojo%2C%25Ngemplak%2C%25Sleman%2CLampung!5e0!3m2!1sen!2sid!4v1717770000001!5m2!1sen!2sid"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen={false}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Peta Cabang Pagerwojo"
              />
            </div>
            <div className="mt-3.5 text-left font-sans">
              <span className="text-[8px] font-bold text-gold uppercase tracking-wider block">Cabang Yogyakarta</span>
              <h4 className="text-xs font-bold text-stone-900 dark:text-white mt-1">Pagerwojo Ngemplak (4 Unit)</h4>
              <p className="text-[10px] text-stone-500 dark:text-stone-400 mt-1 leading-relaxed">Terletak di lingkungan yang hijau dan tenang di Sleman, Yogyakarta. Udara sejuk pedesaan yang asri serta akses mudah ke pusat perkotaan.</p>
            </div>
          </div>

          {/* Map 3: Magersari */}
          <div className="rounded-none border border-stone-250 dark:border-white/10 p-2.5 bg-white dark:bg-[#0E0E0E] flex flex-col justify-between">
            <div className="w-full h-56 rounded-none overflow-hidden relative border border-stone-200 dark:border-white/5 bg-stone-900">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d15824.238382998634!2d112.7154238!3d-7.458293!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2dd7e13b827e8d2f%3A0xe104724b07fbdf0c!2sMagersari%2C%20Sidoarjo%20Sub-District%2C%20Sidoarjo%20Regency%2C%25East%20Java!5e0!3m2!1sen!2sid!4v1717770000002!5m2!1sen!2sid"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen={false}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Peta Cabang Magersari"
              />
            </div>
            <div className="mt-3.5 text-left font-sans">
              <span className="text-[8px] font-bold text-gold uppercase tracking-wider block">Cabang Sidoarjo</span>
              <h4 className="text-xs font-bold text-stone-900 dark:text-white mt-1">Perumahan Magersari (5 Unit)</h4>
              <p className="text-[10px] text-stone-500 dark:text-stone-400 mt-1 leading-relaxed">Berada di pusat kota Sidoarjo, dekat dari gerbang jalan tol utama Sidoarjo, stasiun kereta api komuter, serta Lippo Mall Sidoarjo.</p>
            </div>
          </div>

        </div>

        {/* Commuter Highlights */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4 font-sans text-left">
          
          <div className="flex gap-4 items-start">
            <div className="w-10 h-10 rounded-none border border-stone-200 dark:border-white/10 bg-stone-50 dark:bg-stone-900 text-gold flex items-center justify-center shrink-0">
              <Train className="h-4 w-4" />
            </div>
            <div>
              <h4 className="text-[11px] uppercase tracking-widest font-semibold text-stone-900 dark:text-white">Akses Stasiun & Transportasi</h4>
              <p className="text-xs text-stone-500 dark:text-stone-400 mt-0.5 font-light leading-relaxed">Tersedia jaringan ojek/taksi online 24 jam dan dekat stasiun kereta api komuter lokal untuk memudahkan perjalanan Anda.</p>
            </div>
          </div>

          <div className="flex gap-4 items-start">
            <div className="w-10 h-10 rounded-none border border-stone-200 dark:border-white/10 bg-stone-50 dark:bg-stone-900 text-gold flex items-center justify-center shrink-0">
              <ShoppingBag className="h-4 w-4" />
            </div>
            <div>
              <h4 className="text-[11px] uppercase tracking-widest font-semibold text-stone-900 dark:text-white">Pusat Belanja & Kuliner</h4>
              <p className="text-xs text-stone-500 dark:text-stone-400 mt-0.5 font-light leading-relaxed">Hanya berjarak 5-10 menit berkendara santai menuju mal pusat kota, pasar swalayan harian, dan ruko kuliner.</p>
            </div>
          </div>

          <div className="flex gap-4 items-start">
            <div className="w-10 h-10 rounded-none border border-stone-200 dark:border-white/10 bg-stone-50 dark:bg-stone-900 text-gold flex items-center justify-center shrink-0">
              <Clock className="h-4 w-4" />
            </div>
            <div>
              <h4 className="text-[11px] uppercase tracking-widest font-semibold text-stone-900 dark:text-white font-sans">Kesehatan & Tanggap Darurat</h4>
              <p className="text-xs text-stone-500 dark:text-stone-400 mt-0.5 font-light leading-relaxed font-sans">Kurang dari 15 menit dari klinik pratama 24 jam dan rumah sakit umum kab/kota untuk menjamin bantuan medis instan.</p>
            </div>
          </div>

        </div>

        <div className="pt-2 text-center">
          <button
            type="button"
            className="mx-auto bg-stone-900 text-gold dark:bg-white dark:text-black px-6 py-3 rounded-none font-semibold text-[10px] uppercase tracking-widest hover:bg-gold dark:hover:bg-gold dark:hover:text-black border border-[#d4af37]/35 transition-all cursor-pointer flex items-center gap-1.5"
            onClick={() => {
              window.open("https://maps.google.com", "_blank");
            }}
          >
            Buka Petunjuk Google Maps Global &rarr;
          </button>
        </div>
      </section>

    </div>
  );
}
export {};
