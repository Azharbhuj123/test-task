# AI Campaign Operations Agent

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

## Environment Documentation
Create `.env` in `apps/backend/` and include:
```env
ANTHROPIC_API_KEY=your_key_here
PORT=4000
DATABASE_URL="file:./dev.db"
```
(Do not commit real API keys to version control).
