"use client";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

interface PrevNextPageProps {
  hasNoMoreContent: boolean;
}

export const PrevNextPage = ({ hasNoMoreContent }: PrevNextPageProps) => {
  const searchParams = useSearchParams();
  const currentPage = searchParams.has("page")
    ? parseInt(searchParams.get("page")!)
    : 0;
  const nextpage = searchParams.has("page") ? currentPage + 1 : 2;
  const prevPage = currentPage - 1;
  return (
    <div className="flex justify-center items-center gap-3">
      <button
        disabled={prevPage < 1}
        className="group text-slate-200 bg-indigo-500 disabled:pointer-events-none disabled:bg-slate-500 disabled:shadow-none hover:bg-indigo-700 transition-colors rounded-full px-4 py-2"
      >
        <Link
          href={{
            pathname: "/search",
            query: {
              query: searchParams.get("query"),
              page: prevPage,
            },
          }}
          className="flex gap-1"
        >
          <span className="group-hover:-translate-x-0.5 inline-block transition-transform">
            &#8249;
          </span>{" "}
          Previous page
        </Link>
      </button>
      <button
        disabled={hasNoMoreContent}
        className="group text-slate-200 bg-indigo-500 disabled:pointer-events-none disabled:bg-slate-500 disabled:shadow-none hover:bg-indigo-700 transition-colors rounded-full px-4 py-2"
      >
        <Link
          href={{
            pathname: "/search",
            query: {
              query: searchParams.get("query"),
              page: nextpage,
            },
          }}
          className="flex gap-1"
        >
          Next page{" "}
          <span className="group-hover:translate-x-0.5 inline-block transition-transform">
            &#8250;
          </span>
        </Link>
      </button>
    </div>
  );
};
