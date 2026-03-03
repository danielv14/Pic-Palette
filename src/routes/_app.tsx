import { createFileRoute, Link, Outlet } from "@tanstack/react-router";
import { OrderBy } from "unsplash-js";
import { Searchbar } from "~/components/Searchbar";

const AppLayout = () => (
  <div className="container mx-auto px-4 py-6">
    <h1 className="pt-10 pb-3 text-center font-display text-4xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-br from-brand-300 to-brand-500 md:text-5xl">
      Pic Palette
    </h1>
    <p className="mb-6 text-center text-base text-text-muted">
      Search for images to find color palettes to use in your projects
    </p>
    <div className="mx-auto max-w-2xl px-4 py-4">
      <Searchbar />
    </div>
    <div className="mt-4 mb-8 flex flex-wrap items-center justify-center gap-2">
      <Link
        to="/list"
        search={{ type: OrderBy.POPULAR }}
        className="rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-sm text-text-secondary backdrop-blur-md transition-all duration-200 hover:bg-white/10 hover:text-text-primary"
      >
        Popular
      </Link>
      <Link
        to="/list"
        search={{ type: OrderBy.LATEST }}
        className="rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-sm text-text-secondary backdrop-blur-md transition-all duration-200 hover:bg-white/10 hover:text-text-primary"
      >
        Latest
      </Link>
      <Link
        to="/topics"
        className="rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-sm text-text-secondary backdrop-blur-md transition-all duration-200 hover:bg-white/10 hover:text-text-primary"
      >
        Topics
      </Link>
    </div>
    <Outlet />
  </div>
);

export const Route = createFileRoute("/_app")({
  component: AppLayout,
});
