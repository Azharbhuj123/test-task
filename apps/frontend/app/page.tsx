'use client';

import { useState, useCallback } from 'react';
import Image from 'next/image';
import { useConversations } from '../hooks/useConversations';
import { useApprovals } from '../hooks/useApprovals';
import { useBackendHealth } from '../hooks/useBackendHealth';
import { ChatArea } from '../components/chat/ChatArea';
import { RightPanel } from '../components/layout/RightPanel';
import {
  Plus, MessageSquare, Trash2, ShieldAlert,
  BookOpen, Activity, ChevronRight, X, Menu, Settings
} from 'lucide-react';

import { SettingsModal } from '../components/layout/SettingsModal';

type RightTab = 'approvals' | 'documents' | 'activity';

export default function Home() {
  const [activeConversationId, setActiveConversationId] = useState<string | undefined>();
  const [rightTab, setRightTab] = useState<RightTab>('approvals');
  const [rightOpen, setRightOpen] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);

  const { conversations, isLoading: convsLoading, remove } = useConversations();
  const { pendingApprovals } = useApprovals();
  const { isConnected } = useBackendHealth();

  const handleNewChat = useCallback(() => {
    setActiveConversationId(undefined);
    setSidebarOpen(false);
  }, []);

  const handleSelectConv = useCallback((id: string) => {
    setActiveConversationId(id);
    setSidebarOpen(false);
  }, []);

  const handleConversationCreated = useCallback((id: string) => {
    setActiveConversationId(id);
  }, []);

  const handleDelete = async (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    if (confirm('Delete this conversation?')) {
      await remove(id);
      if (activeConversationId === id) setActiveConversationId(undefined);
    }
  };

  const formatTime = (iso: string) => {
    const d = new Date(iso);
    const now = new Date();
    const diff = now.getTime() - d.getTime();
    if (diff < 60000) return 'just now';
    if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`;
    if (diff < 86400000) return `${Math.floor(diff / 3600000)}h ago`;
    return d.toLocaleDateString([], { month: 'short', day: 'numeric' });
  };

  const rightTabs = [
    { id: 'approvals' as RightTab, label: 'Approvals', icon: <ShieldAlert size={14} />, badge: pendingApprovals.length },
    { id: 'documents' as RightTab, label: 'Docs', icon: <BookOpen size={14} /> },
    { id: 'activity' as RightTab, label: 'Activity', icon: <Activity size={14} /> },
  ];

  return (
    <div className="flex h-screen overflow-hidden" style={{ background: '#f1f5f9' }}>

      {/* ════════════════════════════════════════════════
          LEFT SIDEBAR — dark, conversations list
      ════════════════════════════════════════════════ */}
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="md:hidden fixed inset-0 z-40 bg-black/50 backdrop-blur-sm"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <aside className={`
        fixed md:relative z-50 md:z-auto
        flex flex-col w-64 h-full flex-shrink-0
        transition-sidebar
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
      `}
        style={{ background: 'var(--sidebar-bg)' }}
      >
        {/* Sidebar Header */}
        <div className="flex items-center justify-between px-4 py-4 border-b" style={{ borderColor: 'var(--sidebar-border)' }}>
          <Image src="/logo.svg" alt="Campaign Agent" width={110} height={30} className="h-7 w-auto" priority />
          <button
            className="md:hidden text-gray-400 hover:text-white p-1 rounded"
            onClick={() => setSidebarOpen(false)}
          >
            <X size={16} />
          </button>
        </div>

        {/* New Chat Button */}
        <div className="px-3 py-3">
          <button
            onClick={handleNewChat}
            className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-semibold text-white transition-all duration-150 group"
            style={{ background: '#1E79F8' }}
          >
            <Plus size={16} className="group-hover:rotate-90 transition-transform duration-200" />
            New Conversation
          </button>
        </div>

        {/* Connection Status */}
        <div className="px-4 mb-2 flex items-center gap-2">
          <span className="relative flex h-2 w-2">
            {isConnected && <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />}
            <span className={`relative inline-flex rounded-full h-2 w-2 ${isConnected ? 'bg-emerald-500' : 'bg-red-500'}`} />
          </span>
          <span className="text-[11px] font-medium" style={{ color: isConnected ? '#34d399' : '#f87171' }}>
            {isConnected ? 'Backend connected' : 'Backend offline'}
          </span>
        </div>

        {/* Conversations List */}
        <div className="flex-1 overflow-y-auto px-2 pb-4">
          {convsLoading && (
            <div className="text-center py-8 text-xs" style={{ color: 'rgba(255,255,255,0.3)' }}>
              Loading...
            </div>
          )}

          {!convsLoading && conversations.length === 0 && (
            <div className="text-center py-10 px-4">
              <MessageSquare size={28} className="mx-auto mb-2 opacity-20" style={{ color: 'rgba(255,255,255,0.5)' }} />
              <p className="text-xs" style={{ color: 'rgba(255,255,255,0.3)' }}>No conversations yet</p>
            </div>
          )}

          {conversations.map((conv: { id: string; title: string; messageCount: number; updatedAt: string }) => (
            <button
              key={conv.id}
              onClick={() => handleSelectConv(conv.id)}
              className="w-full text-left px-3 py-2.5 rounded-xl mb-1 group transition-all duration-100 flex items-start gap-2.5"
              style={{
                background: activeConversationId === conv.id
                  ? 'var(--sidebar-active)'
                  : 'transparent',
              }}
              onMouseEnter={e => {
                if (activeConversationId !== conv.id)
                  (e.currentTarget as HTMLElement).style.background = 'var(--sidebar-hover)';
              }}
              onMouseLeave={e => {
                if (activeConversationId !== conv.id)
                  (e.currentTarget as HTMLElement).style.background = 'transparent';
              }}
            >
              <MessageSquare size={14} className="flex-shrink-0 mt-0.5" style={{ color: activeConversationId === conv.id ? '#60a5fa' : 'rgba(255,255,255,0.4)' }} />
              <div className="flex-1 min-w-0">
                <p className="text-xs font-medium truncate leading-snug" style={{ color: activeConversationId === conv.id ? '#fff' : 'rgba(255,255,255,0.75)' }}>
                  {conv.title}
                </p>
                <p className="text-[10px] mt-0.5" style={{ color: 'rgba(255,255,255,0.3)' }}>
                  {formatTime(conv.updatedAt)} · {conv.messageCount} msgs
                </p>
              </div>
              <button
                onClick={e => handleDelete(e, conv.id)}
                className="opacity-0 group-hover:opacity-100 transition-opacity p-0.5 rounded hover:text-red-400"
                style={{ color: 'rgba(255,255,255,0.4)' }}
              >
                <Trash2 size={12} />
              </button>
            </button>
          ))}
        </div>

        {/* Sidebar Footer */}
        <div className="px-4 py-3 border-t" style={{ borderColor: 'var(--sidebar-border)' }}>
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
              D
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold truncate" style={{ color: 'rgba(255,255,255,0.85)' }}>Demo User</p>
              <p className="text-[10px] truncate" style={{ color: 'rgba(255,255,255,0.35)' }}>demo@example.com</p>
            </div>
            <button
              onClick={() => setSettingsOpen(true)}
              className="p-1.5 rounded-lg hover:bg-white/10 transition-colors"
              title="Settings"
            >
              <Settings size={14} style={{ color: 'rgba(255,255,255,0.5)' }} />
            </button>
          </div>
        </div>
      </aside>

      {/* ════════════════════════════════════════════════
          CENTER — Chat
      ════════════════════════════════════════════════ */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden bg-white shadow-sm">

        {/* Chat Topbar */}
        <div className="flex items-center justify-between px-4 py-3 border-b bg-white/80 backdrop-blur-sm flex-shrink-0">
          <div className="flex items-center gap-3">
            {/* Mobile: hamburger */}
            <button
              className="md:hidden p-1.5 rounded-lg hover:bg-gray-100 text-gray-500"
              onClick={() => setSidebarOpen(true)}
            >
              <Menu size={18} />
            </button>
            <div>
              <h1 className="text-sm font-bold text-gray-900 leading-none">
                {activeConversationId
                  ? conversations.find((c: { id: string; title: string }) => c.id === activeConversationId)?.title ?? 'Conversation'
                  : 'New Conversation'}
              </h1>
              <p className="text-[11px] text-gray-400 mt-0.5">AI Campaign Operations Agent · GPT-4o-mini</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Right panel toggle */}
            <div className="hidden md:flex items-center gap-1 bg-gray-100 rounded-lg p-0.5">
              {rightTabs.map(t => (
                <button
                  key={t.id}
                  onClick={() => { setRightTab(t.id); setRightOpen(true); }}
                  className={`relative flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-[11px] font-semibold transition-all ${
                    rightTab === t.id && rightOpen
                      ? 'bg-white text-blue-600 shadow-sm'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  {t.icon}
                  {t.label}
                  {(t.badge ?? 0) > 0 && (
                    <span className="absolute -top-1 -right-1 bg-amber-500 text-white text-[8px] font-bold w-3.5 h-3.5 rounded-full flex items-center justify-center">
                      {t.badge}
                    </span>
                  )}
                </button>
              ))}
              <button
                onClick={() => setRightOpen(v => !v)}
                className="p-1.5 text-gray-400 hover:text-gray-600 transition-colors"
                title={rightOpen ? 'Hide panel' : 'Show panel'}
              >
                <ChevronRight size={14} className={`transition-transform ${rightOpen ? 'rotate-0' : 'rotate-180'}`} />
              </button>
            </div>
          </div>
        </div>

        {/* Chat + Right Panel */}
        <div className="flex flex-1 overflow-hidden">
          <div className="flex-1 overflow-hidden">
            <ChatArea
              conversationId={activeConversationId}
              onConversationCreated={handleConversationCreated}
            />
          </div>

          {/* Right Panel */}
          {rightOpen && (
            <div className="hidden md:flex w-72 lg:w-80 border-l flex-shrink-0 flex-col bg-gray-50/80">
              <RightPanel tab={rightTab} />
            </div>
          )}
        </div>
      </main>

      {/* Modals */}
      {settingsOpen && <SettingsModal onClose={() => setSettingsOpen(false)} />}
    </div>
  );
}
