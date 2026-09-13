import React, { useState } from 'react';
import { 
  KeyRound, 
  User, 
  Eye, 
  EyeOff, 
  ArrowRight, 
  ShieldCheck, 
  AlertCircle,
  FileSpreadsheet,
  CheckCircle2,
  Lock
} from 'lucide-react';
import { INITIAL_MEMBERS } from '../data/mockData';
import { Member } from '../types';

interface LoginFormProps {
  onLogin: (identifier: string, pass: string) => Promise<{ success: boolean; message: string }>;
  onOpenGasModal: () => void;
  gasConfigActive: boolean;
}

export const LoginForm: React.FC<LoginFormProps> = ({
  onLogin,
  onOpenGasModal,
  gasConfigActive,
}) => {
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!identifier.trim() || !password.trim()) {
      setErrorMessage('Nomor Anggota / Username dan Kata Sandi wajib diisi.');
      return;
    }

    setIsLoading(true);
    setErrorMessage(null);

    const res = await onLogin(identifier, password);
    setIsLoading(false);

    if (!res.success) {
      setErrorMessage(res.message);
    }
  };

  const handleSelectDemoAccount = (m: Member) => {
    setIdentifier(m.id);
    setPassword(m.password);
    setErrorMessage(null);
  };

  return (
    <div className="w-full max-w-lg mx-auto py-8 sm:py-12 px-4">
      <div className="bg-white rounded-2xl shadow-xl shadow-slate-200/60 border border-slate-200/80 overflow-hidden">
        
        {/* Header decoration */}
        <div className="bg-gradient-to-r from-emerald-800 to-teal-700 px-6 sm:px-8 py-8 text-white relative">
          <div className="relative z-10">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-950/40 backdrop-blur-xs text-emerald-200 text-xs font-semibold mb-3 border border-emerald-500/30">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-300" />
              Sistem Otentikasi Anggota Koperasi
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight font-['Space_Grotesk']">
              Masuk Akun Anggota
            </h1>
            <p className="text-emerald-100/90 text-sm mt-1.5">
              Cek saldo akumulasi simpanan pokok, simpanan wajib, dan rincian transaksi Anda.
            </p>
          </div>
          
          {/* Subtle background decoration */}
          <div className="absolute right-0 bottom-0 translate-x-4 translate-y-4 opacity-10 pointer-events-none">
            <Lock className="w-48 h-48 text-white" />
          </div>
        </div>

        {/* Form Body */}
        <div className="p-6 sm:p-8">
          
          {/* Status Google Apps Script */}
          <div className="mb-6 p-3.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <FileSpreadsheet className="w-4 h-4 text-emerald-600 shrink-0" />
              <span className="text-slate-600">
                Database: <strong className="text-slate-900">{gasConfigActive ? 'Google Spreadsheet (Live GAS)' : 'Database Koperasi (Terverifikasi)'}</strong>
              </span>
            </div>
            <button
              type="button"
              id="btn-login-gas-config"
              onClick={onOpenGasModal}
              className="text-emerald-700 hover:text-emerald-800 font-semibold underline hover:no-underline"
            >
              Pengaturan GAS
            </button>
          </div>

          {/* Error notification */}
          {errorMessage && (
            <div className="mb-6 p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm flex items-start gap-2.5">
              <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
              <div className="font-medium">{errorMessage}</div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            
            {/* Field: ID Anggota / Username */}
            <div>
              <label 
                htmlFor="input-identifier"
                className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5"
              >
                Nomor Anggota / Username
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <User className="w-5 h-5" />
                </div>
                <input
                  id="input-identifier"
                  type="text"
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  placeholder="Contoh: BMI0001 atau radiztadewantara@gmail.com"
                  required
                  className="w-full pl-11 pr-4 py-3 bg-white rounded-xl border border-slate-300 text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:border-emerald-600 transition-all placeholder:text-slate-400 font-medium"
                />
              </div>
              <p className="text-[11px] text-slate-400 mt-1">
                Bisa menggunakan format ID (misal <span className="font-mono font-semibold">BMI0001</span>) atau alamat Email.
              </p>
            </div>

            {/* Field: Kata Sandi */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label 
                  htmlFor="input-password"
                  className="block text-xs font-bold uppercase tracking-wider text-slate-700"
                >
                  Kata Sandi
                </label>
                <span className="text-[11px] text-emerald-700 font-semibold">
                  Default: bmi123*
                </span>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <KeyRound className="w-5 h-5" />
                </div>
                <input
                  id="input-password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Masukkan kata sandi akun Anda"
                  required
                  className="w-full pl-11 pr-11 py-3 bg-white rounded-xl border border-slate-300 text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:border-emerald-600 transition-all placeholder:text-slate-400 font-medium"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              id="btn-submit-login"
              disabled={isLoading}
              className="w-full mt-2 py-3.5 px-4 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-sm shadow-md shadow-emerald-700/25 flex items-center justify-center gap-2 transition-all disabled:opacity-70 cursor-pointer"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <span>Periksa Nilai Simpanan</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Quick Select Section (All 5 user-provided members) */}
          <div className="mt-8 pt-6 border-t border-slate-200">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Pilih Akun Anggota (1-Klik):
              </span>
              <span className="text-[11px] text-slate-400">
                Data dari Spreadsheet
              </span>
            </div>

            <div className="space-y-2">
              {INITIAL_MEMBERS.map((m) => {
                const isSelected = identifier.toUpperCase() === m.id || identifier.toLowerCase() === m.username.toLowerCase();
                return (
                  <button
                    key={m.id}
                    type="button"
                    onClick={() => handleSelectDemoAccount(m)}
                    className={`w-full text-left p-2.5 rounded-xl border transition-all flex items-center justify-between group cursor-pointer ${
                      isSelected
                        ? 'bg-emerald-50 border-emerald-300 ring-1 ring-emerald-400'
                        : 'bg-slate-50/70 hover:bg-slate-100/80 border-slate-200'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-xs ${
                        isSelected ? 'bg-emerald-700 text-white' : 'bg-slate-200 text-slate-700 group-hover:bg-slate-300'
                      }`}>
                        {m.name.charAt(0)}
                      </div>
                      <div>
                        <div className="text-xs font-bold text-slate-900 group-hover:text-emerald-800">
                          {m.name}
                        </div>
                        <div className="text-[11px] text-slate-500 font-mono">
                          {m.id} • {m.username}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                        {m.status}
                      </span>
                      {isSelected && (
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

        </div>

        {/* Card Footer */}
        <div className="bg-slate-50 px-6 py-4 border-t border-slate-200 text-center text-xs text-slate-500">
          Koperasi Bina Mandiri Indonesia • Berbadan Hukum & Terdaftar
        </div>

      </div>
    </div>
  );
};
