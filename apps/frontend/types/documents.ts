export type KnowledgeDocument = {
  name: string;
  size: number;
  modified: string;
};

export type ApprovalStats = {
  pending: number;
  approved: number;
  rejected: number;
  executed: number;
  failed: number;
  total: number;
};

export type ActivityApproval = {
  id: string;
  toolName: string;
  toolArguments: string;
  status: string;
  createdAt: string;
  approvedAt?: string;
  rejectedAt?: string;
  executedAt?: string;
  result?: string;
};

export type ActivityExecution = {
  id: string;
  toolName: string;
  status: string;
  createdAt: string;
  completedAt?: string;
  error?: string;
};
