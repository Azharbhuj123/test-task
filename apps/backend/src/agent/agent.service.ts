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

    // Build message history for OpenAI
    const messages: any[] = conversation.messages.map(m => {
      let content: any = m.content;
      
      if (m.attachments) {
        try {
          const parsed = JSON.parse(m.attachments);
          const contentArray: any[] = [];
          
          let textContent = m.content || '';
          
          for (const att of parsed) {
            if (att.type === 'image') {
              contentArray.push({ type: 'image_url', image_url: { url: att.url } });
            } else {
              try {
                const base64Data = att.url.split(',')[1];
                if (base64Data) {
                  const decoded = Buffer.from(base64Data, 'base64').toString('utf8');
                  textContent += `\n\n[Attached Document: ${att.name}]\n${decoded}`;
                }
              } catch (e) {
                console.error('Failed to decode document', e);
              }
            }
          }
          
          if (textContent) {
            contentArray.unshift({ type: 'text', text: textContent });
          }
          
          if (contentArray.length > 0) {
            content = contentArray;
          }
        } catch (e) {
          console.error('Failed to parse attachments', e);
        }
      }

      return {
        role: m.role.toLowerCase() as 'user' | 'assistant',
        content
      };
    });

    // Augment system prompt with RAG context
    const ragContext = await ragService.searchKnowledge(message);
    const systemPromptWithRag = ragContext && ragContext !== 'Knowledge base unavailable.'
      ? `${SYSTEM_PROMPT}\n\n---\n## Relevant Knowledge Base Context\n${ragContext}`
      : SYSTEM_PROMPT;

    messages.unshift({ role: 'system', content: systemPromptWithRag });

    let iterations = 0;

    while (iterations < MAX_AGENT_ITERATIONS) {
      iterations++;
      console.log(`[Agent] Iteration ${iterations}`);

      let response;
      try {
        response = await openai.chat.completions.create({
          model: 'gpt-4o-mini',
          messages,
          tools: getOpenAITools(),
          tool_choice: 'auto'
        });
      } catch (e: any) {
        console.error('[Agent] OpenAI API error:', e.message);
        throw new Error('OpenAI API error: ' + e.message);
      }

      const responseMessage = response.choices[0].message;
      const stopReason = response.choices[0].finish_reason;

      // No tool calls — return final response
      if (!responseMessage.tool_calls || responseMessage.tool_calls.length === 0 || stopReason === 'stop') {
        return {
          conversationId,
          message: responseMessage.content || 'No response generated.',
          status: 'completed'
        };
      }

      // Push the assistant message with tool_calls into history
      messages.push(responseMessage);

      // Track whether any high-risk approval was created this iteration
      let approvalCreatedId: string | undefined;

      for (const toolCall of responseMessage.tool_calls) {
        if (toolCall.type !== 'function') continue;

        const toolName = toolCall.function.name;
        const tool = toolRegistry[toolName];
        console.log(`[Agent] Tool requested: ${toolName}`);

        if (!tool) {
          messages.push({
            role: 'tool',
            tool_call_id: toolCall.id,
            content: `Error: Tool "${toolName}" not found in registry.`
          });
          continue;
        }

        try {
          const rawArgs = JSON.parse(toolCall.function.arguments);
          const parsedArgs = tool.zod_schema.parse(rawArgs);

          if (tool.risk === 'HIGH_RISK') {
            // Create approval record — do NOT execute
            const approval = await approvalService.createApprovalRequest(
              conversationId,
              toolName,
              parsedArgs
            );
            approvalCreatedId = approval.id;
            console.log(`[Agent] Approval created: ${approval.id} for ${toolName}`);

            messages.push({
              role: 'tool',
              tool_call_id: toolCall.id,
              content: JSON.stringify({
                status: 'pending_approval',
                approvalId: approval.id,
                message: `Action "${toolName}" requires human approval. An approval request has been created. The user must approve or reject it from the Pending Approvals panel.`
              })
            });
          } else {
            // Execute directly
            const result = await tool.execute(parsedArgs);
            console.log(`[Agent] Tool "${toolName}" executed successfully`);
            messages.push({
              role: 'tool',
              tool_call_id: toolCall.id,
              content: JSON.stringify(result)
            });
          }
        } catch (e: any) {
          console.error(`[Agent] Error executing tool "${toolName}":`, e.message);
          messages.push({
            role: 'tool',
            tool_call_id: toolCall.id,
            content: `Error: ${e.message}`
          });
        }
      }

      // If we created an approval this iteration, do one more LLM call to get
      // a proper user-facing message, then return with pending_approval status
      if (approvalCreatedId) {
        let finalMessage = `I've submitted an approval request for this action. Please review it in the **Pending Approvals** panel on the left and click **Approve** to execute it.`;
        try {
          const finalResponse = await openai.chat.completions.create({
            model: 'gpt-4o-mini',
            messages
          });
          finalMessage = finalResponse.choices[0].message.content || finalMessage;
        } catch (e) {
          // Use default message if this call fails
        }

        return {
          conversationId,
          message: finalMessage,
          status: 'pending_approval',
          approvalId: approvalCreatedId
        };
      }

      // Otherwise continue the loop (tool results were added, get next response)
    }

    throw new Error('Agent reached maximum iterations without a final response.');
  }
}

export const agentService = new AgentService();
