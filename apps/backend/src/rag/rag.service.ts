import fs from 'fs';
import path from 'path';

export class RagService {
  private knowledgePath = path.join(process.cwd(), '../../knowledge/campaign-guidelines.md');

  async searchKnowledge(query: string): Promise<string> {
    try {
      const text = fs.readFileSync(this.knowledgePath, 'utf8');
      
      // A very simple keyword extraction/fallback matching. 
      // For a robust system we'd use vector embeddings.
      // Since this is a prototype, we'll just return the relevant sections or the whole text if it's small.
      if (text.length < 5000) {
        return text;
      }

      // Simple keyword matching for sections:
      const terms = query.toLowerCase().split(' ').filter(w => w.length > 3);
      const paragraphs = text.split('\n\n');
      const relevant = paragraphs.filter(p => terms.some(t => p.toLowerCase().includes(t)));
      
      if (relevant.length > 0) {
        return relevant.join('\n\n');
      }

      return "No specific guidelines found for the query.";
    } catch (e) {
      console.warn("Failed to read knowledge base file", e);
      return "Knowledge base unavailable.";
    }
  }
}

export const ragService = new RagService();
