'use client';

import { useActivityLog, useApprovalStats } from '../../hooks/useActivity';
import { ActivityApproval } from '../../types/documents';
import { Spinner } from '../ui/Spinner';
import { Activity, CheckCircle2, XCircle, Clock, Zap } from 'lucide-react';

const STATUS_CONFIG: Record<string, { color: string; icon: React.ReactNode; label: string }> = {
  PENDING:  { color: 'bg-amber-100 text-amber-700',  icon: <Clock size={10} />,         label: 'Pending' },
  APPROVED: { color: 'bg-blue-100 text-blue-700',    icon: <CheckCircle2 size={10} />,   label: 'Approved' },
  EXECUTED: { color: 'bg-green-100 text-green-700',  icon: <Zap size={10} />,            label: 'Executed' },
  REJECTED: { color: 'bg-red-100 text-red-700',      icon: <XCircle size={10} />,        label: 'Rejected' },
  FAILED:   { color: 'bg-red-100 text-red-700',      icon: <XCircle size={10} />,        label: 'Failed' },
  SUCCESS:  { color: 'bg-green-100 text-green-700',  icon: <CheckCircle2 size={10} />,   label: 'Success' },
};

const TOOL_LABELS: Record<string, string> = {
  get_campaigns: 'Get Campaigns',
  get_campaign: 'Get Campaign',
  get_campaign_metrics: 'Get Metrics',
  get_recent_campaign_metrics: 'Get Recent Metrics',
  update_campaign_budget: 'Budget Update',
  pause_campaign: 'Pause Campaign',
  resume_campaign: 'Resume Campaign',
  create_campaign: 'Create Campaign',
  update_campaign_objective: 'Update Objective',
  search_campaign_knowledge: 'Knowledge Search',
};

function timeAgo(date: string) {
  const diff = Date.now() - new Date(date).getTime();
  const m = Math.floor(diff / 60000);
  if (m < 1) return 'just now';
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  return `${Math.floor(h / 24)}d ago`;
}

export function ActivityLog() {
  const { data, isLoading } = useActivityLog();
  const { data: stats } = useApprovalStats();

  const approvals: ActivityApproval[] = data?.approvals ?? [];

  return (
    <div className="flex flex-col h-full bg-white">
      {/* Header */}
      <div className="px-4 py-3 border-b flex items-center gap-2">
        <Activity className="w-4 h-4 text-indigo-500" />
        <h3 className="text-sm font-semibold text-gray-800">Activity Log</h3>
        {isLoading && <Spinner className="w-3.5 h-3.5 text-gray-300 ml-auto" />}
      </div>

      {/* Stats Row */}
      {stats && (
        <div className="grid grid-cols-3 gap-1 px-3 py-2 border-b">
          {[
            { label: 'Pending', val: stats.pending, color: 'text-amber-600 bg-amber-50' },
            { label: 'Executed', val: stats.executed, color: 'text-green-600 bg-green-50' },
            { label: 'Rejected', val: stats.rejected, color: 'text-red-600 bg-red-50' },
          ].map(s => (
            <div key={s.label} className={`${s.color} rounded-lg px-2 py-1.5 text-center`}>
              <p className="text-lg font-bold leading-none">{s.val}</p>
              <p className="text-[10px] mt-0.5 font-medium">{s.label}</p>
            </div>
          ))}
        </div>
      )}

      {/* Approval History */}
      <div className="flex-1 overflow-y-auto px-3 py-2 space-y-2">
        {!isLoading && approvals.length === 0 && (
          <div className="text-center py-8 text-xs text-gray-400">
            No activity yet. Actions will appear here.
          </div>
        )}

        {approvals.map((a: ActivityApproval) => {
          const cfg = STATUS_CONFIG[a.status] ?? STATUS_CONFIG.PENDING;
          const toolLabel = TOOL_LABELS[a.toolName] ?? a.toolName.replace(/_/g, ' ');

          let parsedArgs: Record<string, unknown> = {};
          try { parsedArgs = JSON.parse(a.toolArguments); } catch {}

          return (
            <div key={a.id} className="border border-gray-100 rounded-xl p-3 bg-gray-50/50">
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-xs font-semibold text-gray-700">{toolLabel}</span>
                <span className={`inline-flex items-center gap-0.5 text-[10px] font-semibold px-1.5 py-0.5 rounded-full ${cfg.color}`}>
                  {cfg.icon} {cfg.label}
                </span>
              </div>
              <div className="space-y-0.5">
                {Object.entries(parsedArgs).map(([k, v]) => (
                  <p key={k} className="text-[10px] text-gray-500">
                    <span className="font-medium text-gray-600">{k}:</span>{' '}
                    {k === 'newBudget' || k === 'budget' ? `$${v}` : String(v).slice(0, 40)}
                  </p>
                ))}
              </div>
              <p className="text-[10px] text-gray-400 mt-1.5">{timeAgo(a.createdAt)}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
