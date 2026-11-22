import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "@/styles/globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "ORBIT — Spatial Productivity Operating System",
  description: "AI-powered spatial productivity operating system with Apple visionOS liquid glass aesthetics and connected intelligence.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`dark ${geistSans.variable} ${geistMono.variable}`}>
      <body className="antialiased bg-[#070914] text-[#F8FAFC] selection:bg-[#9366FF]/30 selection:text-white font-sans">
        {children}
      </body>
    </html>
  );
}
