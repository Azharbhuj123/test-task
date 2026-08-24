import { z } from 'zod';
import { ToolDefinition } from '../agent/agent.types';
import { campaignService } from './campaign.service';

export const getCampaignsTool: ToolDefinition = {
  name: 'get_campaigns',
  description: 'Get all campaigns. Optionally filter by status. Valid statuses: ACTIVE, PAUSED, COMPLETED, DRAFT.',
  parameters: {
    type: 'object',
    properties: {
      status: {
        type: 'string',
        description: 'Optional status filter: ACTIVE, PAUSED, COMPLETED, or DRAFT'
      }
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
  description: 'Get details of a specific campaign by its ID.',
  parameters: {
    type: 'object',
    properties: {
      campaignId: {
        type: 'string',
        description: 'The unique ID of the campaign'
      }
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
  description: 'Get all historical performance metrics for a campaign (impressions, clicks, spend, conversions, conversion rate).',
  parameters: {
    type: 'object',
    properties: {
      campaignId: {
        type: 'string',
        description: 'The unique ID of the campaign'
      }
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
  description: 'Get the most recent N days of performance metrics for a campaign. Useful for trend analysis.',
  parameters: {
    type: 'object',
    properties: {
      campaignId: {
        type: 'string',
        description: 'The unique ID of the campaign'
      },
      limit: {
        type: 'number',
        description: 'Number of recent days to fetch (default 5)'
      }
    },
    required: ['campaignId']
  },
  zod_schema: z.object({
    campaignId: z.string(),
    limit: z.number().optional()
  }),
  risk: 'READ',
  execute: async (args: { campaignId: string; limit?: number }) => {
    return campaignService.getRecentCampaignMetrics(args.campaignId, args.limit);
  }
};

export const updateCampaignBudgetTool: ToolDefinition = {
  name: 'update_campaign_budget',
  description: 'Update the daily budget of a campaign. This is a HIGH-RISK action that requires human approval before execution.',
  parameters: {
    type: 'object',
    properties: {
      campaignId: {
        type: 'string',
        description: 'The unique ID of the campaign to update'
      },
      newBudget: {
        type: 'number',
        description: 'The new daily budget amount in USD'
      }
    },
    required: ['campaignId', 'newBudget']
  },
  zod_schema: z.object({
    campaignId: z.string(),
    newBudget: z.number().positive()
  }),
  risk: 'HIGH_RISK',
  execute: async (args: { campaignId: string; newBudget: number }) => {
    return campaignService.updateCampaignBudget(args.campaignId, args.newBudget);
  }
};

export const pauseCampaignTool: ToolDefinition = {
  name: 'pause_campaign',
  description: 'Pause an active campaign. This is a HIGH-RISK action that requires human approval before execution.',
  parameters: {
    type: 'object',
    properties: {
      campaignId: {
        type: 'string',
        description: 'The unique ID of the campaign to pause'
      }
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
  description: 'Resume a paused campaign. This is a low-risk action that does NOT require human approval.',
  parameters: {
    type: 'object',
    properties: {
      campaignId: {
        type: 'string',
        description: 'The unique ID of the campaign to resume'
      }
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
