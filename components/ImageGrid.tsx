import React from "react";

export const ImageGrid = ({ children }: { children: React.ReactNode }) => (
  <div className="grid grid-cols-1 p-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
    {children}
  </div>
);
