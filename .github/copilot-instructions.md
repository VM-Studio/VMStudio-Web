## Purpose

This file gives succinct, actionable guidance for AI coding agents working in the VMStudio-Web repository.
Focus on concrete, discoverable patterns (files to change, commands to run, notable conventions).

## Project at-a-glance

- Framework: Next.js (app directory), Next 16.0.2, React 19
- Language: TypeScript (strict mode on via `tsconfig.json`)
- Styling: Tailwind CSS (v4) and a global stylesheet at `src/app/globals.css`
- Fonts: `next/font/google` is used (see `src/app/layout.tsx` for Geist/Geist_Mono variables)
- Build & host: typical Vercel deployment (no custom runtime detected in repo)

## Quick commands

- Start local dev server: `npm run dev` (maps to `next dev`)
- Build: `npm run build` (maps to `next build`)
- Start production server (locally): `npm run start` (maps to `next start`)
- Lint: `npm run lint` (package.json maps to `eslint`) — for targeted linting use: `npx eslint . --ext .ts,.tsx` if needed

## Key files & where to work

- App entry / pages: `src/app/page.tsx` (primary landing component to edit)
- Root layout / global styles: `src/app/layout.tsx` and `src/app/globals.css` — global fonts and CSS variables are set here
- Static assets: `public/` (images, SVGs used by `next/image` in `page.tsx`)
- TypeScript paths: `tsconfig.json` exposes `@/* -> ./src/*` — prefer imports like `@/components/Widget`
- Next config: `next.config.ts` (currently minimal); adjust here for advanced features (images, redirects, experimental flags)

## Project-specific conventions (do not change without tests/PR)

- App directory uses React Server Components by default. Components in `src/app` are server components unless they include the top-line directive `"use client"` — add that only when you rely on browser-only hooks (useState, useEffect) or third-party client libs.
- Fonts are loaded via `next/font/google` in `layout.tsx`. They expose CSS variables (e.g. `--font-geist-sans`) used on `<body>`; prefer reusing those variables instead of re-declaring fonts.
- Tailwind utility classes are used directly in JSX (no CSS-in-JS). Keep component class lists short and semantic where possible.
- Image handling uses `next/image` — static paths reference `public/` (e.g., `src="/next.svg"`). When adding remote images, configure domains in `next.config.ts`.

## Examples (concrete)

- Import using path alias:

  import MyComp from "@/components/MyComp";

- Convert a server component to client-only (if you add hooks):

  // At top of file
  "use client";
  import { useState } from "react";

## Tests & CI

- This repository currently has no automated tests or CI config in the repo root. Treat behavior changes conservatively and add small unit/interaction tests when introducing new logic.

## Adding APIs / server logic

- There are no `api` routes present. To add server handlers, add route handlers under `src/app/api/.../route.ts` (Next 16 app routing). Follow Next.js app router conventions.

## Linting and code style

- ESLint config lives at the repo root (`eslint.config.mjs`). `npm run lint` invokes `eslint` — CI or local runs may need explicit globs: `npx eslint src --ext .ts,.tsx`.

## Where to look for more context

- `README.md` (project bootstrap / dev hints)
- `package.json` (scripts and dependency versions)
- `src/app/layout.tsx` and `src/app/page.tsx` (concrete examples of fonts, Tailwind, and `next/image` usage)

## If you're unsure

- Preserve Server vs Client component boundaries; prefer server components unless client features are required.
- Keep changes isolated and small; run dev server and verify UI and console for runtime errors.

---
If anything important is missing or you want a different level of detail (e.g., CI, deploy hooks, testing template), tell me which area to expand and I will iterate.
