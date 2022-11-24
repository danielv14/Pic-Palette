import Link from "next/link";
import { OrderBy } from "unsplash-js";
import "./globals.css";
import { Searchbar } from "./Searchbar";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head />
      <body className="bg-slate-300 dark:bg-slate-800 dark:text-gray-100 text-gray-800 container mx-auto p-2">
        <h1 className="text-center pt-4  text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-br from-indigo-300 to-indigo-600">
          Pic Palette
        </h1>
        <p className="text-center text-md md:text-2xl font-bold text-slate-600">
          Search for images to find color palettes to use in your projects!
        </p>
        <div className="px-4 py-2">
          <Searchbar />
        </div>
        <p className="text-center text-md md:text-xl font-bold text-slate-600 mb-3">
          Or browse{" "}
          <Link
            className="hover:underline hover:decoration-indigo-400 text-indigo-500 hover:text-indigo-400"
            href={`/list?${new URLSearchParams({
              type: OrderBy.POPULAR,
            }).toString()}`}
          >
            popular
          </Link>{" "}
          or{" "}
          <Link
            className="hover:underline hover:decoration-indigo-400 text-indigo-500 hover:text-indigo-400"
            href={`/list?${new URLSearchParams({
              type: OrderBy.LATEST,
            }).toString()}`}
          >
            latest
          </Link>{" "}
          images
        </p>

        {children}
      </body>
    </html>
  );
}
