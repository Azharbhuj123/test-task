'use client';

import { useState } from 'react';
import Image from 'next/image';
import { ChatLayout } from '../components/chat/ChatLayout';
import { ApprovalPanel } from '../components/approvals/ApprovalPanel';
import { DocumentPanel } from '../components/documents/DocumentPanel';
import { ActivityLog } from '../components/activity/ActivityLog';
import { useApprovals } from '../hooks/useApprovals';
import { useBackendHealth } from '../hooks/useBackendHealth';
import {
  ShieldAlert, BookOpen, Activity,
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
      icon: <ShieldAlert size={14} />,
      badge: pendingApprovals.length || undefined
    },
    { id: 'documents', label: 'Knowledge', icon: <BookOpen size={14} /> },
    { id: 'activity',  label: 'Activity',  icon: <Activity size={14} /> }
  ];

  return (
    <div className="flex flex-col h-screen bg-slate-100 overflow-hidden">

      {/* ── Top App Bar ──────────────────────────────────────── */}
      <header className="h-13 bg-white border-b flex items-center px-5 gap-4 flex-shrink-0 shadow-sm z-20">

        {/* Logo */}
        <div className="flex items-center gap-3">
          <Image
            src="/logo.svg"
            alt="Logosym"
            width={120}
            height={35}
            priority
            className="h-7 w-auto"
          />
          <div className="hidden sm:block h-5 w-px bg-gray-200" />
          <span className="hidden sm:block text-xs text-gray-400 font-medium">Campaign Operations Agent</span>
        </div>

        {/* Right side */}
        <div className="ml-auto flex items-center gap-3">

          {/* Connection status */}
          <div className="flex items-center gap-1.5 text-xs font-medium">
            {isConnected ? (
              <>
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500" />
                </span>
                <span className="text-green-600 hidden sm:inline">Connected</span>
              </>
            ) : (
              <>
                <WifiOff size={12} className="text-red-400" />
                <span className="text-red-500 hidden sm:inline">Backend Offline</span>
              </>
            )}
          </div>

          {/* Mobile toggle */}
          <button
            className="md:hidden p-1.5 rounded-lg bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors"
            onClick={() => setMobileOpen(v => !v)}
            aria-label="Toggle sidebar"
          >
            {mobileOpen ? <X size={16} /> : <Menu size={16} />}
          </button>
        </div>
      </header>

      {/* ── Body ─────────────────────────────────────────────── */}
      <div className="flex flex-1 overflow-hidden relative">

        {/* ── Left Panel Desktop ──────────────────────────── */}
        <aside className="hidden md:flex flex-col w-72 lg:w-80 border-r bg-white shadow-sm flex-shrink-0">
          <SidebarContent tabs={tabs} leftTab={leftTab} setLeftTab={setLeftTab} />
        </aside>

        {/* ── Mobile Slide-in ─────────────────────────────── */}
        {mobileOpen && (
          <div className="md:hidden absolute inset-0 z-30 flex">
            <div className="flex flex-col w-72 bg-white shadow-2xl border-r">
              <SidebarContent tabs={tabs} leftTab={leftTab} setLeftTab={setLeftTab} />
            </div>
            <div className="flex-1 bg-black/40 backdrop-blur-sm" onClick={() => setMobileOpen(false)} />
          </div>
        )}

        {/* ── Chat Main ───────────────────────────────────── */}
        <main className="flex-1 flex flex-col overflow-hidden bg-slate-50">
          <ChatLayout />
        </main>
      </div>
    </div>
  );
}

function SidebarContent({
  tabs, leftTab, setLeftTab
}: {
  tabs: { id: string; label: string; icon: React.ReactNode; badge?: number }[];
  leftTab: string;
  setLeftTab: (t: any) => void;
}) {
  return (
    <>
      {/* Tab Bar */}
      <div className="flex border-b bg-gray-50/80">
        {tabs.map(t => (
          <button
            key={t.id}
            onClick={() => setLeftTab(t.id)}
            className={`flex-1 flex flex-col items-center py-3 gap-1 text-[10px] font-semibold transition-all relative ${
              leftTab === t.id
                ? 'text-blue-600 bg-white border-b-2 border-blue-600'
                : 'text-gray-400 hover:text-gray-600 hover:bg-gray-100'
            }`}
          >
            {t.icon}
            {t.label}
            {t.badge ? (
              <span className="absolute top-1.5 right-2.5 bg-amber-500 text-white text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center leading-none">
                {t.badge}
              </span>
            ) : null}
          </button>
        ))}
      </div>

      {/* Panel */}
      <div className="flex-1 overflow-hidden">
        {leftTab === 'approvals' && <ApprovalPanel />}
        {leftTab === 'documents' && <DocumentPanel />}
        {leftTab === 'activity'  && <ActivityLog />}
      </div>
    </>
  );
}
