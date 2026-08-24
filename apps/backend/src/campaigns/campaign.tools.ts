import { z } from 'zod';
import { ToolDefinition } from '../agent/agent.types';
import { campaignService } from './campaign.service';

export const getCampaignsTool: ToolDefinition = {
  name: 'get_campaigns',
  description: 'Get all campaigns, optionally filtered by status (ACTIVE, PAUSED, COMPLETED, DRAFT)',
  parameters: {
    type: 'object',
    properties: {
      status: { type: 'string', description: 'Optional status filter' }
    }
  },
  zod_schema: z.object({
    status: z.string().optional()
  }),
  risk: 'READ',
  execute: async (args: { status?: string }) => {
    return campaignService.getCampaigns(args.status);
  }
};

export const getCampaignTool: ToolDefinition = {
  name: 'get_campaign',
  description: 'Get campaign details by its unique ID',
  parameters: {
    type: 'object',
    properties: {
      campaignId: { type: 'string' }
    },
    required: ['campaignId']
  },
  zod_schema: z.object({
    campaignId: z.string()
  }),
  risk: 'READ',
  execute: async (args: { campaignId: string }) => {
    return campaignService.getCampaignById(args.campaignId);
  }
};

export const getCampaignMetricsTool: ToolDefinition = {
  name: 'get_campaign_metrics',
  description: 'Get all metrics for a campaign',
  parameters: {
    type: 'object',
    properties: {
      campaignId: { type: 'string' }
    },
    required: ['campaignId']
  },
  zod_schema: z.object({
    campaignId: z.string()
  }),
  risk: 'READ',
  execute: async (args: { campaignId: string }) => {
    return campaignService.getCampaignMetrics(args.campaignId);
  }
};

export const getRecentCampaignMetricsTool: ToolDefinition = {
  name: 'get_recent_campaign_metrics',
  description: 'Get recent metrics for a campaign',
  parameters: {
    type: 'object',
    properties: {
      campaignId: { type: 'string' },
      limit: { type: 'number', description: 'Number of recent metrics to fetch (default 5)' }
    },
    required: ['campaignId']
  },
  zod_schema: z.object({
    campaignId: z.string(),
    limit: z.number().optional()
  }),
  risk: 'READ',
  execute: async (args: { campaignId: string, limit?: number }) => {
    return campaignService.getRecentCampaignMetrics(args.campaignId, args.limit);
  }
};

export const updateCampaignBudgetTool: ToolDefinition = {
  name: 'update_campaign_budget',
  description: 'Update the budget of a campaign. Requires human approval.',
  parameters: {
    type: 'object',
    properties: {
      campaignId: { type: 'string' },
      newBudget: { type: 'number', description: 'The new budget amount' }
    },
    required: ['campaignId', 'newBudget']
  },
  zod_schema: z.object({
    campaignId: z.string(),
    newBudget: z.number().positive()
  }),
  risk: 'HIGH_RISK',
  execute: async (args: { campaignId: string, newBudget: number }) => {
    return campaignService.updateCampaignBudget(args.campaignId, args.newBudget);
  }
};

export const pauseCampaignTool: ToolDefinition = {
  name: 'pause_campaign',
  description: 'Pause a campaign. Requires human approval.',
  parameters: {
    type: 'object',
    properties: {
      campaignId: { type: 'string' }
    },
    required: ['campaignId']
  },
  zod_schema: z.object({
    campaignId: z.string()
  }),
  risk: 'HIGH_RISK',
  execute: async (args: { campaignId: string }) => {
    return campaignService.pauseCampaign(args.campaignId);
  }
};

export const resumeCampaignTool: ToolDefinition = {
  name: 'resume_campaign',
  description: 'Resume a paused campaign.',
  parameters: {
    type: 'object',
    properties: {
      campaignId: { type: 'string' }
    },
    required: ['campaignId']
  },
  zod_schema: z.object({
    campaignId: z.string()
  }),
  risk: 'LOW_RISK',
  execute: async (args: { campaignId: string }) => {
    return campaignService.resumeCampaign(args.campaignId);
  }
};
