'use client';

import { useState } from 'react';
import { ChatLayout } from '../components/chat/ChatLayout';
import { ApprovalPanel } from '../components/approvals/ApprovalPanel';
import { DocumentPanel } from '../components/documents/DocumentPanel';
import { ActivityLog } from '../components/activity/ActivityLog';
import { useApprovals } from '../hooks/useApprovals';
import { useBackendHealth } from '../hooks/useBackendHealth';
import {
  BotMessageSquare, ShieldAlert, BookOpen, Activity,
  Wifi, WifiOff, Menu, X
} from 'lucide-react';

type LeftTab = 'approvals' | 'documents' | 'activity';

export default function Home() {
  const [leftTab, setLeftTab] = useState<LeftTab>('approvals');
  const [mobileOpen, setMobileOpen] = useState(false);
  const { pendingApprovals } = useApprovals();
  const { isConnected } = useBackendHealth();

  const tabs: { id: LeftTab; label: string; icon: React.ReactNode; badge?: number }[] = [
    {
      id: 'approvals',
      label: 'Approvals',
      icon: <ShieldAlert size={15} />,
      badge: pendingApprovals.length || undefined
    },
    { id: 'documents', label: 'Knowledge', icon: <BookOpen size={15} /> },
    { id: 'activity', label: 'Activity', icon: <Activity size={15} /> }
  ];

  return (
    <div className="flex flex-col h-screen bg-slate-100 overflow-hidden">
      {/* ── Top App Bar ─────────────────────────────────── */}
      <header className="h-12 bg-white border-b flex items-center px-4 gap-3 flex-shrink-0 shadow-sm z-20">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center shadow-sm">
            <BotMessageSquare size={14} className="text-white" />
          </div>
          <div className="hidden sm:block">
            <p className="text-sm font-bold text-gray-900 leading-none">AI Campaign Agent</p>
            <p className="text-[10px] text-gray-400 leading-none mt-0.5">OpenAI · Tool Calling · RAG · Human Approval</p>
          </div>
        </div>

        <div className="ml-auto flex items-center gap-3">
          <div className="flex items-center gap-1.5 text-xs font-medium">
            {isConnected ? (
              <><Wifi size={12} className="text-green-500" /><span className="text-green-600 hidden sm:inline">Backend Connected</span></>
            ) : (
              <><WifiOff size={12} className="text-red-400" /><span className="text-red-500 hidden sm:inline">Offline</span></>
            )}
          </div>

          {/* Mobile sidebar toggle */}
          <button
            className="md:hidden p-1.5 rounded-lg bg-gray-100 text-gray-600 hover:bg-gray-200"
            onClick={() => setMobileOpen(v => !v)}
          >
            {mobileOpen ? <X size={16} /> : <Menu size={16} />}
          </button>
        </div>
      </header>

      {/* ── Main Body ────────────────────────────────────── */}
      <div className="flex flex-1 overflow-hidden relative">

        {/* ── Left Panel (Desktop) ─────────────────────── */}
        <aside className="hidden md:flex flex-col w-72 lg:w-80 border-r bg-white shadow-sm flex-shrink-0">
          {/* Tab Bar */}
          <div className="flex border-b bg-gray-50">
            {tabs.map(t => (
              <button
                key={t.id}
                onClick={() => setLeftTab(t.id)}
                className={`flex-1 flex flex-col items-center py-2.5 gap-0.5 text-[10px] font-semibold transition-colors relative ${
                  leftTab === t.id
                    ? 'text-blue-600 bg-white border-b-2 border-blue-600'
                    : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
                }`}
              >
                {t.icon}
                {t.label}
                {t.badge ? (
                  <span className="absolute top-1 right-3 bg-amber-500 text-white text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                    {t.badge}
                  </span>
                ) : null}
              </button>
            ))}
          </div>

          {/* Panel Content */}
          <div className="flex-1 overflow-hidden">
            {leftTab === 'approvals' && <ApprovalPanel />}
            {leftTab === 'documents' && <DocumentPanel />}
            {leftTab === 'activity' && <ActivityLog />}
          </div>
        </aside>

        {/* ── Mobile Slide-in Panel ─────────────────────── */}
        {mobileOpen && (
          <div className="md:hidden absolute inset-0 z-30 flex">
            <div className="flex flex-col w-72 bg-white shadow-xl border-r">
              <div className="flex border-b bg-gray-50">
                {tabs.map(t => (
                  <button
                    key={t.id}
                    onClick={() => setLeftTab(t.id)}
                    className={`flex-1 flex flex-col items-center py-2.5 gap-0.5 text-[10px] font-semibold transition-colors ${
                      leftTab === t.id
                        ? 'text-blue-600 bg-white border-b-2 border-blue-600'
                        : 'text-gray-500'
                    }`}
                  >
                    {t.icon}
                    {t.label}
                  </button>
                ))}
              </div>
              <div className="flex-1 overflow-hidden">
                {leftTab === 'approvals' && <ApprovalPanel />}
                {leftTab === 'documents' && <DocumentPanel />}
                {leftTab === 'activity' && <ActivityLog />}
              </div>
            </div>
            {/* Backdrop */}
            <div className="flex-1 bg-black/30" onClick={() => setMobileOpen(false)} />
          </div>
        )}

        {/* ── Chat (Main) ──────────────────────────────── */}
        <main className="flex-1 flex flex-col overflow-hidden bg-slate-50">
          <ChatLayout />
        </main>
      </div>
    </div>
  );
}
