import { Request, Response } from 'express';
import { openAIManager } from '../lib/openai';

export const getSettings = (_req: Request, res: Response) => {
  res.json({
    success: true,
    data: {
      isConfigured: openAIManager.isConfigured(),
      // Mask key — only return last 6 chars for display
      keyPreview: openAIManager.isConfigured()
        ? `sk-...${openAIManager.getCurrentKey().slice(-6)}`
        : null,
    }
  });
};

export const updateApiKey = (req: Request, res: Response) => {
  const { apiKey } = req.body;

  if (!apiKey || typeof apiKey !== 'string' || !apiKey.startsWith('sk-')) {
    res.status(400).json({
      success: false,
      error: 'Invalid API key. OpenAI keys must start with "sk-".'
    });
    return;
  }

  openAIManager.updateKey(apiKey.trim());
  console.log(`[Settings] OpenAI API key updated (ends: ...${apiKey.slice(-6)})`);

  res.json({
    success: true,
    message: 'API key updated successfully.',
    data: {
      isConfigured: true,
      keyPreview: `sk-...${apiKey.slice(-6)}`,
    }
  });
};

export const clearApiKey = (_req: Request, res: Response) => {
  openAIManager.updateKey('');
  res.json({ success: true, message: 'API key cleared.' });
};
