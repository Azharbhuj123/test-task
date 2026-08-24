import { Router } from 'express';
import { getCampaigns, getCampaignById, getCampaignMetrics } from '../campaigns/campaign.controller';
import { handleChat } from '../chat/chat.controller';
import { getPendingApprovals, getApprovalById, approveRequest, rejectRequest } from '../approvals/approval.controller';
import { getActivityLog, getApprovalStats } from '../approvals/activity.controller';
import { listDocuments, uploadDocument, deleteDocument } from '../rag/rag.controller';

const router = Router();

// Campaign Routes
router.get('/campaigns', getCampaigns);
router.get('/campaigns/:id', getCampaignById);
router.get('/campaigns/:id/metrics', getCampaignMetrics);

// Chat Route
router.post('/chat', handleChat);

// Approval Routes
router.get('/approvals/pending', getPendingApprovals);
router.get('/approvals/stats', getApprovalStats);
router.get('/approvals/activity', getActivityLog);
router.get('/approvals/:id', getApprovalById);
router.post('/approvals/:id/approve', approveRequest);
router.post('/approvals/:id/reject', rejectRequest);

// Document / RAG Routes
router.get('/documents', listDocuments);
router.post('/documents/upload', uploadDocument);
router.delete('/documents/:name', deleteDocument);

export default router;
