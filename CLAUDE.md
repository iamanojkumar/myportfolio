# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev      # dev server (http://localhost:3000)
npm run build    # production build — also the only type-check gate (tsc noEmit via next build)
npm run start    # serve production build
npm run lint     # next lint (eslint-config-next core-web-vitals)
```

There is no test suite and no test runner installed.

## Required environment

`.env.local` must define `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`. `lib/supabaseClient.ts` throws at module load if either is missing, so a missing env file breaks every page, not just data fetching.

## Architecture

Next.js 14 App Router, TypeScript strict, React 18, CSS Modules. No CSS framework, no state library, no ORM — Supabase is called directly from `lib/`.

**Data flow.** All persistence goes through `lib/projects.ts`, the single boundary between the app and the `projects` table. It owns the snake_case ↔ camelCase mapping (`hero_image` ↔ `heroImage`, `created_at` ↔ `createdAt`) via `fromRow`/`toRow`; nothing else in the codebase should touch that table or those column names. `saveProject` is an upsert keyed on the client-generated `crypto.randomUUID()` id, so creating and editing are the same call.

The Supabase client is shared and configured with `cache: 'no-store'` on its fetch. Both server pages (`app/page.tsx`, `app/project/[id]/page.tsx`) set `export const dynamic = 'force-dynamic'` — the site deliberately renders fresh on every request so admin edits appear immediately. Removing either the no-store fetch or the `force-dynamic` flag will cause stale content.

The `projects` table has no migration tooling — schema changes are applied by hand in the Supabase SQL editor. SQL that has been applied is kept in `db/` for the record (e.g. `db/add-featured-column.sql` adds the `featured` column). Adding a field to `Project` without running the matching SQL breaks every save, since `toRow` sends the column on upsert.

**Three routes.**
- `/` — server component listing projects. `splitFeatured()` partitions them into the `FeaturedProjects` card grid (cover image + CTA) and the plain `ProjectList` below it; when nothing is featured the list keeps its original "Projects" heading.
- `/project/[id]` — server component. Project body is stored as an HTML string and injected with `dangerouslySetInnerHTML`. Before injection, `generateHeadingData()` rewrites `<h1>`–`<h5>` tags to add slug ids and returns the heading list that `TableOfContents` uses for scroll-spy. That function is the sole coupling between the stored HTML and the TOC — heading ids are derived, never stored.
- `/admin` — one large `'use client'` component: sidebar list, draft state, and the editor. Auth is a hardcoded username/password constant compared client-side (`ADMIN_USER`/`ADMIN_PASS` in `app/admin/page.tsx`); it is decoration, not security. Real protection would have to come from Supabase RLS on the `projects` table and the `Media` bucket.

**Editor.** `components/RichEditor.tsx` is a `contentEditable` div driven by `document.execCommand`, producing the HTML string stored in `projects.content`. It syncs one-way from the `value` prop only when `editor.innerHTML !== value`, to avoid clobbering the caret on every keystroke — preserve that guard when changing the sync logic. Media inserted through `MediaPopover` uploads via `lib/uploadMedia.ts` (Supabase Storage bucket `Media`, 50MB cap, random UUID filename) and is embedded as a public URL.

**Cross-cutting UI.** `SmoothScroll` wraps the whole app in `app/layout.tsx`, running a Lenis instance and exposing it through `useLenis()` — components that scroll programmatically (`TableOfContents`, `BackToTop`) must go through the Lenis instance rather than native scrolling. `RevealContainer` sets up one IntersectionObserver that watches every `.reveal:not(.in)` element in its subtree, so entrance animations are opted into by adding the global `reveal` class in JSX rather than per-component logic.

**Theming.** Light/dark are CSS custom properties on `:root` and `:root[data-theme='dark']` in `app/globals.css`. An inline blocking script in `app/layout.tsx` sets `data-theme` before paint (localStorage, falling back to `prefers-color-scheme`) to avoid a flash; `ThemeToggle` writes both the attribute and localStorage. New colors belong in the token block in `globals.css` — component CSS modules should only reference `var(--…)`.

## Legacy file

`portfolio.html` at the repo root is the original single-file prototype the Next.js app was ported from. It is not built, served, or imported; treat it as design reference only and do not keep it in sync.
