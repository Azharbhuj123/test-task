# AI Campaign Agent - SPEC

## Overview
A lightweight AI Campaign Operations Agent for managing local mock campaign data, utilizing real Claude AI with tool-calling capabilities and a human-in-the-loop approval state machine for high-risk actions.

## Agent Architecture
- Core loop handles `tool_use` directly using `@anthropic-ai/sdk`.
- Bounded loop iteration limits `MAX_AGENT_ITERATIONS` to prevent infinite loops.

## Tool Architecture
- Strict Zod validation on backend before tools execute.
- Read tools (`get_campaigns`, `get_campaign_metrics`) execute immediately.
- High Risk tools (`update_campaign_budget`) transition to a pending approval state instead of immediate execution.

## Approval State Machine
- `PENDING -> APPROVED -> EXECUTED`
- `PENDING -> REJECTED`
- Executing an action relies on strict database checks to ensure idempotency. Double approvals are rejected.

## RAG Architecture
- A simple local string match retrieval over `knowledge/campaign-guidelines.md` is fed to Claude for context. Vector DB omitted for prototype simplicity.

## Failure Handling
- Zod errors map to graceful tool errors fed back to Claude.
- Idempotency errors return strict `400` from the API.

## Data Model
- SQLite via Prisma. 
- Core entities: `User`, `Campaign`, `CampaignMetric`, `Conversation`, `Message`, `ApprovalRequest`, `ToolExecution`.
