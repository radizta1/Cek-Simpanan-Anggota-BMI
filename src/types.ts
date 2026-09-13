export interface Member {
  id: string; // e.g. 'BMI0001'
  name: string; // e.g. 'Shafa Radizta Dewantara'
  username: string; // email: 'radiztadewantara@gmail.com'
  password: string; // 'bmi123*'
  status: 'AKTIF' | 'NONAKTIF';
  joinDate: string;
  phone?: string;
  avatarUrl?: string;
  branch?: string;
}

export type SavingsType = 'POKOK' | 'WAJIB' | 'SUKARELA';

export interface SavingsTransaction {
  id: string;
  memberId: string;
  date: string;
  type: SavingsType;
  amount: number;
  description: string;
  receiptNo: string;
  tellerName: string;
}

export interface MemberSavingsSummary {
  totalPokok: number;
  totalWajib: number;
  totalSukarela: number;
  grandTotal: number;
  lastPaymentDate: string;
  wajibMonthlyRate: number;
  monthsPaid: number;
  currentMonthPaid: boolean;
}

export interface GasConfig {
  webAppUrl: string;
  isCustomUrlActive: boolean;
  lastSyncTime?: string;
}
