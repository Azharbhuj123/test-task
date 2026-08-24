import { useBackendHealth } from "../../hooks/useBackendHealth";
import { BotMessageSquare, Wifi, WifiOff } from "lucide-react";

export function ChatHeader() {
  const { isConnected } = useBackendHealth();

  return (
    <header className="h-14 bg-white border-b flex items-center justify-between px-5 flex-shrink-0">
      <div className="flex items-center gap-2.5">
        <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
          <BotMessageSquare className="w-4.5 h-4.5 text-white" size={18} />
        </div>
        <div>
          <p className="font-semibold text-gray-900 text-sm leading-tight">AI Campaign Assistant</p>
          <p className="text-xs text-gray-400 leading-tight">Powered by OpenAI · Tool Calling · RAG</p>
        </div>
      </div>
      <div className="flex items-center gap-1.5 text-xs font-medium">
        {isConnected ? (
          <>
            <Wifi size={13} className="text-green-500" />
            <span className="text-green-600">Connected</span>
          </>
        ) : (
          <>
            <WifiOff size={13} className="text-red-400" />
            <span className="text-red-500">Backend Unavailable</span>
          </>
        )}
      </div>
    </header>
  );
}
