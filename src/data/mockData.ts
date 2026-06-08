import { Room, User, Booking, DamageReport, Transaction, NotificationItem } from '../types';

// Let's create exactly 21 rooms
// Jimbaran: 12 rooms (J-01 to J-12)
// Pagerwojo: 4 rooms (P-01 to P-04)
// Magersari: 5 rooms (M-01 to M-05)

const jimbaranMap = [
  { id: 'j1', roomNumber: 'J-01', type: 'Standard' as const, price: 1500000, size: '3x4m²', bedType: 'Single', isAvailable: true },
  { id: 'j2', roomNumber: 'J-02', type: 'Standard' as const, price: 1500000, size: '3x4m²', bedType: 'Single', isAvailable: false, tenantId: 'tenant1' },
  { id: 'j3', roomNumber: 'J-03', type: 'Deluxe' as const, price: 2200000, size: '4x5m²', bedType: 'Queen', isAvailable: true },
  { id: 'j4', roomNumber: 'J-04', type: 'Deluxe' as const, price: 2200000, size: '4x5m²', bedType: 'Queen', isAvailable: false, tenantId: 'tenant3' },
  { id: 'j5', roomNumber: 'J-05', type: 'Executive' as const, price: 3500000, size: '5x6m²', bedType: 'King', isAvailable: false, tenantId: 'tenant2' },
  { id: 'j6', roomNumber: 'J-06', type: 'Executive' as const, price: 3500000, size: '5x6m²', bedType: 'King', isAvailable: true },
  { id: 'j7', roomNumber: 'J-07', type: 'Suite' as const, price: 4800000, size: '6x8m²', bedType: 'Super King', isAvailable: true },
  { id: 'j8', roomNumber: 'J-08', type: 'Standard' as const, price: 1500000, size: '3x4m²', bedType: 'Single', isAvailable: true },
  { id: 'j9', roomNumber: 'J-09', type: 'Deluxe' as const, price: 2200000, size: '4x5m²', bedType: 'Queen', isAvailable: true },
  { id: 'j10', roomNumber: 'J-10', type: 'Executive' as const, price: 3500000, size: '5x6m²', bedType: 'King', isAvailable: true },
  { id: 'j11', roomNumber: 'J-11', type: 'Suite' as const, price: 4800000, size: '6x8m²', bedType: 'Super King', isAvailable: true },
  { id: 'j12', roomNumber: 'J-12', type: 'Deluxe' as const, price: 2200000, size: '4x5m²', bedType: 'Queen', isAvailable: false, tenantId: 'tenant4' },
];

const pagerwojoMap = [
  { id: 'p1', roomNumber: 'P-01', type: 'Standard' as const, price: 1600000, size: '3x4m²', bedType: 'Single', isAvailable: true },
  { id: 'p2', roomNumber: 'P-02', type: 'Deluxe' as const, price: 2300000, size: '4x5m²', bedType: 'Queen', isAvailable: false, tenantId: 'tenant5' },
  { id: 'p3', roomNumber: 'P-03', type: 'Executive' as const, price: 3600000, size: '5x6m²', bedType: 'King', isAvailable: true },
  { id: 'p4', roomNumber: 'P-04', type: 'Suite' as const, price: 4900000, size: '6x8m²', bedType: 'Super King', isAvailable: true },
];

const magersariMap = [
  { id: 'm1', roomNumber: 'M-01', type: 'Standard' as const, price: 1400000, size: '3x4m²', bedType: 'Single', isAvailable: true },
  { id: 'm2', roomNumber: 'M-02', type: 'Deluxe' as const, price: 2100000, size: '4x5m²', bedType: 'Queen', isAvailable: false, tenantId: 'tenant6' },
  { id: 'm3', roomNumber: 'M-03', type: 'Executive' as const, price: 3400000, size: '5x6m²', bedType: 'King', isAvailable: true },
  { id: 'm4', roomNumber: 'M-04', type: 'Suite' as const, price: 4700000, size: '6x8m²', bedType: 'Super King', isAvailable: true },
  { id: 'm5', roomNumber: 'M-05', type: 'Standard' as const, price: 1400000, size: '3x4m²', bedType: 'Single', isAvailable: true },
];

// Combine all 21 rooms
export const initialRooms: Room[] = [
  ...jimbaranMap.map((r, i) => ({
    ...r,
    location: 'Jimbaran' as const,
    facilities: ['AC', 'Wifi', r.type === 'Suite' || r.type === 'Executive' ? 'Water Heater' : '', 'Laundry'].filter(Boolean),
    image: getRoomImage(r.type, i)
  })),
  ...pagerwojoMap.map((r, i) => ({
    ...r,
    location: 'Pagerwojo Ngemplak' as const,
    facilities: ['AC', 'Wifi', r.type === 'Suite' || r.type === 'Executive' ? 'Water Heater' : '', 'Laundry'].filter(Boolean),
    image: getRoomImage(r.type, i + 12)
  })),
  ...magersariMap.map((r, i) => ({
    ...r,
    location: 'Perumahan Magersari' as const,
    facilities: ['AC', 'Wifi', r.type === 'Suite' || r.type === 'Executive' ? 'Water Heater' : '', 'Laundry'].filter(Boolean),
    image: getRoomImage(r.type, i + 16)
  }))
];

function getRoomImage(type: string, seed: number): string {
  const images = [
    'https://lh3.googleusercontent.com/aida-public/AB6AXuA1UM6uYhwMt0t7efCQSmQskWdAZG3tUyQJuJnR2PLnJCQYFmsI3vn7e8LmFeNu43uVkq0fF0Mf8yQaQSolCG_x_04fpB2KgxuZqQhvPpuB6TKWiKlgMJyrX8OJjgrcworTY7QGrmUXACpBYSwpyEkWGPGgOFEpDIGEFi3OAGGG2DI9vdQWtoZu0W1JbxLeCM0Cf-C0O1Lvp4kWz9HNi6JOQQ5Pu6Oxq_wNDJqKzDkna2Z_fdGBIZBaToInFAYeW-VviGgzd3B5XnY',
    'https://lh3.googleusercontent.com/aida-public/AB6AXuAh9N3-596klyO7g-ayWyqOtHnMN1rHY0pQtBv7jSfLktClWWBGPUSxBw_S0Jg9sEEGxcd21bUxQkgH11MnUefUtSKIvf9Seyl4kLYMnzCYLECHpcBQHY5vtp_HkSgxJyEar0hfsSrVMqQXFvt_stbFvyBFO-hDW5wDUyUy3NG-huJwopTWYD7AVHBbcmZgzJiHwdfATuUOyuPo3WrYysE7u7aY3ETrqof18deJPaDhccM1rAaF-Vm502atr3rxcvTzFr4l9ZrTDpg',
    'https://lh3.googleusercontent.com/aida-public/AB6AXuDoBhIrnJ7zaLAkOgIyPb7UX6AQJKWe05NElS6J28LE6bfxg87p8Yrp7loEMMdDcS5xSIX0736i1xEEk_kn_T2r_a__s4HfqMF2OCf1NY-Xybcrfzr9dSrL5VJ6sV6sQPPu3jSt4j_2AqdDGOx-9bxrcBQYK5K5RQ6kLM7g2B7zG7anY_afq18mT1NGrOsMssi1IYD33syNO67fSqi9X0dOgR99W84Z_AnhE3tLnRmcpZN9eBRZAmbQKwuiKuJ8B8sJzESrxnttD7o',
    'https://lh3.googleusercontent.com/aida-public/AB6AXuD9xNVrx29BzFQoK4C_8RoH7xlzl14EMYy_KQ8D0S5D4f0HoYehFDfCTpT8F4tC5ZOQn_Ivt7FDorsdcE0JIWyeCg4owgdrItudp4l2a-qj6U3-c0wDweYzIOgo2xnDv1VXIQU7f3XkNrovE48V7xAUe50j4Ele60ofX74u-PAifvy9jUHDrrJLTtSm1j1CKEXUivzc9SsP5F-IxUpHnwK_p-GHsvquWzWpfrLYXMXoTo7HS9u1UNRZfPHIglNfsDqiNJhSIyfDs5U'
  ];
  if (type === 'Standard') return images[1];
  if (type === 'Deluxe') return images[2];
  if (type === 'Executive') return images[0];
  return images[3];
}

export const initialUsers: User[] = [
  { id: 'admin', email: 'admin@indrajayakost.com', name: 'Admin Indra Jaya', role: 'admin', avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBG-XYfewPEwhKMhZzw9N5EXiUaD8SivjsDTinoeB2drDFwjQXSMm-xl6Z1YXSpAwmNHsbVmDqN4-GwpJR7dSO5WF8JWdAA2ECpgZVAh3zw1gf-yFoVjQSZ9WbMhZ-jpXiGBKckItyZR7FrUUT3mleDKLlaKYuPehC0YtmSV9NvvC0kG_J74tsyX_tWjQwRB_Y9eF64MEKZLbuyRPuLGlar1MUaqvJYr0InG2cQ1TqDYWjc57YLSBi05AnLotx0IPH1jNNpSb7XjP4' },
  { id: 'tenant1', email: 'budi@gmail.com', name: 'Budi Santoso', role: 'tenant', roomNumber: 'J-02', avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCHU1x3Medmc3q_d01lLtVI6-mMUXYTk9P05NbIlsQnmsSepKVYyFI9Z1jLK98eHC1aw46J7AXiPzxelOoIq_bsLPbMOp6Q7GqAegmPDstOGGL9VQkyaNK8tx_knvkDht7RnyxeBJG3Afr9I78D2431z9Fy4R-89LzjDjEmCwu4W2FFgjZ-jcNa8nDqNZ5ve3KTrUnb3soMqep7f0uStiCxBrUyiyDYdj7NmubszL9gGL7pECH9H2ZObv_q1BYqS7I7KvhRRLIAmRs', entryDate: '12 Jan 2024' },
  { id: 'tenant2', email: 'siti@gmail.com', name: 'Siti Aminah', role: 'tenant', roomNumber: 'J-05', entryDate: '05 Mar 2024' },
  { id: 'tenant3', email: 'joko@gmail.com', name: 'Joko Widada', role: 'tenant', roomNumber: 'J-04', entryDate: '20 Feb 2024' },
  { id: 'tenant4', email: 'eka@gmail.com', name: 'Eka Putri', role: 'tenant', roomNumber: 'J-12', entryDate: '15 Mei 2024' },
  { id: 'tenant5', email: 'ahmad@gmail.com', name: 'Ahmad Fauzi', role: 'tenant', roomNumber: 'P-02', entryDate: '01 Apr 2024' },
  { id: 'tenant6', email: 'dewi@gmail.com', name: 'Dewi Lestari', role: 'tenant', roomNumber: 'M-02', entryDate: '10 Feb 2024' }
];

export const initialBookings: Booking[] = [
  { id: 'book1', roomId: 'j2', tenantId: 'tenant1', tenantName: 'Budi Santoso', roomNumber: 'J-02', location: 'Jimbaran', price: 1500000, status: 'active', entryDate: '12 Jan 2024', paymentStatus: 'Belum Lunas' },
  { id: 'book2', roomId: 'j5', tenantId: 'tenant2', tenantName: 'Siti Aminah', roomNumber: 'J-05', location: 'Jimbaran', price: 3500000, status: 'active', entryDate: '05 Mar 2024', paymentStatus: 'Lunas' },
  { id: 'book3', roomId: 'j4', tenantId: 'tenant3', tenantName: 'Joko Widada', roomNumber: 'J-04', location: 'Jimbaran', price: 2200000, status: 'active', entryDate: '20 Feb 2024', paymentStatus: 'Belum Lunas' },
  { id: 'book4', roomId: 'j12', tenantId: 'tenant4', tenantName: 'Eka Putri', roomNumber: 'J-12', location: 'Jimbaran', price: 2200000, status: 'active', entryDate: '15 Mei 2024', paymentStatus: 'Lunas' },
  { id: 'book5', roomId: 'p2', tenantId: 'tenant5', tenantName: 'Ahmad Fauzi', roomNumber: 'P-02', location: 'Pagerwojo Ngemplak', price: 2300000, status: 'active', entryDate: '01 Apr 2024', paymentStatus: 'Lunas' },
  { id: 'book6', roomId: 'm2', tenantId: 'tenant6', tenantName: 'Dewi Lestari', roomNumber: 'M-02', location: 'Perumahan Magersari', price: 2100000, status: 'active', entryDate: '10 Feb 2024', paymentStatus: 'Lunas' },
];

export const initialReports: DamageReport[] = [
  { id: 'rep1', tenantId: 'tenant1', tenantName: 'Budi Santoso', roomNumber: 'J-02', title: 'AC Kurang Dingin', description: 'AC menyala tetapi udara di kamar tetap hangat.', status: 'Diproses', createdAt: '2026-06-05T10:00:00Z' },
  { id: 'rep2', tenantId: 'tenant2', tenantName: 'Siti Aminah', roomNumber: 'J-05', title: 'Fitting Lampu Kamar Mandi', description: 'Lampu berkedip terus menerus.', status: 'Selesai', createdAt: '2026-06-04T08:30:00Z' }
];

export const initialTransactions: Transaction[] = [
  { id: 't1', date: '2026-06-01', category: 'PEMASUKAN', title: 'Sewa J-05 - Siti Aminah', description: 'Pembayaran Bulanan Kamar J-05', status: 'Berhasil', amount: 3500000, paymentMethod: 'Transfer BCA' },
  { id: 't2', date: '2026-06-02', category: 'PENGELUARAN', title: 'Pembelian Token Listrik', description: 'Token Listrik Gedung Utama & Koridor', status: 'Berhasil', amount: 850000 },
  { id: 't3', date: '2026-06-03', category: 'PEMASUKAN', title: 'Sewa J-12 - Eka Putri', description: 'Sewa Kamar J-12', status: 'Berhasil', amount: 2200000, paymentMethod: 'Transfer Mandiri' },
  { id: 't4', date: '2026-06-04', category: 'PENGELUARAN', title: 'Gaji Penjaga Kost', description: 'Pembayaran Gaji Bulanan Penjaga', status: 'Berhasil', amount: 2500000 },
  { id: 't5', date: '2026-06-05', category: 'PEMASUKAN', title: 'Sewa M-02 - Dewi Lestari', description: 'Pembayaran Bulanan M-02', status: 'Berhasil', amount: 2100000, paymentMethod: 'QRIS' },
  { id: 't6', date: '2026-06-06', category: 'PENGELUARAN', title: 'Perbaikan Pipa Air', description: 'Mengganti pipa yang bocor di Jimbaran', status: 'Berhasil', amount: 450000 }
];

export const initialNotifications: NotificationItem[] = [
  { id: 'n1', title: 'Pemeliharaan AC Kost', message: 'Pembersihan AC rutin untuk wilayah Jimbaran dijadwalkan tanggal 10 Juni 2026.', type: 'maintenance', createdAt: '2026-06-06T12:00:00Z', isRead: false },
  { id: 'n2', title: 'Tagihan Pembayaran', message: 'Tagihan sewa untuk Kamar J-02 jatuh tempo pada tanggal 15 Juni 2026.', type: 'payment', createdAt: '2026-06-05T09:00:00Z', isRead: false }
];
