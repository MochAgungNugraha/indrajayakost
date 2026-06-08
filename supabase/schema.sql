-- ============================================
-- INDRA JAYA KOST - Supabase Database Schema
-- ============================================

-- Tabel Users
CREATE TABLE IF NOT EXISTS public.users (
  id TEXT PRIMARY KEY,
  auth_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  email TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  role TEXT DEFAULT 'guest' CHECK (role IN ('admin', 'tenant', 'guest')),
  room_number TEXT,
  avatar TEXT,
  entry_date TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tabel Rooms
CREATE TABLE IF NOT EXISTS public.rooms (
  id TEXT PRIMARY KEY,
  room_number TEXT UNIQUE NOT NULL,
  type TEXT DEFAULT 'Standard',
  price BIGINT DEFAULT 1500000,
  size TEXT DEFAULT '3x4m2',
  bed_type TEXT DEFAULT 'Single',
  location TEXT NOT NULL,
  facilities TEXT[] DEFAULT '{"AC","Wifi","Laundry"}',
  is_available BOOLEAN DEFAULT true,
  tenant_id TEXT,
  image TEXT,
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tabel Bookings
CREATE TABLE IF NOT EXISTS public.bookings (
  id TEXT PRIMARY KEY,
  room_id TEXT REFERENCES public.rooms(id),
  tenant_id TEXT,
  tenant_name TEXT,
  room_number TEXT,
  location TEXT,
  price BIGINT,
  status TEXT DEFAULT 'pending',
  entry_date TEXT,
  payment_status TEXT DEFAULT 'Belum Lunas',
  payment_proof TEXT,
  payment_method TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tabel Reports
CREATE TABLE IF NOT EXISTS public.reports (
  id TEXT PRIMARY KEY,
  tenant_id TEXT,
  tenant_name TEXT,
  room_number TEXT,
  title TEXT NOT NULL,
  description TEXT,
  status TEXT DEFAULT 'Pending',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tabel Transactions
CREATE TABLE IF NOT EXISTS public.transactions (
  id TEXT PRIMARY KEY,
  date TEXT,
  category TEXT CHECK (category IN ('PEMASUKAN', 'PENGELUARAN')),
  title TEXT NOT NULL,
  description TEXT,
  status TEXT DEFAULT 'Berhasil',
  amount BIGINT,
  payment_method TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tabel Notifications
CREATE TABLE IF NOT EXISTS public.notifications (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  message TEXT,
  type TEXT DEFAULT 'system',
  is_read BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.rooms ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- Policies: Allow public read on rooms
CREATE POLICY "rooms_select" ON public.rooms FOR SELECT USING (true);
CREATE POLICY "rooms_all" ON public.rooms FOR ALL USING (true);

-- Policies: Allow all for other tables (service role bypasses RLS anyway)
CREATE POLICY "users_all" ON public.users FOR ALL USING (true);
CREATE POLICY "bookings_all" ON public.bookings FOR ALL USING (true);
CREATE POLICY "reports_all" ON public.reports FOR ALL USING (true);
CREATE POLICY "transactions_all" ON public.transactions FOR ALL USING (true);
CREATE POLICY "notifications_all" ON public.notifications FOR ALL USING (true);
