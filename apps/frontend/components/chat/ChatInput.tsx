import { useState, useRef } from 'react';
import { Send, Paperclip, Image as ImageIcon, Globe } from 'lucide-react';

interface ChatInputProps {
  onSend: (msg: string) => void;
  disabled?: boolean;
}

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
    <div className="w-full max-w-3xl mx-auto flex-shrink-0 px-4 pb-6">
      <div className="bg-white border border-gray-200 rounded-2xl shadow-sm focus-within:shadow-md focus-within:border-gray-300 transition-all p-3 pt-4 flex flex-col gap-3">
        
        {/* Top Row: Input and "All Web" toggle */}
        <div className="flex items-start gap-3 px-2">
          <textarea
            ref={textareaRef}
            value={value}
            onChange={e => setValue(e.target.value)}
            onKeyDown={handleKey}
            onInput={handleInput}
            placeholder="Ask whatever you want...."
            disabled={disabled}
            rows={1}
            className="flex-1 resize-none bg-transparent text-sm text-gray-900 placeholder:text-gray-500 font-medium focus:outline-none min-h-[24px] max-h-[120px] leading-relaxed pt-1"
          />
          <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gray-100 text-[11px] font-semibold text-gray-700 hover:bg-gray-200 transition-colors flex-shrink-0">
            <Globe size={12} />
            All Web
            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6"/></svg>
          </button>
        </div>

        {/* Bottom Row: Actions and Send button */}
        <div className="flex items-center justify-between px-2 pt-2 border-t border-gray-50 mt-1">
          <div className="flex items-center gap-4">
            <button className="flex items-center gap-1.5 text-[11px] font-semibold text-gray-500 hover:text-gray-900 transition-colors">
              <Paperclip size={14} />
              Add Attachment
            </button>
            <button className="flex items-center gap-1.5 text-[11px] font-semibold text-gray-500 hover:text-gray-900 transition-colors">
              <ImageIcon size={14} />
              Use Image
            </button>
          </div>
          
          <div className="flex items-center gap-3">
            <span className="text-[10px] font-medium text-gray-400">{value.length}/1000</span>
            <button
              onClick={submit}
              disabled={!hasValue || disabled}
              className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${
                hasValue && !disabled
                  ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow hover:shadow-md'
                  : 'bg-gray-100 text-gray-400 cursor-not-allowed'
              }`}
            >
              <Send size={14} className={hasValue && !disabled ? '' : 'opacity-50'} />
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
