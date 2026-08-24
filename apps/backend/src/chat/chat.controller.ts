import { Request, Response, NextFunction } from 'express';
import { chatService } from './chat.service';

export const handleChat = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { conversationId, message, attachments } = req.body;
    if (!message && (!attachments || attachments.length === 0)) {
      return res.status(400).json({ success: false, error: 'Message or attachment is required' });
    }

    const result = await chatService.handleChat(message || '', conversationId, attachments);
    
    res.json({
      success: true,
      data: result
    });
  } catch (error) {
    next(error);
  }
};
