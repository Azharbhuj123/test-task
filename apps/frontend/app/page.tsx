import { ChatLayout } from "../components/chat/ChatLayout";
import { ApprovalPanel } from "../components/approvals/ApprovalPanel";

export default function Home() {
  return (
    <div className="flex h-screen w-full overflow-hidden bg-white">
      {/* Mobile: Chat takes full, Sidebar pushes down. Desktop: Sidebar left, Chat right */}
      <div className="hidden md:flex h-full flex-shrink-0">
        <ApprovalPanel />
      </div>
      
      <div className="flex-1 flex flex-col h-full overflow-hidden">
        {/* Mobile Approvals Collapsed Area could go here if needed, keeping it simple */}
        <div className="md:hidden w-full h-1/3 border-b overflow-hidden">
          <ApprovalPanel />
        </div>
        
        <div className="flex-1 h-full overflow-hidden">
          <ChatLayout />
        </div>
      </div>
    </div>
  );
}
