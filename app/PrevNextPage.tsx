"use client";
import { useSearchParams } from "next/navigation";
import { PaginationWithTypeOrQuerySchema } from "../schemas/PaginationParams";
import { ListType } from "../types/ListType";

interface PrevNextPageProps {
  hasNoMoreContent: boolean;
  path: string;
  pageParam: ListType;
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

export const PrevNextPage = ({
  hasNoMoreContent,
  path,
  pageParam,
}: PrevNextPageProps) => {
  const searchParams = useSearchParams();
  const paginationParams = PaginationWithTypeOrQuerySchema.parse(
    Object.fromEntries(searchParams.entries())
  );
  const nextpage = paginationParams.page === 0 ? 2 : paginationParams.page + 1;
  const prevPage = paginationParams.page - 1;
  const listType = paginationParams[pageParam];
  return (
    <div className="flex justify-center items-center gap-3">
      <form action={path} method="get">
        <input readOnly type="text" name={pageParam} value={listType} hidden />
        <input
          readOnly
          type="text"
          name="perPage"
          value={paginationParams.perPage}
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
      <form action={path} method="get">
        <input readOnly type="text" name={pageParam} value={listType} hidden />
        <input
          readOnly
          type="text"
          name="perPage"
          value={paginationParams.perPage}
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
