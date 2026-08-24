import { useState, useRef } from 'react';
import { Send, Paperclip, Image as ImageIcon, Globe, X, FileText } from 'lucide-react';
import { Attachment } from '../../types/chat';

interface ChatInputProps {
  onSend: (msg: string, attachments?: Attachment[]) => void;
  disabled?: boolean;
}

export function ChatInput({ onSend, disabled }: ChatInputProps) {
  const [value, setValue] = useState('');
  const [attachments, setAttachments] = useState<Attachment[]>([]);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);

  const submit = () => {
    const v = value.trim();
    if ((!v && attachments.length === 0) || disabled) return;
    onSend(v, attachments.length > 0 ? attachments : undefined);
    setValue('');
    setAttachments([]);
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, type: 'image' | 'file') => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    Array.from(files).forEach(file => {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setAttachments(prev => [
            ...prev,
            {
              id: Math.random().toString(36).substring(7),
              type,
              name: file.name,
              url: event.target!.result as string
            }
          ]);
        }
      };
      reader.readAsDataURL(file);
    });
    
    // reset input
    e.target.value = '';
  };

  const removeAttachment = (id: string) => {
    setAttachments(prev => prev.filter(a => a.id !== id));
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

  const hasValue = value.trim().length > 0 || attachments.length > 0;

  return (
    <div className="w-full max-w-3xl mx-auto flex-shrink-0 px-4 pb-6">
      <div className="bg-white border border-gray-200 rounded-2xl shadow-sm focus-within:shadow-md focus-within:border-gray-300 transition-all p-3 pt-4 flex flex-col gap-3">
        
        {/* Attachment Staging Area */}
        {attachments.length > 0 && (
          <div className="flex flex-wrap gap-3 px-2 mb-2">
            {attachments.map(att => (
              <div key={att.id} className="relative group rounded-lg overflow-hidden border border-gray-200 bg-gray-50 flex items-center justify-center">
                {att.type === 'image' ? (
                  <img src={att.url} alt={att.name} className="h-16 w-16 object-cover" />
                ) : (
                  <div className="h-16 w-16 flex flex-col items-center justify-center gap-1 p-2">
                    <FileText size={20} className="text-purple-500" />
                    <span className="text-[8px] font-medium text-gray-500 truncate w-full text-center">{att.name}</span>
                  </div>
                )}
                <button
                  onClick={() => removeAttachment(att.id)}
                  className="absolute top-1 right-1 bg-black/50 hover:bg-black text-white rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <X size={10} />
                </button>
              </div>
            ))}
          </div>
        )}

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
            <input 
              type="file" 
              ref={fileInputRef} 
              className="hidden" 
              multiple 
              accept=".pdf,.doc,.docx,.txt"
              onChange={(e) => handleFileChange(e, 'file')}
            />
            <input 
              type="file" 
              ref={imageInputRef} 
              className="hidden" 
              multiple 
              accept="image/*"
              onChange={(e) => handleFileChange(e, 'image')}
            />
            
            <button onClick={() => fileInputRef.current?.click()} className="flex items-center gap-1.5 text-[11px] font-semibold text-gray-500 hover:text-gray-900 transition-colors">
              <Paperclip size={14} />
              Add Attachment
            </button>
            <button onClick={() => imageInputRef.current?.click()} className="flex items-center gap-1.5 text-[11px] font-semibold text-gray-500 hover:text-gray-900 transition-colors">
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
