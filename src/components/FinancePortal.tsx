import React, { useState } from 'react';
import { 
  DollarSign, 
  TrendingDown, 
  TrendingUp, 
  FileSpreadsheet, 
  Search, 
  Sparkles, 
  Calendar, 
  ArrowUpRight, 
  ArrowDownRight,
  Printer
} from 'lucide-react';
import { Transaction } from '../types';

interface FinancePortalProps {
  transactions: Transaction[];
  highContrast: boolean;
}

export default function FinancePortal({
  transactions,
  highContrast
}: FinancePortalProps) {
  const [filterCategory, setFilterCategory] = useState<'Semua' | 'PEMASUKAN' | 'PENGELUARAN'>('Semua');
  const [searchLedger, setSearchLedger] = useState('');

  // Calculations
  const incomeTotal = transactions
    .filter(t => t.category === 'PEMASUKAN' && t.status === 'Berhasil')
    .reduce((sum, t) => sum + t.amount, 0);

  const expenseTotal = transactions
    .filter(t => t.category === 'PENGELUARAN' && t.status === 'Berhasil')
    .reduce((sum, t) => sum + t.amount, 0);

  const netProfit = incomeTotal - expenseTotal;

  // Filtered transactions
  const filteredTxs = transactions.filter(t => {
    const matchesCat = filterCategory === 'Semua' || t.category === filterCategory;
    const matchesSearch = t.title.toLowerCase().includes(searchLedger.toLowerCase()) || 
                          t.description.toLowerCase().includes(searchLedger.toLowerCase()) ||
                          (t.paymentMethod && t.paymentMethod.toLowerCase().includes(searchLedger.toLowerCase()));
    return matchesCat && matchesSearch;
  });

  // Simple pure SVG interactive chart data nodes
  // Let's create monthly snapshots to feed our SVG chart safely
  const monthsData = [
    { name: 'Jan', pemasukan: 11000000, pengeluaran: 3000000 },
    { name: 'Feb', pemasukan: 12500000, pengeluaran: 3800000 },
    { name: 'Mar', pemasukan: 14000000, pengeluaran: 4200000 },
    { name: 'Apr', pemasukan: 13500000, pengeluaran: 2800000 },
    { name: 'Mei', pemasukan: 15100000, pengeluaran: 4500000 },
    { name: 'Jun', pemasukan: incomeTotal, pengeluaran: expenseTotal } // Dynamic current month from live DB
  ];

  const maxVal = Math.max(...monthsData.map(d => Math.max(d.pemasukan, d.pengeluaran))) * 1.1;

  // Expenditures Allocation Categorization stats
  const catExpenses = [
    { name: "Listrik & Air Umum", amount: 850000, percent: 22, color: "bg-indigo-500" },
    { name: "Gaji & Keamanan", amount: 2500000, percent: 65, color: "bg-emerald-500" },
    { name: "Suku Cadang & Pipa", amount: 450000, percent: 13, color: "bg-orange-500" }
  ];

  const handleExportSim = () => {
    alert("Mempersiapkan rilis cetak kuitansi. PDF Lembar Neraca Keuangan CV Indra Jaya Kost Persada siap diunduh.");
  };

  return (
    <div className="mx-auto max-w-7xl px-4 md:px-8 pt-24 pb-16 space-y-10 text-left">
      
      {/* 1. Header Balance Panel */}
      <section className="bg-slate-900 border border-slate-800 text-white rounded-[32px] p-6 md:p-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 shadow-2xl">
        <div className="space-y-1.5">
          <span className="px-3 py-1 text-[10px] font-black uppercase text-emerald-400 bg-emerald-950/45 rounded-lg">Laporan Buku Kas Utama</span>
          <h2 className="text-2xl md:text-3xl font-black tracking-tight">Akuntansi & Keuangan</h2>
          <p className="text-slate-400 text-xs font-semibold leading-relaxed">
            Monitor detail perputaran kas, alokasi pengeluaran, perbandingan trend bulanan, dan audit pembukuan.
          </p>
        </div>

        <button
          type="button"
          onClick={handleExportSim}
          className="bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs px-6 py-3.5 rounded-2xl flex items-center gap-2"
        >
          <Printer className="h-4 w-4" />
          Cetak Excel & PDF Buku Setoran
        </button>
      </section>

      {/* 2. Statistical Financial Toggles */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Total Income */}
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs text-left relative overflow-hidden">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-[10px] text-slate-400 font-extrabold uppercase">Total Pemasukan (Bulan Ini)</p>
              <h4 className="text-2xl font-black text-emerald-600 dark:text-emerald-400 mt-1">
                Rp {incomeTotal.toLocaleString('id-ID')}
              </h4>
            </div>
            <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 text-emerald-650 flex items-center justify-center shrink-0">
              <TrendingUp className="h-5 w-5" />
            </div>
          </div>
          <div className="text-[10px] text-slate-400 font-semibold mt-4">
            Terdiri dari pembayaran sewa aktif dikoordinasikan server.
          </div>
        </div>

        {/* Total Expenditures */}
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs text-left relative overflow-hidden">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-[10px] text-slate-400 font-extrabold uppercase">Pengeluaran Operasional</p>
              <h4 className="text-2xl font-black text-rose-500 mt-1">
                Rp {expenseTotal.toLocaleString('id-ID')}
              </h4>
            </div>
            <div className="w-10 h-10 rounded-xl bg-rose-50 dark:bg-rose-950/30 text-rose-500 flex items-center justify-center shrink-0">
              <TrendingDown className="h-5 w-5" />
            </div>
          </div>
          <div className="text-[10px] text-slate-400 font-semibold mt-4">
            Termasuk gaji penjaga, token listrik koridor, perawatan AC.
          </div>
        </div>

        {/* Net Profit */}
        <div className="p-6 rounded-3xl bg-slate-950 text-white shadow-xl text-left relative overflow-hidden border border-slate-800">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-[10px] text-emerald-400 font-extrabold uppercase">Keuntungan Bersih (Profit)</p>
              <h4 className="text-2xl font-black text-white mt-1">
                Rp {netProfit.toLocaleString('id-ID')}
              </h4>
            </div>
            <div className="w-10 h-10 rounded-xl bg-emerald-950 text-emerald-400 flex items-center justify-center shrink-0">
              <Sparkles className="h-5 w-5" />
            </div>
          </div>
          <div className="text-[10px] text-slate-400 font-semibold mt-4">
            Laba surplus bersih sisa penyisihan beban operasional kota.
          </div>
        </div>

      </section>

      {/* 3. Interactive Trend Charts (Beautiful Pure SVG layout) */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Monthly comparative chart panel */}
        <div className="lg:col-span-2 rounded-3xl bg-white dark:bg-slate-900 p-6 border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="flex justify-between items-center pb-4 border-b dark:border-slate-800 mb-6 flex-wrap gap-4 text-left">
            <div>
              <h3 className="text-base font-black text-slate-900 dark:text-white">Tren Keuangan Bulanan (Semester I)</h3>
              <p className="text-[10px] text-slate-400 mt-0.5">Metrik perbandingan kas masuk dan keluar CV Indra Jaya Kost Persada</p>
            </div>
            <div className="flex items-center gap-3 text-[10px] font-bold">
              <span className="flex items-center gap-1"><span className="w-3 h-3 rounded-sm bg-emerald-500 inline-block" /> Pemasukan</span>
              <span className="flex items-center gap-1"><span className="w-3 h-3 rounded-sm bg-indigo-500 inline-block" /> Pengeluaran</span>
            </div>
          </div>

          {/* SVG representation of Bar graphs */}
          <div className="relative w-full aspect-5/3 md:aspect-2/1 h-64 md:h-80">
            <svg viewBox="0 0 500 240" className="w-full h-full" aria-label="Visualisasi Tren Anggaran Keuangan">
              {/* grid lines */}
              <line x1="30" y1="20" x2="480" y2="20" stroke="#f1f5f9" strokeWidth="1" className="dark:stroke-slate-800" />
              <line x1="30" y1="80" x2="480" y2="80" stroke="#f1f5f9" strokeWidth="1" className="dark:stroke-slate-800" />
              <line x1="30" y1="140" x2="480" y2="140" stroke="#f1f5f9" strokeWidth="1" className="dark:stroke-slate-800" />
              <line x1="30" y1="200" x2="480" y2="200" stroke="#e2e8f0" strokeWidth="1" className="dark:stroke-slate-800" />

              {/* draw bar elements */}
              {monthsData.map((data, index) => {
                const xBase = 50 + index * 72;
                
                // Height nodes scaling
                const inHeight = (data.pemasukan / maxVal) * 160;
                const exHeight = (data.pengeluaran / maxVal) * 160;

                return (
                  <g key={index} className="group cursor-pointer">
                    {/* Tooltip trigger or values display on top of bars */}
                    <text 
                      x={xBase + 12} 
                      y={200 - inHeight - 5} 
                      className="text-[7px] font-bold fill-slate-500 scale-0 group-hover:scale-100 transition-all text-center origin-bottom"
                      textAnchor="middle"
                    >
                      {(data.pemasukan / 1000000).toFixed(1)}Jt
                    </text>

                    {/* Income bar */}
                    <rect
                      x={xBase}
                      y={200 - inHeight}
                      width="12"
                      height={inHeight}
                      rx="3"
                      fill="#10b981"
                      className="hover:fill-emerald-605 transition-all text-emerald-500"
                    />

                    {/* Expense bar */}
                    <rect
                      x={xBase + 15}
                      y={200 - exHeight}
                      width="12"
                      height={exHeight}
                      rx="3"
                      fill="#6366f1"
                      className="hover:fill-indigo-655 transition-all text-indigo-500"
                    />

                    {/* Month labels */}
                    <text
                      x={xBase + 13}
                      y="218"
                      className="text-[9px] font-bold fill-slate-400 dark:fill-slate-500"
                      textAnchor="middle"
                    >
                      {data.name}
                    </text>
                  </g>
                );
              })}
            </svg>
          </div>
        </div>

        {/* Expenditures Allocations Pie/Progress bars style */}
        <div className="rounded-3xl bg-white dark:bg-slate-900 p-6 border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col justify-between">
          <div>
            <h3 className="text-base font-black text-slate-900 dark:text-white border-b dark:border-slate-800 pb-4 mb-4">
              Alokasi Pengeluaran Bulanan
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-semibold mb-6">
              Rincian beban biaya operasional dan upah tenaga CV Indra Jaya Kost Persada pada siklus berjalan:
            </p>

            <div className="space-y-4">
              {catExpenses.map((cat, i) => (
                <div key={i} className="space-y-1.5 text-xs font-semibold">
                  <div className="flex justify-between items-baseline">
                    <span className="text-slate-700 dark:text-slate-300 font-bold">{cat.name}</span>
                    <span className="text-slate-500 dark:text-slate-400 font-black">
                      Rp {cat.amount.toLocaleString('id-ID')} ({cat.percent}%)
                    </span>
                  </div>
                  <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-2 overflow-hidden">
                    <div className={`${cat.color} h-full`} style={{ width: `${cat.percent}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-indigo-50/45 dark:bg-indigo-950/20 border border-indigo-100 dark:border-indigo-900/10 mt-6 text-xs text-slate-500 leading-relaxed font-semibold">
            Tip Manajemen: Penghematan listrik koridor luar dengan lampu sensor cahaya otomatis beroperasi berhasil memangkas 9% beban total bulanan.
          </div>
        </div>

      </section>

      {/* 4. Ledger Transaction History list table */}
      <section className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 shadow-xs text-left">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b dark:border-slate-800 pb-4 mb-6">
          <div>
            <h3 className="text-lg font-black text-slate-900 dark:text-white">Buku Register Buku Kas (Ledger)</h3>
            <p className="text-[11px] text-slate-500 mt-0.5">Daftar transaksi mutasi setoran dan kuitansi operasional harian.</p>
          </div>

          {/* Table queries filter buttons list */}
          <div className="flex flex-wrap gap-2 items-center w-full md:w-auto">
            <div className="relative flex-1 md:flex-initial">
              <Search className="h-3.5 w-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Cari transaksi..."
                className="pl-8.5 pr-4 py-2 text-xs font-semibold bg-slate-50 dark:bg-slate-950 border border-slate-200 focus:border-emerald-650 rounded-xl dark:border-slate-800 text-slate-900 dark:text-white outline-hidden"
                value={searchLedger}
                onChange={(e) => setSearchLedger(e.target.value)}
              />
            </div>

            <div className="flex gap-1.5">
              {(['Semua', 'PEMASUKAN', 'PENGELUARAN'] as const).map((cat) => (
                <button
                  key={cat}
                  type="button"
                  className={`px-3 py-1.5 rounded-lg border text-[11px] font-black transition-all ${
                    filterCategory === cat
                      ? 'bg-emerald-600 text-white border-emerald-600'
                      : 'border-slate-200 hover:bg-slate-50 dark:border-slate-800 text-slate-700 dark:text-slate-300'
                  }`}
                  onClick={() => setFilterCategory(cat)}
                >
                  {cat === 'Semua' ? 'Semua' : cat === 'PEMASUKAN' ? 'Kas Masuk' : 'Beban/Kas Keluar'}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Ledger Table lists display */}
        {filteredTxs.length === 0 ? (
          <p className="text-xs text-slate-400 text-center py-8 font-semibold">Tidak ada transaksi mutasi yang cocok.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-xs font-semibold text-left">
              <thead>
                <tr className="border-b dark:border-slate-800 text-slate-400 uppercase tracking-widest text-[9px] font-bold">
                  <th className="py-3 px-3">Tanggal</th>
                  <th className="py-3 px-3">Kategori</th>
                  <th className="py-3 px-3">Deskripsi Transaksi</th>
                  <th className="py-3 px-3">Metode</th>
                  <th className="py-3 px-3 text-right">Nominal Anggaran</th>
                </tr>
              </thead>
              <tbody className="divide-y dark:divide-slate-800 text-slate-700 dark:text-slate-350">
                {filteredTxs.map((tx) => (
                  <tr key={tx.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-950/20 transition-all">
                    <td className="py-3.5 px-3 font-mono">{tx.date}</td>
                    <td className="py-3.5 px-3">
                      <span className={`px-2 py-0.5 rounded-sm text-[9px] font-black tracking-wide ${
                        tx.category === 'PEMASUKAN'
                          ? 'bg-emerald-50 text-emerald-800 dark:bg-emerald-950/20 dark:text-emerald-300'
                          : 'bg-rose-50 text-rose-800 dark:bg-rose-950/20'
                      }`}>
                        {tx.category === 'PEMASUKAN' ? 'Masuk' : 'Keluar'}
                      </span>
                    </td>
                    <td className="py-3.5 px-3">
                      <p className="font-bold text-slate-900 dark:text-white">{tx.title}</p>
                      <span className="text-[10px] text-slate-400 font-medium">{tx.description}</span>
                    </td>
                    <td className="py-3.5 px-3 font-medium text-slate-500">{tx.paymentMethod || 'Kas Operasional'}</td>
                    <td className={`py-3.5 px-3 text-right font-black ${
                      tx.category === 'PEMASUKAN' ? 'text-emerald-600 dark:text-emerald-450' : 'text-rose-500'
                    }`}>
                      {tx.category === 'PEMASUKAN' ? '+' : '-'} Rp {tx.amount.toLocaleString('id-ID')}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

    </div>
  );
}
export {};
