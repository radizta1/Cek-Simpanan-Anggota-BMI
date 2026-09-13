import React, { useState } from 'react';
import { 
  Member, 
  MemberSavingsSummary, 
  SavingsTransaction,
  SavingsType 
} from '../types';
import { formatRupiah, formatDateIndo } from '../services/gasService';
import { 
  Wallet, 
  PiggyBank, 
  Coins, 
  TrendingUp, 
  Calendar, 
  CreditCard, 
  Printer, 
  PlusCircle, 
  Search, 
  CheckCircle2, 
  Clock, 
  Sparkles,
  Building,
  ShieldCheck,
  ChevronRight,
  FileSpreadsheet
} from 'lucide-react';

interface MemberDashboardProps {
  member: Member;
  summary: MemberSavingsSummary;
  transactions: SavingsTransaction[];
  onOpenCardModal: () => void;
  onOpenPaymentModal: () => void;
  onOpenPrintModal: () => void;
  onOpenGasModal: () => void;
}

export const MemberDashboard: React.FC<MemberDashboardProps> = ({
  member,
  summary,
  transactions,
  onOpenCardModal,
  onOpenPaymentModal,
  onOpenPrintModal,
  onOpenGasModal,
}) => {
  const [filterType, setFilterType] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  // Filter transactions
  const filteredTransactions = transactions.filter(trx => {
    const matchesType = filterType === 'ALL' || trx.type === filterType;
    const matchesSearch = 
      trx.receiptNo.toLowerCase().includes(searchQuery.toLowerCase()) ||
      trx.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      trx.date.includes(searchQuery);
    return matchesType && matchesSearch;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* 1. Member Profile & Welcome Banner */}
      <div className="bg-gradient-to-r from-emerald-800 via-emerald-700 to-teal-800 rounded-3xl p-6 sm:p-8 text-white shadow-xl shadow-emerald-950/10 relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          
          <div className="flex items-start sm:items-center gap-4">
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-2xl sm:text-3xl font-extrabold text-white shadow-inner shrink-0">
              {member.name.charAt(0)}
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2 mb-1">
                <h1 className="text-xl sm:text-2xl lg:text-3xl font-extrabold tracking-tight font-['Space_Grotesk']">
                  {member.name}
                </h1>
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-400/20 text-emerald-200 border border-emerald-300/30">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-300" />
                  Status: {member.status}
                </span>
              </div>
              
              <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs sm:text-sm text-emerald-100/80">
                <span className="font-mono bg-black/20 px-2 py-0.5 rounded-md text-emerald-200 font-semibold">
                  No. Anggota: {member.id}
                </span>
                <span>•</span>
                <span>{member.username}</span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <Building className="w-3.5 h-3.5 opacity-80" />
                  {member.branch || 'Kantor Pusat Koperasi'}
                </span>
              </div>
            </div>
          </div>

          {/* Quick Member Action Buttons */}
          <div className="flex flex-wrap items-center gap-2.5">
            <button
              id="btn-open-card-modal"
              onClick={onOpenCardModal}
              className="inline-flex items-center gap-2 px-3.5 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs sm:text-sm font-semibold backdrop-blur-md border border-white/20 transition-all cursor-pointer"
            >
              <CreditCard className="w-4 h-4 text-emerald-300" />
              <span>Kartu Anggota (KTA)</span>
            </button>

            <button
              id="btn-open-print-modal"
              onClick={onOpenPrintModal}
              className="inline-flex items-center gap-2 px-3.5 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs sm:text-sm font-semibold backdrop-blur-md border border-white/20 transition-all cursor-pointer"
            >
              <Printer className="w-4 h-4 text-emerald-300" />
              <span>Cetak Buku Simpanan</span>
            </button>

            <button
              id="btn-open-payment-modal"
              onClick={onOpenPaymentModal}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-900 text-xs sm:text-sm font-bold shadow-md shadow-amber-950/20 transition-all cursor-pointer"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Setor Simpanan</span>
            </button>
          </div>

        </div>

        {/* Ambient subtle shape */}
        <div className="absolute right-0 top-0 translate-x-12 -translate-y-12 w-64 h-64 bg-emerald-600/30 rounded-full blur-3xl pointer-events-none" />
      </div>

      {/* 2. Total Savings Highlight Cards (Pokok, Wajib, Total) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Card: Simpanan Pokok */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200/90 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 rounded-xl bg-blue-50 border border-blue-200 text-blue-700 flex items-center justify-center">
              <PiggyBank className="w-6 h-6" />
            </div>
            <span className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full bg-blue-50 text-blue-700 border border-blue-100">
              <CheckCircle2 className="w-3.5 h-3.5 text-blue-600" />
              Lunas (1x Bayar)
            </span>
          </div>

          <p className="text-xs font-bold uppercase tracking-wider text-slate-500">
            Total Simpanan Pokok
          </p>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1 font-['Space_Grotesk']">
            {formatRupiah(summary.totalPokok)}
          </h2>

          <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span>Status Setoran</span>
            <span className="font-semibold text-slate-700">Tercatat di Buku Induk</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-2">
            *Dibayarkan saat awal pendaftaran keanggotaan dan tidak dapat ditarik kembali selama aktif menjadi anggota koperasi.
          </p>
        </div>

        {/* Card: Simpanan Wajib */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200/90 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 flex items-center justify-center">
              <Coins className="w-6 h-6" />
            </div>
            <span className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-100">
              {formatRupiah(summary.wajibMonthlyRate)} / bln
            </span>
          </div>

          <p className="text-xs font-bold uppercase tracking-wider text-slate-500">
            Total Simpanan Wajib
          </p>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1 font-['Space_Grotesk'] text-emerald-800">
            {formatRupiah(summary.totalWajib)}
          </h2>

          <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span>Total Periode Terbayar:</span>
            <span className="font-bold text-slate-800">{summary.monthsPaid} Kali Setoran</span>
          </div>
          
          <div className="mt-2 flex items-center justify-between text-xs">
            <span className="text-slate-500">Pembayaran Terakhir:</span>
            <span className="font-semibold text-emerald-700">{formatDateIndo(summary.lastPaymentDate)}</span>
          </div>
        </div>

        {/* Card: Total Akumulasi Keseluruhan */}
        <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl p-6 text-white shadow-md relative overflow-hidden">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 rounded-xl bg-white/10 border border-white/20 text-amber-300 flex items-center justify-center">
              <TrendingUp className="w-6 h-6" />
            </div>
            <span className="inline-flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-full bg-amber-400/20 text-amber-300 border border-amber-400/30">
              <Sparkles className="w-3.5 h-3.5" />
              Total Ekuitas
            </span>
          </div>

          <p className="text-xs font-bold uppercase tracking-wider text-slate-300">
            Total Akumulasi Simpanan
          </p>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white mt-1 font-['Space_Grotesk']">
            {formatRupiah(summary.grandTotal)}
          </h2>

          <div className="mt-4 pt-4 border-t border-white/10 space-y-1.5 text-xs text-slate-300">
            <div className="flex justify-between">
              <span>Pokok ({Math.round((summary.totalPokok / summary.grandTotal) * 100 || 0)}%):</span>
              <span className="font-semibold text-white">{formatRupiah(summary.totalPokok)}</span>
            </div>
            <div className="flex justify-between">
              <span>Wajib ({Math.round((summary.totalWajib / summary.grandTotal) * 100 || 0)}%):</span>
              <span className="font-semibold text-emerald-400">{formatRupiah(summary.totalWajib)}</span>
            </div>
          </div>
        </div>

      </div>

      {/* 3. Transaction History Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        
        {/* Table Header & Controls */}
        <div className="p-6 border-b border-slate-200 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h3 className="text-lg font-bold text-slate-900 font-['Space_Grotesk']">
              Buku Catatan Simpanan Anggota
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Histori seluruh mutasi simpanan pokok dan simpanan wajib yang telah disetorkan.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            
            {/* Filter Tabs */}
            <div className="inline-flex p-1 rounded-xl bg-slate-100 border border-slate-200 text-xs font-semibold text-slate-600">
              <button
                onClick={() => setFilterType('ALL')}
                className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                  filterType === 'ALL' ? 'bg-white text-slate-900 shadow-xs' : 'hover:text-slate-900'
                }`}
              >
                Semua ({transactions.length})
              </button>
              <button
                onClick={() => setFilterType('POKOK')}
                className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                  filterType === 'POKOK' ? 'bg-white text-blue-700 shadow-xs' : 'hover:text-slate-900'
                }`}
              >
                Pokok
              </button>
              <button
                onClick={() => setFilterType('WAJIB')}
                className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                  filterType === 'WAJIB' ? 'bg-white text-emerald-700 shadow-xs' : 'hover:text-slate-900'
                }`}
              >
                Wajib
              </button>
            </div>

            {/* Search Input */}
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Cari transaksi / kuitansi..."
                className="w-full sm:w-56 pl-9 pr-3 py-1.5 text-xs bg-white border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:border-emerald-600"
              />
            </div>

          </div>
        </div>

        {/* Table Content */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider">
                <th className="py-3 px-4 sm:px-6">No. Kuitansi</th>
                <th className="py-3 px-4">Tanggal</th>
                <th className="py-3 px-4">Jenis Simpanan</th>
                <th className="py-3 px-4">Keterangan</th>
                <th className="py-3 px-4 text-right">Nominal</th>
                <th className="py-3 px-4 text-right sm:pr-6">Petugas</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {filteredTransactions.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-400">
                    Tidak ada catatan transaksi yang sesuai.
                  </td>
                </tr>
              ) : (
                filteredTransactions.map((t) => {
                  const isPokok = t.type === 'POKOK';
                  return (
                    <tr key={t.id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="py-3.5 px-4 sm:px-6 font-mono font-semibold text-slate-700">
                        {t.receiptNo}
                      </td>
                      <td className="py-3.5 px-4 text-slate-600 whitespace-nowrap">
                        {formatDateIndo(t.date)}
                      </td>
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
                          isPokok 
                            ? 'bg-blue-50 text-blue-700 border border-blue-200' 
                            : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        }`}>
                          {isPokok ? 'SIMPANAN POKOK' : 'SIMPANAN WAJIB'}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-slate-800 font-medium max-w-xs">
                        {t.description}
                      </td>
                      <td className="py-3.5 px-4 text-right font-bold font-mono text-sm whitespace-nowrap text-emerald-700">
                        + {formatRupiah(t.amount)}
                      </td>
                      <td className="py-3.5 px-4 sm:pr-6 text-right text-slate-500 whitespace-nowrap">
                        {t.tellerName}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Table Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-2">
          <span>
            Menampilkan <strong>{filteredTransactions.length}</strong> dari <strong>{transactions.length}</strong> total mutasi
          </span>
          <button
            onClick={onOpenPrintModal}
            className="text-emerald-700 hover:text-emerald-800 font-semibold inline-flex items-center gap-1 cursor-pointer"
          >
            <span>Unduh Laporan Mutasi Rekening</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

      </div>

      {/* 4. Information Box: Peraturan Simpanan Pokok & Wajib Koperasi */}
      <div className="bg-amber-50/60 rounded-2xl p-6 border border-amber-200/80 text-amber-900 text-xs">
        <h4 className="font-bold text-sm text-amber-950 mb-2 flex items-center gap-1.5">
          <ShieldCheck className="w-4 h-4 text-amber-700" />
          Ketentuan Simpanan Anggota Sesuai UU Perkoperasian:
        </h4>
        <ul className="list-disc list-inside space-y-1 text-amber-900/90 leading-relaxed">
          <li>
            <strong>Simpanan Pokok</strong> adalah sejumlah uang yang sama banyaknya yang wajib dibayarkan oleh anggota kepada koperasi pada saat masuk menjadi anggota, tidak dapat diambil kembali selama yang bersangkutan masih menjadi anggota.
          </li>
          <li>
            <strong>Simpanan Wajib</strong> adalah jumlah simpanan tertentu yang harus dibayarkan oleh anggota kepada koperasi dalam waktu dan kesempatan tertentu (misalnya tiap bulan).
          </li>
          <li>
            Setiap anggota yang tertib membayar simpanan wajib berhak memperoleh <strong>Sisa Hasil Usaha (SHU)</strong> yang dibagikan pada Rapat Anggota Tahunan (RAT).
          </li>
        </ul>
      </div>

    </div>
  );
};
