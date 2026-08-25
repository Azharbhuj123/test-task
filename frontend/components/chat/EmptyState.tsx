import { FileText, ListTodo, MessageSquare, Lightbulb, Activity, PieChart } from 'lucide-react';

interface EmptyStateProps {
  suggestions: string[];
  onSuggestionClick: (s: string) => void;
}

const CARDS = [
  { icon: <ListTodo size={16} />, label: 'Show me all active campaigns' },
  { icon: <FileText size={16} />, label: 'How is Campaign Alpha performing?' },
  { icon: <Lightbulb size={16} />, label: 'Create a Summer Sale 2026 campaign' },
  { icon: <MessageSquare size={16} />, label: 'Increase Campaign Alpha budget to $150' },
  { icon: <Activity size={16} />, label: 'Pause underperforming campaigns' },
  { icon: <PieChart size={16} />, label: 'What is our average conversion rate?' }
];

export function EmptyState({ onSuggestionClick }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center w-full max-w-3xl mx-auto px-6 pt-6 pb-4">
      
      {/* Hero Typography */}
      <div className="w-full text-left mb-6">
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-gray-900 mb-1">
          Hi there, <span className="text-gradient-purple">Demo User</span>
        </h1>
        <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-gradient-purple mb-4">
          What would you like to know?
        </h2>
        <p className="text-sm text-gray-400 font-medium max-w-sm">
          Use one of the most common prompts below or use your own to begin
        </p>
      </div>

      {/* Suggestion Cards Grid */}
      <div className="w-full grid grid-cols-2 md:grid-cols-3 gap-3 mb-4">
        {CARDS.map((card, i) => (
          <button
            key={i}
            onClick={() => onSuggestionClick(card.label)}
            className="flex flex-col justify-between items-start text-left bg-gray-50/80 hover:bg-white border border-gray-100 hover:border-gray-200 hover:shadow-sm rounded-2xl p-4 transition-all min-h-[100px] h-full group"
          >
            <span className="text-xs font-semibold text-gray-800 leading-relaxed group-hover:text-blue-900 transition-colors">
              {card.label}
            </span>
            <div className="text-gray-400 mt-4">
              {card.icon}
            </div>
          </button>
        ))}
      </div>

      <div className="w-full flex justify-start">
        <button className="flex items-center gap-1.5 text-[11px] font-semibold text-gray-400 hover:text-gray-600 transition-colors">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/></svg>
          Refresh Prompts
        </button>
      </div>
    </div>
  );
}
