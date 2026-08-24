import React from 'react';
import { ChatMessage } from '../../types/chat';
import { Bot, User, ShieldAlert, AlertCircle, CheckCircle2 } from 'lucide-react';

function renderContent(content: string): React.ReactNode {
  return content.split('\n').map((line, i, arr) => {
    const html = line
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/`(.*?)`/g, '<code style="background:#eff6ff;color:#1d4ed8;padding:1px 5px;border-radius:4px;font-size:0.8em;font-family:monospace">$1</code>');
    return (
      <React.Fragment key={i}>
        <span dangerouslySetInnerHTML={{ __html: html }} />
        {i < arr.length - 1 && <br />}
      </React.Fragment>
    );
  });
}

export function MessageBubble({ message, isLast }: { message: ChatMessage; isLast: boolean }) {
  const isUser = message.role === 'user';
  const isPending = message.status === 'pending_approval';

  return (
    <div className={`flex items-start gap-3 mb-6 ${isUser ? 'flex-row-reverse' : ''}`}>

      {/* Avatar */}
      <div className={`flex-shrink-0 w-8 h-8 rounded-xl flex items-center justify-center shadow-sm ${
        isUser
          ? 'bg-blue-600 text-white'
          : 'bg-gradient-to-br from-slate-700 to-slate-900 text-white'
      }`}>
        {isUser ? <User size={14} /> : <Bot size={14} />}
      </div>

      {/* Content */}
      <div className={`flex flex-col max-w-[80%] min-w-0 ${isUser ? 'items-end' : 'items-start'}`}>

        {/* Role label */}
        <span className="text-[10px] font-semibold text-gray-400 mb-1 px-1">
          {isUser ? 'You' : 'Campaign Agent'}
        </span>

        {/* Bubble */}
        <div className={`px-4 py-3 rounded-2xl text-sm leading-relaxed whitespace-pre-wrap break-words shadow-sm ${
          isUser
            ? 'bg-blue-600 text-white rounded-tr-sm'
            : message.isError
            ? 'bg-red-50 text-red-800 border border-red-200 rounded-tl-sm'
            : 'bg-gray-100 text-gray-800 rounded-tl-sm'
        }`}>
          {message.isError && (
            <div className="flex items-center gap-1.5 mb-1.5 text-red-600">
              <AlertCircle size={13} />
              <span className="text-xs font-semibold">Error</span>
            </div>
          )}
          {isUser ? message.content : renderContent(message.content)}
        </div>

        {/* Pending Approval Banner */}
        {isPending && (
          <div className="mt-2 w-full max-w-sm bg-amber-50 border border-amber-200 rounded-xl p-3 flex items-start gap-2.5 shadow-sm">
            <ShieldAlert className="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-xs font-bold text-amber-900">Approval Required</p>
              <p className="text-[11px] text-amber-700 mt-0.5 leading-snug">
                Check the <strong>Approvals</strong> panel → click <strong>Approve</strong> to execute the action.
              </p>
            </div>
          </div>
        )}

        {/* Success execution note */}
        {message.status === 'completed' && !isUser && isLast && (
          <div className="mt-1.5 flex items-center gap-1 text-[10px] text-gray-400">
            <CheckCircle2 size={10} className="text-green-500" />
            Completed
          </div>
        )}

        {/* Timestamp */}
        {message.createdAt && (
          <span className="text-[10px] text-gray-400 mt-1 px-1">
            {new Date(message.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </span>
        )}
      </div>
    </div>
  );
}
