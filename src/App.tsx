/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Member, MemberSavingsSummary, SavingsTransaction, SavingsType } from './types';
import { GasService } from './services/gasService';
import { Header } from './components/Header';
import { LoginForm } from './components/LoginForm';
import { MemberDashboard } from './components/MemberDashboard';
import { DigitalCardModal } from './components/DigitalCardModal';
import { PaymentModal } from './components/PaymentModal';
import { PrintReceiptModal } from './components/PrintReceiptModal';
import { GasIntegrationModal } from './components/GasIntegrationModal';

const SESSION_STORAGE_MEMBER_KEY = 'koperasi_session_member_id';

export default function App() {
  const [member, setMember] = useState<Member | null>(null);
  const [summary, setSummary] = useState<MemberSavingsSummary | null>(null);
  const [transactions, setTransactions] = useState<SavingsTransaction[]>([]);
  const [gasConfig, setGasConfig] = useState<{ url: string; isActive: boolean }>({ url: '', isActive: false });

  // Modal States
  const [isGasModalOpen, setIsGasModalOpen] = useState(false);
  const [isCardModalOpen, setIsCardModalOpen] = useState(false);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [isPrintModalOpen, setIsPrintModalOpen] = useState(false);

  // Initialize data and restore session if available
  useEffect(() => {
    const config = GasService.getGasConfig();
    setGasConfig(config);

    const savedMemberId = sessionStorage.getItem(SESSION_STORAGE_MEMBER_KEY);
    if (savedMemberId) {
      const members = GasService.getMembers();
      const existing = members.find(m => m.id === savedMemberId);
      if (existing) {
        setMember(existing);
        setSummary(GasService.calculateSummary(existing.id));
        setTransactions(GasService.getTransactions().filter(t => t.memberId === existing.id));
      }
    }
  }, []);

  const handleLogin = async (identifier: string, pass: string) => {
    const res = await GasService.login(
      identifier, 
      pass, 
      gasConfig.isActive ? gasConfig.url : undefined
    );

    if (res.success && res.member && res.summary) {
      setMember(res.member);
      setSummary(res.summary);
      setTransactions(res.transactions || []);
      sessionStorage.setItem(SESSION_STORAGE_MEMBER_KEY, res.member.id);
      return { success: true, message: res.message };
    }

    return { success: false, message: res.message };
  };

  const handleLogout = () => {
    sessionStorage.removeItem(SESSION_STORAGE_MEMBER_KEY);
    setMember(null);
    setSummary(null);
    setTransactions([]);
  };

  const handleSavePayment = (type: SavingsType, amount: number, description: string) => {
    if (!member) return;
    const newTrx = GasService.recordPayment(member.id, type, amount, description);
    const updatedTransactions = [newTrx, ...transactions];
    setTransactions(updatedTransactions);
    const updatedSummary = GasService.calculateSummary(member.id);
    setSummary(updatedSummary);
  };

  const handleSaveGasConfig = (url: string, isActive: boolean) => {
    GasService.saveGasConfig(url, isActive);
    setGasConfig({ url, isActive });
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-['Plus_Jakarta_Sans',sans-serif]">
      
      {/* Navigation Header */}
      <Header
        member={member}
        onLogout={handleLogout}
        onOpenGasModal={() => setIsGasModalOpen(true)}
        gasConfigActive={gasConfig.isActive && !!gasConfig.url}
      />

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col justify-center">
        {!member ? (
          <LoginForm
            onLogin={handleLogin}
            onOpenGasModal={() => setIsGasModalOpen(true)}
            gasConfigActive={gasConfig.isActive && !!gasConfig.url}
          />
        ) : (
          summary && (
            <MemberDashboard
              member={member}
              summary={summary}
              transactions={transactions}
              onOpenCardModal={() => setIsCardModalOpen(true)}
              onOpenPaymentModal={() => setIsPaymentModalOpen(true)}
              onOpenPrintModal={() => setIsPrintModalOpen(true)}
              onOpenGasModal={() => setIsGasModalOpen(true)}
            />
          )
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-6 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p>
            © {new Date().getFullYear()} Koperasi Simpan Pinjam BMI. Terhubung Google Apps Script & Spreadsheets.
          </p>
          <div className="flex items-center gap-4 text-emerald-700 font-semibold">
            <button 
              onClick={() => setIsGasModalOpen(true)}
              className="hover:underline cursor-pointer"
            >
              Panduan Google Apps Script (Code.gs)
            </button>
            <span>•</span>
            <span className="text-slate-500 font-normal">Versi 1.0.0</span>
          </div>
        </div>
      </footer>

      {/* Modals */}
      <GasIntegrationModal
        isOpen={isGasModalOpen}
        onClose={() => setIsGasModalOpen(false)}
        onSaveGasConfig={handleSaveGasConfig}
        currentUrl={gasConfig.url}
        isActive={gasConfig.isActive}
      />

      {member && (
        <>
          <DigitalCardModal
            isOpen={isCardModalOpen}
            onClose={() => setIsCardModalOpen(false)}
            member={member}
          />

          <PaymentModal
            isOpen={isPaymentModalOpen}
            onClose={() => setIsPaymentModalOpen(false)}
            member={member}
            onSavePayment={handleSavePayment}
          />

          {summary && (
            <PrintReceiptModal
              isOpen={isPrintModalOpen}
              onClose={() => setIsPrintModalOpen(false)}
              member={member}
              summary={summary}
              transactions={transactions}
            />
          )}
        </>
      )}

    </div>
  );
}
