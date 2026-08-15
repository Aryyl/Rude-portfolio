import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import FishLoader from "@/components/FishLoader";
import FishCursor from "@/components/FishCursor";
import Navigation from "@/components/Navigation";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Rudrangshu Sonowal — Cinematic Video Editor",
  description: "Creative professional specializing in cinematic video editing, color grading, and visual storytelling.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <FishLoader />
        <FishCursor />
        <Navigation />
        {children}
      </body>
    </html>
  );
}
