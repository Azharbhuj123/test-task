# AGENTS.md

This file gives AI coding agents (Claude Code, Cursor, Copilot, etc.) the context and rules needed to work safely and consistently in this Next.js codebase. Read this before making changes.

---

## 1. Project Overview

- **Framework:** Next.js (App Router, TypeScript)
- **Styling:** Tailwind CSS
- **State:** Zustand (global), React Server Components + `useState` (local)
- **Data:** Prisma/Drizzle + Server Actions (no client-side fetch for mutations)
- **Validation:** Zod
- **Package manager:** *(pnpm | npm | yarn — set this to match the repo)*

Full folder structure and SEO/AEO/GEO conventions live in `nextjs-project-structure-seo-aeo-geo.md` — read that first for architecture context.

---

## 2. Setup Commands

```bash
pnpm install          # install dependencies
pnpm dev              # start dev server (localhost:3000)
pnpm build            # production build — run before declaring a task "done"
pnpm lint             # ESLint
pnpm typecheck        # tsc --noEmit
pnpm test             # unit tests
pnpm format           # Prettier write
```

**Before finishing any task:** run `lint`, `typecheck`, and `build`. Do not report a task complete if any of these fail.

---

## 3. Directory Rules — Where New Code Goes

| Adding... | Goes in... |
|---|---|
| A new page/route | `src/app/(group)/route-name/page.tsx` |
| A component used by ONE page only | `src/app/(group)/route-name/_components/` |
| A component reused across ≥2 features | `src/components/shared/` |
| A generic UI primitive (Button, Input) | `src/components/ui/` |
| Domain logic (auth, users, products, etc.) | `src/features/<feature>/` with its own `components/`, `hooks/`, `actions/`, `schemas/`, `types/` |
| A server mutation | `src/features/<feature>/actions/*.ts` with `"use server"` |
| A Zod schema | `src/features/<feature>/schemas/*.ts` |
| A cross-app utility | `src/lib/utils.ts` |
| A global hook | `src/hooks/` |
| Global state | `src/store/` |
| Metadata / JSON-LD helpers | `src/lib/seo.ts`, `src/lib/structured-data.ts` |

**Rule of thumb:** if it's tied to one business domain, it belongs in `features/`. If it's generic and reusable everywhere, it belongs in `components/` or `lib/`. Never create a flat catch-all `utils/` dump for feature-specific logic.

---

## 4. Coding Conventions

### Components
- Default to **Server Components**. Only add `"use client"` when the component needs interactivity, browser APIs, or hooks (`useState`, `useEffect`, event handlers).
- Push `"use client"` as far down the tree as possible — wrap only the interactive leaf, not the whole page.
- One component per file. File name matches the component name in kebab-case (`stats-card.tsx` → `StatsCard`).
- Co-locate a component's types in the same file unless shared, in which case move to `types/`.

### Data & Mutations
- All writes go through **Server Actions** (`"use server"`), not API routes, unless the consumer is external (webhook, third-party client).
- Validate every server action input with a **Zod schema** from `features/<feature>/schemas/` before touching the DB.
- Never call `fetch` to your own API routes from a Server Component — call the data layer directly.

### Styling
- Tailwind utility classes only. No inline `style={{}}` unless dynamic values require it.
- Use `cn()` from `lib/utils.ts` for conditional classes — never string-concatenate class names.
- Follow existing design tokens (spacing, colors) from `tailwind.config.ts`; don't invent new arbitrary values (`p-[13px]`) unless truly necessary.

### TypeScript
- No `any`. Use `unknown` + narrowing, or generate proper types from Zod schemas (`z.infer<typeof schema>`).
- Prefer `type` for props/unions, `interface` only when declaration merging is needed.
- Export shared types from `features/<feature>/types/` or global `src/types/`.

### Imports
- Use path aliases (`@/components/...`, `@/features/...`, `@/lib/...`) — never deep relative imports like `../../../components`.

---

## 5. SEO / AEO / GEO Requirements (Non-Negotiable)

Every new page must:
1. Export `generateMetadata` using `buildMetadata()` from `lib/seo.ts` — never hand-roll `<head>` tags.
2. Include a canonical URL.
3. Use exactly one `<h1>`, with a logical heading hierarchy below it.
4. Use `next/image` with meaningful `alt` text for all images — never a raw `<img>`.
5. Add relevant JSON-LD (`Article`, `FAQPage`, `Product`, `BreadcrumbList`) via `lib/structured-data.ts` helpers when the page type warrants it.
6. If adding an FAQ section, use real question-style headings and keep answers to short, self-contained paragraphs (AEO/GEO extractability).

If a page is added to `sitemap.ts` logic (dynamic route source), update the sitemap generator — don't leave new routes unindexed.

---

## 6. Testing Expectations

- New Server Actions and utility functions in `lib/` require unit tests.
- New UI components with logic (not pure presentational) require at least one test covering the primary interaction.
- Don't snapshot-test everything — prefer behavior assertions (`getByRole`, `getByText`) over snapshot diffs.
- Place tests next to the file: `component.tsx` + `component.test.tsx`.

---

## 7. Git & PR Conventions

- **Branch naming:** `feature/<short-name>`, `fix/<short-name>`, `chore/<short-name>`.
- **Commits:** Conventional Commits format — `feat:`, `fix:`, `refactor:`, `chore:`, `docs:`.
- **Before opening a PR:** `lint`, `typecheck`, `test`, and `build` must all pass locally.
- Keep PRs scoped to one feature/fix. Don't mix refactors with feature work in the same PR.
- Update this file if you introduce a new top-level convention (new folder, new required pattern).

---

## 8. Things Agents Should NOT Do

- Don't add new top-level folders under `src/` without checking this file first — everything should fit the existing `app/ components/ features/ lib/ hooks/ store/ types/ config/` structure.
- Don't introduce a new state management library alongside Zustand.
- Don't bypass Zod validation on server actions "to save time."
- Don't use `getServerSideProps`/`getStaticProps` — this is App Router only (no Pages Router patterns).
- Don't fetch data in Client Components when it could be fetched in a Server Component and passed down.
- Don't hardcode strings that belong in `config/site.ts` (site name, URLs, nav links).
- Don't commit `.env.local` or real secrets — only `.env.example` with placeholder keys.
- Don't skip `alt` text, metadata, or semantic HTML "to move faster" — SEO/AEO/GEO rules in Section 5 are mandatory, not optional polish.

---

## 9. Quick Reference: Feature Module Template

When scaffolding a new feature, generate this shape:

```
src/features/<feature-name>/
├── components/
│   └── <feature-name>-form.tsx
├── hooks/
│   └── use-<feature-name>.ts
├── actions/
│   └── <feature-name>-actions.ts     # "use server"
├── schemas/
│   └── <feature-name>-schema.ts      # Zod
└── types/
    └── <feature-name>.types.ts
```

---

## 10. Where to Look First

| Question | Answer lives in |
|---|---|
| "Where does X component go?" | Section 3 above |
| "How do I fetch/mutate data?" | Section 4 → Data & Mutations |
| "What metadata does this page need?" | Section 5, `lib/seo.ts` |
| "What's the full folder architecture?" | `nextjs-project-structure-seo-aeo-geo.md` |
| "Site name, nav links, base URL?" | `src/config/site.ts` |
| "Env variables?" | `src/config/env.ts` + `.env.example` |
