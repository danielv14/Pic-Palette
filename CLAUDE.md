# Pic Palette - Claude Instructions

## Project Overview

Photo browsing app that fetches images from Unsplash and extracts color palettes from them. Built with TanStack Start (SSR), TanStack Router (file-based routing), TanStack Query (infinite scroll), and Tailwind CSS v4.

## Commands

```bash
yarn dev    # Dev server on http://localhost:3000
yarn build  # Production build
yarn start  # Run production server (node .output/server/index.mjs)
```

## Environment

Requires `.env.local` with:
```
UNSPLASH_ACCESS_KEY=your_access_key
```

## Project Structure

```
src/
  components/       # React UI components
  integration/      # External API integrations
    unsplash/       # All Unsplash API logic (server fns, queries, palette extraction)
  routes/           # File-based routes (TanStack Router)
    __root.tsx      # Root layout
    _app.tsx        # App layout
    _app/           # Pages: index, search, list
  schemas/          # Zod validation schemas for search/list/pagination params
  types/            # TypeScript interfaces
  utils/            # Helpers (color extraction, sleep)
```

## Key Patterns

- **Routing:** File-based with TanStack Router. `routeTree.gen.ts` is auto-generated - never edit manually.
- **Data fetching:** Server functions via `createServerFn` from `@tanstack/react-start`. All Unsplash API calls go through `src/integration/unsplash/`.
- **Infinite scroll:** TanStack Query `infiniteQueryOptions` with a "Load more" button.
- **Validation:** Zod schemas in `src/schemas/` are used for both runtime validation and type inference (`z.infer<>`). Route search params are validated via `validateSearch`.
- **Styling:** Tailwind CSS v4 with custom OKLCH color variables and custom fonts (Outfit/Inter) defined in `src/styles.css`.
- **Path aliases:** `~/` maps to `src/`.

## Code Conventions

- Const arrow functions: `const foo = () => {}`
- Explicit variable names
- Async/await over `.then()`/`.catch()`
- Components typed with TypeScript interfaces for props
- Boolean props hardcoded to true omit `={true}`

## Deployment

Configured for Vercel with TanStack Start preset via Nitro server engine. Nitro plugin is added in `vite.config.ts`.
