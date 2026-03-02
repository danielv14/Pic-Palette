interface LoadMoreButtonProps {
  onClick: () => void;
}

export const LoadMoreButton = ({ onClick }: LoadMoreButtonProps) => (
  <div className="mt-6 mb-6 flex justify-center">
    <button
      onClick={onClick}
      className="rounded-full bg-brand-500 px-6 py-2 font-body text-sm font-medium text-white transition-colors hover:bg-brand-600"
    >
      Load more
    </button>
  </div>
);
