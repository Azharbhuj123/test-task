import React from 'react';
import { ChatMessage, Attachment } from '../../types/chat';
import { Bot, User, ShieldAlert, AlertCircle, CheckCircle2, FileText } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { DynamicChart } from './DynamicChart';



export function MessageBubble({ message, isLast }: { message: ChatMessage; isLast: boolean }) {
  const isUser = message.role === 'user';
  const isPending = message.status === 'pending_approval';

  return (
    <div className={`flex items-start gap-3 mb-6 ${isUser ? 'flex-row-reverse' : ''}`}>

      {/* Avatar */}
      <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center shadow-sm mt-4 ${
        isUser
          ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white'
          : 'bg-[#1e293b] text-white'
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
        <div className={`px-5 py-4 rounded-[1.25rem] text-sm leading-relaxed whitespace-pre-wrap break-words ${
          isUser
            ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-md'
            : message.isError
            ? 'bg-red-50 text-red-800 border border-red-200'
            : 'bg-[#f4f5f7] text-[#1f2937]'
        }`}>
          {message.isError && (
            <div className="flex items-center gap-1.5 mb-1.5 text-red-600">
              <AlertCircle size={13} />
              <span className="text-xs font-semibold">Error</span>
            </div>
          )}
          {isUser ? (
            <div className="flex flex-col gap-3">
              {message.attachments && message.attachments.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {message.attachments.map(att => (
                    <div key={att.id} className="relative rounded-lg overflow-hidden border border-white/20 bg-white/10 flex items-center justify-center">
                      {att.type === 'image' ? (
                        <img src={att.url} alt={att.name} className="h-20 w-20 object-cover" />
                      ) : (
                        <div className="h-20 w-20 flex flex-col items-center justify-center gap-1.5 p-2 text-white">
                          <FileText size={24} />
                          <span className="text-[9px] font-medium truncate w-full text-center">{att.name}</span>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
              {message.content && <span>{message.content}</span>}
            </div>
          ) : (
            <div className="prose prose-sm max-w-none prose-p:my-1 prose-ul:my-1 prose-ol:my-1 prose-li:my-0 leading-relaxed w-full">
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                components={{
                  strong: ({...props}) => <strong className="text-gradient-purple font-bold" {...props} />,
                  code: ({inline, children, node: _node, className: _className, ...props}: {inline?: boolean, children?: React.ReactNode, node?: unknown, className?: string} & React.HTMLAttributes<HTMLElement>) => {
                    const match = /language-(\w+)/.exec(_className || '');
                    const codeString = String(children).replace(/\n$/, '');
                    
                    if (!inline && match && match[1] === 'json') {
                      try {
                        const parsed = JSON.parse(codeString);
                        if (parsed && parsed.type === 'chart') {
                          return <DynamicChart data={parsed} />;
                        }
                      } catch (e) {
                        // fallback to normal code block if parsing fails
                      }
                    }

                    return inline ? (
                      <code className="bg-blue-50 text-blue-700 px-1.5 py-0.5 rounded text-[0.85em] font-mono before:content-none after:content-none" {...props}>{children}</code>
                    ) : (
                      <code className="block bg-gray-800 text-gray-100 p-3 rounded-lg overflow-x-auto text-sm my-2 font-mono before:content-none after:content-none" {...props}>{children}</code>
                    );
                  }
                }}
              >
                {message.content || ''}
              </ReactMarkdown>
            </div>
          )}
        </div>

        {/* Pending Approval Banner */}
        {isPending && (
          <div className="mt-2 w-full max-w-sm bg-purple-50/50 border border-purple-200 rounded-xl p-3 flex items-start gap-2.5 shadow-sm">
            <ShieldAlert className="w-4 h-4 text-purple-500 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-xs font-bold text-purple-900">Approval Required</p>
              <p className="text-[11px] text-purple-700 mt-0.5 leading-snug">
                Check the <strong>Approvals</strong> panel → click <strong>Approve</strong> to execute the action.
              </p>
            </div>
          </div>
        )}

        {/* Success Approval Banner */}
        {message.status === 'completed' && message.approvalId && (
          <div className="mt-2 w-full max-w-sm bg-green-50 border border-green-200 rounded-xl p-3 flex items-start gap-2.5 shadow-sm">
            <CheckCircle2 className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-xs font-bold text-green-900">Task Completed</p>
              <p className="text-[11px] text-green-700 mt-0.5 leading-snug">
                Approval was granted and the action executed successfully!
              </p>
            </div>
          </div>
        )}

        {/* Success execution note (for non-approval tasks) */}
        {message.status === 'completed' && !message.approvalId && !isUser && isLast && (
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
