import { createFileRoute, Link, Outlet } from "@tanstack/react-router";
import { OrderBy } from "unsplash-js";
import { Searchbar } from "~/components/Searchbar";

const AppLayout = () => (
  <div className="container mx-auto px-4 py-6">
    <h1 className="pt-10 pb-3 text-center font-display text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-br from-brand-300 to-brand-600 md:text-5xl">
      Pic Palette
    </h1>
    <p className="mb-6 text-center text-md font-bold text-text-secondary md:text-2xl">
      Search for images to find color palettes to use in your projects!
    </p>
    <div className="mx-auto max-w-2xl px-4 py-4">
      <Searchbar />
    </div>
    <p className="mt-2 mb-8 text-center text-md font-bold text-text-secondary md:text-xl">
      Or browse{" "}
      <Link
        to="/list"
        search={{ type: OrderBy.POPULAR }}
        className="text-brand-400 transition-colors hover:text-brand-300 hover:underline hover:decoration-brand-400"
      >
        popular
      </Link>{" "}
      or{" "}
      <Link
        to="/list"
        search={{ type: OrderBy.LATEST }}
        className="text-brand-400 transition-colors hover:text-brand-300 hover:underline hover:decoration-brand-400"
      >
        latest
      </Link>{" "}
      images, or explore{" "}
      <Link
        to="/topics"
        className="text-brand-400 transition-colors hover:text-brand-300 hover:underline hover:decoration-brand-400"
      >
        topics
      </Link>
    </p>
    <Outlet />
  </div>
);

export const Route = createFileRoute("/_app")({
  component: AppLayout,
});
