import { Request, Response, NextFunction } from 'express';
import { chatService } from './chat.service';

export const handleChat = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { conversationId, message } = req.body;
    if (!message) {
      return res.status(400).json({ success: false, error: 'Message is required' });
    }

    const result = await chatService.handleChat(message, conversationId);
    
    res.json({
      success: true,
      data: result
    });
  } catch (error) {
    next(error);
  }
};
