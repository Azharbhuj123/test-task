import { useState, useRef } from 'react';
import { Send, Zap } from 'lucide-react';

interface ChatInputProps {
  onSend: (msg: string) => void;
  disabled?: boolean;
}

const QUICK = ['Show campaigns', 'Budget guidelines', 'Create campaign'];

export function ChatInput({ onSend, disabled }: ChatInputProps) {
  const [value, setValue] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const submit = () => {
    const v = value.trim();
    if (!v || disabled) return;
    onSend(v);
    setValue('');
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }
  };

  const handleKey = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      submit();
    }
  };

  const handleInput = () => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = 'auto';
    el.style.height = Math.min(el.scrollHeight, 120) + 'px';
  };

  const hasValue = value.trim().length > 0;

  return (
    <div className="flex-shrink-0 border-t bg-white px-4 py-3">

      {/* Quick actions */}
      {!disabled && !hasValue && (
        <div className="flex gap-2 mb-3 overflow-x-auto pb-0.5">
          {QUICK.map(q => (
            <button
              key={q}
              onClick={() => onSend(q)}
              className="flex-shrink-0 flex items-center gap-1 text-[11px] font-semibold px-3 py-1.5 rounded-full border border-blue-100 text-blue-600 bg-blue-50 hover:bg-blue-100 transition-colors"
            >
              <Zap size={10} />
              {q}
            </button>
          ))}
        </div>
      )}

      {/* Input row */}
      <div className="flex items-end gap-3 max-w-3xl mx-auto">
        <div className={`flex-1 flex items-end gap-2 bg-gray-50 border rounded-2xl px-4 py-3 transition-all ${
          disabled ? 'opacity-60' : 'hover:border-blue-300 focus-within:border-blue-400 focus-within:ring-4 focus-within:ring-blue-50 focus-within:bg-white'
        }`}>
          <textarea
            ref={textareaRef}
            value={value}
            onChange={e => setValue(e.target.value)}
            onKeyDown={handleKey}
            onInput={handleInput}
            placeholder="Ask about campaigns, request actions, search guidelines..."
            disabled={disabled}
            rows={1}
            className="flex-1 resize-none bg-transparent text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none min-h-[24px] max-h-[120px] leading-6"
          />
        </div>

        <button
          onClick={submit}
          disabled={!hasValue || disabled}
          className={`flex-shrink-0 w-11 h-11 rounded-2xl flex items-center justify-center transition-all duration-150 ${
            hasValue && !disabled
              ? 'bg-blue-600 text-white hover:bg-blue-700 shadow-lg shadow-blue-200 active:scale-95'
              : 'bg-gray-100 text-gray-300 cursor-not-allowed'
          }`}
          aria-label="Send"
        >
          <Send size={16} className={hasValue && !disabled ? '' : 'opacity-40'} />
        </button>
      </div>

      <p className="text-center text-[10px] text-gray-300 mt-2">
        High-risk actions (budget changes, pauses) require your explicit approval before execution.
      </p>
    </div>
  );
}
