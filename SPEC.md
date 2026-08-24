# AI Campaign Agent - SPEC

## Overview
A lightweight AI Campaign Operations Agent that can query mock campaign data, use RAG for guidelines, and perform tool execution that respects a human-in-the-loop approval workflow.

## Architecture
- Frontend: Next.js + Tailwind + React Query + Axios
- Backend: Express + Prisma (SQLite)
- AI: Anthropic API

## Flow
User -> Chat -> Agent -> Tool Routing -> (Optional Approval) -> Execution -> Final Response

## Scope
- Simple local/mock campaign data.
- Tool Calling for Reading and High-Impact updates.
- Approval interception and resolution.
- Local RAG setup.
- OUT OF SCOPE: Authentication, real Ads APIs, multi-tenancy.
