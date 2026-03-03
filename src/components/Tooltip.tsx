import { useState, useRef } from "react";
import { createPortal } from "react-dom";

interface TooltipProps {
  content: string;
  children: React.ReactNode;
}

export const Tooltip = ({ content, children }: TooltipProps) => {
  const [position, setPosition] = useState<{ x: number; y: number } | null>(null);
  const ref = useRef<HTMLDivElement>(null);

  const handleMouseEnter = () => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    setPosition({ x: rect.left + rect.width / 2, y: rect.top });
  };

  return (
    <div ref={ref} onMouseEnter={handleMouseEnter} onMouseLeave={() => setPosition(null)}>
      {children}
      {position &&
        typeof document !== "undefined" &&
        createPortal(
          <div
            style={{
              position: "fixed",
              left: position.x,
              top: position.y - 8,
              transform: "translate(-50%, -100%)",
            }}
            className="pointer-events-none z-50 rounded-lg bg-surface-3 px-2 py-1 text-xs whitespace-nowrap text-text-primary shadow-md"
          >
            {content}
          </div>,
          document.body
        )}
    </div>
  );
};
