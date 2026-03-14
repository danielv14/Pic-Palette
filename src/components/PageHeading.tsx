interface PageHeadingProps {
  children: React.ReactNode;
}

export const PageHeading = ({ children }: PageHeadingProps) => (
  <h2 className="bg-gradient-to-br from-brand-300 to-brand-600 bg-clip-text p-2 text-center text-2xl font-extrabold text-transparent font-display md:p-4 md:text-start md:text-3xl">
    {children}
  </h2>
);
