import * as React from "react";
import { useState } from "react";
import { Select } from "@base-ui/react/select";
import { useNavigate } from "@tanstack/react-router";

export const SEARCH_TYPES = ["photos", "collections"] as const;
export type SearchType = (typeof SEARCH_TYPES)[number];

const LABELS: Record<SearchType, string> = {
  photos: "Photos",
  collections: "Collections",
};

export const Searchbar = () => {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [type, setType] = useState<SearchType>("photos");

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (!query.trim()) return;
    navigate({ to: "/search", search: { query: query.trim(), type } });
  };

  const handleTypeChange = (value: string | null) => {
    if (value && SEARCH_TYPES.includes(value as SearchType)) {
      setType(value as SearchType);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <button type="submit" className="sr-only" aria-hidden>Search</button>
      <div className="flex items-center rounded-2xl border border-white/10 bg-white/5 backdrop-blur-md focus-within:ring-2 focus-within:ring-brand-400 transition-shadow">
        <input
          required
          type="text"
          className="min-w-0 flex-1 bg-transparent py-3 pl-4 pr-3 text-text-primary placeholder:text-text-muted focus:outline-none"
          onChange={(event) => setQuery(event.target.value)}
          value={query}
          placeholder="Search for kittens, dogs or whatever"
          name="query"
        />
        <div className="h-5 w-px bg-white/10" />
        <Select.Root value={type} onValueChange={handleTypeChange}>
          <Select.Trigger className="flex cursor-default items-center gap-1.5 rounded-r-2xl px-4 py-3 text-sm font-medium text-text-secondary transition-colors hover:text-text-primary focus:outline-none data-[popup-open]:text-text-primary">
            <Select.Value />
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
              className="h-3.5 w-3.5 opacity-60"
            >
              <path
                fillRule="evenodd"
                d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z"
                clipRule="evenodd"
              />
            </svg>
          </Select.Trigger>
          <Select.Portal>
            <Select.Positioner side="bottom" align="end" sideOffset={8} className="z-50">
              <Select.Popup className="overflow-hidden rounded-xl border border-white/10 bg-surface-1 py-1 shadow-xl backdrop-blur-xl transition-[transform,scale,opacity] data-[ending-style]:scale-95 data-[ending-style]:opacity-0 data-[starting-style]:scale-95 data-[starting-style]:opacity-0">
                <Select.List>
                  {SEARCH_TYPES.map((searchType) => (
                    <Select.Item
                      key={searchType}
                      value={searchType}
                      className="flex cursor-default items-center gap-2.5 px-3 py-2 text-sm text-text-secondary hover:bg-surface-3 data-[highlighted]:bg-surface-3"
                    >
                      <Select.ItemText>{LABELS[searchType]}</Select.ItemText>
                      <Select.ItemIndicator className="ml-auto">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="h-3.5 w-3.5 text-brand-500">
                          <path fillRule="evenodd" d="M12.416 3.376a.75.75 0 0 1 .208 1.04l-5 7.5a.75.75 0 0 1-1.154.114l-3-3a.75.75 0 0 1 1.06-1.06l2.353 2.353 4.493-6.74a.75.75 0 0 1 1.04-.207Z" clipRule="evenodd" />
                        </svg>
                      </Select.ItemIndicator>
                    </Select.Item>
                  ))}
                </Select.List>
              </Select.Popup>
            </Select.Positioner>
          </Select.Portal>
        </Select.Root>
      </div>
    </form>
  );
};
