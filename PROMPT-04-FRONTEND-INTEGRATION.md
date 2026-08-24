# PROMPT-04 — Full Frontend + Backend Integration

# AI Campaign Operations Agent

You are a Senior Frontend Engineer specializing in:

- Next.js
- React
- TypeScript
- Tailwind CSS
- TanStack Query
- Agentic AI Interfaces
- Chat Interfaces
- Human-in-the-Loop Approval Systems

You are working on an existing project:

**AI Campaign Operations Agent**

The backend is already implemented.

Your task is to create the complete frontend and properly integrate it with the real backend APIs.

---

# 1. MAIN OBJECTIVE

Create a clean, minimal, professional AI Agent interface where the user can:

1. Start a conversation with the AI agent.
2. Ask questions about campaigns.
3. See AI responses.
4. See when the AI uses tools.
5. See when an action requires approval.
6. View pending approval requests.
7. Approve an action.
8. Reject an action.
9. See the result after approval.
10. Continue the conversation after an action is completed.

This is NOT a full campaign-management dashboard.

The primary product experience is:

```text
AI Chat
+
Agent Tool Usage
+
Human Approval
```

---

# 2. IMPORTANT RULE

Do NOT create fake frontend data.

All important application data must come from the backend.

Do NOT hardcode:

```text
campaigns
approvals
AI responses
approval statuses
metrics
```

The frontend must communicate with the actual backend APIs.

---

# 3. TECHNOLOGY

Use:

```text
Next.js
React
TypeScript
Tailwind CSS
TanStack Query
Axios
Lucide React
```

If the existing frontend already uses another compatible setup, preserve the existing setup instead of unnecessarily replacing it.

---

# 4. FRONTEND STRUCTURE

Use a clean structure similar to:

```text
apps/frontend/
│
├── app/
│   ├── page.tsx
│   ├── layout.tsx
│   └── globals.css
│
├── components/
│   │
│   ├── chat/
│   │   ├── ChatLayout.tsx
│   │   ├── ChatHeader.tsx
│   │   ├── MessageList.tsx
│   │   ├── MessageBubble.tsx
│   │   ├── ChatInput.tsx
│   │   ├── TypingIndicator.tsx
│   │   └── ToolActivity.tsx
│   │
│   ├── approvals/
│   │   ├── ApprovalPanel.tsx
│   │   ├── ApprovalCard.tsx
│   │   └── ApprovalStatus.tsx
│   │
│   ├── campaigns/
│   │   ├── CampaignSummary.tsx
│   │   └── CampaignMetrics.tsx
│   │
│   └── ui/
│       ├── Button.tsx
│       ├── Badge.tsx
│       ├── Card.tsx
│       ├── Spinner.tsx
│       └── EmptyState.tsx
│
├── hooks/
│   ├── useChat.ts
│   ├── useApprovals.ts
│   └── useCampaigns.ts
│
├── lib/
│   ├── api.ts
│   ├── query-client.ts
│   └── utils.ts
│
├── types/
│   ├── chat.ts
│   ├── approval.ts
│   └── campaign.ts
│
└── providers/
    └── QueryProvider.tsx
```

If equivalent folders already exist, reuse them.

Do not duplicate functionality.

---

# 5. ENVIRONMENT

Create:

```env
NEXT_PUBLIC_API_URL=http://localhost:4000
```

The frontend must use this variable for API requests.

Do not hardcode:

```text
http://localhost:4000
```

throughout the application.

---

# 6. API CLIENT

Create:

```text
lib/api.ts
```

Use Axios.

Example structure:

```ts
import axios from "axios";

export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});
```

All API calls should use this client.

Do not call Axios directly inside UI components.

---

# 7. TANSTACK QUERY

Configure TanStack Query.

Create:

```text
providers/QueryProvider.tsx
```

Wrap the application with:

```text
QueryClientProvider
```

Use TanStack Query for:

```text
campaign fetching
approval fetching
approval mutations
```

For chat, use a mutation because each message creates an agent execution.

---

# 8. FRONTEND TYPES

Create TypeScript types matching the backend.

## Chat

```ts
type ChatMessage = {
  id: string;
  role: "user" | "assistant";
  content: string;
  createdAt: string;
};
```

Agent response:

```ts
type ChatResponse = {
  conversationId: string;
  status: "completed" | "pending_approval" | "failed";
  message: string;
  approvalId?: string;
};
```

---

# 9. APPROVAL TYPES

Create:

```ts
type ApprovalStatus =
  | "PENDING"
  | "APPROVED"
  | "REJECTED"
  | "EXECUTED"
  | "FAILED";
```

Approval:

```ts
type Approval = {
  id: string;
  toolName: string;
  status: ApprovalStatus;
  arguments: Record<string, unknown>;
  createdAt: string;
  updatedAt?: string;
};
```

If the backend returns additional fields, include them.

---

# 10. CAMPAIGN TYPES

Create:

```ts
type Campaign = {
  id: string;
  name: string;
  status: string;
  budget: number;
  conversions?: number;
  spend?: number;
};
```

Match the actual backend schema.

Do not invent fields that do not exist.

---

# 11. MAIN UI

The main page should be:

```text
┌─────────────────────────────────────────────────────────────┐
│ AI Campaign Agent                              ● Connected │
├───────────────────────┬─────────────────────────────────────┤
│                       │                                     │
│ Pending Approvals     │         AI Conversation             │
│                       │                                     │
│ ┌───────────────────┐ │  User: Show my campaigns            │
│ │ Budget Change     │ │                                     │
│ │ Alpha → $150      │ │  AI: I found 3 campaigns...         │
│ │ [Approve] [Reject]│ │                                     │
│ └───────────────────┘ │                                     │
│                       │                                     │
│                       │  User: Increase Alpha budget        │
│                       │                                     │
│                       │  AI: This action requires approval. │
│                       │                                     │
│                       │─────────────────────────────────────│
│                       │  Type your message...        [Send] │
└───────────────────────┴─────────────────────────────────────┘
```

Keep it simple.

---

# 12. RESPONSIVE DESIGN

The interface must work on:

```text
Desktop
Tablet
Mobile
```

Desktop:

```text
Approval Sidebar | Chat
```

Mobile:

```text
Chat
↓
Approval section
```

The approval panel can become a drawer or collapsible section on smaller screens.

---

# 13. DESIGN STYLE

Use a modern SaaS interface.

Design principles:

```text
Clean
Minimal
Professional
Readable
Fast
```

Avoid:

```text
Huge gradients
Excessive animations
3D effects
Unnecessary charts
Complex navigation
```

Use clear visual states.

---

# 14. HEADER

Create:

```text
AI Campaign Agent
```

Subtitle:

```text
AI-powered campaign operations with human approval
```

Status indicator:

```text
● Connected
```

The connected state can be determined by the backend health endpoint.

If backend is unavailable:

```text
● Backend unavailable
```

---

# 15. CHAT HEADER

Display:

```text
AI Campaign Assistant
```

Optional:

```text
Agent ready
```

Do not add unnecessary navigation.

---

# 16. CHAT MESSAGE LIST

Create:

```text
components/chat/MessageList.tsx
```

Render:

```text
USER MESSAGE
```

and:

```text
AI MESSAGE
```

Different visual styling.

Example:

```text
User:
Show me my active campaigns.

AI:
I found 3 active campaigns:
- Campaign Alpha
- Campaign Beta
- Campaign Gamma
```

---

# 17. MESSAGE BUBBLE

Create:

```text
MessageBubble.tsx
```

User:

```text
right aligned
```

Assistant:

```text
left aligned
```

Keep message rendering readable.

Support basic Markdown if the existing project already has a Markdown renderer.

Do not build a complex Markdown engine.

---

# 18. CHAT INPUT

Create:

```text
ChatInput.tsx
```

Requirements:

```text
Textarea
Send button
Enter = send
Shift + Enter = newline
Disabled while request is processing
```

Placeholder:

```text
Ask the AI agent about your campaigns...
```

---

# 19. SEND MESSAGE FLOW

When user sends:

```text
Show me all campaigns
```

Frontend:

```text
User types message
↓
POST /api/chat
↓
Backend Agent
↓
Claude
↓
Tool
↓
Tool Result
↓
Claude
↓
Backend response
↓
Frontend
↓
Render AI message
```

Do not simulate a response.

---

# 20. CHAT HOOK

Create:

```text
hooks/useChat.ts
```

Implement:

```ts
sendMessage(message)
```

The hook should:

1. Add user message to UI.
2. Set loading state.
3. Call backend.
4. Receive response.
5. Add assistant message.
6. Handle pending approval.
7. Handle errors.
8. Reset loading state.

---

# 21. CONVERSATION ID

Maintain:

```text
conversationId
```

After the first request:

```text
Backend
↓
conversationId
↓
Frontend state
```

Future messages must send the same ID.

Example:

```json
{
  "conversationId": "abc123",
  "message": "Increase its budget to 150"
}
```

This allows the backend Agent to understand conversation context.

---

# 22. INITIAL STATE

When opening the application:

Display:

```text
AI Campaign Agent

Ask me anything about your campaigns.

Try:

"Show me all campaigns"

"How is Campaign Alpha performing?"

"Resume Campaign Gamma"

"Increase Campaign Alpha's budget to $150"
```

These should be clickable suggestions.

Clicking one should populate/send the message.

---

# 23. TYPING INDICATOR

While the backend request is running:

Display:

```text
AI is working...
```

or:

```text
Agent is thinking...
```

Use a simple animated indicator.

Do not overdo animations.

---

# 24. TOOL ACTIVITY

If backend returns tool activity metadata, display it.

Example:

```text
┌──────────────────────────────┐
│ Agent Activity               │
│ ✓ get_campaigns              │
│ ✓ get_campaign_metrics       │
└──────────────────────────────┘
```

If backend currently does not return tool activity:

Do not fake it.

Only display actual backend data.

---

# 25. PENDING APPROVAL STATE

This is one of the most important UI states.

When backend returns:

```json
{
  "status": "pending_approval",
  "approvalId": "abc123"
}
```

Display:

```text
┌────────────────────────────────────────┐
│ Approval Required                      │
│                                        │
│ Increase Campaign Alpha budget to $150 │
│                                        │
│ This action requires human approval    │
│ before it can be executed.             │
│                                        │
│ [Review Approval]                      │
└────────────────────────────────────────┘
```

Do not show:

```text
Action completed
```

because it is still pending.

---

# 26. APPROVAL SIDEBAR

Create:

```text
components/approvals/ApprovalPanel.tsx
```

It should fetch:

```http
GET /api/approvals/pending
```

Display all pending requests.

Example:

```text
Pending Approvals

┌──────────────────────────────┐
│ Update Campaign Budget       │
│ Campaign Alpha               │
│ New Budget: $150             │
│                              │
│ [Approve]      [Reject]      │
└──────────────────────────────┘
```

---

# 27. APPROVAL CARD

Create:

```text
ApprovalCard.tsx
```

Display:

```text
Action
Campaign
Arguments
Created time
Status
```

Never dump raw JSON as the primary UI.

Convert arguments into readable text.

Example:

Instead of:

```json
{
  "campaignId": "camp_123",
  "newBudget": 150
}
```

show:

```text
Campaign: Alpha
New budget: $150
```

---

# 28. APPROVE ACTION

When user clicks:

```text
Approve
```

call:

```http
POST /api/approvals/:id/approve
```

Show loading:

```text
Approving...
```

Disable both buttons while processing.

After success:

```text
Approval → EXECUTED
```

Refresh pending approvals.

---

# 29. REJECT ACTION

When user clicks:

```text
Reject
```

call:

```http
POST /api/approvals/:id/reject
```

Show:

```text
Rejecting...
```

After success:

```text
Approval → REJECTED
```

Refresh pending approvals.

---

# 30. TANSTACK QUERY INVALIDATION

After:

```text
Approve
Reject
```

invalidate:

```text
["approvals", "pending"]
```

Then fetch the latest state from backend.

Do not manually guess the new state.

---

# 31. APPROVAL RESULT

After approval succeeds, display:

```text
✓ Action approved and executed

Campaign Alpha budget is now $150.
```

This message must come from the backend result where possible.

Do not hardcode success text for specific campaigns.

---

# 32. ERROR STATE

If API fails:

Display:

```text
Something went wrong.

Please try again.
```

Optionally include a safe backend error message.

Do NOT expose:

```text
stack trace
database query
API key
internal server details
```

---

# 33. EMPTY APPROVAL STATE

If there are no pending approvals:

```text
No pending approvals

Actions that require your approval will appear here.
```

---

# 34. APPROVAL STATUS BADGES

Use clear badges:

```text
PENDING
APPROVED
REJECTED
EXECUTED
FAILED
```

Suggested semantics:

```text
PENDING  → warning
APPROVED → neutral/info
EXECUTED → success
REJECTED → muted/error
FAILED   → error
```

Do not rely only on color.

Always include the status text.

---

# 35. CAMPAIGN INFORMATION

The chat should be able to display campaign information naturally.

Example AI response:

```text
Campaign Alpha

Status: Active
Budget: $100/day
Spend: $72
Conversions: 18
```

If the backend supports structured campaign data, optionally render it using:

```text
CampaignSummary
```

Otherwise, render the AI response normally.

Do not create a full campaign dashboard.

---

# 36. CAMPAIGN TOOL INTEGRATION

The frontend does NOT directly call:

```text
get_campaign
update_campaign_budget
pause_campaign
```

The frontend only talks to:

```text
POST /api/chat
```

The Agent handles tools internally.

This is important.

Correct:

```text
Frontend
↓
Chat API
↓
Agent
↓
Tools
```

Incorrect:

```text
Frontend
↓
Campaign Tool
```

---

# 37. APPROVAL API INTEGRATION

Approval actions are different.

Frontend directly calls:

```text
GET /api/approvals/pending

POST /api/approvals/:id/approve

POST /api/approvals/:id/reject
```

Because the human is explicitly controlling approval.

---

# 38. BACKEND HEALTH CHECK

Create:

```text
hooks/useBackendHealth.ts
```

or implement it simply inside the main layout.

Call:

```http
GET /health
```

Show:

```text
Connected
```

or:

```text
Backend unavailable
```

Do not repeatedly request it unnecessarily.

A polling interval of around 30–60 seconds is enough if polling is implemented.

---

# 39. LOADING STATES

Implement proper loading states for:

```text
Chat
Approvals
Approve
Reject
Health
```

Never leave the UI frozen without feedback.

---

# 40. DISABLE STATES

Disable Send when:

```text
message is empty
OR
chat request is processing
```

Disable Approve/Reject when:

```text
approval mutation is processing
```

---

# 41. SCROLL BEHAVIOR

The chat should automatically scroll to the latest message.

When a new message arrives:

```text
scroll to bottom
```

Do not scroll unexpectedly when the user is reading an older message.

Keep implementation simple.

---

# 42. MOBILE UX

On mobile:

```text
Header
↓
Chat
↓
Input
```

Approval panel should be accessible through:

```text
Pending Approvals
```

button/drawer.

Do not make the desktop sidebar unusable on mobile.

---

# 43. ACCESSIBILITY

Use:

```text
button
textarea
aria-label
visible focus states
keyboard navigation
```

Buttons must have clear labels.

Examples:

```text
Approve action
Reject action
Send message
Open pending approvals
```

---

# 44. NO MOCK DATA

Remove temporary:

```text
mockCampaigns
mockMessages
mockApprovals
fakeAIResponse
```

if they exist.

Use real backend APIs.

The only static data allowed is:

```text
empty states
example prompts
UI labels
```

---

# 45. API ERROR HANDLING

Create a reusable API error helper.

Handle:

```text
400
401
404
409
422
500
network failure
```

For example:

```text
409
→ Approval is no longer pending.

404
→ Approval not found.

500
→ Something went wrong on the server.
```

---

# 46. APPROVAL CONFLICT

If two browser tabs attempt to approve the same action:

Backend should return an appropriate conflict/error.

Frontend should then:

1. Show the error.
2. Refresh approvals.
3. Remove the item if it is no longer pending.

Do not assume the local state is correct.

---

# 47. CHAT PENDING FLOW

Important complete frontend flow:

```text
User
↓
"Increase Alpha budget to $150"
↓
Chat API
↓
Agent
↓
Claude
↓
Tool Use
↓
Approval Created
↓
Backend returns:
pending_approval
↓
Frontend displays approval message
↓
Approval Panel shows request
↓
User clicks Approve
↓
Approve API
↓
Backend executes tool
↓
Frontend refreshes approval list
↓
Frontend shows execution result
```

This must work end-to-end.

---

# 48. REJECTION FLOW

```text
User
↓
High-risk request
↓
Pending Approval
↓
User clicks Reject
↓
POST /reject
↓
Backend
↓
Approval = REJECTED
↓
No campaign modification
↓
Frontend refreshes
↓
Show rejected status
```

---

# 49. NORMAL AGENT FLOW

Test:

```text
User:
Show all campaigns
```

Expected:

```text
Chat
↓
Backend
↓
Claude
↓
get_campaigns
↓
Database
↓
Claude
↓
Response
↓
Frontend
```

The frontend should only see the final useful result unless tool activity is explicitly returned by the backend.

---

# 50. MULTI-TURN FLOW

Test:

```text
User:
Show Campaign Alpha.

AI:
Campaign Alpha has a $100 budget.

User:
Increase its budget to $150.
```

The frontend must send the same:

```text
conversationId
```

for the second message.

Backend should understand:

```text
"its"
=
Campaign Alpha
```

---

# 51. FRONTEND STATE

Keep state simple.

Use:

```text
TanStack Query
+
React state
```

Use React state for:

```text
conversationId
input
local chat messages
UI drawer state
```

Use TanStack Query for:

```text
pending approvals
approval mutations
campaign reads if required
```

Do not introduce Redux unless it already exists.

---

# 52. QUERY KEYS

Use predictable query keys:

```ts
["approvals", "pending"]

["approval", approvalId]

["campaigns"]

["campaign", campaignId]
```

---

# 53. CHAT MESSAGE STATE

The chat UI should maintain:

```text
messages
conversationId
isLoading
error
pendingApproval
```

Avoid unnecessary global state.

---

# 54. FRONTEND API FUNCTIONS

Create API functions such as:

```ts
sendChatMessage()

getPendingApprovals()

getApproval()

approveApproval()

rejectApproval()

getCampaigns()

getCampaign()
```

These functions belong in:

```text
lib/api/
```

or an equivalent service layer.

Components should not contain raw Axios calls.

---

# 55. FINAL UI COMPONENT TREE

Aim for:

```text
App
│
└── QueryProvider
    │
    └── MainPage
        │
        └── ChatLayout
            │
            ├── Header
            │
            ├── ApprovalPanel
            │   └── ApprovalCard
            │
            └── Chat
                │
                ├── ChatHeader
                ├── MessageList
                │   ├── MessageBubble
                │   └── ToolActivity
                │
                └── ChatInput
```

---

# 56. VISUAL PRIORITY

The UI should make this immediately obvious:

```text
1. Chat
2. AI response
3. Pending approval
4. Approve / Reject
5. Execution result
```

Do not prioritize:

```text
campaign charts
complex navigation
settings
profile
notifications
```

Those are outside the screening scope.

---

# 57. DEMO PROMPTS

Add clickable demo prompts:

```text
Show me all campaigns

Tell me about Campaign Alpha

Show Alpha's recent performance

Resume Campaign Gamma

Increase Campaign Alpha's budget to $150
```

These are only starter prompts.

They must still call the real backend.

---

# 58. FINAL DEMO SCENARIO

The evaluator should be able to perform:

### Step 1

Open application.

See:

```text
AI Campaign Agent
Connected
```

### Step 2

Send:

```text
Show me all campaigns.
```

### Step 3

Agent responds using real Claude + real tool.

### Step 4

Send:

```text
Increase Campaign Alpha budget to $150.
```

### Step 5

UI shows:

```text
Approval Required
```

### Step 6

Approval sidebar shows:

```text
Update Campaign Budget
Campaign Alpha
$100 → $150

[Approve] [Reject]
```

### Step 7

Click:

```text
Approve
```

### Step 8

Backend executes action.

### Step 9

UI updates:

```text
✓ Action executed successfully
```

### Step 10

Ask:

```text
What is Alpha's current budget?
```

Agent should use the campaign tool and return:

```text
$150
```

This proves the entire system is actually connected.

---

# 59. FRONTEND BUILD CHECK

Run:

```bash
npm run build
```

Fix:

```text
TypeScript errors
ESLint errors
React errors
Next.js errors
```

Do not leave build errors.

---

# 60. BACKEND CONNECTION CHECK

Before considering frontend complete, verify:

```text
Frontend
        ↓
NEXT_PUBLIC_API_URL
        ↓
Backend
        ↓
SQLite
```

And:

```text
Frontend
        ↓
Chat API
        ↓
Claude
        ↓
Tool
        ↓
Database
```

And:

```text
Frontend
        ↓
Approve API
        ↓
Approval Service
        ↓
Tool Execution
        ↓
Database
```

---

# 61. NO FRONTEND MOCKS

The final frontend must not contain fake logic like:

```ts
setTimeout(() => {
  setMessages(...)
}, 1000)
```

to simulate AI.

Do not simulate approvals.

Do not simulate campaign changes.

Everything important must come from the backend.

---

# 62. PERFORMANCE

Keep frontend lightweight.

Do not add:

```text
heavy chart libraries
large UI libraries
unnecessary dependencies
complex state management
```

Use simple React components.

---

# 63. FINAL FRONTEND CHECKLIST

Before completion verify:

```text
[ ] Next.js app runs
[ ] Backend URL configured
[ ] API client configured
[ ] TanStack Query configured
[ ] Chat UI created
[ ] Chat input works
[ ] Chat API integrated
[ ] Conversation ID maintained
[ ] Real AI response displayed
[ ] Loading state works
[ ] Error state works
[ ] Pending approval displayed
[ ] Approval list integrated
[ ] Approve integrated
[ ] Reject integrated
[ ] Approval refresh works
[ ] Double approval handled
[ ] Campaign data comes from backend
[ ] No fake AI responses
[ ] No fake approval data
[ ] Responsive layout
[ ] Mobile layout
[ ] Keyboard interaction
[ ] Build passes
```

---

# 64. FINAL PROJECT FLOW

The final system should behave like:

```text
                 ┌──────────────────┐
                 │    USER          │
                 └────────┬─────────┘
                          │
                          ▼
                 ┌──────────────────┐
                 │   CHAT UI        │
                 └────────┬─────────┘
                          │
                          ▼
                 ┌──────────────────┐
                 │   POST /chat     │
                 └────────┬─────────┘
                          │
                          ▼
                 ┌──────────────────┐
                 │   AI AGENT       │
                 │   Claude         │
                 └────────┬─────────┘
                          │
                     tool_use
                          │
                          ▼
                 ┌──────────────────┐
                 │  TOOL REGISTRY   │
                 └────────┬─────────┘
                          │
                    Risk Check
                          │
             ┌────────────┴────────────┐
             │                         │
             ▼                         ▼
          LOW RISK                  HIGH RISK
             │                         │
             ▼                         ▼
       Execute Tool              Create Approval
             │                         │
             │                         ▼
             │                   PENDING UI
             │                         │
             │                 ┌───────┴───────┐
             │                 │               │
             │              APPROVE          REJECT
             │                 │               │
             │                 ▼               ▼
             │            Execute Tool       Stop
             │                 │
             └────────┬────────┘
                      │
                      ▼
                 Tool Result
                      │
                      ▼
                   Claude
                      │
                      ▼
                Final Response
                      │
                      ▼
                  Chat UI
```

---

# 65. IMPORTANT SCREENING SCOPE

Do NOT add these unless already implemented:

```text
Authentication
User profiles
Admin dashboard
Billing
Real Meta integration
Real Google Ads integration
Real campaign publishing
Notifications
Email
WebSockets
Advanced analytics
Vector database
Production deployment
```

The goal is to demonstrate:

```text
Agentic AI
+
Real Tool Calling
+
Human Approval
+
Clean Frontend
+
Backend Integration
```

---

# 66. FINAL HANDOVER

After completing the frontend, update README.md with:

## Frontend

```text
Next.js
React
TypeScript
Tailwind CSS
TanStack Query
Axios
```

## Main Features

```text
AI Chat
Agent Tool Calling
Approval UI
Campaign Information
Approval Actions
Responsive Interface
```

## Run Frontend

```bash
npm install
npm run dev
```

## Environment

```env
NEXT_PUBLIC_API_URL=http://localhost:4000
```

## Demo

Explain the complete demo:

```text
1. Ask agent for campaign information.
2. Ask agent to perform a high-impact action.
3. Agent creates pending approval.
4. Approve or reject from UI.
5. Verify the campaign state.
6. Continue conversation.
```

---

# FINAL INSTRUCTION TO AI

Do not rewrite the backend unnecessarily.

First inspect the existing frontend and backend.

Understand:

* Existing folder structure
* Existing API routes
* Existing Prisma schema
* Existing API response formats
* Existing Claude Agent implementation

Then adapt the frontend to the existing backend.

Do not invent APIs that do not exist.

If an API response differs from the expected structure in this document, use the actual backend response and update the frontend types accordingly.

Do not create mock APIs.

Do not create fake data.

Do not create fake AI responses.

Do not bypass the backend.

The final frontend must be fully connected to the real backend.

The most important demo must be:

```text
User
↓
Chat
↓
Claude
↓
Real Tool Use
↓
High-Risk Action
↓
Approval Required
↓
Frontend Approval Card
↓
Approve
↓
Backend Executes Tool
↓
Database Updated
↓
Frontend Shows Result
```

After completing this task, stop.

Do not implement additional features outside the screening scope.
