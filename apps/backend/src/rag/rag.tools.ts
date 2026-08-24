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

export const listKnowledgeDocumentsTool: ToolDefinition = {
  name: 'list_knowledge_documents',
  description: 'List all documents available in the knowledge base.',
  parameters: { type: 'object', properties: {} },
  zod_schema: z.object({}),
  risk: 'READ',
  execute: async () => {
    return { documents: ragService.listDocuments() };
  }
};

export const readKnowledgeDocumentTool: ToolDefinition = {
  name: 'read_knowledge_document',
  description: 'Read the full, raw content of a specific document in the knowledge base by filename (e.g. campaign-guidelines.md). Use this when asked to summarize or read a specific document.',
  parameters: {
    type: 'object',
    properties: { filename: { type: 'string' } },
    required: ['filename']
  },
  zod_schema: z.object({ filename: z.string() }),
  risk: 'READ',
  execute: async (args: { filename: string }) => {
    return { content: ragService.readDocument(args.filename) };
  }
};
