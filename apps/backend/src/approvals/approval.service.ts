import prisma from '../lib/prisma';
import { toolRegistry } from '../agent/tools';

export class ApprovalService {
  async createApprovalRequest(conversationId: string, toolName: string, args: any) {
    return prisma.approvalRequest.create({
      data: {
        conversationId,
        toolName,
        toolArguments: JSON.stringify(args),
        status: 'PENDING'
      }
    });
  }

  async getPendingApprovals() {
    return prisma.approvalRequest.findMany({
      where: { status: 'PENDING' },
      orderBy: { createdAt: 'desc' }
    });
  }

  async getApprovalById(id: string) {
    const approval = await prisma.approvalRequest.findUnique({
      where: { id }
    });
    if (!approval) throw new Error('Approval not found');
    return approval;
  }

  async approveRequest(id: string) {
    const approval = await this.getApprovalById(id);
    
    if (approval.status !== 'PENDING') {
      throw new Error(`Approval request is no longer pending. Current status: ${approval.status}`);
    }

    // Move to APPROVED
    await prisma.approvalRequest.update({
      where: { id },
      data: { status: 'APPROVED', approvedAt: new Date() }
    });

    // Execute Tool
    const tool = toolRegistry[approval.toolName];
    if (!tool) throw new Error('Tool not found');

    let resultData;
    let execStatus: 'SUCCESS' | 'FAILED' = 'SUCCESS';
    let errorMessage: string | undefined;

    try {
      const args = JSON.parse(approval.toolArguments);
      
      // Re-validate arguments for safety before executing
      const parsedArgs = tool.zod_schema.parse(args);
      
      // Execute the action (e.g. update budget)
      resultData = await tool.execute(parsedArgs);
    } catch (error: any) {
      execStatus = 'FAILED';
      errorMessage = error.message || 'Execution failed';
    }

    // Save Execution
    await prisma.toolExecution.create({
      data: {
        approvalRequestId: id,
        toolName: approval.toolName,
        arguments: approval.toolArguments,
        result: resultData ? JSON.stringify(resultData) : null,
        status: execStatus,
        error: errorMessage,
        completedAt: new Date()
      }
    });

    // Update final status
    const finalStatus = execStatus === 'SUCCESS' ? 'EXECUTED' : 'FAILED';
    const updatedApproval = await prisma.approvalRequest.update({
      where: { id },
      data: { 
        status: finalStatus, 
        executedAt: new Date(),
        result: resultData ? JSON.stringify(resultData) : errorMessage
      }
    });

    return {
      success: execStatus === 'SUCCESS',
      data: updatedApproval
    };
  }

  async rejectRequest(id: string, reason?: string) {
    const approval = await this.getApprovalById(id);
    
    if (approval.status !== 'PENDING') {
      throw new Error(`Approval request is no longer pending. Current status: ${approval.status}`);
    }

    return prisma.approvalRequest.update({
      where: { id },
      data: { 
        status: 'REJECTED', 
        rejectedAt: new Date(),
        reason 
      }
    });
  }
}

export const approvalService = new ApprovalService();
