export const PhotoPageSkeleton = () => (
  <div className="p-2 md:p-4">
    <div className="mb-6 h-5 w-12 animate-pulse rounded-full bg-surface-3" />

    <div className="mt-4 grid grid-cols-1 gap-8 lg:grid-cols-2">
      <div className="flex flex-col gap-4">
        <div className="aspect-[4/3] w-full animate-pulse rounded-2xl bg-surface-3" />
        <div className="h-4 w-40 animate-pulse rounded-full bg-surface-3" />
      </div>

      <div className="rounded-2xl border border-surface-3 bg-surface-1 p-6">
        <div className="mb-5 h-6 w-20 animate-pulse rounded-full bg-surface-3" />
        <div className="flex flex-col gap-5">
          <div className="space-y-3">
            <div className="h-3 w-14 animate-pulse rounded-full bg-surface-3" />
            <div className="flex gap-2">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="h-9 w-9 animate-pulse rounded-full bg-surface-3" />
              ))}
            </div>
            <div className="h-3 w-14 animate-pulse rounded-full bg-surface-3" />
            <div className="flex gap-2">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="h-9 w-9 animate-pulse rounded-full bg-surface-3" />
              ))}
            </div>
          </div>
          <div className="space-y-4 rounded-xl bg-surface-0 p-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="flex items-center gap-3">
                <div className="h-3 w-20 animate-pulse rounded-full bg-surface-3" />
                <div className="h-3 flex-1 animate-pulse rounded-full bg-surface-3" />
                <div className="h-3 w-12 animate-pulse rounded-full bg-surface-3" />
              </div>
            ))}
          </div>
          <div className="flex gap-2">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="h-7 w-14 animate-pulse rounded-full bg-surface-3" />
            ))}
          </div>
          <div className="h-10 w-full animate-pulse rounded-xl bg-surface-3" />
        </div>
      </div>
    </div>
  </div>
);
