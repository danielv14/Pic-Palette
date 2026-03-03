import type { ReactNode } from "react";

export const ImageGrid = ({ children }: { children: ReactNode }) => (
  <div className="grid grid-cols-1 gap-4 p-2 sm:grid-cols-2 lg:grid-cols-3 lg:gap-5 xl:grid-cols-4 xl:gap-6">
    {children}
  </div>
);
