import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";
import Navbar from "../components/Navbar";
import "@fontsource/inter/300.css";
import "@fontsource/inter/400.css";
import "@fontsource/inter/500.css";
import "@fontsource/inter/600.css";
import "@fontsource/inter/700.css";

const geist = Geist({
  variable: "--font-geist",
  subsets: ["latin"],
});

const inter = {
  variable: "--font-inter",
};

export const metadata: Metadata = {
  title: "Björklöven - Hockeystatistik",
  description: "Matcher och spelarstatistik för Björklöven",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="sv" className={`${geist.variable} ${inter.variable}`}>
      <body
        className="min-h-screen bg-gray-50 font-[Inter]"
      >
        <Navbar />
        <main className="container mx-auto p-4 max-w-7xl">
          {children}
        </main>
      </body>
    </html>
  );
}
