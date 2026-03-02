import type { ReactNode } from "react";

export const ImageGrid = ({ children }: { children: ReactNode }) => (
  <div className="grid grid-cols-1 gap-6 p-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
    {children}
  </div>
);
