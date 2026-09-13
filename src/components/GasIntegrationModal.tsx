import React, { useState } from 'react';
import { 
  X, 
  FileSpreadsheet, 
  Copy, 
  Check, 
  ExternalLink, 
  Play, 
  HelpCircle, 
  Code, 
  Database,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { GAS_SCRIPT_CODE, GasService } from '../services/gasService';
import { INITIAL_MEMBERS } from '../data/mockData';

interface GasIntegrationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSaveGasConfig: (url: string, isActive: boolean) => void;
  currentUrl: string;
  isActive: boolean;
}

export const GasIntegrationModal: React.FC<GasIntegrationModalProps> = ({
  isOpen,
  onClose,
  onSaveGasConfig,
  currentUrl,
  isActive,
}) => {
  const [urlInput, setUrlInput] = useState(currentUrl || '');
  const [activeToggle, setActiveToggle] = useState(isActive);
  const [activeTab, setActiveTab] = useState<'GUIDE' | 'CODE' | 'SHEETS' | 'DATA'>('GUIDE');
  const [copiedCode, setCopiedCode] = useState(false);
  const [copiedData, setCopiedData] = useState(false);
  const [testStatus, setTestStatus] = useState<{ loading: boolean; success?: boolean; message?: string } | null>(null);

  if (!isOpen) return null;

  const handleCopyCode = () => {
    navigator.clipboard.writeText(GAS_SCRIPT_CODE);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const handleCopyCsvData = () => {
    const csv = [
      'ID Anggota,Nama Anggota,Username,Password,Status Keanggotaan',
      ...INITIAL_MEMBERS.map(m => `${m.id},${m.name},${m.username},${m.password},${m.status}`)
    ].join('\n');
    navigator.clipboard.writeText(csv);
    setCopiedData(true);
    setTimeout(() => setCopiedData(false), 2000);
  };

  const handleTestConnection = async () => {
    if (!urlInput.trim()) {
      setTestStatus({ loading: false, success: false, message: 'Masukkan URL Aplikasi Web Google Script terlebih dahulu.' });
      return;
    }

    setTestStatus({ loading: true });
    try {
      const pingUrl = new URL(urlInput.trim());
      pingUrl.searchParams.set('action', 'ping');

      const res = await fetch(pingUrl.toString(), {
        method: 'GET',
        headers: { 'Accept': 'application/json' }
      });

      if (res.ok) {
        const data = await res.json();
        setTestStatus({
          loading: false,
          success: true,
          message: data.message || `Terhubung ke Spreadsheet: "${data.sheetName || 'Koperasi'}"`
        });
      } else {
        setTestStatus({
          loading: false,
          success: false,
          message: `Gagal mengakses URL (HTTP ${res.status}). Pastikan hak akses Web App diset ke "Anyone" (Siapa saja).`
        });
      }
    } catch (err: any) {
      setTestStatus({
        loading: false,
        success: false,
        message: 'Koneksi gagal: ' + (err.message || 'Periksa kembali URL dan izin akses Web App.')
      });
    }
  };

  const handleSave = () => {
    onSaveGasConfig(urlInput.trim(), activeToggle);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto animate-in fade-in duration-150">
      <div className="bg-white rounded-3xl max-w-2xl w-full shadow-2xl overflow-hidden border border-slate-200 my-8">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-slate-50">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center">
              <FileSpreadsheet className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-800 text-sm">
                Integrasi Google Apps Script & Spreadsheets
              </h3>
              <p className="text-[11px] text-slate-500">
                Hubungkan portal dengan Google Spreadsheet milik koperasi Anda
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-slate-200 text-slate-400 hover:text-slate-600 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-slate-200 bg-slate-100/70 px-6 pt-2 text-xs font-semibold gap-2 overflow-x-auto">
          <button
            onClick={() => setActiveTab('GUIDE')}
            className={`pb-2.5 px-3 border-b-2 transition-all flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${
              activeTab === 'GUIDE'
                ? 'border-emerald-600 text-emerald-800'
                : 'border-transparent text-slate-500 hover:text-slate-700'
            }`}
          >
            <HelpCircle className="w-3.5 h-3.5" />
            <span>1. Panduan Setup (5 Menit)</span>
          </button>

          <button
            onClick={() => setActiveTab('CODE')}
            className={`pb-2.5 px-3 border-b-2 transition-all flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${
              activeTab === 'CODE'
                ? 'border-emerald-600 text-emerald-800'
                : 'border-transparent text-slate-500 hover:text-slate-700'
            }`}
          >
            <Code className="w-3.5 h-3.5" />
            <span>2. Salin Script (Code.gs)</span>
          </button>

          <button
            onClick={() => setActiveTab('SHEETS')}
            className={`pb-2.5 px-3 border-b-2 transition-all flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${
              activeTab === 'SHEETS'
                ? 'border-emerald-600 text-emerald-800'
                : 'border-transparent text-slate-500 hover:text-slate-700'
            }`}
          >
            <Database className="w-3.5 h-3.5" />
            <span>3. Format Spreadsheet</span>
          </button>

          <button
            onClick={() => setActiveTab('DATA')}
            className={`pb-2.5 px-3 border-b-2 transition-all flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${
              activeTab === 'DATA'
                ? 'border-emerald-600 text-emerald-800'
                : 'border-transparent text-slate-500 hover:text-slate-700'
            }`}
          >
            <FileSpreadsheet className="w-3.5 h-3.5" />
            <span>4. Data Anggota</span>
          </button>
        </div>

        {/* Tab Content */}
        <div className="p-6 max-h-[60vh] overflow-y-auto">
          
          {/* TAB 1: GUIDE */}
          {activeTab === 'GUIDE' && (
            <div className="space-y-4 text-xs text-slate-600">
              <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 text-emerald-900">
                <span className="font-bold block mb-0.5">Sudah Siap Pakai!</span>
                Aplikasi ini sudah dilengkapi dengan database bawaan yang memuat 5 data anggota yang Anda berikan. Jika Anda ingin menghubungkannya ke Spreadsheet Google Anda secara langsung, ikuti langkah berikut:
              </div>

              <ol className="space-y-3 list-decimal list-inside text-slate-700">
                <li className="p-2.5 bg-slate-50 rounded-lg border border-slate-200">
                  <strong>Buka Google Spreadsheet:</strong> Buat file spreadsheet baru atau gunakan spreadsheet yang sudah ada di Google Drive Anda.
                </li>
                <li className="p-2.5 bg-slate-50 rounded-lg border border-slate-200">
                  <strong>Buka Apps Script:</strong> Klik menu <em>Ekstensi (Extensions)</em> &gt; <em>Apps Script</em>.
                </li>
                <li className="p-2.5 bg-slate-50 rounded-lg border border-slate-200">
                  <strong>Tempelkan Kode Script:</strong> Hapus kode bawaan di file <code className="bg-slate-200 px-1 rounded">Code.gs</code>, lalu salin dan tempel kode dari tab <em>"2. Salin Script (Code.gs)"</em>.
                </li>
                <li className="p-2.5 bg-slate-50 rounded-lg border border-slate-200">
                  <strong>Deploy sebagai Aplikasi Web:</strong>
                  <ul className="list-disc list-inside ml-4 mt-1 space-y-0.5 text-slate-600">
                    <li>Klik tombol biru <strong>Terapkan (Deploy)</strong> &gt; <strong>Penerapan baru (New deployment)</strong></li>
                    <li>Pilih jenis: <strong>Aplikasi Web (Web app)</strong></li>
                    <li>Jalankan sebagai: <strong>Saya (Me)</strong></li>
                    <li>Yang memiliki akses: <strong className="text-emerald-700">Siapa saja (Anyone)</strong> *(Wajib agar web bisa berkomunikasi)*</li>
                  </ul>
                </li>
                <li className="p-2.5 bg-slate-50 rounded-lg border border-slate-200">
                  <strong>Salin URL & Tempel di Form Bawah:</strong> Ambil URL yang berakhiran <code className="bg-slate-200 px-1 rounded">/exec</code> lalu tempelkan pada isian di bawah ini.
                </li>
              </ol>
            </div>
          )}

          {/* TAB 2: CODE.GS */}
          {activeTab === 'CODE' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-700">
                  Kode Google Apps Script (Code.gs)
                </span>
                <button
                  onClick={handleCopyCode}
                  className="px-3 py-1.5 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs flex items-center gap-1.5 transition-all"
                >
                  {copiedCode ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedCode ? 'Tersalin!' : 'Salin Kode Lengkap'}</span>
                </button>
              </div>

              <pre className="bg-slate-900 text-emerald-400 p-4 rounded-xl text-[11px] font-mono overflow-x-auto max-h-80 border border-slate-800 leading-relaxed select-all">
                {GAS_SCRIPT_CODE}
              </pre>
            </div>
          )}

          {/* TAB 3: FORMAT SHEETS */}
          {activeTab === 'SHEETS' && (
            <div className="space-y-4 text-xs">
              <div className="p-3 bg-blue-50 border border-blue-200 rounded-xl text-blue-900">
                Pastikan nama sheet dan kolom di Google Spreadsheet Anda persis seperti berikut (Apps Script akan otomatis membuatnya jika belum ada):
              </div>

              <div>
                <h4 className="font-bold text-slate-800 mb-1">Sheet 1: Data_Anggota</h4>
                <div className="overflow-x-auto">
                  <table className="w-full border border-slate-300 text-[11px]">
                    <thead className="bg-slate-100 font-bold text-slate-700">
                      <tr>
                        <th className="p-2 border">ID Anggota</th>
                        <th className="p-2 border">Nama Anggota</th>
                        <th className="p-2 border">Username</th>
                        <th className="p-2 border">Password</th>
                        <th className="p-2 border">Status Keanggotaan</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td className="p-2 border font-mono">BMI0001</td>
                        <td className="p-2 border">Shafa Radizta Dewantara</td>
                        <td className="p-2 border">radiztadewantara@gmail.com</td>
                        <td className="p-2 border">bmi123*</td>
                        <td className="p-2 border text-emerald-700 font-bold">AKTIF</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              <div>
                <h4 className="font-bold text-slate-800 mb-1">Sheet 2: Data_Simpanan</h4>
                <div className="overflow-x-auto">
                  <table className="w-full border border-slate-300 text-[11px]">
                    <thead className="bg-slate-100 font-bold text-slate-700">
                      <tr>
                        <th className="p-2 border">ID Transaksi</th>
                        <th className="p-2 border">ID Anggota</th>
                        <th className="p-2 border">Tanggal</th>
                        <th className="p-2 border">Jenis Simpanan</th>
                        <th className="p-2 border">Nominal</th>
                        <th className="p-2 border">Keterangan</th>
                        <th className="p-2 border">No Kuitansi</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td className="p-2 border font-mono">TRX-001</td>
                        <td className="p-2 border font-mono">BMI0001</td>
                        <td className="p-2 border">2023-01-15</td>
                        <td className="p-2 border font-bold">POKOK</td>
                        <td className="p-2 border">1000000</td>
                        <td className="p-2 border">Setoran Awal Simpanan Pokok</td>
                        <td className="p-2 border font-mono">KWT/2023/01/001</td>
                      </tr>
                      <tr>
                        <td className="p-2 border font-mono">TRX-002</td>
                        <td className="p-2 border font-mono">BMI0001</td>
                        <td className="p-2 border">2023-01-15</td>
                        <td className="p-2 border font-bold">WAJIB</td>
                        <td className="p-2 border">100000</td>
                        <td className="p-2 border">Simpanan Wajib Bulan Jan 2023</td>
                        <td className="p-2 border font-mono">KWT/2023/01/002</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: DATA ANGGOTA */}
          {activeTab === 'DATA' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-700">
                  Data 5 Anggota dari Permintaan Anda:
                </span>
                <button
                  onClick={handleCopyCsvData}
                  className="px-3 py-1.5 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs flex items-center gap-1.5 transition-all"
                >
                  {copiedData ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedData ? 'Tersalin!' : 'Salin Data CSV'}</span>
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full border border-slate-300 text-xs">
                  <thead className="bg-slate-100 font-bold text-slate-700">
                    <tr>
                      <th className="p-2 border">ID Anggota</th>
                      <th className="p-2 border">Nama Anggota</th>
                      <th className="p-2 border">Username</th>
                      <th className="p-2 border">Password</th>
                      <th className="p-2 border">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {INITIAL_MEMBERS.map(m => (
                      <tr key={m.id} className="hover:bg-slate-50">
                        <td className="p-2 border font-mono font-bold">{m.id}</td>
                        <td className="p-2 border">{m.name}</td>
                        <td className="p-2 border">{m.username}</td>
                        <td className="p-2 border font-mono">{m.password}</td>
                        <td className="p-2 border text-emerald-700 font-bold">{m.status}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

        </div>

        {/* Configuration Form Bar */}
        <div className="p-6 bg-slate-50 border-t border-slate-200 space-y-4">
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-700">
                URL Aplikasi Web Google Apps Script (/exec)
              </label>
              <div className="flex items-center gap-2">
                <span className="text-[11px] text-slate-500">Gunakan URL Live:</span>
                <input
                  type="checkbox"
                  id="toggle-gas-active"
                  checked={activeToggle}
                  onChange={(e) => setActiveToggle(e.target.checked)}
                  className="rounded border-slate-300 text-emerald-600 focus:ring-emerald-500 w-4 h-4 cursor-pointer"
                />
              </div>
            </div>

            <div className="flex gap-2">
              <input
                type="url"
                value={urlInput}
                onChange={(e) => setUrlInput(e.target.value)}
                placeholder="https://script.google.com/macros/s/.../exec"
                className="flex-1 px-3.5 py-2.5 bg-white rounded-xl border border-slate-300 text-xs font-mono focus:outline-none focus:ring-2 focus:ring-emerald-600"
              />
              <button
                type="button"
                onClick={handleTestConnection}
                disabled={testStatus?.loading}
                className="px-4 py-2.5 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-800 text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                {testStatus?.loading ? (
                  <div className="w-3.5 h-3.5 border-2 border-slate-600 border-t-transparent rounded-full animate-spin" />
                ) : (
                  <Play className="w-3.5 h-3.5" />
                )}
                <span>Uji Koneksi</span>
              </button>
            </div>
          </div>

          {/* Test Status feedback */}
          {testStatus && (
            <div className={`p-3 rounded-xl text-xs flex items-start gap-2 border ${
              testStatus.success 
                ? 'bg-emerald-50 text-emerald-800 border-emerald-200' 
                : 'bg-red-50 text-red-800 border-red-200'
            }`}>
              {testStatus.success ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              ) : (
                <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
              )}
              <span>{testStatus.message}</span>
            </div>
          )}

          <div className="flex items-center justify-between pt-2 border-t border-slate-200">
            <button
              type="button"
              onClick={() => {
                GasService.resetToDefault();
                alert('Database lokal berhasil di-reset sesuai 5 data anggota bawaan.');
              }}
              className="text-xs text-slate-500 hover:text-slate-700 underline"
            >
              Reset Data Awal
            </button>

            <div className="flex gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-200 rounded-xl"
              >
                Tutup
              </button>
              <button
                type="button"
                onClick={handleSave}
                className="px-5 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs shadow-sm"
              >
                Simpan Pengaturan
              </button>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
