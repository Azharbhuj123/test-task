import OpenAI from 'openai';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';

dotenv.config();

class OpenAIClientManager {
  private client: OpenAI;
  private currentKey: string;

  constructor() {
    this.currentKey = process.env.OPENAI_API_KEY || '';
    this.client = new OpenAI({
      apiKey: this.currentKey || 'missing-key',
    });
  }

  getClient(): OpenAI {
    return this.client;
  }

  getCurrentKey(): string {
    return this.currentKey;
  }

  isConfigured(): boolean {
    return !!this.currentKey && this.currentKey !== 'missing-key';
  }

  // Update the key at runtime — no restart needed
  updateKey(apiKey: string): void {
    this.currentKey = apiKey;
    this.client = new OpenAI({ apiKey });

    // Persist to .env so it survives restarts
    try {
      const envPath = path.join(process.cwd(), '.env');
      let envContent = fs.existsSync(envPath) ? fs.readFileSync(envPath, 'utf8') : '';

      if (envContent.includes('OPENAI_API_KEY=')) {
        envContent = envContent.replace(/^OPENAI_API_KEY=.*/m, `OPENAI_API_KEY="${apiKey}"`);
      } else {
        envContent += `\nOPENAI_API_KEY="${apiKey}"`;
      }
      fs.writeFileSync(envPath, envContent, 'utf8');
    } catch (e) {
      console.warn('[Settings] Could not persist API key to .env:', e);
    }
  }
}

// Singleton
export const openAIManager = new OpenAIClientManager();

// Named export for backwards compatibility
export const openai = new Proxy({} as OpenAI, {
  get(_target, prop) {
    return (openAIManager.getClient() as any)[prop];
  }
});
