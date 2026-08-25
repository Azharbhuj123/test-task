'use client';

import { ApprovalPanel } from '../approvals/ApprovalPanel';
import { DocumentPanel } from '../documents/DocumentPanel';
import { ActivityLog } from '../activity/ActivityLog';

type RightTab = 'approvals' | 'documents' | 'activity';

export function RightPanel({ tab }: { tab: RightTab }) {
  return (
    <div className="flex-1 overflow-hidden h-full">
      {tab === 'approvals' && <ApprovalPanel />}
      {tab === 'documents' && <DocumentPanel />}
      {tab === 'activity' && <ActivityLog />}
    </div>
  );
}
