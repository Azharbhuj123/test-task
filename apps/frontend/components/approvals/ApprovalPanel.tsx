'use client';

import { useApprovals } from "../../hooks/useApprovals";
import { ApprovalCard } from "./ApprovalCard";
import { Spinner } from "../ui/Spinner";
import { ShieldCheck, RefreshCw } from "lucide-react";

export function ApprovalPanel() {
  const { pendingApprovals, isLoading, error, approve, reject, isMutating } = useApprovals();

  return (
    <div className="flex flex-col h-full bg-gray-50 border-r w-full">
      {/* Header */}
      <div className="h-14 flex items-center justify-between px-5 border-b bg-white flex-shrink-0">
        <div className="flex items-center gap-2">
          <h2 className="font-semibold text-gray-800 text-sm">Pending Approvals</h2>
          {pendingApprovals.length > 0 && (
            <span className="bg-amber-100 text-amber-700 text-xs font-bold px-2 py-0.5 rounded-full border border-amber-200">
              {pendingApprovals.length}
            </span>
          )}
        </div>
        {isMutating && <Spinner className="w-4 h-4 text-gray-400" />}
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4">
        {isLoading && (
          <div className="flex justify-center items-center py-12">
            <Spinner className="text-gray-300 w-5 h-5" />
          </div>
        )}

        {error && (
          <div className="p-3 text-xs text-red-700 bg-red-50 border border-red-200 rounded-lg">
            Failed to load approvals. Is the backend running?
          </div>
        )}

        {!isLoading && !error && pendingApprovals.length === 0 && (
          <div className="flex flex-col items-center justify-center mt-16 text-center px-4">
            <div className="w-12 h-12 bg-green-50 rounded-2xl flex items-center justify-center mb-3">
              <ShieldCheck className="w-6 h-6 text-green-400" />
            </div>
            <p className="text-sm font-medium text-gray-600">All clear</p>
            <p className="text-xs text-gray-400 mt-1">
              Actions requiring your approval will appear here automatically.
            </p>
          </div>
        )}

        {!isLoading && !error && pendingApprovals.map(approval => (
          <ApprovalCard
            key={approval.id}
            approval={approval}
            onApprove={approve}
            onReject={reject}
            disabled={isMutating}
          />
        ))}
      </div>

      {/* Footer hint */}
      <div className="px-4 py-3 border-t bg-white">
        <p className="text-[10px] text-gray-400 leading-tight text-center">
          Approvals refresh automatically every 5s. High-risk AI actions require your explicit approval before execution.
        </p>
      </div>
    </div>
  );
}
