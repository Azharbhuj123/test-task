import { anthropic } from '../lib/anthropic';
import { toolRegistry, getAnthropicTools } from './tools';
import { approvalService } from '../approvals/approval.service';
import { ragService } from '../rag/rag.service';
import { AgentRequest, AgentResponse } from './agent.types';
import { SYSTEM_PROMPT } from './agent.prompts';
import prisma from '../lib/prisma';
import { MessageParam } from '@anthropic-ai/sdk/resources/messages';

const MAX_AGENT_ITERATIONS = 10;

export class AgentService {
  async processRequest(request: AgentRequest): Promise<AgentResponse> {
    const { conversationId, message } = request;
    
    if (!conversationId) throw new Error("Conversation ID is required in AgentService");

    // Load conversation history
    const conversation = await prisma.conversation.findUnique({
      where: { id: conversationId },
      include: { messages: { orderBy: { createdAt: 'asc' } } }
    });

    if (!conversation) throw new Error("Conversation not found");

    // Map history to Anthropic format
    const messages: MessageParam[] = conversation.messages.map(m => ({
      role: m.role.toLowerCase() as 'user' | 'assistant',
      content: m.content
    }));

    let iterations = 0;
    
    // Add RAG context if user is asking about guidelines/policies
    // For simplicity in this screening, we'll append RAG context if there's a budget change request
    // or if the user asks a question. Ideally, Claude would have a 'search_knowledge' tool.
    // Let's add a quick RAG check in the prompt to inform the agent:
    const ragContext = await ragService.searchKnowledge(message);
    const systemPromptWithRag = `${SYSTEM_PROMPT}\n\nRelevant Knowledge Base Context:\n${ragContext}`;

    while (iterations < MAX_AGENT_ITERATIONS) {
      iterations++;
      console.log(`[Agent] Starting request (Iteration ${iterations})`);

      let response;
      try {
        response = await anthropic.messages.create({
          model: 'claude-3-haiku-20240307',
          max_tokens: 1024,
          system: systemPromptWithRag,
          messages: messages,
          tools: getAnthropicTools(),
        });
      } catch (e: any) {
        console.error('[Agent] Claude API failure', e);
        throw new Error('Claude API failure: ' + e.message);
      }

      const assistantMessage: MessageParam = { role: 'assistant', content: response.content };
      messages.push(assistantMessage);

      // Check if Claude used tools
      if (response.stop_reason === 'tool_use') {
        const toolUseBlocks = response.content.filter(block => block.type === 'tool_use') as any[];
        
        let toolResultsContent = [];
        let needsApproval = false;
        let approvalId: string | undefined;

        for (const toolUse of toolUseBlocks) {
          console.log(`[Agent] Claude requested tool: ${toolUse.name}`);
          const tool = toolRegistry[toolUse.name];
          
          if (!tool) {
            toolResultsContent.push({
              type: 'tool_result',
              tool_use_id: toolUse.id,
              content: `Error: Tool ${toolUse.name} not found or not allowed.`,
              is_error: true
            });
            continue;
          }

          try {
            // Validate arguments
            const parsedArgs = tool.zod_schema.parse(toolUse.input);
            
            if (tool.risk === 'HIGH_RISK') {
              console.log(`[Approval] Created approval request for ${toolUse.name}`);
              const approval = await approvalService.createApprovalRequest(conversationId, tool.name, parsedArgs);
              needsApproval = true;
              approvalId = approval.id;
              
              toolResultsContent.push({
                type: 'tool_result',
                tool_use_id: toolUse.id,
                content: JSON.stringify({
                  status: 'pending_approval',
                  approvalId: approval.id,
                  message: 'This action requires human approval before execution.'
                })
              });
            } else {
              console.log(`[Tool] Executing ${toolUse.name}`);
              const result = await tool.execute(parsedArgs);
              console.log(`[Agent] Tool result returned`);
              toolResultsContent.push({
                type: 'tool_result',
                tool_use_id: toolUse.id,
                content: JSON.stringify(result)
              });
            }
          } catch (e: any) {
             toolResultsContent.push({
                type: 'tool_result',
                tool_use_id: toolUse.id,
                content: `Error executing tool: ${e.message}`,
                is_error: true
             });
          }
        }

        // Add tool results to message history
        messages.push({ role: 'user', content: toolResultsContent as any });

        // If high risk, we might want to return early and wait for user, but we should let Claude process the pending response so it can formulate a nice reply.
        // So we just continue the loop, Claude will see the pending result and reply.
      } else {
        // Final response
        const textBlocks = response.content.filter(block => block.type === 'text') as any[];
        const finalContent = textBlocks.map(b => b.text).join('\n');
        
        // We detect if an approval was requested during this chain by searching history since we didn't exit the loop earlier.
        const pendingResponses = messages.filter(m => 
           m.role === 'user' && 
           Array.isArray(m.content) && 
           m.content.some((c:any) => c.type === 'tool_result' && typeof c.content === 'string' && c.content.includes('pending_approval'))
        );
        
        let status: 'completed' | 'pending_approval' = 'completed';
        let approvalId: string | undefined;

        if (pendingResponses.length > 0) {
           status = 'pending_approval';
           // Extract approvalId from the last pending response
           const lastPending = pendingResponses[pendingResponses.length - 1];
           if (Array.isArray(lastPending.content)) {
             const resBlock:any = lastPending.content.find((c:any) => c.type === 'tool_result' && typeof c.content === 'string' && c.content.includes('pending_approval'));
             if (resBlock) {
               try {
                 const parsed = JSON.parse(resBlock.content);
                 approvalId = parsed.approvalId;
               } catch (e) {}
             }
           }
        }

        return {
          conversationId,
          message: finalContent,
          status,
          approvalId
        };
      }
    }

    throw new Error('Agent execution limit reached.');
  }
}

export const agentService = new AgentService();
