import { useState } from 'react';
import { Approval } from "../../types/approval";
import { Button } from "../ui/Button";
import { Check, X, ShieldAlert } from "lucide-react";

interface ApprovalCardProps {
  approval: Approval;
  onApprove: (id: string) => Promise<void>;
  onReject: (id: string) => Promise<void>;
  disabled: boolean;
}

const TOOL_LABELS: Record<string, string> = {
  update_campaign_budget: 'Update Campaign Budget',
  pause_campaign: 'Pause Campaign',
  resume_campaign: 'Resume Campaign',
};

function formatArgKey(key: string): string {
  return key.replace(/([A-Z])/g, ' $1').replace(/^./, s => s.toUpperCase());
}

function formatArgValue(key: string, value: unknown): string {
  if (key === 'newBudget') return `$${value}`;
  return String(value);
}

export function ApprovalCard({ approval, onApprove, onReject, disabled }: ApprovalCardProps) {
  const [isApproving, setIsApproving] = useState(false);
  const [isRejecting, setIsRejecting] = useState(false);
  let parsedArgs: Record<string, unknown> = {};
  try {
    parsedArgs = JSON.parse(approval.toolArguments);
  } catch {}

  const handleApprove = async () => {
    setIsApproving(true);
    try { await onApprove(approval.id); }
    finally { setIsApproving(false); }
  };

  const handleReject = async () => {
    setIsRejecting(true);
    try { await onReject(approval.id); }
    finally { setIsRejecting(false); }
  };

  const isActionDisabled = disabled || isApproving || isRejecting || approval.status !== 'PENDING';
  const label = TOOL_LABELS[approval.toolName] ?? approval.toolName.replace(/_/g, ' ');
  const timeAgo = new Date(approval.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  return (
    <div className="bg-white border border-amber-200 rounded-xl overflow-hidden shadow-sm mb-3">
      {/* Header */}
      <div className="bg-amber-50 px-4 py-3 border-b border-amber-100 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <ShieldAlert className="w-4 h-4 text-amber-500 flex-shrink-0" />
          <span className="text-sm font-semibold text-gray-800">{label}</span>
        </div>
        <span className="text-xs text-gray-400">{timeAgo}</span>
      </div>

      {/* Arguments */}
      <div className="px-4 py-3">
        <table className="w-full text-sm">
          <tbody>
            {Object.entries(parsedArgs).map(([k, v]) => (
              <tr key={k} className="border-b last:border-0">
                <td className="py-1.5 text-gray-500 font-medium pr-4 text-xs">{formatArgKey(k)}</td>
                <td className="py-1.5 text-gray-900 font-semibold text-xs text-right">{formatArgValue(k, v)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Actions */}
      <div className="px-4 pb-4 flex gap-2">
        <Button
          variant="outline"
          size="sm"
          className="flex-1 text-red-600 border-red-200 hover:bg-red-50 hover:border-red-300"
          onClick={handleReject}
          disabled={isActionDisabled}
          aria-label="Reject action"
        >
          {isRejecting ? (
            <span className="flex items-center gap-1"><span className="animate-spin">⟳</span> Rejecting...</span>
          ) : (
            <span className="flex items-center gap-1"><X size={14} /> Reject</span>
          )}
        </Button>
        <Button
          size="sm"
          className="flex-1 bg-green-600 hover:bg-green-700 text-white border-0"
          onClick={handleApprove}
          disabled={isActionDisabled}
          aria-label="Approve action"
        >
          {isApproving ? (
            <span className="flex items-center gap-1"><span className="animate-spin">⟳</span> Approving...</span>
          ) : (
            <span className="flex items-center gap-1"><Check size={14} /> Approve</span>
          )}
        </Button>
      </div>
    </div>
  );
}
