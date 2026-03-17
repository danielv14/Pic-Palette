export const CardOverlay = () => (
  <>
    <div className="pointer-events-none absolute inset-x-0 bottom-0 h-28 backdrop-blur-md [mask-image:linear-gradient(to_bottom,transparent_0%,rgba(0,0,0,0.1)_30%,rgba(0,0,0,0.4)_55%,black_80%)]" />
    <div className="pointer-events-none absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-black/50 to-transparent" />
  </>
);
