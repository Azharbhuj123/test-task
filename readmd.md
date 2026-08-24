# Prompt 00 — Project Analysis & Setup Planning

You are a Senior Full-Stack Engineer and AI Agentic Systems Architect.

You are working on an existing software project that will become a lightweight **AI Campaign Operations Agent**.

Before writing or modifying any code, your first responsibility is to **fully analyze the existing project and understand its current structure, dependencies, configuration, architecture, and development setup**.

This is a technical screening project, so the final implementation must remain lightweight and achievable within approximately **3–4 hours**.

---

# 1. IMPORTANT — ANALYZE FIRST

Do NOT immediately create files.

Do NOT immediately install dependencies.

Do NOT rewrite the project.

Do NOT replace the existing architecture without understanding it.

First inspect the entire repository and understand what already exists.

Analyze:

* Existing folders
* Existing files
* package.json
* Lock files
* TypeScript configuration
* Next.js configuration
* Backend configuration
* Environment files
* Database configuration
* Existing API routes
* Existing components
* Existing services
* Existing utilities
* Existing shared types
* Existing scripts
* Existing dependencies
* Existing Git configuration
* Existing documentation

If the project is empty, determine that clearly.

If the project already has an architecture, preserve useful parts wherever possible.

---

# 2. PROJECT GOAL

The final project will be a lightweight:

# AI Campaign Operations Agent

It will provide a conversational AI interface where users can communicate with an AI agent.

The agent should eventually be able to:

```text
User
 ↓
Chat
 ↓
AI Agent
 ↓
Understand Request
 ↓
Use Tools
 ↓
Retrieve Campaign Data
 ↓
Use RAG Knowledge
 ↓
Perform Low-Risk Actions
 ↓
Detect High-Impact Actions
 ↓
Request Human Approval
 ↓
Approve / Reject
 ↓
Execute Approved Action
 ↓
Return Tool Result
 ↓
Continue Agent
 ↓
Final Response
```

---

# 3. IMPORTANT PRODUCT DECISION

Do NOT integrate any real advertising platform.

Do NOT use:

* Meta Ads API
* Facebook API
* Google Ads API
* TikTok Ads API
* LinkedIn Ads API

The project will use its own local/mock campaign data.

The purpose of the project is to demonstrate:

* Agentic AI
* Tool Calling
* RAG
* Human-in-the-Loop
* Approval Workflow
* Chat-based AI interaction

The advertising platform itself is NOT the focus.

---

# 4. TARGET TECHNOLOGY

The preferred stack is:

## Frontend

* Next.js
* React
* TypeScript
* App Router
* Tailwind CSS
* TanStack Query
* Axios

## Backend

* Node.js
* TypeScript
* Express
* Zod
* CORS
* dotenv

## Database

* SQLite
* Prisma

## AI

* Anthropic Claude API
* Native Claude tool-use

## RAG

* Local knowledge documents
* Embeddings
* Lightweight vector retrieval

Do not introduce unnecessary infrastructure.

---

# 5. TARGET PROJECT STRUCTURE

The expected architecture is approximately:

```text
ai-campaign-agent/
│
├── apps/
│   │
│   ├── frontend/
│   │   ├── app/
│   │   ├── components/
│   │   ├── lib/
│   │   └── types/
│   │
│   └── backend/
│       ├── src/
│       │   ├── agent/
│       │   ├── approvals/
│       │   ├── campaigns/
│       │   ├── chat/
│       │   ├── rag/
│       │   ├── middleware/
│       │   └── lib/
│       │
│       └── prisma/
│
├── knowledge/
│   └── campaign-guidelines.md
│
├── packages/
│   └── shared/
│
├── README.md
├── SPEC.md
├── package.json
└── .gitignore
```

This is a TARGET structure only.

Do not blindly create it.

First determine whether the existing repository already follows a suitable structure.

---

# 6. ANALYZE THE EXISTING PROJECT

Create an analysis covering the following.

## A. Project Type

Determine:

* Is this a monorepo?
* Single frontend?
* Single backend?
* Full-stack?
* Existing Next.js project?
* Existing Node.js project?

## B. Frontend

Identify:

* Framework
* Version
* Router
* UI library
* Styling system
* State management
* API client
* Existing components
* Existing pages

## C. Backend

Identify:

* Runtime
* Framework
* API structure
* Controllers
* Services
* Middleware
* Error handling
* Validation

## D. Database

Identify:

* Current database
* ORM
* Existing schema
* Migrations
* Seed system

## E. AI

Check whether the project already has:

* AI SDK
* Anthropic SDK
* OpenAI SDK
* Tool calling
* Agent implementation
* Streaming
* AI utilities

Do not remove existing AI functionality.

## F. RAG

Check whether the project already has:

* Embeddings
* Vector database
* Document loader
* Chunking
* Retrieval
* Semantic search

## G. Environment

Identify:

```text
.env
.env.local
.env.example
```

Do not expose or print actual secret values.

Only identify variable names.

---

# 7. DEPENDENCY ANALYSIS

Inspect `package.json` files.

Create a table:

| Dependency | Purpose | Existing | Required | Action |
| ---------- | ------- | -------- | -------- | ------ |

For every required dependency, decide:

```text
KEEP
REMOVE
REPLACE
ADD
```

Do not install anything during this analysis step.

---

# 8. ARCHITECTURE GAP ANALYSIS

Compare the existing project with the target AI Agent architecture.

Identify what already exists for:

```text
Chat
Agent
Claude
Tool Calling
Campaign Data
RAG
Approval
Database
Frontend
Backend
```

Use:

```text
Existing
Missing
Needs Modification
```

Example:

```text
Chat
✓ Existing

Claude
✗ Missing

Approval System
✗ Missing

Database
✓ Existing Prisma + SQLite

RAG
✗ Missing
```

---

# 9. AGENT ARCHITECTURE PLAN

Do not implement it yet.

Explain how the final agent should work.

Expected architecture:

```text
User Message
     ↓
Chat API
     ↓
Agent Service
     ↓
Claude
     ↓
Tool Use
     ↓
Tool Router
     ↓
┌─────────────────────────────┐
│                             │
│ Read Tool                   │
│     ↓                       │
│ Execute Immediately         │
│                             │
│ High Impact Tool            │
│     ↓                       │
│ Approval Gate               │
│     ↓                       │
│ Pending                     │
│     ↓                       │
│ Human Approval              │
│     ↓                       │
│ Execute                     │
│                             │
└─────────────────────────────┘
     ↓
Tool Result
     ↓
Claude
     ↓
Final Response
```

Explain where the approval interception should happen.

---

# 10. TOOL ARCHITECTURE PLAN

The final system should have a small number of tools.

Expected tools:

```text
get_campaigns
get_campaign
get_campaign_metrics
search_campaign_knowledge
update_campaign_budget
```

Classify them:

```text
READ
READ
READ
RAG
HIGH_IMPACT
```

The `update_campaign_budget` tool must eventually require human approval.

Do not implement these tools yet.

Only analyze how they should fit into the existing architecture.

---

# 11. APPROVAL ARCHITECTURE PLAN

The final system should have a simple approval lifecycle:

```text
PENDING
   ↓
APPROVED
   ↓
EXECUTED
```

or:

```text
PENDING
   ↓
REJECTED
```

Optional:

```text
FAILED
```

Explain:

* Where approval records should live.
* How the agent waits.
* How approval resumes execution.
* How rejection stops execution.
* How duplicate approval should be prevented.

Do not implement this yet.

---

# 12. RAG ARCHITECTURE PLAN

The final system should have a lightweight knowledge base.

Expected:

```text
knowledge/
└── campaign-guidelines.md
```

Planned flow:

```text
Knowledge Document
       ↓
Chunking
       ↓
Embeddings
       ↓
Vector Storage
       ↓
User Question
       ↓
Retriever
       ↓
Relevant Context
       ↓
Claude
```

Do not implement RAG yet.

Only identify the best lightweight approach for this repository.

---

# 13. DATABASE PLAN

The final project may require:

```text
Conversation
Message
Campaign
ApprovalRequest
ToolExecution
```

Determine whether the existing database can support these.

If a database already exists, explain how to extend it.

If no database exists, recommend SQLite + Prisma.

Do not create migrations during this analysis step.

---

# 14. FRONTEND PLAN

The final frontend should remain extremely simple.

Expected UI:

```text
AI Campaign Agent
│
├── Chat Messages
├── Chat Input
└── Approval Card
    ├── Action
    ├── Current Value
    ├── Proposed Value
    ├── Approve
    └── Reject
```

Do not build the UI yet.

Determine where these components should be placed within the existing frontend.

---

# 15. API PLAN

The final backend should eventually expose:

```http
GET /health

POST /api/chat

GET /api/approvals

POST /api/approvals/:id/approve

POST /api/approvals/:id/reject
```

Do not implement these endpoints yet.

Check whether the existing API architecture can support them.

---

# 16. 3–4 HOUR TIME LIMIT

The implementation must remain small.

The following are OUT OF SCOPE:

* Meta integration
* Google Ads integration
* OAuth
* Authentication
* Multi-tenancy
* Multiple agents
* Complex dashboards
* Redis
* RabbitMQ
* Kafka
* Kubernetes
* Docker
* Complex background workers
* Production-grade vector infrastructure
* Advanced permissions
* Complex analytics

If the existing project contains unnecessary infrastructure for this test, recommend whether it should remain or be ignored.

Do not remove it automatically.

---

# 17. OUTPUT REQUIRED FROM THIS ANALYSIS

After inspecting the repository, provide a detailed but concise report with these sections:

## 1. Current Project Summary

Explain what currently exists.

## 2. Current Architecture

Show the existing architecture as a diagram.

## 3. Existing Technology Stack

List the actual technologies found.

## 4. Existing Dependencies

Explain important dependencies.

## 5. Existing Database

Explain the current database and schema.

## 6. Existing AI Capabilities

Explain whether AI/LLM/tool calling already exists.

## 7. Existing RAG Capabilities

Explain whether RAG already exists.

## 8. Existing Frontend

Explain the current frontend structure.

## 9. Existing Backend

Explain the current backend structure.

## 10. Gap Analysis

Show:

```text
Feature
Existing
Missing
Required Change
```

## 11. Target Architecture

Provide the recommended final architecture.

## 12. Recommended File Structure

Show the exact structure that should be used.

## 13. Dependencies To Add

Only list dependencies that are actually required.

## 14. Dependencies To Remove

Only recommend removal if clearly unnecessary.

## 15. Database Changes Required

Explain required models.

## 16. Environment Variables Required

Only list variable names.

Never expose secret values.

## 17. Implementation Order

Provide the exact sequence of future implementation steps.

Example:

```text
Step 01 → Project Setup
Step 02 → Database + Mock Campaigns
Step 03 → Claude Agent
Step 04 → Tool Calling
Step 05 → Approval Gate
Step 06 → RAG
Step 07 → Chat UI
Step 08 → Testing
Step 09 → README + SPEC
```

## 18. 3–4 Hour Scope

Clearly identify:

```text
MUST HAVE
NICE TO HAVE
SKIP
```

---

# 18. CRITICAL RULE

This prompt is an **ANALYSIS AND PLANNING STEP ONLY**.

Do NOT:

* Modify application logic.
* Create the full agent.
* Implement RAG.
* Implement approvals.
* Implement tool calling.
* Build the final UI.
* Create unnecessary dependencies.
* Delete existing code.

You may inspect files and configuration.

You may make a small temporary diagnostic change only if absolutely required to understand the project, but revert it before finishing.

The goal is to understand the existing project first.

---

# 19. Final Response Format

At the end, provide:

```text
PROJECT STATUS
----------------
Frontend: ...
Backend: ...
Database: ...
AI: ...
RAG: ...
Approval: ...

ARCHITECTURE STATUS
-------------------
Existing:
...

Required:
...

NEXT STEP
---------
The next prompt should implement:
...
```

Do not start implementation until the analysis is complete.

Wait for the next implementation prompt after providing this analysis.
