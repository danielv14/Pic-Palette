import { useMemo } from "react";
import type { ApiResult } from "~/types/ApiResult";

export const useInfinitePages = <T>(pages: ApiResult<T[]>[] | undefined) => {
  const firstError = pages?.find((page) => page.error)?.error ?? null;
  const items = useMemo(() => pages?.flatMap((page) => page.data ?? []) ?? [], [pages]);
  return { items, firstError };
};
