import { ChatMessage } from "../../types/chat";
import { cn } from "../../lib/utils";
import { Bot, User, ShieldAlert } from "lucide-react";

export function MessageBubble({ message }: { message: ChatMessage }) {
  const isUser = message.role === 'user';
  
  // Extract pending approval tags
  const isPending = message.content.includes('[PENDING_APPROVAL:');
  let cleanContent = message.content;
  if (isPending) {
    cleanContent = message.content.replace(/\[PENDING_APPROVAL:.*?\]/g, '');
  }

  return (
    <div className={cn("flex w-full mb-6", isUser ? "justify-end" : "justify-start")}>
      <div className={cn("flex max-w-[85%] sm:max-w-[75%]", isUser ? "flex-row-reverse" : "flex-row")}>
        
        {/* Avatar */}
        <div className={cn("flex-shrink-0 flex items-center justify-center h-8 w-8 rounded-full", isUser ? "ml-3 bg-blue-100 text-blue-600" : "mr-3 bg-gray-100 text-gray-700")}>
          {isUser ? <User size={16} /> : <Bot size={16} />}
        </div>

        {/* Message Content */}
        <div className="flex flex-col">
          <div className={cn(
            "px-4 py-3 rounded-2xl whitespace-pre-wrap text-sm",
            isUser ? "bg-blue-600 text-white rounded-tr-none" : "bg-white border text-gray-800 rounded-tl-none shadow-sm",
            message.isError && "bg-red-50 text-red-700 border-red-200"
          )}>
            {cleanContent}
          </div>

          {/* Pending Action Callout */}
          {isPending && (
            <div className="mt-2 p-3 bg-amber-50 border border-amber-200 rounded-xl text-sm text-amber-800 flex items-start gap-2 shadow-sm">
               <ShieldAlert className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
               <div>
                  <p className="font-semibold">Approval Required</p>
                  <p className="text-amber-700 mt-1">This action requires human approval before it can be executed. Please review the request in the pending approvals sidebar.</p>
               </div>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
