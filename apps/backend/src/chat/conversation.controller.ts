import { Request, Response } from 'express';
import prisma from '../lib/prisma';

// List all conversations with preview
export const getConversations = async (_req: Request, res: Response) => {
  try {
    const conversations = await prisma.conversation.findMany({
      orderBy: { updatedAt: 'desc' },
      include: {
        messages: {
          orderBy: { createdAt: 'asc' },
          take: 1,
          where: { role: 'USER' }
        },
        _count: { select: { messages: true } }
      }
    });

    const data = conversations.map((c: any) => ({
      id: c.id,
      title: c.title || (c.messages[0]?.content?.slice(0, 60) ?? 'New Conversation'),
      messageCount: c._count.messages,
      createdAt: c.createdAt,
      updatedAt: c.updatedAt,
    }));

    res.json({ success: true, data });
  } catch (e: any) {
    res.status(500).json({ success: false, error: e.message });
  }
};

// Get all messages for a conversation
export const getConversationMessages = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const messages = await prisma.message.findMany({
      where: { conversationId: id },
      orderBy: { createdAt: 'asc' }
    });
    res.json({ success: true, data: messages });
  } catch (e: any) {
    res.status(500).json({ success: false, error: e.message });
  }
};

// Delete a conversation
export const deleteConversation = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await prisma.conversation.delete({ where: { id } });
    res.json({ success: true });
  } catch (e: any) {
    res.status(500).json({ success: false, error: e.message });
  }
};
