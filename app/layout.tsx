import "./globals.css";
import { Searchbar } from "./Searchbar";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head />
      <body className="bg-slate-800 text-gray-100 container mx-auto p-2">
        <div className="py-4 my-4">
          <Searchbar />
        </div>
        {children}
      </body>
    </html>
  );
}
