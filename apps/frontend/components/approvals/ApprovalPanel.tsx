'use client';

import { useApprovals } from "../../hooks/useApprovals";
import { ApprovalCard } from "./ApprovalCard";
import { EmptyState } from "../ui/EmptyState";
import { Spinner } from "../ui/Spinner";
import { CheckCircle2 } from "lucide-react";

export function ApprovalPanel() {
  const { pendingApprovals, isLoading, error, approve, reject, isMutating } = useApprovals();

  return (
    <div className="flex flex-col h-full bg-gray-50/80 border-r w-full md:w-80 lg:w-96">
      <div className="h-14 flex items-center px-6 border-b bg-white flex-shrink-0">
        <h2 className="font-semibold text-gray-800 text-sm tracking-wide uppercase">Pending Approvals</h2>
        {pendingApprovals.length > 0 && (
          <span className="ml-2 bg-amber-100 text-amber-800 text-xs font-bold px-2 py-0.5 rounded-full">
            {pendingApprovals.length}
          </span>
        )}
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        {isLoading && (
          <div className="flex justify-center items-center h-32">
            <Spinner className="text-gray-400 w-6 h-6" />
          </div>
        )}

        {error && (
          <div className="p-4 mb-4 text-sm text-red-800 rounded-lg bg-red-50">
            Failed to load approvals.
          </div>
        )}

        {!isLoading && !error && pendingApprovals.length === 0 && (
          <EmptyState 
            title="All clear"
            description="No actions currently require your approval."
            className="mt-10"
            />
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

        {!isLoading && !error && pendingApprovals.length === 0 && (
           <div className="flex justify-center mt-4">
              <CheckCircle2 className="w-12 h-12 text-gray-200" />
           </div>
        )}
      </div>
    </div>
  );
}
