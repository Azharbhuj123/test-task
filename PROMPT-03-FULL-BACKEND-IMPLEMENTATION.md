# PROMPT-03 — Full Backend Implementation

# AI Campaign Operations Agent

You are a Senior Backend Engineer specializing in:

- Node.js
- TypeScript
- Express
- Prisma
- SQLite
- Claude API
- Agentic AI
- Tool Calling
- RAG
- Human-in-the-Loop Approval Systems

You are working on an existing project:

**AI Campaign Operations Agent**

The project already has:

- Project structure
- Frontend foundation
- Backend foundation
- Prisma
- SQLite
- Database schema
- Database migration
- Seed data

Your job now is to implement the backend completely and incrementally.

---

# IMPORTANT DEVELOPMENT RULE

Do NOT implement everything at once.

You MUST follow the steps in this document in order.

After completing each step:

1. Inspect the implementation.
2. Fix TypeScript errors.
3. Fix runtime errors.
4. Run the relevant tests/checks.
5. Confirm the step is working.
6. Only then continue to the next step.

Do not skip steps.

Do not implement future features before their designated step.

---

# 1. FINAL BACKEND GOAL

The backend should eventually support this architecture:

```text
                    ┌──────────────────┐
                    │   Frontend Chat  │
                    └────────┬─────────┘
                             │
                             ▼
                    ┌──────────────────┐
                    │   Chat API       │
                    └────────┬─────────┘
                             │
                             ▼
                    ┌──────────────────┐
                    │   AI Agent       │
                    │   Claude API     │
                    └────────┬─────────┘
                             │
                             ▼
                    ┌──────────────────┐
                    │   Tool Router    │
                    └────────┬─────────┘
                             │
             ┌───────────────┼────────────────┐
             │               │                │
             ▼               ▼                ▼
      Campaign Tools    RAG/Knowledge   Approval Gate
             │               │                │
             ▼               ▼                ▼
          Prisma          Knowledge       Pending Action
             │                              │
             ▼                              ▼
          SQLite                       Approve/Reject
                                            │
                                            ▼
                                      Tool Execution
                                            │
                                            ▼
                                      Claude Result
                                            │
                                            ▼
                                      Final Response
```

---

# 2. CORE PRINCIPLE

The backend must demonstrate genuine Agentic AI behavior.

Do NOT create a fake flow like:

```text
User
↓
Hardcoded if/else
↓
Fake AI response
```

Instead, use:

```text
User
↓
Claude
↓
Tool Use
↓
Backend Tool Execution
↓
Tool Result
↓
Claude
↓
Final Answer
```

Claude must be responsible for deciding when to use tools.

---

# 3. TECHNOLOGY

Use:

```text
Node.js
TypeScript
Express
Prisma
SQLite
Zod
Anthropic Claude API
dotenv
CORS
```

Do not add unnecessary infrastructure.

Do NOT add:

* Redis
* Kafka
* RabbitMQ
* Kubernetes
* Microservices
* PostgreSQL
* MongoDB
* External campaign APIs

This is a 3–4 hour screening project.

Keep it simple.

---

# 4. ENVIRONMENT VARIABLES

Backend `.env`:

```env
PORT=4000

DATABASE_URL="file:./dev.db"

ANTHROPIC_API_KEY=

FRONTEND_URL=http://localhost:3000
```

Never hardcode:

```text
ANTHROPIC_API_KEY
```

Never commit `.env`.

---

# 5. BACKEND FOLDER STRUCTURE

Maintain this structure:

```text
apps/backend/
│
├── prisma/
│   ├── schema.prisma
│   ├── seed.ts
│   └── migrations/
│
├── src/
│   │
│   ├── agent/
│   │   ├── agent.service.ts
│   │   ├── agent.types.ts
│   │   ├── agent.prompts.ts
│   │   └── tools.ts
│   │
│   ├── approvals/
│   │   ├── approval.controller.ts
│   │   ├── approval.service.ts
│   │   └── approval.types.ts
│   │
│   ├── campaigns/
│   │   ├── campaign.controller.ts
│   │   ├── campaign.service.ts
│   │   └── campaign.tools.ts
│   │
│   ├── chat/
│   │   ├── chat.controller.ts
│   │   └── chat.service.ts
│   │
│   ├── rag/
│   │   ├── rag.service.ts
│   │   └── knowledge.ts
│   │
│   ├── middleware/
│   │   └── error.middleware.ts
│   │
│   ├── lib/
│   │   ├── prisma.ts
│   │   └── anthropic.ts
│   │
│   ├── routes/
│   │   └── index.ts
│   │
│   ├── app.ts
│   └── server.ts
│
├── .env
├── .env.example
├── package.json
└── tsconfig.json
```

If some files already exist, update them.

Do not duplicate files.

---

# STEP 1 — BACKEND FOUNDATION

Before implementing AI functionality, verify that the backend works.

Verify:

```http
GET /health
```

Expected:

```json
{
  "status": "ok",
  "service": "ai-campaign-agent-backend"
}
```

Verify:

```text
Express
↓
Middleware
↓
Routes
↓
Controller
↓
Service
↓
Prisma
```

works correctly.

---

# STEP 2 — PRISMA CLIENT

Create:

```text
src/lib/prisma.ts
```

Use one reusable Prisma Client instance.

All database services must import Prisma from this file.

Do not instantiate Prisma repeatedly.

---

# STEP 3 — ANTHROPIC CLIENT

Create:

```text
src/lib/anthropic.ts
```

Initialize the Anthropic SDK using:

```env
ANTHROPIC_API_KEY
```

Do not expose the API key to frontend.

The frontend must communicate only with the backend.

Architecture:

```text
Frontend
↓
Backend
↓
Anthropic
```

Never:

```text
Frontend
↓
Anthropic
```

---

# STEP 4 — CAMPAIGN SERVICE

Create/update:

```text
src/campaigns/campaign.service.ts
```

Implement:

```ts
getCampaigns()

getCampaignById(campaignId)

getCampaignMetrics(campaignId)

getRecentCampaignMetrics(campaignId, limit)

updateCampaignBudget(campaignId, newBudget)

pauseCampaign(campaignId)

resumeCampaign(campaignId)
```

The first four functions are read operations.

The last three are write operations.

---

# STEP 5 — CAMPAIGN CONTROLLER

Create:

```text
src/campaigns/campaign.controller.ts
```

Implement:

```http
GET /api/campaigns

GET /api/campaigns/:id

GET /api/campaigns/:id/metrics
```

Optional:

```http
GET /api/campaigns/:id/metrics/recent
```

Do NOT expose dangerous write operations as unrestricted public endpoints.

Write operations will be executed through the Agent/Tool system.

---

# STEP 6 — CAMPAIGN TOOLS

Create:

```text
src/campaigns/campaign.tools.ts
```

Define tools for Claude.

Required tools:

```text
get_campaigns
get_campaign
get_campaign_metrics
get_recent_campaign_metrics
update_campaign_budget
pause_campaign
resume_campaign
```

---

# STEP 7 — TOOL DEFINITIONS

Claude needs proper tool schemas.

Example concept:

```ts
{
  name: "get_campaign",
  description: "Get campaign details by campaign ID",
  input_schema: {
    type: "object",
    properties: {
      campaignId: {
        type: "string",
        description: "The campaign ID"
      }
    },
    required: ["campaignId"]
  }
}
```

Use proper JSON schemas.

Every tool must have:

```text
name
description
input_schema
handler
```

Do not hardcode tool results.

---

# STEP 8 — TOOL RISK CLASSIFICATION

Every tool must have a risk level.

Use:

```text
READ
LOW_RISK
HIGH_RISK
```

Classification:

```text
get_campaigns
→ READ

get_campaign
→ READ

get_campaign_metrics
→ READ

get_recent_campaign_metrics
→ READ

update_campaign_budget
→ HIGH_RISK

pause_campaign
→ HIGH_RISK

resume_campaign
→ LOW_RISK
```

For this screening task:

```text
HIGH_RISK
```

means human approval is required.

---

# STEP 9 — TOOL REGISTRY

Create a central tool registry.

Example conceptual structure:

```ts
const tools = {
  get_campaigns: {
    risk: "READ",
    schema: ...,
    execute: ...
  },

  get_campaign: {
    risk: "READ",
    schema: ...,
    execute: ...
  },

  update_campaign_budget: {
    risk: "HIGH_RISK",
    schema: ...,
    execute: ...
  }
}
```

The Agent should use this registry.

Do NOT scatter risk checking throughout the code.

---

# STEP 10 — AGENT TYPES

Create:

```text
src/agent/agent.types.ts
```

Define types for:

```text
AgentRequest
AgentResponse
AgentToolCall
ToolResult
ToolRiskLevel
AgentExecutionState
```

Keep the types simple.

---

# STEP 11 — AGENT SYSTEM PROMPT

Create:

```text
src/agent/agent.prompts.ts
```

Create a system prompt for Claude.

The agent should understand:

```text
You are an AI Campaign Operations Assistant.

You help users inspect and manage campaign data.

You can:
- Read campaigns.
- Read campaign metrics.
- Perform permitted campaign operations.

Important:
- Never claim an action was completed if the tool did not execute.
- High-impact actions require human approval.
- When an action requires approval, clearly tell the user that the action is pending approval.
- Use tools whenever real campaign data is required.
- Do not invent campaign information.
- Keep responses concise and useful.
```

Do not make the prompt unnecessarily long.

---

# STEP 12 — AGENT SERVICE

Create:

```text
src/agent/agent.service.ts
```

This is the core AI component.

It must use the real Anthropic API.

The basic flow:

```text
User Message
↓
Load Conversation History
↓
Send Messages to Claude
↓
Claude Responds
↓
Check stop_reason
↓
If text:
    Return final answer

If tool_use:
    Process tool
```

---

# STEP 13 — REAL CLAUDE TOOL USE

This is extremely important.

Do NOT fake tool calls.

Use real Claude tool use.

The backend must send tools to Claude.

Claude should return actual:

```text
tool_use
```

blocks.

The backend must then execute the requested tool.

Then send:

```text
tool_result
```

back to Claude.

The loop should continue until Claude returns a final text response.

---

# STEP 14 — AGENT LOOP

Implement a controlled loop:

```text
while tool calls exist:

    send request to Claude

    inspect response

    if no tool call:
        return final response

    for each tool call:

        identify tool

        validate arguments

        determine risk

        execute or request approval

        create tool result

    send tool results back to Claude
```

Set a maximum iteration limit:

```text
MAX_AGENT_ITERATIONS = 10
```

If the limit is reached:

Return a safe error.

Do not create an infinite loop.

---

# STEP 15 — TOOL ARGUMENT VALIDATION

Before executing a tool:

1. Identify the tool.
2. Validate arguments.
3. Reject invalid arguments.
4. Only execute valid arguments.

Use Zod for backend validation.

Example:

```ts
const updateBudgetSchema = z.object({
  campaignId: z.string().min(1),
  newBudget: z.number().positive()
});
```

Never trust Claude's arguments blindly.

---

# STEP 16 — CHAT SERVICE

Create:

```text
src/chat/chat.service.ts
```

Responsibilities:

```text
Receive user message
↓
Create/load conversation
↓
Save user message
↓
Call Agent Service
↓
Save assistant response
↓
Return result
```

The Chat Service should NOT contain Claude tool logic.

That belongs in Agent Service.

---

# STEP 17 — CHAT CONTROLLER

Create:

```text
src/chat/chat.controller.ts
```

Create:

```http
POST /api/chat
```

Request:

```json
{
  "conversationId": "optional-id",
  "message": "Show me all active campaigns"
}
```

If `conversationId` is not provided:

Create a new conversation.

Response should contain:

```json
{
  "success": true,
  "data": {
    "conversationId": "...",
    "message": "...",
    "status": "completed"
  }
}
```

---

# STEP 18 — BASIC CHAT FLOW

The following request must work:

```text
User:
Show me all campaigns
```

Expected behavior:

```text
POST /api/chat
↓
Chat Service
↓
Agent Service
↓
Claude
↓
get_campaigns tool
↓
Campaign Service
↓
Prisma
↓
SQLite
↓
tool_result
↓
Claude
↓
Final Answer
```

The response must contain actual database information.

---

# STEP 19 — READ TOOL TESTS

Test:

```text
Show me all campaigns
```

Then:

```text
Tell me about Campaign Alpha
```

Then:

```text
Show me Alpha's recent metrics
```

Then:

```text
Which campaign has the highest conversions?
```

Claude should use tools rather than invent answers.

---

# STEP 20 — APPROVAL SERVICE

Now implement:

```text
src/approvals/approval.service.ts
```

Create functions:

```ts
createApprovalRequest()

getPendingApprovals()

getApprovalById()

approveRequest()

rejectRequest()
```

Do not execute the tool automatically when creating an approval.

---

# STEP 21 — APPROVAL STATE MACHINE

Use:

```text
PENDING
APPROVED
REJECTED
EXECUTED
FAILED
```

State transitions:

```text
PENDING
  │
  ├── APPROVE → APPROVED
  │                │
  │                ├── execute success → EXECUTED
  │                │
  │                └── execute failure → FAILED
  │
  └── REJECT → REJECTED
```

Invalid transitions must be rejected.

Examples:

```text
EXECUTED → APPROVED
```

must fail.

```text
REJECTED → APPROVED
```

must fail.

```text
APPROVED → APPROVED
```

must fail.

---

# STEP 22 — APPROVAL CREATION

When Claude requests a HIGH_RISK tool:

```text
Do NOT execute the tool.
```

Instead:

```text
Tool Call
↓
Risk = HIGH_RISK
↓
Create ApprovalRequest
↓
Status = PENDING
↓
Return pending signal
```

The tool must NOT modify the campaign.

---

# STEP 23 — PENDING TOOL RESULT

Claude must receive a clear tool result.

Example:

```json
{
  "status": "pending_approval",
  "approvalId": "approval-id",
  "message": "This action requires human approval before execution."
}
```

The agent must not fail silently.

The user should receive a response similar to:

```text
This action requires approval before I can execute it.

Action:
Increase Campaign Alpha budget from $100 to $150.

Approval ID:
abc123
```

---

# STEP 24 — APPROVAL API

Create:

```text
src/approvals/approval.controller.ts
```

Endpoints:

```http
GET /api/approvals/pending

GET /api/approvals/:id

POST /api/approvals/:id/approve

POST /api/approvals/:id/reject
```

---

# STEP 25 — APPROVE FLOW

When:

```http
POST /api/approvals/:id/approve
```

is called:

```text
ApprovalRequest
↓
Check status
↓
Must be PENDING
↓
Change status → APPROVED
↓
Execute original tool
↓
Create ToolExecution
↓
Success
↓
ApprovalRequest → EXECUTED
```

If execution fails:

```text
ApprovalRequest → FAILED
```

Store the error.

---

# STEP 26 — REJECT FLOW

When:

```http
POST /api/approvals/:id/reject
```

is called:

```text
ApprovalRequest
↓
Check status
↓
Must be PENDING
↓
Status → REJECTED
↓
Do NOT execute tool
```

Return a clear response.

---

# STEP 27 — DOUBLE APPROVAL PROTECTION

This is important.

If:

```text
Approval A
Status = EXECUTED
```

and someone calls:

```http
POST /api/approvals/A/approve
```

again:

Reject the request.

Return:

```text
Approval request is no longer pending.
```

Do not execute the tool again.

The same applies to rejected requests.

---

# STEP 28 — APPROVAL EXECUTION SAFETY

Never blindly execute a stale request.

When approving:

1. Load approval request.
2. Verify status is `PENDING`.
3. Parse stored arguments.
4. Validate arguments again.
5. Load current campaign state.
6. Verify campaign still exists.
7. Execute action.
8. Store result.

This is important because campaign data may have changed after the approval was created.

---

# STEP 29 — BUDGET CHANGE TOOL

Implement:

```text
update_campaign_budget
```

Input:

```json
{
  "campaignId": "...",
  "newBudget": 150
}
```

Behavior:

```text
Load campaign
↓
Validate campaign
↓
Update budget
↓
Return updated campaign
```

This tool must be classified:

```text
HIGH_RISK
```

Therefore:

```text
Claude → tool_use
↓
Approval required
↓
PENDING
```

The budget must NOT change before approval.

---

# STEP 30 — PAUSE CAMPAIGN TOOL

Implement:

```text
pause_campaign
```

Input:

```json
{
  "campaignId": "..."
}
```

Behavior:

```text
Load campaign
↓
Set status = PAUSED
↓
Return campaign
```

Classify:

```text
HIGH_RISK
```

Approval required.

---

# STEP 31 — RESUME CAMPAIGN TOOL

Implement:

```text
resume_campaign
```

Input:

```json
{
  "campaignId": "..."
}
```

Behavior:

```text
Load campaign
↓
Set status = ACTIVE
↓
Return campaign
```

For this screening project, classify as:

```text
LOW_RISK
```

It can execute immediately.

---

# STEP 32 — TOOL EXECUTION AUDIT

Whenever a tool actually executes:

Create:

```text
ToolExecution
```

Store:

```text
toolName
arguments
result
status
createdAt
completedAt
```

For failures:

```text
status = FAILED
error = ...
```

This provides an audit trail.

---

# STEP 33 — RAG FOUNDATION

Now implement a very lightweight RAG system.

Do NOT introduce a vector database.

Do NOT introduce Pinecone.

Do NOT introduce Weaviate.

Do NOT introduce Qdrant.

The test is too small for that.

Use local knowledge files.

Knowledge:

```text
knowledge/
└── campaign-guidelines.md
```

---

# STEP 34 — RAG SERVICE

Create:

```text
src/rag/rag.service.ts
```

Implement a simple retrieval mechanism.

The service should:

```text
Load knowledge
↓
Split into sections
↓
Find relevant sections
↓
Return relevant context
```

For this screening task, simple keyword/term matching is acceptable.

The goal is to demonstrate the RAG concept without spending hours implementing vector infrastructure.

---

# STEP 35 — KNOWLEDGE FILE

Use:

```text
knowledge/campaign-guidelines.md
```

Include useful campaign rules such as:

```md
# Campaign Guidelines

## Budget Changes

Large budget changes require human approval.

## Campaign Pausing

Pausing an active campaign is considered a high-impact action.

## Campaign Performance

When analyzing campaign performance, use actual campaign metrics instead of assumptions.

## Budget Recommendations

Recommendations should consider recent spend, conversions, and conversion rate.
```

Keep the knowledge base small.

---

# STEP 36 — RAG + AGENT

The Agent should retrieve knowledge when relevant.

Example:

```text
User:
Can I increase Campaign Alpha's budget significantly?
```

Agent flow:

```text
User
↓
Claude
↓
RAG / Knowledge
↓
Campaign Data
↓
Decision
↓
High-Risk Tool
↓
Approval
```

The agent should not invent policy information.

---

# STEP 37 — CHAT HISTORY

The Agent must receive relevant conversation history.

Flow:

```text
Database
↓
Conversation
↓
Messages
↓
Agent
↓
Claude
```

Store:

```text
USER
ASSISTANT
```

messages.

Do not send unlimited history.

For this small project, sending the last reasonable number of messages is acceptable.

---

# STEP 38 — AGENT CONVERSATION EXAMPLE

User:

```text
Show me Campaign Alpha.
```

Agent:

```text
Uses get_campaign.
```

User:

```text
Increase its budget to 150.
```

Agent should understand:

```text
"its"
=
Campaign Alpha
```

Then:

```text
Claude
↓
update_campaign_budget
↓
HIGH_RISK
↓
ApprovalRequest
↓
PENDING
```

The budget must not change yet.

---

# STEP 39 — APPROVAL CONTINUATION

After approval:

```text
POST /api/approvals/:id/approve
```

The backend should execute the original tool.

Store:

```text
ToolExecution
```

Update:

```text
ApprovalRequest
```

Then return the execution result.

Example:

```json
{
  "success": true,
  "data": {
    "approvalId": "...",
    "status": "EXECUTED",
    "result": {
      "campaignId": "...",
      "budget": 150
    }
  }
}
```

---

# STEP 40 — AGENT PENDING STATE

When an action is pending:

The Agent must clearly return:

```text
status = pending_approval
```

The Chat API must expose this status to the frontend.

Example:

```json
{
  "success": true,
  "data": {
    "conversationId": "...",
    "status": "pending_approval",
    "approvalId": "...",
    "message": "This action requires human approval."
  }
}
```

Do not return:

```text
status = completed
```

when the action is still pending.

---

# STEP 41 — CONCURRENCY

For this screening task, implement a simple protection mechanism.

If multiple approval requests exist:

```text
Approval A → PENDING
Approval B → PENDING
```

They may coexist.

However, the same approval request must never execute twice.

Use a status check before execution.

Conceptually:

```text
PENDING
↓
APPROVED
↓
EXECUTION
↓
EXECUTED
```

The approval endpoint should prevent duplicate execution.

---

# STEP 42 — IDEMPOTENCY

Approve endpoint must be safe against repeated calls.

Example:

```text
First request:
PENDING → APPROVED → EXECUTED

Second request:
EXECUTED → ERROR
```

Do not execute the tool twice.

---

# STEP 43 — ERROR HANDLING

Handle:

```text
Claude API failure
Database failure
Invalid tool
Invalid tool arguments
Campaign not found
Approval not found
Approval already processed
Tool execution failure
Agent loop limit exceeded
```

Return meaningful errors.

Never expose internal stack traces to the client.

---

# STEP 44 — AGENT LOOP LIMIT

Set:

```ts
const MAX_AGENT_ITERATIONS = 10;
```

If Claude keeps requesting tools indefinitely:

Stop execution.

Return:

```text
Agent execution limit reached.
```

Do not allow infinite loops.

---

# STEP 45 — API ROUTES

Final backend API should contain approximately:

```text
GET  /health

GET  /api/campaigns
GET  /api/campaigns/:id
GET  /api/campaigns/:id/metrics

POST /api/chat

GET  /api/approvals/pending
GET  /api/approvals/:id

POST /api/approvals/:id/approve
POST /api/approvals/:id/reject
```

Keep routes organized.

---

# STEP 46 — API ARCHITECTURE

Use:

```text
Route
 ↓
Controller
 ↓
Service
 ↓
Agent / Prisma / Tool
```

Do not put business logic directly into route files.

---

# STEP 47 — SECURITY

Even though this is a prototype:

Do NOT:

* expose API keys
* execute arbitrary shell commands
* execute arbitrary JavaScript from Claude
* accept arbitrary SQL
* allow Claude to choose unrestricted functions
* trust tool arguments without validation

Only registered tools may execute.

---

# STEP 48 — TOOL ALLOWLIST

Claude may only call tools registered in the tool registry.

Example:

```text
get_campaigns
get_campaign
get_campaign_metrics
get_recent_campaign_metrics
update_campaign_budget
pause_campaign
resume_campaign
```

If Claude requests:

```text
delete_database
send_email
run_shell
```

Reject the tool call.

Return a safe tool error.

---

# STEP 49 — TOOL RESULT FORMAT

Use a consistent result format.

Success:

```json
{
  "success": true,
  "data": {}
}
```

Failure:

```json
{
  "success": false,
  "error": "Campaign not found"
}
```

Pending:

```json
{
  "success": true,
  "status": "pending_approval",
  "approvalId": "..."
}
```

---

# STEP 50 — TEST SCENARIOS

You MUST test the following scenarios.

## Test 1 — Read Campaigns

User:

```text
Show me all campaigns.
```

Expected:

```text
Claude calls get_campaigns
↓
Database queried
↓
Tool result returned
↓
Claude answers
```

---

## Test 2 — Read Specific Campaign

User:

```text
Tell me about Campaign Alpha.
```

Expected:

```text
Claude calls get_campaign
```

---

## Test 3 — Metrics

User:

```text
Show me Campaign Alpha's recent performance.
```

Expected:

```text
Claude calls get_recent_campaign_metrics
```

---

## Test 4 — Low Risk Action

User:

```text
Resume Campaign Gamma.
```

Expected:

```text
Claude
↓
resume_campaign
↓
No approval
↓
Campaign becomes ACTIVE
```

---

## Test 5 — High Risk Action

User:

```text
Increase Campaign Alpha budget to 150.
```

Expected:

```text
Claude
↓
update_campaign_budget
↓
HIGH_RISK
↓
ApprovalRequest
↓
PENDING
```

Campaign budget must remain unchanged.

---

## Test 6 — Approve

Call:

```http
POST /api/approvals/:id/approve
```

Expected:

```text
PENDING
↓
APPROVED
↓
Tool executes
↓
EXECUTED
```

Campaign budget changes.

---

## Test 7 — Reject

Create another high-risk request.

Call:

```http
POST /api/approvals/:id/reject
```

Expected:

```text
PENDING
↓
REJECTED
```

Campaign remains unchanged.

---

## Test 8 — Double Approval

Approve an already executed approval.

Expected:

```text
Request rejected.
```

Tool must NOT execute again.

---

## Test 9 — Invalid Campaign

Ask:

```text
Tell me about campaign XYZ123.
```

Expected:

```text
Campaign not found.
```

Claude must not invent campaign information.

---

## Test 10 — Agent Loop

Verify Claude can perform:

```text
User
↓
Tool Call
↓
Tool Result
↓
Final Response
```

using the real Anthropic API.

---

# STEP 51 — TEST WITHOUT ANTHROPIC KEY

If the API key is missing:

The backend should start.

But AI endpoints should return a clear configuration error.

Example:

```text
ANTHROPIC_API_KEY is not configured.
```

Do not crash the entire server during startup unless the project intentionally requires strict startup validation.

---

# STEP 52 — LOGGING

Add simple development logs.

Example:

```text
[Agent] Starting request
[Agent] Claude requested tool: get_campaign
[Tool] Executing get_campaign
[Agent] Tool result returned
[Approval] Created approval request
[Approval] Request approved
[Tool] Executing approved action
```

Do not log:

* API keys
* sensitive secrets
* full unnecessary conversation data

Keep logging simple.

---

# STEP 53 — README UPDATE

Update:

```text
README.md
```

Include:

## Project

AI Campaign Operations Agent

## Backend

Node.js + Express + TypeScript

## AI

Anthropic Claude

## Database

SQLite + Prisma

## Features

* Campaign data retrieval
* AI tool calling
* Agent loop
* Campaign actions
* Human approval
* RAG knowledge
* Approval audit trail

## Setup

```bash
npm install
```

Then:

```bash
npm run prisma:generate
npm run prisma:migrate
npm run prisma:seed
```

Then:

```bash
npm run dev
```

---

# STEP 54 — ENVIRONMENT DOCUMENTATION

README should explain:

```env
ANTHROPIC_API_KEY=your_key_here
```

Never include a real key.

Explain where the developer should obtain/configure the API key if required.

---

# STEP 55 — SPEC UPDATE

Update:

```text
SPEC.md
```

Include:

```text
Agent Architecture
Tool Architecture
Approval State Machine
RAG Architecture
Failure Handling
Concurrency Strategy
Data Model
```

Keep it concise.

---

# STEP 56 — FINAL BACKEND STRUCTURE

The completed backend should approximately look like:

```text
apps/backend/
│
├── prisma/
│   ├── migrations/
│   ├── schema.prisma
│   └── seed.ts
│
├── src/
│   │
│   ├── agent/
│   │   ├── agent.service.ts
│   │   ├── agent.types.ts
│   │   ├── agent.prompts.ts
│   │   └── tools.ts
│   │
│   ├── approvals/
│   │   ├── approval.controller.ts
│   │   ├── approval.service.ts
│   │   └── approval.types.ts
│   │
│   ├── campaigns/
│   │   ├── campaign.controller.ts
│   │   ├── campaign.service.ts
│   │   └── campaign.tools.ts
│   │
│   ├── chat/
│   │   ├── chat.controller.ts
│   │   └── chat.service.ts
│   │
│   ├── rag/
│   │   ├── rag.service.ts
│   │   └── knowledge.ts
│   │
│   ├── middleware/
│   │   └── error.middleware.ts
│   │
│   ├── lib/
│   │   ├── prisma.ts
│   │   └── anthropic.ts
│   │
│   ├── routes/
│   │   └── index.ts
│   │
│   ├── app.ts
│   └── server.ts
│
├── .env
├── .env.example
├── package.json
└── tsconfig.json
```

---

# STEP 57 — FINAL VALIDATION

Run:

```bash
npm run prisma:generate
```

Then:

```bash
npm run prisma:migrate
```

Then:

```bash
npm run prisma:seed
```

Then:

```bash
npm run build
```

Then:

```bash
npm run dev
```

---

# STEP 58 — FINAL CHECKLIST

The following must work:

```text
[ ] Backend starts
[ ] Health endpoint works
[ ] SQLite database works
[ ] Prisma works
[ ] Seed works
[ ] Campaign API works
[ ] Campaign service works
[ ] Claude client works
[ ] Real Claude tool_use works
[ ] Real tool_result works
[ ] Agent loop works
[ ] Conversation history works
[ ] Read tools work
[ ] Low-risk tool works
[ ] High-risk tool creates approval
[ ] Pending status works
[ ] Approval endpoint works
[ ] Reject endpoint works
[ ] Approved action executes
[ ] Rejected action does not execute
[ ] Double approval is blocked
[ ] Tool execution is audited
[ ] Invalid tool is rejected
[ ] Invalid arguments are rejected
[ ] Campaign not found is handled
[ ] Agent iteration limit works
[ ] RAG retrieval works
[ ] RAG context can be used by agent
[ ] README updated
[ ] SPEC updated
[ ] No Meta API
[ ] No Google Ads API
[ ] No unnecessary infrastructure
```

---

# STEP 59 — FINAL TEST FLOW

The most important complete test is:

```text
USER
 │
 │ "Increase Campaign Alpha budget to $150"
 ▼
CHAT API
 │
 ▼
AGENT SERVICE
 │
 ▼
CLAUDE API
 │
 │ tool_use:
 │ update_campaign_budget
 ▼
TOOL REGISTRY
 │
 ▼
RISK CHECK
 │
 │ HIGH_RISK
 ▼
APPROVAL SERVICE
 │
 ▼
DATABASE
 │
 │ PENDING
 ▼
CHAT RESPONSE
 │
 │ "Waiting for approval"
 ▼
HUMAN
 │
 │ POST /approve
 ▼
APPROVAL SERVICE
 │
 ▼
VALIDATE CURRENT STATE
 │
 ▼
TOOL EXECUTION
 │
 ▼
PRISMA
 │
 ▼
SQLITE
 │
 ▼
CAMPAIGN UPDATED
 │
 ▼
TOOL EXECUTION AUDIT
 │
 ▼
APPROVAL = EXECUTED
```

This is the core feature of the entire technical screening.

---

# STEP 60 — IMPORTANT IMPLEMENTATION PRINCIPLE

Do not make the application look like a normal CRUD campaign management application.

The important part is the:

```text
AI Agent
+
Real Tool Calling
+
Human Approval
```

Campaign CRUD is only supporting infrastructure.

The evaluator should be able to see:

```text
Claude decides
↓
Claude calls a tool
↓
Backend intercepts the tool
↓
Backend checks risk
↓
High-risk action pauses
↓
Human approves
↓
Tool executes
↓
Result is recorded
```

That is the main demonstration.

---

# STEP 61 — DO NOT OVER-ENGINEER

This is a technical screening project.

Do NOT add:

```text
Microservices
Redis
Kafka
RabbitMQ
Kubernetes
Docker orchestration
Vector databases
Complex authentication
Role management
Multi-tenancy
Real ad APIs
Advanced event sourcing
Complex queues
Distributed locks
```

Unless the existing project already contains them.

The goal is a clean working prototype.

---

# STEP 62 — FINAL DEVELOPER REPORT

After implementation, provide exactly this report:

## Backend Status

```text
Backend: PASS / FAIL
Database: PASS / FAIL
Claude API: PASS / FAIL
Agent Loop: PASS / FAIL
Tool Calling: PASS / FAIL
Approval System: PASS / FAIL
RAG: PASS / FAIL
```

## APIs

List all implemented endpoints.

## Tools

List:

```text
get_campaigns
get_campaign
get_campaign_metrics
get_recent_campaign_metrics
update_campaign_budget
pause_campaign
resume_campaign
```

## Approval Flow

Explain:

```text
PENDING
→ APPROVED
→ EXECUTED

PENDING
→ REJECTED

APPROVED
→ FAILED
```

## Tests

Report the result of each test scenario.

## Known Limitations

Clearly list anything intentionally simplified.

Example:

```text
1. SQLite is used instead of PostgreSQL.
2. RAG uses lightweight local retrieval instead of a vector database.
3. Authentication is not implemented.
4. Campaign integrations are mocked/local.
5. Approval authorization is simplified for the screening.
```

## Next Step

STOP after backend completion.

Do not automatically implement frontend features.

The next separate step will be:

**PROMPT-04 — Frontend Chat + Approval UI**

---

# FINAL INSTRUCTION

Implement this backend incrementally.

Do not skip verification.

Do not fake Claude tool calling.

Use the real Anthropic API.

Use real Prisma database operations.

Use real approval state transitions.

Use real tool execution.

Keep the code simple, readable, and production-minded without over-engineering.

The final result should be a small but genuine Agentic AI backend suitable for a 3–4 hour technical screening.
