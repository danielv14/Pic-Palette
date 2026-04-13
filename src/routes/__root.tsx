import type { QueryClient } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import {
  createRootRouteWithContext,
  HeadContent,
  Outlet,
  Scripts,
} from "@tanstack/react-router";
import appCss from "~/styles.css?url";

export const Route = createRootRouteWithContext<{
  queryClient: QueryClient;
}>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "Pic Palette" },
      {
        name: "description",
        content: "Search for images and extract color palettes",
      },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      {
        rel: "icon",
        href: "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>🎨</text></svg>",
      },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      {
        rel: "preconnect",
        href: "https://fonts.gstatic.com",
        crossOrigin: "anonymous",
      },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600&family=JetBrains+Mono:wght@400&family=Outfit:wght@600;700;800&display=swap",
      },
    ],
  }),
  component: RootComponent,
});

function RootComponent() {
  return (
    <RootDocument>
      <Outlet />
    </RootDocument>
  );
}

function RootDocument({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body className="min-h-screen bg-surface-0 font-body text-text-primary">
        <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(ellipse_at_top,_var(--color-brand-900)_0%,_transparent_50%)] opacity-30" />
        <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(ellipse_at_bottom_right,_var(--color-brand-900)_0%,_transparent_50%)] opacity-15" />
        <div className="noise-overlay" />
        <div className="relative">{children}</div>
        {import.meta.env.DEV && <ReactQueryDevtools buttonPosition="bottom-right" />}
        <Scripts />
      </body>
    </html>
  );
}
