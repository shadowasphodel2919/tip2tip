import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Editor Cam Watch - Are you working, Cam?",
  description: "Are you working, Cam? Countdown to the next upload.",
  openGraph: {
    title: "Editor Cam Watch",
    description: "Are you working, Cam? Countdown to the next upload.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head />
      <body className="min-h-screen" suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}
