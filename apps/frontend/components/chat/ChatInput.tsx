import { useState } from 'react';
import { Send, Mic } from 'lucide-react';
import { cn } from '../../lib/utils';

interface ChatInputProps {
  onSend: (message: string) => void;
  disabled?: boolean;
}

const QUICK_ACTIONS = [
  'Show all campaigns',
  'Create new campaign',
  'Budget guidelines',
];

export function ChatInput({ onSend, disabled }: ChatInputProps) {
  const [input, setInput] = useState('');

  const handleSubmit = () => {
    if (input.trim() && !disabled) {
      onSend(input.trim());
      setInput('');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <div className="bg-white border-t px-4 py-3">
      {/* Quick action chips */}
      {!disabled && input === '' && (
        <div className="flex gap-2 mb-2 overflow-x-auto pb-1 scrollbar-hide">
          {QUICK_ACTIONS.map(a => (
            <button
              key={a}
              onClick={() => onSend(a)}
              className="flex-shrink-0 text-[10px] font-medium px-2.5 py-1 bg-blue-50 text-blue-600 border border-blue-100 rounded-full hover:bg-blue-100 transition-colors"
            >
              {a}
            </button>
          ))}
        </div>
      )}

      <div className="flex items-end gap-2 max-w-4xl mx-auto">
        <textarea
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Ask about campaigns, request actions, search guidelines..."
          disabled={disabled}
          className="flex-1 min-h-[44px] max-h-28 w-full rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent resize-none disabled:opacity-50 transition-all"
          rows={1}
          onInput={e => {
            const t = e.target as HTMLTextAreaElement;
            t.style.height = 'auto';
            t.style.height = Math.min(t.scrollHeight, 112) + 'px';
          }}
        />
        <button
          onClick={handleSubmit}
          disabled={!input.trim() || disabled}
          className={cn(
            "h-11 w-11 rounded-2xl flex items-center justify-center transition-all flex-shrink-0 shadow-sm",
            input.trim() && !disabled
              ? "bg-blue-600 text-white hover:bg-blue-700 active:scale-95 shadow-blue-200 shadow-md"
              : "bg-gray-100 text-gray-400 cursor-not-allowed"
          )}
          aria-label="Send message"
        >
          <Send size={16} />
        </button>
      </div>
      <p className="text-center text-[10px] text-gray-300 mt-2">
        AI can make mistakes. High-risk actions require your approval before execution.
      </p>
    </div>
  );
}
