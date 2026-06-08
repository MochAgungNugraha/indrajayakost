export interface User {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'tenant' | 'guest';
  roomNumber?: string; // for tenants
  avatar?: string;
  entryDate?: string;
}

export type RoomType = 'Standard' | 'Deluxe' | 'Executive' | 'Suite';

export interface Room {
  id: string;
  roomNumber: string;
  type: RoomType;
  price: number; // in IDR per month, e.g., 1500000
  location: 'Jimbaran' | 'Pagerwojo Ngemplak' | 'Perumahan Magersari';
  size: string; // e.g., "3x4m²"
  bedType: string; // e.g., "Single" or "Queen"
  facilities: string[]; // e.g., ["AC", "Wifi", "Water Heater", "Laundry"]
  isAvailable: boolean;
  tenantId?: string;
  image: string;
  description?: string;
}

export interface Booking {
  id: string;
  roomId: string;
  tenantId: string;
  tenantName: string;
  roomNumber: string;
  location: string;
  price: number;
  status: 'pending' | 'active' | 'completed' | 'cancelled'; // pending triggers payment, active means occupied, etc.
  entryDate: string;
  paymentStatus: 'Lunas' | 'Belum Lunas' | 'Menunggu Konfirmasi';
  paymentProof?: string;
  paymentMethod?: string;
}

export interface DamageReport {
  id: string;
  tenantId: string;
  tenantName: string;
  roomNumber: string;
  title: string;
  description: string;
  status: 'Pending' | 'Diproses' | 'Selesai';
  createdAt: string;
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  type: 'payment' | 'maintenance' | 'system' | 'booking';
  createdAt: string;
  isRead: boolean;
}

export interface NotificationConfig {
  emailNotify: boolean;
  pushNotify: boolean;
  paymentReminder: boolean;
  maintenanceAlert: boolean;
  autoSound: boolean;
}

export interface Transaction {
  id: string;
  date: string;
  category: 'PEMASUKAN' | 'PENGELUARAN';
  title: string;
  description: string;
  status: 'Berhasil' | 'Pending' | 'Gagal';
  amount: number;
  paymentMethod?: string;
}

export interface SyncResponse {
  rooms: Room[];
  bookings: Booking[];
  reports: DamageReport[];
  transactions: Transaction[];
  notifications: NotificationItem[];
}
