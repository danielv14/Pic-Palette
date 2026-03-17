import type { ReactNode } from "react";
import { Link } from "@tanstack/react-router";
import { pillClasses } from "~/components/PillButton";

interface PillLinkProps {
  to: string;
  search?: Record<string, unknown>;
  children: ReactNode;
}

export const PillLink = ({ to, search, children }: PillLinkProps) => (
  <div className="mt-6 mb-6 flex justify-center">
    <Link to={to} search={search} className={pillClasses}>
      {children}
    </Link>
  </div>
);
