import { PillButton } from "~/components/PillButton";

interface LoadMoreButtonProps {
  onClick: () => void;
}

export const LoadMoreButton = ({ onClick }: LoadMoreButtonProps) => (
  <PillButton onClick={onClick}>Load more</PillButton>
);
