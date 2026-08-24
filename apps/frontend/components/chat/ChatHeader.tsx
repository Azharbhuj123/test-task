import { useBackendHealth } from "../../hooks/useBackendHealth";
import { Badge } from "../ui/Badge";
import { BotMessageSquare } from "lucide-react";

export function ChatHeader() {
  const { isConnected } = useBackendHealth();

  return (
    <header className="h-14 bg-white border-b flex items-center justify-between px-6 flex-shrink-0 z-10">
      <div className="flex items-center gap-2 text-gray-900 font-semibold text-lg">
        <BotMessageSquare className="w-5 h-5 text-blue-600" />
        AI Campaign Assistant
      </div>
      <div>
        <Badge variant={isConnected ? "success" : "destructive"} className="px-3 rounded-full">
          <span className={`w-1.5 h-1.5 rounded-full mr-2 ${isConnected ? 'bg-white' : 'bg-white'}`} />
          {isConnected ? 'Connected' : 'Backend Unavailable'}
        </Badge>
      </div>
    </header>
  );
}
