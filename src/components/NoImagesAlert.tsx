import type { ReactNode } from "react";

export const NoImagesAlert = ({ children }: { children: ReactNode }) => (
  <div className="flex items-center justify-center gap-2 py-12 text-text-secondary">
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth="2"
      stroke="currentColor"
      className="w-8"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z"
      />
    </svg>
    <p className="text-center text-md font-bold md:text-2xl">{children}</p>
  </div>
);
