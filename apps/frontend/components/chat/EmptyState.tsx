import Image from 'next/image';
import { Sparkles } from 'lucide-react';

const FEATURES = [
  { icon: '🛠️', label: 'Tool Calling', desc: 'Real-time campaign operations' },
  { icon: '📚', label: 'RAG Knowledge', desc: 'Searches your guidelines' },
  { icon: '🛡️', label: 'Human Approval', desc: 'You approve high-risk actions' },
  { icon: '📊', label: 'Activity Log', desc: 'Full audit trail' },
];

interface EmptyStateProps {
  suggestions: string[];
  onSuggestionClick: (s: string) => void;
}

export function EmptyState({ suggestions, onSuggestionClick }: EmptyStateProps) {
  return (
    <div className="h-full flex flex-col items-center justify-center px-6 py-10 overflow-y-auto">
      <div className="max-w-2xl w-full">

        {/* Hero */}
        <div className="text-center mb-10">
          <div className="flex justify-center mb-5">
            <Image src="/logo.svg" alt="Campaign Agent" width={140} height={40} className="h-10 w-auto" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight mb-3">
            Campaign Operations Agent
          </h1>
          <p className="text-base text-gray-500 max-w-md mx-auto leading-relaxed">
            Your AI-powered operations assistant. Ask about campaigns, analyze performance, search guidelines, and safely request actions.
          </p>

          {/* Feature grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-7">
            {FEATURES.map(f => (
              <div key={f.label} className="bg-gray-50 border border-gray-100 rounded-2xl p-3 text-left hover:border-blue-200 hover:bg-blue-50/40 transition-colors">
                <div className="text-2xl mb-1.5">{f.icon}</div>
                <p className="text-xs font-bold text-gray-800">{f.label}</p>
                <p className="text-[10px] text-gray-500 mt-0.5">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Suggestions */}
        <div className="mb-4 flex items-center gap-3">
          <div className="h-px flex-1 bg-gray-100" />
          <span className="text-[10px] text-gray-400 font-semibold uppercase tracking-widest flex items-center gap-1.5">
            <Sparkles size={11} className="text-blue-400" /> Try asking
          </span>
          <div className="h-px flex-1 bg-gray-100" />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {suggestions.map((s, i) => (
            <button
              key={i}
              onClick={() => onSuggestionClick(s)}
              className="text-left px-4 py-3.5 bg-white border border-gray-200 rounded-2xl text-sm text-gray-700 hover:border-blue-400 hover:bg-blue-50 hover:text-blue-700 transition-all duration-150 shadow-sm hover:shadow-md group"
            >
              <span className="group-hover:translate-x-0.5 inline-block transition-transform duration-150">{s}</span>
            </button>
          ))}
        </div>

      </div>
    </div>
  );
}
