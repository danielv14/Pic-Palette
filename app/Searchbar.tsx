"use client";

import { useSearchParams } from "next/navigation";
import { useState } from "react";

export const Searchbar = () => {
  const searchParams = useSearchParams();
  const [query, setQuery] = useState(searchParams.get("query") ?? "");
  return (
    <form action={`/search`} method="get">
      <div className="relative flex-auto">
        <input
          type="text"
          className="form-input bg-slate-700 ring-indigo-700 pl-12 border-none w-full rounded-full placeholder:text-slate-400 py-2 px-3 text-slate-300"
          onChange={(e) => {
            setQuery(e.target.value);
          }}
          value={query}
          placeholder="Search for kittens, dogs or whatever"
          name="query"
        />
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 20 20"
          strokeWidth={1.5}
          stroke="currentColor"
          className="pointer-events-none absolute inset-y-0 left-3 h-full w-5 fill-slate-700/50 transition text-slate-400"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
          />
        </svg>
      </div>
    </form>
  );
};
