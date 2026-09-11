# Pic Palette - Claude Instructions

## Project Overview

Photo browsing app that fetches images from Unsplash and extracts color palettes from them. Built with TanStack Start (SSR), TanStack Router (file-based routing), TanStack Query (infinite scroll), and Tailwind CSS v4.

## Commands

```bash
npm run dev    # Dev server on http://localhost:3000
npm run build  # Production build
npm test       # Vitest
npm start      # Run production server (node .output/server/index.mjs)
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
    unsplash/       # client.ts (Unsplash client), api.ts (pure endpoint calls, error mapping),
                    # serverFns.ts (createServerFn adapters), queries.ts (TanStack Query options)
  routes/           # File-based routes (TanStack Router)
    __root.tsx      # Root layout
    _app.tsx        # App layout
    _app/           # Pages: index, search, list
  types/            # TypeScript interfaces
  utils/            # Helpers (color adjust, sleep)
```

## Key Patterns

- **Routing:** File-based with TanStack Router. `routeTree.gen.ts` is auto-generated - never edit manually.
- **Data fetching:** Server functions via `createServerFn` from `@tanstack/react-start` are thin adapters over pure functions in `src/integration/unsplash/api.ts`, which take the Unsplash client as an argument so tests can pass a fake.
- **Infinite scroll:** `InfiniteResults` renders any paged `ApiResult` list with a "Load more" button; routes pass query options and a render function.
- **Validation:** Route search params are validated with Zod via `validateSearch` in each route file. Server function params are plain types.
- **Tests:** Vitest with jsdom. Pure modules (api, favorites store, color adjust) and `InfiniteResults` have tests; run `npm test`.
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
