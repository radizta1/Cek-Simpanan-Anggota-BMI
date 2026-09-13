import React, { useState } from 'react';
import { X, CheckCircle, Coins, ArrowRight, ShieldCheck } from 'lucide-react';
import { Member, SavingsType } from '../types';
import { formatRupiah } from '../services/gasService';

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  member: Member;
  onSavePayment: (type: SavingsType, amount: number, description: string) => void;
}

export const PaymentModal: React.FC<PaymentModalProps> = ({
  isOpen,
  onClose,
  member,
  onSavePayment,
}) => {
  const [type, setType] = useState<SavingsType>('WAJIB');
  const [amount, setAmount] = useState<number>(100000);
  const [description, setDescription] = useState('Setoran Simpanan Wajib Periode Berjalan');
  const [isSuccess, setIsSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSavePayment(type, amount, description);
    setIsSuccess(true);
    setTimeout(() => {
      setIsSuccess(false);
      onClose();
    }, 1500);
  };

  const handleTypeChange = (newType: SavingsType) => {
    setType(newType);
    if (newType === 'WAJIB') {
      setAmount(100000);
      setDescription('Setoran Simpanan Wajib Periode Berjalan');
    } else if (newType === 'POKOK') {
      setAmount(1000000);
      setDescription('Pelunasan Simpanan Pokok Anggota');
    } else {
      setAmount(50000);
      setDescription('Setoran Simpanan Sukarela Anggota');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white rounded-3xl max-w-lg w-full shadow-2xl overflow-hidden border border-slate-200">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/50">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center">
              <Coins className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-slate-800 text-sm">
                Setor Simpanan Koperasi
              </h3>
              <p className="text-[11px] text-slate-500">
                Anggota: {member.name} ({member.id})
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        {isSuccess ? (
          <div className="p-8 text-center space-y-3 animate-in zoom-in-95">
            <div className="w-16 h-16 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle className="w-8 h-8" />
            </div>
            <h4 className="font-extrabold text-lg text-slate-900 font-['Space_Grotesk']">
              Setoran Berhasil Dicatat!
            </h4>
            <p className="text-xs text-slate-500 max-w-xs mx-auto">
              Saldo simpanan Anda telah diperbarui secara otomatis di sistem pembukuan koperasi.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-5">
            
            {/* Type selector */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                Pilih Jenis Simpanan:
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => handleTypeChange('WAJIB')}
                  className={`p-3 rounded-xl border text-left transition-all ${
                    type === 'WAJIB'
                      ? 'bg-emerald-50 border-emerald-500 ring-2 ring-emerald-500/20'
                      : 'bg-white border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  <span className="font-bold text-xs text-slate-900 block">Simpanan Wajib</span>
                  <span className="text-[11px] text-slate-500">Rp 100.000 / bln</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleTypeChange('POKOK')}
                  className={`p-3 rounded-xl border text-left transition-all ${
                    type === 'POKOK'
                      ? 'bg-blue-50 border-blue-500 ring-2 ring-blue-500/20'
                      : 'bg-white border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  <span className="font-bold text-xs text-slate-900 block">Simpanan Pokok</span>
                  <span className="text-[11px] text-slate-500">Rp 1.000.000 (Awal)</span>
                </button>
              </div>
            </div>

            {/* Nominal input */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                Nominal Setoran (Rp)
              </label>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(Number(e.target.value))}
                min={10000}
                step={10000}
                required
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 font-bold font-mono text-sm focus:outline-none focus:ring-2 focus:ring-emerald-600"
              />
              <p className="text-[11px] text-slate-400 mt-1">
                Terbilang: <strong className="text-slate-700">{formatRupiah(amount)}</strong>
              </p>
            </div>

            {/* Keterangan */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                Keterangan / Berita Setoran
              </label>
              <input
                type="text"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-600"
              />
            </div>

            {/* Notice */}
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-[11px] text-slate-500 flex items-start gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <span>
                Setoran ini akan membuat nomor kuitansi resmi dan otomatis memperbarui buku simpanan anggota.
              </span>
            </div>

            {/* Submit */}
            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
              >
                Batal
              </button>
              <button
                type="submit"
                className="px-5 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs flex items-center gap-1.5 shadow-md shadow-emerald-700/20"
              >
                <span>Konfirmasi Setoran</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

          </form>
        )}

      </div>
    </div>
  );
};
