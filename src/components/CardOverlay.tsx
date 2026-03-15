export const CardOverlay = () => (
  <>
    <div className="pointer-events-none absolute inset-x-0 bottom-0 h-24 backdrop-blur-sm [mask-image:linear-gradient(to_bottom,transparent,black_60%)]" />
    <div className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/35 to-transparent" />
  </>
);
