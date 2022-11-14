"use client";
import { useSearchParams } from "next/navigation";

interface PrevNextPageProps {
  hasNoMoreContent: boolean;
}

const Button = ({
  children,
  disabled,
}: {
  children: React.ReactNode;
  disabled: boolean;
}) => (
  <button
    disabled={disabled}
    type="submit"
    className="group text-slate-200 bg-indigo-500 disabled:bg-slate-200 disabled:cursor-not-allowed dark:disabled:bg-slate-600 disabled:shadow-none disabled:text-slate-400 hover:bg-indigo-700 transition-colors disabled:transition-none rounded-full px-4 py-2"
  >
    {children}
  </button>
);

export const PrevNextPage = ({ hasNoMoreContent }: PrevNextPageProps) => {
  const searchParams = useSearchParams();
  const currentPage = searchParams.has("page")
    ? parseInt(searchParams.get("page")!)
    : 0;
  const nextpage = searchParams.has("page") ? currentPage + 1 : 2;
  const prevPage = currentPage - 1;
  return (
    <div className="flex justify-center items-center gap-3">
      <form action="/search" method="get">
        <input
          readOnly
          type="text"
          name="query"
          value={searchParams.get("query") as string}
          hidden
        />
        <input readOnly type="text" name="page" value={prevPage} hidden />
        <Button disabled={prevPage < 1}>
          <span className="group-hover:-translate-x-0.5 inline-block transition-transform">
            &#8249;
          </span>{" "}
          Previous page
        </Button>
      </form>
      <form action="/search" method="get">
        <input
          readOnly
          type="text"
          name="query"
          value={searchParams.get("query") as string}
          hidden
        />
        <input readOnly type="text" name="page" value={nextpage} hidden />
        <Button disabled={hasNoMoreContent}>
          Next page{" "}
          <span className="group-hover:translate-x-0.5 group-disabled:translate-none inline-block transition-transform">
            &#8250;
          </span>
        </Button>
      </form>
    </div>
  );
};
