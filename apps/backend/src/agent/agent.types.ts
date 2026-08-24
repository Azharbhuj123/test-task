import { z } from 'zod';

export type ToolRiskLevel = 'READ' | 'LOW_RISK' | 'HIGH_RISK';

export interface AgentRequest {
  conversationId?: string;
  message: string;
}

export interface AgentResponse {
  conversationId: string;
  message: string;
  status: 'completed' | 'pending_approval';
  approvalId?: string;
}

export interface ToolDefinition<T = any> {
  name: string;
  description: string;
  parameters: any; // OpenAI Function parameters JSON schema
  zod_schema: z.ZodType<T>;
  risk: ToolRiskLevel;
  execute: (args: T) => Promise<any>;
}

export interface ToolRegistry {
  [key: string]: ToolDefinition;
}

export interface AgentToolCall {
  id: string;
  name: string;
  input: any;
}

export interface ToolResult {
  tool_call_id: string;
  content: string;
}
