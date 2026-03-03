# Pic Palette

A photo browsing app built with [TanStack Start](https://tanstack.com/start) that lets you explore images from Unsplash and extract color palettes from them.

## Getting Started

First, create a `.env.local` file with your Unsplash API credentials:

```
UNSPLASH_ACCESS_KEY=your_access_key
```

Then run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the app.

## Tech Stack

- [TanStack Start](https://tanstack.com/start) - Full-stack React framework (SSR via Vite + Nitro)
- [TanStack Router](https://tanstack.com/router) - Type-safe file-based routing
- [TanStack Query](https://tanstack.com/query) - Data fetching with infinite scroll support
- [Tailwind CSS v4](https://tailwindcss.com) - Styling
- [Unsplash API](https://unsplash.com/developers) - Photo source
- [node-vibrant](https://github.com/Vibrant-Colors/node-vibrant) - Color palette extraction
- [Zod](https://zod.dev) - Schema validation for API responses and search params

## Scripts

```bash
npm run dev    # Start development server on port 3000
npm run build  # Build for production
npm start      # Run production server
```

## Deploy on Vercel

The project is configured for deployment on Vercel using the TanStack Start preset with Nitro as the server engine.
