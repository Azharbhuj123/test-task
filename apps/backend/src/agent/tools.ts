import { ToolRegistry } from './agent.types';
import {
  getCampaignsTool,
  getCampaignTool,
  getCampaignMetricsTool,
  getRecentCampaignMetricsTool,
  updateCampaignBudgetTool,
  pauseCampaignTool,
  resumeCampaignTool
} from '../campaigns/campaign.tools';

export const toolRegistry: ToolRegistry = {
  [getCampaignsTool.name]: getCampaignsTool,
  [getCampaignTool.name]: getCampaignTool,
  [getCampaignMetricsTool.name]: getCampaignMetricsTool,
  [getRecentCampaignMetricsTool.name]: getRecentCampaignMetricsTool,
  [updateCampaignBudgetTool.name]: updateCampaignBudgetTool,
  [pauseCampaignTool.name]: pauseCampaignTool,
  [resumeCampaignTool.name]: resumeCampaignTool
};

// Map ToolDefinitions to Anthropic Tool types
export const getAnthropicTools = () => {
  return Object.values(toolRegistry).map(t => ({
    name: t.name,
    description: t.description,
    input_schema: t.input_schema
  }));
};
