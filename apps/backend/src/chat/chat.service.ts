import prisma from '../lib/prisma';
import { agentService } from '../agent/agent.service';

export class ChatService {
  async handleChat(message: string, conversationId?: string, attachments?: { type: string, url: string, name: string }[]) {
    let convId = conversationId;
    
    if (!convId) {
      // Find default Demo User for prototyping
      let user = await prisma.user.findUnique({ where: { email: 'demo@example.com' } });
      if (!user) {
        user = await prisma.user.create({ data: { email: 'demo@example.com', name: 'Demo User' } });
      }

      const conv = await prisma.conversation.create({ data: { userId: user.id } });
      convId = conv.id;
    } else {
      const exists = await prisma.conversation.findUnique({ where: { id: convId } });
      if (!exists) throw new Error("Conversation not found");
    }

    // Save user message
    await prisma.message.create({
      data: {
        conversationId: convId,
        role: 'USER',
        content: message,
        attachments: attachments && attachments.length > 0 ? JSON.stringify(attachments) : null
      }
    });

    // Call Agent
    const agentResponse = await agentService.processRequest({
      conversationId: convId,
      message
    });

    // Save assistant message
    await prisma.message.create({
      data: {
        conversationId: convId,
        role: 'ASSISTANT',
        content: agentResponse.message
      }
    });

    return agentResponse;
  }
}

export const chatService = new ChatService();
