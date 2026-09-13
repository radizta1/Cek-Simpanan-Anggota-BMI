import React from 'react';
import { Building2, FileSpreadsheet, LogOut, UserCheck, ShieldCheck } from 'lucide-react';
import { Member } from '../types';

interface HeaderProps {
  member: Member | null;
  onLogout: () => void;
  onOpenGasModal: () => void;
  gasConfigActive: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  member,
  onLogout,
  onOpenGasModal,
  gasConfigActive,
}) => {
  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16 sm:h-20">
          
          {/* Logo & Cooperative Title */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-emerald-700 text-white flex items-center justify-center shadow-md shadow-emerald-700/20">
              <Building2 className="w-6 h-6 sm:w-7 sm:h-7" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-lg sm:text-xl text-slate-900 tracking-tight font-['Space_Grotesk']">
                  KOPERASI BMI
                </span>
                <span className="hidden sm:inline-flex items-center gap-1 text-[11px] font-semibold bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded-full border border-emerald-200">
                  <ShieldCheck className="w-3 h-3" /> Terverifikasi
                </span>
              </div>
              <p className="text-xs text-slate-500 font-medium">
                Portal Cek Simpanan Pokok & Wajib Anggota
              </p>
            </div>
          </div>

          {/* Right Action Items */}
          <div className="flex items-center gap-2 sm:gap-3">
            
            {/* Google Sheets / Apps Script Integration Button */}
            <button
              id="btn-google-apps-script"
              onClick={onOpenGasModal}
              className={`inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold px-3 py-2 rounded-lg border transition-all ${
                gasConfigActive
                  ? 'bg-emerald-50 text-emerald-800 border-emerald-300 hover:bg-emerald-100'
                  : 'bg-slate-50 text-slate-700 border-slate-300 hover:bg-slate-100'
              }`}
              title="Integrasi Google Apps Script & Google Sheets"
            >
              <FileSpreadsheet className={`w-4 h-4 ${gasConfigActive ? 'text-emerald-600' : 'text-emerald-600'}`} />
              <span className="hidden md:inline">
                {gasConfigActive ? 'Google Script: Terhubung' : 'Integrasi Google Script'}
              </span>
              <span className="md:hidden">Google Script</span>
              {gasConfigActive && (
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              )}
            </button>

            {/* Member Profile or Status */}
            {member && (
              <div className="flex items-center gap-2 pl-2 border-l border-slate-200">
                <div className="hidden sm:flex flex-col text-right">
                  <span className="text-xs font-bold text-slate-900 line-clamp-1 max-w-[150px]">
                    {member.name}
                  </span>
                  <span className="text-[11px] text-slate-500 font-mono font-medium">
                    {member.id}
                  </span>
                </div>
                
                <div className="w-9 h-9 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-sm border border-emerald-200 shadow-xs">
                  {member.name.charAt(0)}
                </div>

                <button
                  id="btn-logout"
                  onClick={onLogout}
                  className="inline-flex items-center justify-center p-2 rounded-lg text-slate-550 hover:text-red-600 hover:bg-red-50 transition-colors ml-1"
                  title="Keluar / Logout Akun"
                >
                  <LogOut className="w-4 h-4 text-slate-600 hover:text-red-600" />
                </button>
              </div>
            )}

          </div>

        </div>
      </div>
    </header>
  );
};
