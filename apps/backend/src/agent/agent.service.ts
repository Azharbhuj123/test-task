import { openai } from '../lib/openai';
import { toolRegistry, getOpenAITools } from './tools';
import { approvalService } from '../approvals/approval.service';
import { ragService } from '../rag/rag.service';
import { AgentRequest, AgentResponse } from './agent.types';
import { SYSTEM_PROMPT } from './agent.prompts';
import prisma from '../lib/prisma';

const MAX_AGENT_ITERATIONS = 10;

export class AgentService {
  async processRequest(request: AgentRequest): Promise<AgentResponse> {
    const { conversationId, message } = request;
    
    if (!conversationId) throw new Error("Conversation ID is required in AgentService");

    const conversation = await prisma.conversation.findUnique({
      where: { id: conversationId },
      include: { messages: { orderBy: { createdAt: 'asc' } } }
    });

    if (!conversation) throw new Error("Conversation not found");

    const messages: any[] = conversation.messages.map(m => ({
      role: m.role.toLowerCase() as 'user' | 'assistant',
      content: m.content
    }));

    const ragContext = await ragService.searchKnowledge(message);
    const systemPromptWithRag = `${SYSTEM_PROMPT}\n\nRelevant Knowledge Base Context:\n${ragContext}`;

    messages.unshift({ role: 'system', content: systemPromptWithRag });

    let iterations = 0;
    
    while (iterations < MAX_AGENT_ITERATIONS) {
      iterations++;
      console.log(`[Agent] Starting request (Iteration ${iterations})`);

      let response;
      try {
        response = await openai.chat.completions.create({
          model: 'gpt-4o-mini',
          messages: messages,
          tools: getOpenAITools(),
          tool_choice: 'auto'
        });
      } catch (e: any) {
        console.error('[Agent] OpenAI API failure', e);
        throw new Error('OpenAI API failure: ' + e.message);
      }

      const responseMessage = response.choices[0].message;
      messages.push(responseMessage);

      if (responseMessage.tool_calls) {
        let needsApproval = false;
        let approvalId: string | undefined;

        for (const toolCall of responseMessage.tool_calls) {
          if (toolCall.type !== 'function') continue;
          
          console.log(`[Agent] OpenAI requested tool: ${toolCall.function.name}`);
          const tool = toolRegistry[toolCall.function.name];
          
          if (!tool) {
            messages.push({
              role: 'tool',
              tool_call_id: toolCall.id,
              content: `Error: Tool ${toolCall.function.name} not found.`
            });
            continue;
          }

          try {
            const args = JSON.parse(toolCall.function.arguments);
            const parsedArgs = tool.zod_schema.parse(args);
            
            if (tool.risk === 'HIGH_RISK') {
              console.log(`[Approval] Created approval request for ${toolCall.function.name}`);
              const approval = await approvalService.createApprovalRequest(conversationId, tool.name, parsedArgs);
              needsApproval = true;
              approvalId = approval.id;
              
              messages.push({
                role: 'tool',
                tool_call_id: toolCall.id,
                content: JSON.stringify({
                  status: 'pending_approval',
                  approvalId: approval.id,
                  message: 'This action requires human approval before execution.'
                })
              });
            } else {
              console.log(`[Tool] Executing ${toolCall.function.name}`);
              const result = await tool.execute(parsedArgs);
              console.log(`[Agent] Tool result returned`);
              messages.push({
                role: 'tool',
                tool_call_id: toolCall.id,
                content: JSON.stringify(result)
              });
            }
          } catch (e: any) {
             messages.push({
                role: 'tool',
                tool_call_id: toolCall.id,
                content: `Error executing tool: ${e.message}`
             });
          }
        }
      } else {
        const finalContent = responseMessage.content || '';
        
        // Check if an approval was requested recently in the chat history
        const pendingResponses = messages.filter(m => 
           m.role === 'tool' && 
           typeof m.content === 'string' && 
           m.content.includes('pending_approval')
        );
        
        let status: 'completed' | 'pending_approval' = 'completed';
        let approvalId: string | undefined;

        if (pendingResponses.length > 0) {
           status = 'pending_approval';
           const lastPending = pendingResponses[pendingResponses.length - 1];
           try {
             const parsed = JSON.parse(lastPending.content);
             approvalId = parsed.approvalId;
           } catch (e) {}
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
