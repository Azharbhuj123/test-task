import { z } from 'zod';
import { ToolDefinition } from '../agent/agent.types';
import { ragService } from '../rag/rag.service';

export const searchCampaignKnowledgeTool: ToolDefinition = {
  name: 'search_campaign_knowledge',
  description: 'Search the internal campaign knowledge base for guidelines, best practices, budget rules, and operational policies. Use this when users ask about rules, policies, recommendations, or best practices.',
  parameters: {
    type: 'object',
    properties: {
      query: {
        type: 'string',
        description: 'The search query to look up in the knowledge base'
      }
    },
    required: ['query']
  },
  zod_schema: z.object({
    query: z.string()
  }),
  risk: 'READ',
  execute: async (args: { query: string }) => {
    const result = await ragService.searchKnowledge(args.query);
    return { context: result };
  }
};
