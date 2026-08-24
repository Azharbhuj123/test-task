import { Request, Response, NextFunction } from 'express';
import { approvalService } from './approval.service';

export const getPendingApprovals = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const approvals = await approvalService.getPendingApprovals();
    res.json({ success: true, data: approvals });
  } catch (error) {
    next(error);
  }
};

export const getApprovalById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const approval = await approvalService.getApprovalById(req.params.id);
    res.json({ success: true, data: approval });
  } catch (error) {
    next(error);
  }
};

export const approveRequest = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await approvalService.approveRequest(req.params.id);
    res.json(result);
  } catch (error) {
    next(error);
  }
};

export const rejectRequest = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { reason } = req.body;
    const approval = await approvalService.rejectRequest(req.params.id, reason);
    res.json({ success: true, data: approval });
  } catch (error) {
    next(error);
  }
};
