import React from 'react';
import { X, Printer, Building2, ShieldCheck, Download } from 'lucide-react';
import { Member, MemberSavingsSummary, SavingsTransaction } from '../types';
import { formatRupiah, formatDateIndo } from '../services/gasService';

interface PrintReceiptModalProps {
  isOpen: boolean;
  onClose: () => void;
  member: Member;
  summary: MemberSavingsSummary;
  transactions: SavingsTransaction[];
}

export const PrintReceiptModal: React.FC<PrintReceiptModalProps> = ({
  isOpen,
  onClose,
  member,
  summary,
  transactions,
}) => {
  if (!isOpen) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto animate-in fade-in duration-150">
      <div className="bg-white rounded-3xl max-w-3xl w-full shadow-2xl overflow-hidden border border-slate-200 my-8">
        
        {/* Modal Controls (Hidden in Print) */}
        <div className="print:hidden flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-slate-50">
          <div className="flex items-center gap-2">
            <Printer className="w-5 h-5 text-emerald-700" />
            <h3 className="font-bold text-slate-800 text-sm">
              Pratinjau Buku Simpanan & Rekapitulasi
            </h3>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="px-4 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs flex items-center gap-1.5 shadow-xs cursor-pointer"
            >
              <Printer className="w-4 h-4" />
              <span>Cetak Dokumen</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-full hover:bg-slate-200 text-slate-500 hover:text-slate-700 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Document Sheet */}
        <div className="p-8 sm:p-12 text-slate-900 font-serif bg-white" id="printable-statement">
          
          {/* Header Kop Surat Koperasi */}
          <div className="border-b-2 border-slate-900 pb-4 mb-6 flex items-start justify-between">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-xl bg-emerald-800 text-white flex items-center justify-center font-bold">
                <Building2 className="w-8 h-8" />
              </div>
              <div>
                <h2 className="text-xl font-black tracking-tight uppercase font-sans text-slate-900">
                  KOPERASI BINA MANDIRI INDONESIA (BMI)
                </h2>
                <p className="text-xs text-slate-600 font-sans">
                  Badan Hukum No: AHU-0001423.AH.01.26.TAHUN 2020 • Wilayah Kerja Nasional
                </p>
                <p className="text-xs text-slate-500 font-sans">
                  Jl. Koperasi Makmur No. 12, Jakarta • Telp: (021) 7890-1234 • Email: info@koperasibmi.id
                </p>
              </div>
            </div>

            <div className="text-right font-sans">
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300">
                SALINAN RESMI
              </span>
              <p className="text-[10px] text-slate-400 mt-1">
                Tgl Cetak: {formatDateIndo(new Date().toISOString().slice(0, 10))}
              </p>
            </div>
          </div>

          {/* Title */}
          <div className="text-center my-6">
            <h3 className="text-lg font-bold uppercase underline tracking-wide font-sans">
              SURAT KETERANGAN REKAPITULASI SIMPANAN ANGGOTA
            </h3>
            <p className="text-xs text-slate-500 font-sans mt-0.5">
              Nomor Registrasi: REK/BMI/{member.id}/{new Date().getFullYear()}
            </p>
          </div>

          {/* Member Information Table */}
          <div className="bg-slate-50 rounded-xl p-4 border border-slate-200 font-sans text-xs mb-6 grid grid-cols-1 sm:grid-cols-2 gap-y-2 gap-x-6">
            <div>
              <span className="text-slate-500 block">Nomor ID Anggota:</span>
              <span className="font-bold text-slate-900 font-mono text-sm">{member.id}</span>
            </div>
            <div>
              <span className="text-slate-500 block">Status Keanggotaan:</span>
              <span className="font-bold text-emerald-700">{member.status}</span>
            </div>
            <div>
              <span className="text-slate-500 block">Nama Lengkap:</span>
              <span className="font-bold text-slate-900 text-sm">{member.name}</span>
            </div>
            <div>
              <span className="text-slate-500 block">Tanggal Terdaftar:</span>
              <span className="font-medium text-slate-800">{formatDateIndo(member.joinDate)}</span>
            </div>
          </div>

          {/* Summary Box */}
          <div className="font-sans mb-6">
            <h4 className="text-xs font-bold uppercase text-slate-700 tracking-wider mb-2">
              Ringkasan Saldo Simpanan:
            </h4>
            <div className="grid grid-cols-3 gap-3 text-center">
              <div className="p-3 bg-blue-50/70 border border-blue-200 rounded-xl">
                <span className="text-[10px] font-bold text-blue-700 uppercase block">Simpanan Pokok</span>
                <span className="text-sm sm:text-base font-extrabold text-slate-900">{formatRupiah(summary.totalPokok)}</span>
              </div>
              <div className="p-3 bg-emerald-50/70 border border-emerald-200 rounded-xl">
                <span className="text-[10px] font-bold text-emerald-700 uppercase block">Simpanan Wajib</span>
                <span className="text-sm sm:text-base font-extrabold text-emerald-800">{formatRupiah(summary.totalWajib)}</span>
              </div>
              <div className="p-3 bg-slate-900 text-white rounded-xl">
                <span className="text-[10px] font-bold text-amber-400 uppercase block">Total Akumulasi</span>
                <span className="text-sm sm:text-base font-extrabold text-white">{formatRupiah(summary.grandTotal)}</span>
              </div>
            </div>
          </div>

          {/* Detailed Transaction Ledger */}
          <div className="font-sans mb-8">
            <h4 className="text-xs font-bold uppercase text-slate-700 tracking-wider mb-2">
              Daftar Catatan Mutasi Simpanan:
            </h4>
            <table className="w-full text-left text-xs border border-slate-300 border-collapse">
              <thead>
                <tr className="bg-slate-100 border-b border-slate-300 font-bold text-slate-700">
                  <th className="p-2 border-r border-slate-300">No. Bukti</th>
                  <th className="p-2 border-r border-slate-300">Tanggal</th>
                  <th className="p-2 border-r border-slate-300">Jenis</th>
                  <th className="p-2 border-r border-slate-300">Keterangan</th>
                  <th className="p-2 text-right">Nominal</th>
                </tr>
              </thead>
              <tbody>
                {transactions.map((trx, idx) => (
                  <tr key={trx.id} className={idx % 2 === 0 ? 'bg-white' : 'bg-slate-50/50'}>
                    <td className="p-2 border-r border-slate-300 font-mono">{trx.receiptNo}</td>
                    <td className="p-2 border-r border-slate-300 whitespace-nowrap">{formatDateIndo(trx.date)}</td>
                    <td className="p-2 border-r border-slate-300 font-semibold">{trx.type}</td>
                    <td className="p-2 border-r border-slate-300">{trx.description}</td>
                    <td className="p-2 text-right font-mono font-bold text-slate-900">{formatRupiah(trx.amount)}</td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr className="bg-slate-100 font-bold border-t-2 border-slate-400">
                  <td colSpan={4} className="p-2 text-right">TOTAL KESELURUHAN:</td>
                  <td className="p-2 text-right font-mono text-emerald-800">{formatRupiah(summary.grandTotal)}</td>
                </tr>
              </tfoot>
            </table>
          </div>

          {/* Signature section */}
          <div className="font-sans grid grid-cols-2 gap-8 text-center text-xs mt-12 pt-4 border-t border-slate-200">
            <div>
              <p className="text-slate-500">Mengetahui & Menyetujui,</p>
              <p className="font-bold text-slate-900 mt-1">Anggota Koperasi</p>
              <div className="h-16" />
              <p className="font-bold underline text-slate-900 uppercase">({member.name})</p>
              <p className="text-[10px] text-slate-500 font-mono">ID: {member.id}</p>
            </div>
            <div>
              <p className="text-slate-500">Jakarta, {formatDateIndo(new Date().toISOString().slice(0, 10))}</p>
              <p className="font-bold text-slate-900 mt-1">Pengurus / Kasir Koperasi</p>
              <div className="h-16 flex items-center justify-center">
                <span className="text-[10px] font-bold text-emerald-700 uppercase border border-dashed border-emerald-400 px-3 py-1 rounded-sm rotate-[-4deg]">
                  TERCATAT & TERCAP OTOMATIS
                </span>
              </div>
              <p className="font-bold underline text-slate-900 uppercase">(Bagian Keuangan & Kasir)</p>
              <p className="text-[10px] text-slate-500 font-mono">NIP: KOP-BMI-2024</p>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
