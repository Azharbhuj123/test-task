# AI Campaign Operations Agent

## Backend
Node.js + Express + TypeScript

## AI
Anthropic Claude

## Database
SQLite + Prisma

## Frontend
Next.js + React + TypeScript + Tailwind CSS + TanStack Query + Axios

## Features
* Campaign data retrieval
* AI tool calling
* Agent loop
* Campaign actions
* Human approval
* RAG knowledge
* Approval audit trail
* Clean modern chat interface

## Setup
```bash
npm install
```

### Backend Setup
```bash
cd apps/backend
npm run prisma:generate
npm run prisma:migrate
npm run prisma:seed
npm run dev
```

### Frontend Setup
```bash
cd apps/frontend
npm run dev
```

## Environment Documentation
Create `.env` in `apps/backend/` and include:
```env
ANTHROPIC_API_KEY=your_key_here
PORT=4000
DATABASE_URL="file:./dev.db"
```

Create `.env` in `apps/frontend/` and include:
```env
NEXT_PUBLIC_API_URL=http://localhost:4000
```

## Demo Flow

1. Open `http://localhost:3000` (Frontend)
2. Ask agent for campaign information (e.g. "Show me all campaigns").
3. Ask agent to perform a high-impact action (e.g. "Increase Campaign Alpha's budget to $150").
4. Agent creates pending approval and chat tells you to check the sidebar.
5. Approve or reject from UI sidebar.
6. Verify the campaign state by asking the agent again.
7. Continue conversation.
