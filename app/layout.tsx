import "./globals.css";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head />
      <body className="bg-slate-800 text-gray-100 container mx-auto p-2">
        {children}
      </body>
    </html>
  );
}
