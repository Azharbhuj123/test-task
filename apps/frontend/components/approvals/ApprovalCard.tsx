import { useState } from 'react';
import { Approval } from "../../types/approval";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "../ui/Card";
import { Button } from "../ui/Button";
import { Badge } from "../ui/Badge";
import { Check, X, ShieldAlert, ArrowRight } from "lucide-react";

interface ApprovalCardProps {
  approval: Approval;
  onApprove: (id: string) => Promise<any>;
  onReject: (id: string) => Promise<any>;
  disabled: boolean;
}

export function ApprovalCard({ approval, onApprove, onReject, disabled }: ApprovalCardProps) {
  const [isApproving, setIsApproving] = useState(false);
  const [isRejecting, setIsRejecting] = useState(false);

  // Parse arguments to display nicely
  let parsedArgs: any = {};
  try {
    parsedArgs = JSON.parse(approval.toolArguments);
  } catch (e) {}

  const handleApprove = async () => {
    setIsApproving(true);
    try {
      await onApprove(approval.id);
    } finally {
      setIsApproving(false);
    }
  };

  const handleReject = async () => {
    setIsRejecting(true);
    try {
      await onReject(approval.id);
    } finally {
      setIsRejecting(false);
    }
  };

  const isActionDisabled = disabled || isApproving || isRejecting || approval.status !== 'PENDING';

  return (
    <Card className="mb-4 border-amber-200 bg-amber-50/30 overflow-hidden">
      <CardHeader className="pb-3 px-4 pt-4 bg-white/50 border-b">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm flex items-center gap-1.5 text-gray-900">
            <ShieldAlert className="w-4 h-4 text-amber-500" />
            {approval.toolName === 'update_campaign_budget' ? 'Budget Update' : approval.toolName.replace(/_/g, ' ')}
          </CardTitle>
          <Badge variant="warning">PENDING</Badge>
        </div>
      </CardHeader>
      <CardContent className="pt-4 px-4 pb-0 text-sm">
        <div className="space-y-3 mb-4">
          {parsedArgs.campaignId && (
            <div className="flex justify-between border-b pb-2">
              <span className="text-gray-500">Campaign ID:</span>
              <span className="font-mono text-gray-900 text-xs">{parsedArgs.campaignId}</span>
            </div>
          )}
          {parsedArgs.newBudget && (
            <div className="flex justify-between border-b pb-2 items-center">
              <span className="text-gray-500">New Budget:</span>
              <span className="font-semibold text-green-600 flex items-center gap-1">
                <ArrowRight className="w-3 h-3" />
                ${parsedArgs.newBudget}
              </span>
            </div>
          )}
        </div>
      </CardContent>
      <CardFooter className="px-4 pb-4 pt-2 flex gap-2">
        <Button 
          variant="outline" 
          className="w-full bg-white text-gray-700 border-gray-300 hover:bg-gray-50 h-9 text-xs" 
          onClick={handleReject}
          disabled={isActionDisabled}
        >
          {isRejecting ? 'Rejecting...' : <><X className="w-4 h-4 mr-1" /> Reject</>}
        </Button>
        <Button 
          variant="default" 
          className="w-full bg-amber-500 hover:bg-amber-600 text-white h-9 text-xs" 
          onClick={handleApprove}
          disabled={isActionDisabled}
        >
          {isApproving ? 'Approving...' : <><Check className="w-4 h-4 mr-1" /> Approve</>}
        </Button>
      </CardFooter>
    </Card>
  );
}
