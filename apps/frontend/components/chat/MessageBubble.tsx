import { ChatMessage } from "../../types/chat";
import { cn } from "../../lib/utils";
import { Bot, User, ShieldAlert } from "lucide-react";
import React from "react";

function formatMessage(content: string): React.ReactNode[] {
  return content.split('\n').map((line, i, arr) => {
    const boldLine = line.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    const codeLine = boldLine.replace(/`(.*?)`/g, '<code class="bg-gray-100 text-blue-700 px-1 py-0.5 rounded text-xs font-mono">$1</code>');
    return (
      <React.Fragment key={i}>
        <span dangerouslySetInnerHTML={{ __html: codeLine }} />
        {i < arr.length - 1 && <br />}
      </React.Fragment>
    );
  });
}

export function MessageBubble({ message }: { message: ChatMessage }) {
  const isUser = message.role === 'user';

  const pendingMatch = message.content.match(/\[PENDING_APPROVAL:(.*?)\]/);
  const isPending = !!pendingMatch;
  const cleanContent = message.content.replace(/\[PENDING_APPROVAL:.*?\]/g, '').trim();

  return (
    <div className={cn("flex w-full mb-5", isUser ? "justify-end" : "justify-start")}>
      <div className={cn("flex max-w-[88%] sm:max-w-[78%]", isUser ? "flex-row-reverse" : "flex-row")}>

        <div className={cn(
          "flex-shrink-0 flex items-center justify-center h-8 w-8 rounded-full",
          isUser ? "ml-2.5 bg-blue-600 text-white" : "mr-2.5 bg-blue-50 text-blue-600 border border-blue-100"
        )}>
          {isUser ? <User size={15} /> : <Bot size={15} />}
        </div>

        <div className="flex flex-col min-w-0">
          <div className={cn(
            "px-4 py-3 text-sm leading-relaxed whitespace-pre-wrap break-words",
            isUser
              ? "bg-blue-600 text-white rounded-2xl rounded-tr-sm shadow-sm"
              : "bg-white text-gray-800 rounded-2xl rounded-tl-sm border shadow-sm",
            message.isError && "bg-red-50 text-red-700 border-red-200"
          )}>
            {isUser ? cleanContent : formatMessage(cleanContent)}
          </div>

          {isPending && (
            <div className="mt-2 p-3 bg-amber-50 border border-amber-200 rounded-xl text-sm text-amber-800 flex items-start gap-2 shadow-sm">
              <ShieldAlert className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-amber-900">Approval Required</p>
                <p className="text-amber-700 mt-0.5 text-xs">
                  Review the request in the <strong>Pending Approvals</strong> panel and click <strong>Approve</strong> to execute.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
