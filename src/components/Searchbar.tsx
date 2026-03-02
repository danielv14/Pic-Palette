import { useState } from "react";
import { useNavigate } from "@tanstack/react-router";

export const Searchbar = () => {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (!query.trim()) return;
    navigate({ to: "/search", search: { query: query.trim() } });
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="relative flex-auto">
        <input
          required
          type="text"
          className="w-full rounded-full bg-white py-3 pr-4 pl-12 text-gray-900 shadow-lg shadow-brand-500/10 placeholder:text-gray-400 focus:ring-2 focus:ring-brand-400 focus:outline-none"
          onChange={(event) => setQuery(event.target.value)}
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
          className="pointer-events-none absolute inset-y-0 left-3 h-full w-5 text-gray-400"
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
