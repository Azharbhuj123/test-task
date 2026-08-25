export type ApprovalStatus = 'PENDING' | 'APPROVED' | 'REJECTED' | 'EXECUTED' | 'FAILED';

export type Approval = {
  id: string;
  toolName: string;
  status: ApprovalStatus;
  toolArguments: string; // JSON string from backend
  result?: string;
  reason?: string;
  createdAt: string;
  updatedAt?: string;
};
