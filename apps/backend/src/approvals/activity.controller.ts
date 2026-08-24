import { Request, Response } from 'express';
import prisma from '../lib/prisma';

export const getActivityLog = async (_req: Request, res: Response) => {
  try {
    const [approvals, executions] = await Promise.all([
      prisma.approvalRequest.findMany({
        orderBy: { createdAt: 'desc' },
        take: 50,
        select: {
          id: true,
          toolName: true,
          toolArguments: true,
          status: true,
          createdAt: true,
          approvedAt: true,
          rejectedAt: true,
          executedAt: true,
          result: true
        }
      }),
      prisma.toolExecution.findMany({
        orderBy: { createdAt: 'desc' },
        take: 50,
        select: {
          id: true,
          toolName: true,
          status: true,
          createdAt: true,
          completedAt: true,
          error: true
        }
      })
    ]);

    res.json({ success: true, data: { approvals, executions } });
  } catch (e: any) {
    res.status(500).json({ success: false, error: e.message });
  }
};

export const getApprovalStats = async (_req: Request, res: Response) => {
  try {
    const [pending, approved, rejected, executed, failed, total] = await Promise.all([
      prisma.approvalRequest.count({ where: { status: 'PENDING' } }),
      prisma.approvalRequest.count({ where: { status: 'APPROVED' } }),
      prisma.approvalRequest.count({ where: { status: 'REJECTED' } }),
      prisma.approvalRequest.count({ where: { status: 'EXECUTED' } }),
      prisma.approvalRequest.count({ where: { status: 'FAILED' } }),
      prisma.approvalRequest.count()
    ]);
    res.json({ success: true, data: { pending, approved, rejected, executed, failed, total } });
  } catch (e: any) {
    res.status(500).json({ success: false, error: e.message });
  }
};
