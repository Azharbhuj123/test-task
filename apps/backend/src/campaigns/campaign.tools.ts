import { z } from 'zod';
import { ToolDefinition } from '../agent/agent.types';
import { campaignService } from './campaign.service';

export const getCampaignsTool: ToolDefinition = {
  name: 'get_campaigns',
  description: 'Get all campaigns. Optionally filter by status: ACTIVE, PAUSED, COMPLETED, DRAFT.',
  parameters: {
    type: 'object',
    properties: {
      status: { type: 'string', description: 'Optional status filter: ACTIVE, PAUSED, COMPLETED, or DRAFT' }
    }
  },
  zod_schema: z.object({ status: z.string().optional() }),
  risk: 'READ',
  execute: async (args: { status?: string }) => campaignService.getCampaigns(args.status)
};

export const getCampaignTool: ToolDefinition = {
  name: 'get_campaign',
  description: 'Get details of a specific campaign by its database ID.',
  parameters: {
    type: 'object',
    properties: { campaignId: { type: 'string', description: 'The unique ID of the campaign' } },
    required: ['campaignId']
  },
  zod_schema: z.object({ campaignId: z.string() }),
  risk: 'READ',
  execute: async (args: { campaignId: string }) => campaignService.getCampaignById(args.campaignId)
};

export const getCampaignMetricsTool: ToolDefinition = {
  name: 'get_campaign_metrics',
  description: 'Get all historical performance metrics for a campaign.',
  parameters: {
    type: 'object',
    properties: { campaignId: { type: 'string' } },
    required: ['campaignId']
  },
  zod_schema: z.object({ campaignId: z.string() }),
  risk: 'READ',
  execute: async (args: { campaignId: string }) => campaignService.getCampaignMetrics(args.campaignId)
};

export const getRecentCampaignMetricsTool: ToolDefinition = {
  name: 'get_recent_campaign_metrics',
  description: 'Get the most recent N days of performance metrics for a campaign.',
  parameters: {
    type: 'object',
    properties: {
      campaignId: { type: 'string' },
      limit: { type: 'number', description: 'Number of recent days (default 7)' }
    },
    required: ['campaignId']
  },
  zod_schema: z.object({ campaignId: z.string(), limit: z.number().optional() }),
  risk: 'READ',
  execute: async (args: { campaignId: string; limit?: number }) =>
    campaignService.getRecentCampaignMetrics(args.campaignId, args.limit)
};

export const updateCampaignBudgetTool: ToolDefinition = {
  name: 'update_campaign_budget',
  description: 'Update the daily budget of a campaign. HIGH-RISK — requires human approval before execution.',
  parameters: {
    type: 'object',
    properties: {
      campaignId: { type: 'string', description: 'The unique ID of the campaign' },
      newBudget: { type: 'number', description: 'The new daily budget amount in USD' }
    },
    required: ['campaignId', 'newBudget']
  },
  zod_schema: z.object({ campaignId: z.string(), newBudget: z.number().positive() }),
  risk: 'HIGH_RISK',
  execute: async (args: { campaignId: string; newBudget: number }) =>
    campaignService.updateCampaignBudget(args.campaignId, args.newBudget)
};

export const pauseCampaignTool: ToolDefinition = {
  name: 'pause_campaign',
  description: 'Pause an active campaign. HIGH-RISK — requires human approval before execution.',
  parameters: {
    type: 'object',
    properties: { campaignId: { type: 'string' } },
    required: ['campaignId']
  },
  zod_schema: z.object({ campaignId: z.string() }),
  risk: 'HIGH_RISK',
  execute: async (args: { campaignId: string }) => campaignService.pauseCampaign(args.campaignId)
};

export const resumeCampaignTool: ToolDefinition = {
  name: 'resume_campaign',
  description: 'Resume a paused campaign. HIGH-RISK — requires human approval before execution.',
  parameters: {
    type: 'object',
    properties: { campaignId: { type: 'string' } },
    required: ['campaignId']
  },
  zod_schema: z.object({ campaignId: z.string() }),
  risk: 'HIGH_RISK',
  execute: async (args: { campaignId: string }) => campaignService.resumeCampaign(args.campaignId)
};

// ─── New Tools ───────────────────────────────────────────────────────────────

export const createCampaignTool: ToolDefinition = {
  name: 'create_campaign',
  description: 'Create a brand new campaign with name, objective, and budget. HIGH-RISK — requires human approval.',
  parameters: {
    type: 'object',
    properties: {
      name: { type: 'string', description: 'Campaign name (e.g. "Summer Sale 2026")' },
      objective: {
        type: 'string',
        enum: ['CONVERSIONS', 'TRAFFIC', 'AWARENESS', 'LEADS', 'ENGAGEMENT'],
        description: 'Campaign objective'
      },
      budget: { type: 'number', description: 'Daily budget in USD' }
    },
    required: ['name', 'objective', 'budget']
  },
  zod_schema: z.object({
    name: z.string().min(2),
    objective: z.enum(['CONVERSIONS', 'TRAFFIC', 'AWARENESS', 'LEADS', 'ENGAGEMENT']),
    budget: z.number().positive()
  }),
  risk: 'HIGH_RISK',
  execute: async (args: { name: string; objective: string; budget: number }) =>
    campaignService.createCampaign(args.name, args.objective, args.budget)
};

export const updateCampaignObjectiveTool: ToolDefinition = {
  name: 'update_campaign_objective',
  description: 'Change the objective of an existing campaign. HIGH-RISK — requires human approval.',
  parameters: {
    type: 'object',
    properties: {
      campaignId: { type: 'string' },
      newObjective: {
        type: 'string',
        enum: ['CONVERSIONS', 'TRAFFIC', 'AWARENESS', 'LEADS', 'ENGAGEMENT'],
        description: 'New objective for the campaign'
      }
    },
    required: ['campaignId', 'newObjective']
  },
  zod_schema: z.object({
    campaignId: z.string(),
    newObjective: z.enum(['CONVERSIONS', 'TRAFFIC', 'AWARENESS', 'LEADS', 'ENGAGEMENT'])
  }),
  risk: 'HIGH_RISK',
  execute: async (args: { campaignId: string; newObjective: string }) =>
    campaignService.updateCampaignObjective(args.campaignId, args.newObjective)
};

export const deleteCampaignTool: ToolDefinition = {
  name: 'delete_campaign',
  description: 'Permanently delete a campaign. HIGH-RISK — requires human approval before execution.',
  parameters: {
    type: 'object',
    properties: { campaignId: { type: 'string' } },
    required: ['campaignId']
  },
  zod_schema: z.object({ campaignId: z.string() }),
  risk: 'HIGH_RISK',
  execute: async (args: { campaignId: string }) => campaignService.deleteCampaign(args.campaignId)
};
