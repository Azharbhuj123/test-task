import { z } from 'zod';
import { ToolRegistry } from './agent.types';
import {
  getCampaignsTool,
  getCampaignTool,
  getCampaignMetricsTool,
  getRecentCampaignMetricsTool,
  updateCampaignBudgetTool,
  pauseCampaignTool,
  resumeCampaignTool,
  createCampaignTool,
  updateCampaignObjectiveTool
} from '../campaigns/campaign.tools';
import { searchCampaignKnowledgeTool, listKnowledgeDocumentsTool, readKnowledgeDocumentTool } from '../rag/rag.tools';

export const toolRegistry: ToolRegistry = {
  [getCampaignsTool.name]: getCampaignsTool,
  [getCampaignTool.name]: getCampaignTool,
  [getCampaignMetricsTool.name]: getCampaignMetricsTool,
  [getRecentCampaignMetricsTool.name]: getRecentCampaignMetricsTool,
  [updateCampaignBudgetTool.name]: updateCampaignBudgetTool,
  [pauseCampaignTool.name]: pauseCampaignTool,
  [resumeCampaignTool.name]: resumeCampaignTool,
  [createCampaignTool.name]: createCampaignTool,
  [updateCampaignObjectiveTool.name]: updateCampaignObjectiveTool,
  [searchCampaignKnowledgeTool.name]: searchCampaignKnowledgeTool,
  [listKnowledgeDocumentsTool.name]: listKnowledgeDocumentsTool,
  [readKnowledgeDocumentTool.name]: readKnowledgeDocumentTool,
};

export const getOpenAITools = () =>
  Object.values(toolRegistry).map(t => ({
    type: 'function' as const,
    function: {
      name: t.name,
      description: t.description,
      parameters: t.parameters
    }
  }));
