import React from 'react';
import { X, Building2, ShieldCheck, QrCode, Sparkles, Download } from 'lucide-react';
import { Member } from '../types';
import { formatDateIndo } from '../services/gasService';

interface DigitalCardModalProps {
  isOpen: boolean;
  onClose: () => void;
  member: Member;
}

export const DigitalCardModal: React.FC<DigitalCardModalProps> = ({
  isOpen,
  onClose,
  member,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white rounded-3xl max-w-md w-full shadow-2xl overflow-hidden border border-slate-200">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
          <h3 className="font-bold text-slate-800 text-sm flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-emerald-600" />
            Kartu Tanda Anggota Digital (KTA)
          </h3>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Card Canvas */}
        <div className="p-6 bg-slate-100 flex flex-col items-center">
          
          {/* Card Component */}
          <div className="w-full max-w-sm rounded-2xl bg-gradient-to-br from-emerald-900 via-emerald-800 to-teal-900 text-white p-6 shadow-2xl relative overflow-hidden border border-emerald-600/40">
            
            {/* Background watermarks */}
            <div className="absolute right-0 top-0 translate-x-8 -translate-y-8 w-40 h-40 bg-emerald-500/20 rounded-full blur-2xl pointer-events-none" />
            <div className="absolute -left-10 -bottom-10 w-32 h-32 bg-amber-400/10 rounded-full blur-xl pointer-events-none" />

            {/* Header Koperasi */}
            <div className="flex items-center justify-between mb-6 relative z-10 border-b border-emerald-700/60 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-amber-400 text-slate-900 flex items-center justify-center font-black">
                  <Building2 className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-extrabold text-sm tracking-wide font-['Space_Grotesk'] leading-tight">
                    KOPERASI BMI
                  </h4>
                  <p className="text-[10px] text-emerald-200 font-medium">
                    Koperasi Simpan Pinjam Indonesia
                  </p>
                </div>
              </div>

              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-400/20 text-amber-300 border border-amber-400/30">
                ANGGOTA RESMI
              </span>
            </div>

            {/* Chip & Smart Card Graphic */}
            <div className="flex items-center justify-between mb-5">
              <div className="w-11 h-8 rounded-md bg-gradient-to-tr from-amber-300 to-amber-200 border border-amber-400/80 shadow-xs flex items-center justify-center">
                <div className="w-8 h-5 border border-amber-600/40 rounded-sm grid grid-cols-2 gap-0.5 opacity-60">
                  <div className="border-r border-amber-700" />
                  <div />
                </div>
              </div>

              <div className="text-right">
                <span className="text-[10px] text-emerald-300 uppercase tracking-widest block font-mono">
                  NOMOR ANGGOTA
                </span>
                <span className="font-mono font-black text-base text-amber-300 tracking-wider">
                  {member.id}
                </span>
              </div>
            </div>

            {/* Member Details */}
            <div className="space-y-1 relative z-10">
              <span className="text-[10px] text-emerald-300 uppercase tracking-wider block">
                NAMA ANGGOTA
              </span>
              <p className="font-extrabold text-lg tracking-wide uppercase font-['Space_Grotesk'] text-white">
                {member.name}
              </p>
            </div>

            {/* Card Footer: Join Date & QR Placeholder */}
            <div className="mt-5 pt-3 border-t border-emerald-700/60 flex items-end justify-between relative z-10 text-[11px]">
              <div>
                <span className="text-emerald-300 text-[10px] block">TANGGAL BERGABUNG</span>
                <span className="font-medium text-white">{formatDateIndo(member.joinDate)}</span>
              </div>

              <div className="w-10 h-10 bg-white p-1 rounded-md shadow-xs flex items-center justify-center">
                <QrCode className="w-8 h-8 text-slate-900" />
              </div>
            </div>

          </div>

          <p className="text-xs text-slate-500 mt-4 text-center">
            Tunjukkan kartu ini saat melakukan transaksi langsung di kantor cabang koperasi.
          </p>

        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-white border-t border-slate-100 flex justify-end gap-2">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 transition-colors"
          >
            Tutup
          </button>
          <button
            onClick={() => window.print()}
            className="px-4 py-2 rounded-xl text-xs font-bold bg-emerald-700 hover:bg-emerald-800 text-white flex items-center gap-1.5 shadow-sm transition-all"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Cetak Kartu</span>
          </button>
        </div>

      </div>
    </div>
  );
};
