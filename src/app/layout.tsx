import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Interactive Calendar Component",
  description: "A beautifully crafted, interactive wall calendar component.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-[#f8fafc] font-sans text-slate-950">
        {children}
      </body>
    </html>
  );
}
