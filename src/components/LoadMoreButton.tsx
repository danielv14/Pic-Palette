interface LoadMoreButtonProps {
  onClick: () => void;
}

export const LoadMoreButton = ({ onClick }: LoadMoreButtonProps) => (
  <div className="mt-6 mb-6 flex justify-center">
    <button
      onClick={onClick}
      className="cursor-pointer rounded-full border border-brand-500/40 bg-brand-500/10 px-8 py-3 font-body text-sm font-medium text-brand-300 backdrop-blur-sm transition-all duration-200 hover:bg-brand-500/20"
    >
      Load more
    </button>
  </div>
);
