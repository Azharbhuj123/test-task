import fs from 'fs';
import path from 'path';

const KNOWLEDGE_DIR = path.join(process.cwd(), '../../knowledge');

export class RagService {
  private getKnowledgeFiles(): string[] {
    try {
      if (!fs.existsSync(KNOWLEDGE_DIR)) {
        fs.mkdirSync(KNOWLEDGE_DIR, { recursive: true });
      }
      return fs
        .readdirSync(KNOWLEDGE_DIR)
        .filter(f => f.endsWith('.md') || f.endsWith('.txt'))
        .map(f => path.join(KNOWLEDGE_DIR, f));
    } catch {
      return [];
    }
  }

  async searchKnowledge(query: string): Promise<string> {
    const files = this.getKnowledgeFiles();
    if (files.length === 0) return 'Knowledge base is empty.';

    const allChunks: { text: string; source: string }[] = [];

    for (const filePath of files) {
      try {
        const text = fs.readFileSync(filePath, 'utf8');
        const paragraphs = text.split(/\n\n+/).filter(p => p.trim().length > 20);
        for (const p of paragraphs) {
          allChunks.push({ text: p.trim(), source: path.basename(filePath) });
        }
      } catch {
        continue;
      }
    }

    // Simple keyword relevance score
    const terms = query
      .toLowerCase()
      .split(/\s+/)
      .filter(w => w.length > 2);

    const scored = allChunks.map(chunk => {
      const lower = chunk.text.toLowerCase();
      const score = terms.reduce((acc, t) => acc + (lower.includes(t) ? 1 : 0), 0);
      return { ...chunk, score };
    });

    const relevant = scored
      .filter(c => c.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, 6);

    if (relevant.length === 0) {
      // Fallback: return first 3 chunks from first file
      const fallback = allChunks.slice(0, 3).map(c => c.text).join('\n\n');
      return fallback || 'No relevant content found.';
    }

    return relevant.map(c => `[${c.source}]\n${c.text}`).join('\n\n---\n\n');
  }

  readDocument(filename: string): string {
    const safeName = filename.replace(/[^a-zA-Z0-9._-]/g, '_');
    const dest = path.join(KNOWLEDGE_DIR, safeName);
    if (!fs.existsSync(dest)) return 'Document not found.';
    return fs.readFileSync(dest, 'utf8');
  }

  listDocuments(): { name: string; size: number; modified: string }[] {
    const files = this.getKnowledgeFiles();
    return files.map(f => {
      const stat = fs.statSync(f);
      return {
        name: path.basename(f),
        size: stat.size,
        modified: stat.mtime.toISOString()
      };
    });
  }

  saveDocument(filename: string, content: string): void {
    const safeName = filename.replace(/[^a-zA-Z0-9._-]/g, '_');
    const dest = path.join(KNOWLEDGE_DIR, safeName);
    fs.writeFileSync(dest, content, 'utf8');
  }

  deleteDocument(filename: string): void {
    const safeName = filename.replace(/[^a-zA-Z0-9._-]/g, '_');
    const dest = path.join(KNOWLEDGE_DIR, safeName);
    if (fs.existsSync(dest)) {
      fs.unlinkSync(dest);
    }
  }
}

export const ragService = new RagService();
