import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "@/lib/providers";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter"
});

export const metadata: Metadata = {
  title: "Tarot Reading",
  description: "Interactive tarot readings with AI-powered interpretations",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} font-sans antialiased bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 min-h-screen`}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
