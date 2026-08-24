# Campaign Agent: Full Project Overview

Campaign Agent is a modern, AI-powered web application designed to help marketing teams manage, analyze, and execute high-impact campaign operations through a conversational interface.

Built with a robust Full-Stack TypeScript architecture, this application deeply integrates an LLM (OpenAI `gpt-4o-mini`) with local databases, RAG knowledge bases, dynamic charting, and a secure Human-in-the-Loop (HITL) approval system.

---

## 🏗️ Architecture & Tech Stack

### Frontend
- **Framework:** Next.js 16 (React, Turbopack)
- **Styling:** Tailwind CSS (Custom Purple-Gradient Theme, glassmorphism UI)
- **State Management:** React hooks + TanStack Query
- **Data Visualization:** Recharts (Dynamic JSON-to-Chart rendering)
- **Markdown Processing:** React-Markdown with Tailwind Typography
- **Icons:** Lucide React

### Backend
- **Framework:** Node.js + Express + TypeScript
- **Database:** SQLite with Prisma ORM
- **AI Integration:** OpenAI SDK (`gpt-4o-mini`)
- **Document Processing:** Custom Base64 parsing for Vision and Document injection
- **RAG System:** Local file-based embeddings and knowledge retrieval

---

## ✨ Core Features & Workflows

### 1. Conversational AI Agent
The core of the application is a conversational AI agent capable of answering questions, summarizing data, and calling tools. The agent uses an iterative "Agent Loop" (up to 10 iterations per request) to execute backend tools autonomously before responding to the user.

### 2. Human-in-the-Loop (HITL) Approvals
Security is paramount for campaign operations. Any action that mutates the database (e.g., increasing a budget, pausing a campaign, deleting data) is intercepted by the `ApprovalService`.
- Instead of executing the tool immediately, the AI drafts a **Pending Approval Request**.
- The frontend UI displays an amber/purple warning in the chat bubble.
- The user can review the request in the right-side **Approvals Panel** and click "Approve" or "Reject".
- Upon approval, the backend executes the tool and the chat UI updates dynamically with a green "Task Completed" banner.

### 3. Dynamic Charting
The AI is instructed to output performance metrics (like "Last 7 Days Performance") in a specific JSON format. The frontend intercepts these JSON blocks inside the markdown renderer and dynamically mounts interactive `Recharts` components (LineCharts, BarCharts) directly inside the chat bubble.

### 4. True Vision & Document Processing
The Chat Input supports uploading files (images, PDFs, text documents).
- **Vision:** Images are securely passed to OpenAI's native vision endpoint as Base64 Data URLs, allowing the AI to analyze screenshots, graphs, and photos instantly.
- **Documents:** Text files (txt, md, csv) are decoded on-the-fly by the backend and injected into the prompt. The AI reads the entire document instantly without waiting for background RAG ingestion.
- **Persistence:** Attachments are serialized as JSON and stored in the Prisma database, ensuring they persist beautifully in the UI across page reloads.

### 5. RAG Knowledge Base
The AI has access to a local `/knowledge` directory. Using specialized tools (`list_knowledge_documents`, `read_knowledge_document`), the AI can dynamically search and read long-form marketing guidelines, brand standards, and historical campaign data to ground its answers.

### 6. Dynamic API Key Management
Users can configure the application on-the-fly by opening the Settings Modal (gear icon). The OpenAI API Key can be securely updated and persisted to the backend `.env` file without needing to restart the server.

---

## 🚀 Setup & Installation

1. **Install Dependencies:**
   ```bash
   npm install
   ```

2. **Configure Environment:**
   In `apps/backend/.env`:
   ```env
   OPENAI_API_KEY=your_openai_api_key_here
   PORT=4000
   DATABASE_URL="file:./dev.db"
   ```
   In `apps/frontend/.env`:
   ```env
   NEXT_PUBLIC_API_URL=http://localhost:4000
   ```

3. **Initialize Database:**
   ```bash
   cd apps/backend
   npx prisma generate
   npx prisma db push
   npm run prisma:seed
   ```

4. **Run Application:**
   Start the backend:
   ```bash
   cd apps/backend
   npm run dev
   ```
   Start the frontend:
   ```bash
   cd apps/frontend
   npm run dev
   ```

---

## 🎨 UI/UX Design Principles
- **Modern Layout:** A full-width app window with an expandable mini-sidebar on the left, and a contextual panel (Approvals/Docs/Activity) on the right.
- **Vibrant Theme:** A highly polished `Purple/Blue` gradient theme. Avoid generic primary colors in favor of smooth glassmorphism effects and soft shadows.
- **Responsive Interactions:** Real-time search filtering, dynamic input resizing, and instant visual feedback when actions are approved or files are uploaded.
