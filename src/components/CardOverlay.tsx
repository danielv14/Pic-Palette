export const CardOverlay = () => (
  <>
    <div className="pointer-events-none absolute inset-x-0 bottom-0 h-32 backdrop-blur-md [mask-image:linear-gradient(to_bottom,transparent,black_40%)]" />
    <div className="pointer-events-none absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-black/50 to-transparent" />
  </>
);
