'use client';

import { useState, useCallback } from 'react';
import Image from 'next/image';
import { useConversations } from '../hooks/useConversations';
import { useApprovals } from '../hooks/useApprovals';
import { useBackendHealth } from '../hooks/useBackendHealth';
import { ChatArea } from '../components/chat/ChatArea';
import { RightPanel } from '../components/layout/RightPanel';
import { SettingsModal } from '../components/layout/SettingsModal';
import {
  Plus, Trash2, ShieldAlert,
  BookOpen, Activity, Settings, LayoutPanelLeft, Search
} from 'lucide-react';

type RightTab = 'approvals' | 'documents' | 'activity';

export default function Home() {
  const [activeConversationId, setActiveConversationId] = useState<string | undefined>();
  const [rightTab, setRightTab] = useState<RightTab>('approvals');
  const [rightOpen, setRightOpen] = useState(false); // Default false for the clean look
  const [sidebarExpanded, setSidebarExpanded] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const { conversations, isLoading: convsLoading, remove } = useConversations();
  const { pendingApprovals } = useApprovals();
  const { isConnected } = useBackendHealth();

  const handleNewChat = useCallback(() => {
    setActiveConversationId(undefined);
  }, []);

  const handleSelectConv = useCallback((id: string) => {
    setActiveConversationId(id);
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

  const rightTabs = [
    { id: 'approvals' as RightTab, label: 'Approvals', icon: <ShieldAlert size={16} />, badge: pendingApprovals.length },
    { id: 'documents' as RightTab, label: 'Docs', icon: <BookOpen size={16} /> },
    { id: 'activity' as RightTab, label: 'Activity', icon: <Activity size={16} /> },
  ];

  const filteredConversations = conversations.filter((c: { id: string; title: string }) => 
    c.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex h-screen w-screen bg-[#f8f9fa]">
      <div className="flex h-full w-full overflow-hidden bg-white relative">
        
        {/* ════════════════════════════════════════════════
            EXPANDABLE MINI-SIDEBAR
        ════════════════════════════════════════════════ */}
        <aside 
          className={`flex flex-col h-full bg-[#f8f9fa] border-r border-gray-200 transition-all duration-300 ease-[cubic-bezier(0.2,0.8,0.2,1)] z-20 ${
            sidebarExpanded ? 'w-64' : 'w-[72px]'
          }`}
          onMouseEnter={() => setSidebarExpanded(true)}
          onMouseLeave={() => setSidebarExpanded(false)}
        >
          {/* Logo Area */}
          <div className="h-20 flex items-center px-5 flex-shrink-0">
            {sidebarExpanded ? (
              <Image src="/logo.svg" alt="Campaign Agent" width={110} height={30} className="h-6 w-auto" priority />
            ) : (
              <Image src="/logo.svg" alt="Logo" width={32} height={32} className="w-8 h-8 object-cover object-left rounded-lg" priority />
            )}
          </div>

          {/* Top Actions */}
          <div className="px-3 space-y-2 mb-6">
            <button
              onClick={handleNewChat}
              className={`flex items-center gap-3 p-2.5 rounded-xl text-gray-700 hover:bg-gray-200/60 transition-colors w-full ${!sidebarExpanded && 'justify-center'}`}
              title="New Chat"
            >
              <Plus size={18} className="flex-shrink-0" />
              {sidebarExpanded && <span className="text-sm font-semibold">New Chat</span>}
            </button>
            
            {sidebarExpanded ? (
              <div className="relative w-full">
                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search history..."
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  className="w-full bg-white border border-gray-200 rounded-xl py-2 pl-9 pr-3 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all placeholder:text-gray-400"
                />
              </div>
            ) : (
              <button
                onClick={() => setSidebarExpanded(true)}
                className="flex items-center justify-center p-2.5 rounded-xl text-gray-700 hover:bg-gray-200/60 transition-colors w-full"
                title="Search"
              >
                <Search size={18} className="flex-shrink-0" />
              </button>
            )}
          </div>

          {/* App Tools (Right Panel triggers) */}
          <div className="px-3 space-y-2 mb-6">
            {rightTabs.map(t => (
              <button
                key={t.id}
                onClick={() => {
                  if (rightTab === t.id && rightOpen) {
                    setRightOpen(false);
                  } else {
                    setRightTab(t.id);
                    setRightOpen(true);
                  }
                }}
                className={`flex items-center gap-3 p-2.5 rounded-xl transition-colors w-full relative ${
                  rightTab === t.id && rightOpen
                    ? 'bg-blue-50 text-blue-700'
                    : 'text-gray-700 hover:bg-gray-200/60'
                } ${!sidebarExpanded && 'justify-center'}`}
                title={t.label}
              >
                <div className="relative flex-shrink-0">
                  {t.icon}
                  {(t.badge ?? 0) > 0 && !sidebarExpanded && (
                    <span className="absolute -top-1 -right-1 w-2 h-2 bg-amber-500 rounded-full" />
                  )}
                </div>
                {sidebarExpanded && (
                  <div className="flex flex-1 items-center justify-between min-w-0">
                    <span className="text-sm font-medium truncate">{t.label}</span>
                    {(t.badge ?? 0) > 0 && (
                      <span className="bg-amber-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                        {t.badge}
                      </span>
                    )}
                  </div>
                )}
              </button>
            ))}
          </div>

          {/* Conversations History (Only visible when expanded) */}
          <div className="flex-1 overflow-y-auto px-3">
            {sidebarExpanded && (
              <>
                <div className="px-2 mb-2 text-xs font-semibold text-gray-400 uppercase tracking-wider">History</div>
                {convsLoading && <div className="px-2 text-xs text-gray-400">Loading...</div>}
                {!convsLoading && filteredConversations.length === 0 && (
                  <div className="px-2 text-xs text-gray-400 py-4 text-center">No results found.</div>
                )}
                {!convsLoading && filteredConversations.map((conv: { id: string; title: string }) => (
                  <button
                    key={conv.id}
                    onClick={() => handleSelectConv(conv.id)}
                    className={`w-full text-left px-3 py-2.5 rounded-xl mb-1 group transition-all duration-100 flex items-center justify-between ${
                      activeConversationId === conv.id ? 'bg-purple-50 text-purple-700 font-medium' : 'text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    <span className="text-xs truncate mr-2">{conv.title}</span>
                    <Trash2 
                      size={12} 
                      className="opacity-0 group-hover:opacity-100 text-gray-400 hover:text-red-500 flex-shrink-0 cursor-pointer" 
                      onClick={(e: React.MouseEvent) => handleDelete(e, conv.id)}
                    />
                  </button>
                ))}
              </>
            )}
          </div>

          {/* Sidebar Footer */}
          <div className="p-3 border-t border-gray-200 flex flex-col gap-2">
            <button
              onClick={() => setSettingsOpen(true)}
              className={`flex items-center gap-3 p-2.5 rounded-xl text-gray-700 hover:bg-gray-200/60 transition-colors w-full ${!sidebarExpanded && 'justify-center'}`}
              title="Settings"
            >
              <Settings size={18} className="flex-shrink-0" />
              {sidebarExpanded && <span className="text-sm font-medium">Settings</span>}
            </button>

            <button
              className={`flex items-center gap-3 p-2.5 rounded-xl text-gray-700 hover:bg-gray-200/60 transition-colors w-full ${!sidebarExpanded && 'justify-center'}`}
            >
              <div className="w-6 h-6 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex-shrink-0" />
              {sidebarExpanded && <span className="text-sm font-medium truncate">Demo User</span>}
            </button>
          </div>
        </aside>

        {/* ════════════════════════════════════════════════
            CENTER — Chat Area
        ════════════════════════════════════════════════ */}
        <main className="flex-1 flex flex-col min-w-0 bg-white relative z-10">
          
          {/* Topbar for connection status */}
          <div className="absolute top-4 right-4 z-20 flex items-center gap-3">
            <div className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-50 rounded-full border shadow-sm">
               <span className="relative flex h-2 w-2">
                {isConnected && <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />}
                <span className={`relative inline-flex rounded-full h-2 w-2 ${isConnected ? 'bg-emerald-500' : 'bg-red-500'}`} />
              </span>
              <span className="text-[10px] font-semibold text-gray-500 uppercase tracking-wide">
                {isConnected ? 'Connected' : 'Offline'}
              </span>
            </div>
            
            <button
              onClick={() => setRightOpen(!rightOpen)}
              className={`p-2 rounded-full transition-colors border shadow-sm ${rightOpen ? 'bg-blue-50 border-blue-200 text-blue-600' : 'bg-white border-gray-200 text-gray-500 hover:bg-gray-50'}`}
            >
              <LayoutPanelLeft size={16} />
            </button>
          </div>

          <ChatArea
            conversationId={activeConversationId}
            onConversationCreated={handleConversationCreated}
          />
        </main>

        {/* ════════════════════════════════════════════════
            RIGHT PANEL (Approvals / Docs / Activity)
        ════════════════════════════════════════════════ */}
        {rightOpen && (
          <div className="w-96 border-l border-gray-200 bg-gray-50 flex flex-col z-10 flex-shrink-0">
             <RightPanel tab={rightTab} />
          </div>
        )}

      </div>

      {/* Modals */}
      {settingsOpen && <SettingsModal onClose={() => setSettingsOpen(false)} />}
    </div>
  );
}
