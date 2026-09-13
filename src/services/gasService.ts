import { Member, SavingsTransaction, MemberSavingsSummary } from '../types';
import { INITIAL_MEMBERS, INITIAL_TRANSACTIONS } from '../data/mockData';

const LOCAL_STORAGE_MEMBERS_KEY = 'koperasi_members_data_v1';
const LOCAL_STORAGE_TRANSACTIONS_KEY = 'koperasi_trx_data_v1';
const LOCAL_STORAGE_GAS_CONFIG_KEY = 'koperasi_gas_config_v1';

export const GAS_SCRIPT_CODE = `/**
 * GOOGLE APPS SCRIPT: SISTEM CEK SIMPANAN KOPERASI (POKOK & WAJIB)
 * 
 * CARA PEMASANGAN DI GOOGLE SPREADSHEETS:
 * 1. Buka Google Spreadsheet Anda
 * 2. Buat Sheet 1 dengan nama: "Data_Anggota"
 *    Header (Baris 1): ID Anggota | Nama Anggota | Username | Password | Status Keanggotaan
 * 3. Buat Sheet 2 dengan nama: "Data_Simpanan"
 *    Header (Baris 1): ID Transaksi | ID Anggota | Tanggal | Jenis Simpanan | Nominal | Keterangan | No Kuitansi
 * 4. Klik menu "Ekstensi" (Extensions) > "Apps Script"
 * 5. Hapus kode default, lalu tempelkan (paste) seluruh kode ini
 * 6. Klik tombol "Simpan" (ikon disket)
 * 7. Klik tombol biru "Terapkan" (Deploy) > "Penerapan baru" (New deployment)
 * 8. Pilih jenis: "Aplikasi Web" (Web app)
 *    - Deskripsi: API Cek Simpanan Koperasi
 *    - Jalankan sebagai (Execute as): Saya (Me / email Anda)
 *    - Yang memiliki akses (Who has access): Siapa saja (Anyone) -> PENTING AGAR BISA DIAKSES WEB
 * 9. Klik "Terapkan" (Deploy) dan berikan izin akses Google
 * 10. Salin URL Aplikasi Web yang diberikan (berakhiran /exec) dan masukkan ke Web Portal.
 */

function doGet(e) {
  return handleRequest(e);
}

function doPost(e) {
  return handleRequest(e);
}

function handleRequest(e) {
  var headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type'
  };

  try {
    var params = e.parameter || {};
    var postData = {};
    
    if (e.postData && e.postData.contents) {
      try {
        postData = JSON.parse(e.postData.contents);
      } catch (err) {
        postData = {};
      }
    }
    
    var action = params.action || postData.action || 'ping';
    var ss = SpreadsheetApp.getActiveSpreadsheet();

    // 1. PING / TEST KONEKSI
    if (action === 'ping') {
      return responseJson({
        success: true,
        message: 'Koneksi ke Google Apps Script Spreadsheet Koperasi Berhasil!',
        sheetName: ss.getName(),
        timestamp: new Date().toISOString()
      });
    }

    // 2. LOGIN ANGGOTA
    if (action === 'login') {
      var identifier = (params.identifier || postData.identifier || '').toString().trim();
      var password = (params.password || postData.password || '').toString().trim();

      if (!identifier || !password) {
        return responseJson({ success: false, message: 'Nomor Anggota/Username dan Kata Sandi wajib diisi.' });
      }

      var memberSheet = getOrCreateSheet(ss, 'Data_Anggota');
      var memberData = memberSheet.getDataRange().getValues();
      
      // Baris 0 adalah Header: ID Anggota, Nama Anggota, Username, Password, Status Keanggotaan
      var foundMember = null;
      for (var i = 1; i < memberData.length; i++) {
        var row = memberData[i];
        var rowId = (row[0] || '').toString().trim();
        var rowName = (row[1] || '').toString().trim();
        var rowUsername = (row[2] || '').toString().trim();
        var rowPassword = (row[3] || '').toString().trim();
        var rowStatus = (row[4] || 'AKTIF').toString().trim();

        // Cek kecocokan ID Anggota ATAU Username/Email
        var matchIdOrUser = (rowId.toLowerCase() === identifier.toLowerCase()) || 
                            (rowUsername.toLowerCase() === identifier.toLowerCase());
        
        if (matchIdOrUser && rowPassword === password) {
          foundMember = {
            id: rowId,
            name: rowName,
            username: rowUsername,
            status: rowStatus
          };
          break;
        }
      }

      if (!foundMember) {
        return responseJson({ success: false, message: 'Nomor Anggota / Username atau Kata Sandi salah.' });
      }

      if (foundMember.status.toUpperCase() !== 'AKTIF') {
        return responseJson({ success: false, message: 'Status keanggotaan Anda: ' + foundMember.status + '. Hubungi pengurus koperasi.' });
      }

      // Ambil seluruh data simpanan anggota terkait
      var savings = getMemberSavings(ss, foundMember.id);

      return responseJson({
        success: true,
        message: 'Login berhasil.',
        member: foundMember,
        savings: savings
      });
    }

    // 3. AMBIL DATA SIMPANAN BY MEMBER ID
    if (action === 'getSavings') {
      var memberId = (params.memberId || postData.memberId || '').toString().trim();
      if (!memberId) {
        return responseJson({ success: false, message: 'ID Anggota tidak disertakan.' });
      }
      var savings = getMemberSavings(ss, memberId);
      return responseJson({ success: true, savings: savings });
    }

    return responseJson({ success: false, message: 'Aksi tidak dikenali.' });

  } catch (error) {
    return responseJson({
      success: false,
      message: 'Terjadi kesalahan sistem Apps Script: ' + error.toString()
    });
  }
}

function getMemberSavings(ss, memberId) {
  var savingsSheet = getOrCreateSheet(ss, 'Data_Simpanan');
  var data = savingsSheet.getDataRange().getValues();
  var transactions = [];
  var totalPokok = 0;
  var totalWajib = 0;
  var totalSukarela = 0;
  var lastDate = '';

  for (var i = 1; i < data.length; i++) {
    var row = data[i];
    var rowMemberId = (row[1] || '').toString().trim();
    if (rowMemberId.toLowerCase() === memberId.toLowerCase()) {
      var rawDate = row[2];
      var formattedDate = rawDate instanceof Date ? 
          Utilities.formatDate(rawDate, Session.getScriptTimeZone(), 'yyyy-MM-dd') : 
          rawDate.toString();
      
      var rawType = (row[3] || 'WAJIB').toString().toUpperCase().trim();
      var amount = Number(row[4]) || 0;
      var desc = (row[5] || '').toString();
      var receipt = (row[6] || '').toString();

      if (rawType === 'POKOK') totalPokok += amount;
      else if (rawType === 'WAJIB') totalWajib += amount;
      else totalSukarela += amount;

      if (!lastDate || formattedDate > lastDate) {
        lastDate = formattedDate;
      }

      transactions.push({
        id: (row[0] || ('TRX-' + i)).toString(),
        memberId: rowMemberId,
        date: formattedDate,
        type: rawType,
        amount: amount,
        description: desc,
        receiptNo: receipt
      });
    }
  }

  return {
    transactions: transactions,
    summary: {
      totalPokok: totalPokok,
      totalWajib: totalWajib,
      totalSukarela: totalSukarela,
      grandTotal: totalPokok + totalWajib + totalSukarela,
      lastPaymentDate: lastDate
    }
  };
}

function getOrCreateSheet(ss, sheetName) {
  var sheet = ss.getSheetByName(sheetName);
  if (!sheet) {
    sheet = ss.insertSheet(sheetName);
    if (sheetName === 'Data_Anggota') {
      sheet.appendRow(['ID Anggota', 'Nama Anggota', 'Username', 'Password', 'Status Keanggotaan']);
    } else if (sheetName === 'Data_Simpanan') {
      sheet.appendRow(['ID Transaksi', 'ID Anggota', 'Tanggal', 'Jenis Simpanan', 'Nominal', 'Keterangan', 'No Kuitansi']);
    }
  }
  return sheet;
}

function responseJson(payload) {
  return ContentService.createTextOutput(JSON.stringify(payload))
    .setMimeType(ContentService.MimeType.JSON);
}
`;

export class GasService {
  // Get stored members
  static getMembers(): Member[] {
    const raw = localStorage.getItem(LOCAL_STORAGE_MEMBERS_KEY);
    if (!raw) {
      localStorage.setItem(LOCAL_STORAGE_MEMBERS_KEY, JSON.stringify(INITIAL_MEMBERS));
      return INITIAL_MEMBERS;
    }
    try {
      return JSON.parse(raw);
    } catch {
      return INITIAL_MEMBERS;
    }
  }

  // Get stored transactions
  static getTransactions(): SavingsTransaction[] {
    const raw = localStorage.getItem(LOCAL_STORAGE_TRANSACTIONS_KEY);
    if (!raw) {
      localStorage.setItem(LOCAL_STORAGE_TRANSACTIONS_KEY, JSON.stringify(INITIAL_TRANSACTIONS));
      return INITIAL_TRANSACTIONS;
    }
    try {
      return JSON.parse(raw);
    } catch {
      return INITIAL_TRANSACTIONS;
    }
  }

  // Calculate summary for member
  static calculateSummary(memberId: string): MemberSavingsSummary {
    const trxs = this.getTransactions().filter(t => t.memberId === memberId);
    let totalPokok = 0;
    let totalWajib = 0;
    let totalSukarela = 0;
    let lastPaymentDate = '';
    let monthsPaid = 0;

    // sort by date desc
    const sorted = [...trxs].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    sorted.forEach(t => {
      if (t.type === 'POKOK') {
        totalPokok += t.amount;
      } else if (t.type === 'WAJIB') {
        totalWajib += t.amount;
        monthsPaid += 1;
      } else {
        totalSukarela += t.amount;
      }
    });

    if (sorted.length > 0) {
      lastPaymentDate = sorted[0].date;
    }

    const currentYearMonth = new Date().toISOString().slice(0, 7); // '2026-09'
    const currentMonthPaid = sorted.some(t => t.type === 'WAJIB' && t.date.startsWith(currentYearMonth));

    return {
      totalPokok,
      totalWajib,
      totalSukarela,
      grandTotal: totalPokok + totalWajib + totalSukarela,
      lastPaymentDate: lastPaymentDate || '-',
      wajibMonthlyRate: 100000,
      monthsPaid,
      currentMonthPaid,
    };
  }

  // Login locally or via Live GAS URL
  static async login(
    identifier: string,
    password: string,
    gasUrl?: string
  ): Promise<{ success: boolean; message: string; member?: Member; summary?: MemberSavingsSummary; transactions?: SavingsTransaction[] }> {
    const cleanId = identifier.trim();
    const cleanPass = password.trim();

    // If custom Google Apps Script Web App URL is provided and active
    if (gasUrl && gasUrl.trim().startsWith('http')) {
      try {
        const urlWithParams = new URL(gasUrl);
        urlWithParams.searchParams.set('action', 'login');
        urlWithParams.searchParams.set('identifier', cleanId);
        urlWithParams.searchParams.set('password', cleanPass);

        const response = await fetch(urlWithParams.toString(), {
          method: 'GET',
          headers: {
            'Accept': 'application/json',
          },
        });

        if (response.ok) {
          const json = await response.json();
          if (json.success && json.member) {
            const memberObj: Member = {
              id: json.member.id,
              name: json.member.name,
              username: json.member.username || cleanId,
              password: cleanPass,
              status: (json.member.status as 'AKTIF' | 'NONAKTIF') || 'AKTIF',
              joinDate: '2023-01-01',
            };

            const remoteTrxs: SavingsTransaction[] = json.savings?.transactions || [];
            const summaryObj: MemberSavingsSummary = json.savings?.summary
              ? {
                  totalPokok: json.savings.summary.totalPokok || 0,
                  totalWajib: json.savings.summary.totalWajib || 0,
                  totalSukarela: json.savings.summary.totalSukarela || 0,
                  grandTotal: json.savings.summary.grandTotal || 0,
                  lastPaymentDate: json.savings.summary.lastPaymentDate || '-',
                  wajibMonthlyRate: 100000,
                  monthsPaid: Math.floor((json.savings.summary.totalWajib || 0) / 100000),
                  currentMonthPaid: true,
                }
              : this.calculateSummary(memberObj.id);

            return {
              success: true,
              message: 'Login Berhasil via Google Apps Script (Live Spreadsheet)',
              member: memberObj,
              summary: summaryObj,
              transactions: remoteTrxs,
            };
          } else {
            return {
              success: false,
              message: json.message || 'ID Anggota atau Kata Sandi tidak cocok di Google Spreadsheet.',
            };
          }
        }
      } catch (err) {
        console.warn('GAS fetch failed, falling back to local database:', err);
        // Fallback to local
      }
    }

    // Local / Default Database Authentication
    const members = this.getMembers();
    const found = members.find(
      m => (m.id.toLowerCase() === cleanId.toLowerCase() || m.username.toLowerCase() === cleanId.toLowerCase()) &&
           m.password === cleanPass
    );

    if (!found) {
      return {
        success: false,
        message: 'Nomor Anggota / Username atau Kata Sandi salah. Silakan periksa kembali.',
      };
    }

    if (found.status !== 'AKTIF') {
      return {
        success: false,
        message: 'Status keanggotaan Anda saat ini: ' + found.status + '. Silakan hubungi bagian administrasi Koperasi.',
      };
    }

    const summary = this.calculateSummary(found.id);
    const transactions = this.getTransactions().filter(t => t.memberId === found.id);

    return {
      success: true,
      message: 'Login Berhasil. Selamat datang, ' + found.name + '!',
      member: found,
      summary,
      transactions,
    };
  }

  // Record a simulated payment for Simpanan Wajib / Pokok
  static recordPayment(
    memberId: string,
    type: 'POKOK' | 'WAJIB' | 'SUKARELA',
    amount: number,
    description: string
  ): SavingsTransaction {
    const current = this.getTransactions();
    const newTrx: SavingsTransaction = {
      id: `TRX-${Date.now().toString().slice(-6)}`,
      memberId,
      date: new Date().toISOString().slice(0, 10),
      type,
      amount,
      description,
      receiptNo: `KWT/${new Date().getFullYear()}/${String(new Date().getMonth() + 1).padStart(2, '0')}/${Math.floor(100 + Math.random() * 900)}`,
      tellerName: 'Sistem Kasir Otomatis Koperasi',
    };

    const updated = [newTrx, ...current];
    localStorage.setItem(LOCAL_STORAGE_TRANSACTIONS_KEY, JSON.stringify(updated));
    return newTrx;
  }

  // Reset database to initial
  static resetToDefault(): void {
    localStorage.setItem(LOCAL_STORAGE_MEMBERS_KEY, JSON.stringify(INITIAL_MEMBERS));
    localStorage.setItem(LOCAL_STORAGE_TRANSACTIONS_KEY, JSON.stringify(INITIAL_TRANSACTIONS));
  }

  // Get GAS Config
  static getGasConfig(): { url: string; isActive: boolean } {
    const raw = localStorage.getItem(LOCAL_STORAGE_GAS_CONFIG_KEY);
    if (!raw) return { url: '', isActive: false };
    try {
      return JSON.parse(raw);
    } catch {
      return { url: '', isActive: false };
    }
  }

  // Save GAS Config
  static saveGasConfig(url: string, isActive: boolean): void {
    localStorage.setItem(
      LOCAL_STORAGE_GAS_CONFIG_KEY,
      JSON.stringify({ url: url.trim(), isActive })
    );
  }
}

export function formatRupiah(amount: number): string {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatDateIndo(dateStr: string): string {
  if (!dateStr || dateStr === '-') return '-';
  try {
    const d = new Date(dateStr);
    return new Intl.DateTimeFormat('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    }).format(d);
  } catch {
    return dateStr;
  }
}
