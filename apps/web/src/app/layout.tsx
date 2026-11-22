import type { Metadata } from "next";
import "@/styles/globals.css";

export const metadata: Metadata = {
  title: "ORBIT — Spatial Productivity Operating System",
  description: "AI-powered spatial productivity operating system.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="antialiased bg-[#08090D] text-[#F8FAFC]">
        {children}
      </body>
    </html>
  );
}
