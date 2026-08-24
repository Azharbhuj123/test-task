'use client';

import { ChatLayout } from "../components/chat/ChatLayout";
import { ApprovalPanel } from "../components/approvals/ApprovalPanel";
import { useState } from "react";
import { ClipboardList } from "lucide-react";
import { useApprovals } from "../hooks/useApprovals";

export default function Home() {
  const [showMobileApprovals, setShowMobileApprovals] = useState(false);
  const { pendingApprovals } = useApprovals();

  return (
    <div className="flex h-screen w-full overflow-hidden bg-slate-50">
      {/* Desktop Sidebar */}
      <div className="hidden md:flex h-full flex-shrink-0 w-80 lg:w-96">
        <ApprovalPanel />
      </div>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col h-full overflow-hidden">
        {/* Mobile: Approvals toggle button */}
        <div className="md:hidden flex items-center justify-between px-4 py-2 bg-white border-b text-sm">
          <span className="text-gray-600 font-medium">AI Campaign Agent</span>
          <button
            onClick={() => setShowMobileApprovals(v => !v)}
            className="flex items-center gap-1.5 text-gray-700 bg-gray-100 px-3 py-1.5 rounded-lg hover:bg-gray-200 transition-colors"
          >
            <ClipboardList size={14} />
            Approvals
            {pendingApprovals.length > 0 && (
              <span className="bg-amber-500 text-white text-xs px-1.5 py-0.5 rounded-full font-bold">
                {pendingApprovals.length}
              </span>
            )}
          </button>
        </div>

        {/* Mobile: Approval Drawer */}
        {showMobileApprovals && (
          <div className="md:hidden w-full border-b overflow-y-auto max-h-64 bg-white">
            <ApprovalPanel />
          </div>
        )}

        {/* Main Chat */}
        <div className="flex-1 overflow-hidden">
          <ChatLayout />
        </div>
      </div>
    </div>
  );
}
