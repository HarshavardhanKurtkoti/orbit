import React from "react";
import Link from "next/link";
import { Orbit, Compass } from "lucide-react";

export default function NotFound() {
  return (
    <div className="h-screen w-screen flex flex-col items-center justify-center p-6 bg-[#070914] text-[#F8FAFC] relative overflow-hidden select-none">
      {/* Background Aurora */}
      <div className="absolute w-[500px] h-[500px] rounded-full bg-[#9366FF]/15 blur-[140px] pointer-events-none" />

      <div className="relative z-10 flex flex-col items-center text-center max-w-md p-8 rounded-3xl glass-elevated border border-white/15 shadow-2xl">
        <div className="h-16 w-16 rounded-2xl bg-gradient-to-tr from-[#9366FF] to-[#38BDF8] flex items-center justify-center shadow-glow-violet mb-4">
          <Orbit className="h-8 w-8 text-white animate-spin" style={{ animationDuration: "20s" }} />
        </div>

        <h1 className="text-3xl font-bold tracking-tight text-white mb-2">404</h1>
        <h2 className="text-base font-semibold text-purple-200 mb-2">Spatial Coordinate Lost</h2>
        <p className="text-xs text-slate-400 mb-6 font-mono">
          The requested coordinate has drifted outside the current orbital topology frame.
        </p>

        <Link
          href="/"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#9366FF] to-[#38BDF8] text-white text-xs font-semibold shadow-lg shadow-purple-500/25 hover:shadow-glow-violet hover:brightness-110 transition-all"
        >
          <Compass className="h-4 w-4" />
          <span>Return to Orbit</span>
        </Link>
      </div>
    </div>
  );
}
