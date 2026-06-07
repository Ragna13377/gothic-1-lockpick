import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Gothic Lockpick",
  description: "Solver for the modulo-7 plate puzzle.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru">
      <body>{children}</body>
    </html>
  );
}
