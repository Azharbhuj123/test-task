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

export const getOpenAITools = () => {
  return Object.values(toolRegistry).map(t => ({
    type: 'function' as const,
    function: {
      name: t.name,
      description: t.description,
      parameters: t.parameters
    }
  }));
};
