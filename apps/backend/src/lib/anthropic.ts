import Anthropic from '@anthropic-ai/sdk';
import dotenv from 'dotenv';

dotenv.config();

// Create Anthropic client. 
// If ANTHROPIC_API_KEY is not set, we don't throw immediately so the backend can still start (Step 51)
// but any API call will fail.
export const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY || 'missing-key',
});
