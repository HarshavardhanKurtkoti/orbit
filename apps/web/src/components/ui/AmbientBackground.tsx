"use client";

import React, { memo } from "react";
import { useReducedMotion } from "@/motion/accessibility";

interface AmbientBackgroundProps {
  children?: React.ReactNode;
  showOrbits?: boolean;
}

export const AmbientBackground = memo(({ children, showOrbits = true }: AmbientBackgroundProps) => {
  const prefersReducedMotion = useReducedMotion();

  return (
    <div className="relative w-full h-full overflow-hidden bg-[#070914] text-[#F8FAFC]">
      {/* 1. Deep Atmospheric Gradient Layers */}
      <div className="absolute inset-0 pointer-events-none z-0">
        {/* Top-center soft violet aurora */}
        <div
          className="absolute -top-[20%] left-1/2 -translate-x-1/2 w-[70vw] h-[55vh] rounded-full opacity-40 blur-[130px] pointer-events-none"
          style={{
            background: "radial-gradient(circle, rgba(147, 102, 255, 0.28) 0%, rgba(124, 58, 237, 0.08) 50%, transparent 80%)",
          }}
        />

        {/* Top-right electric blue / cyan glow */}
        <div
          className="absolute top-[5%] -right-[10%] w-[45vw] h-[50vh] rounded-full opacity-30 blur-[120px] pointer-events-none"
          style={{
            background: "radial-gradient(circle, rgba(56, 189, 248, 0.22) 0%, rgba(34, 211, 238, 0.06) 60%, transparent 80%)",
          }}
        />

        {/* Bottom-left subtle cyan anchor */}
        <div
          className="absolute -bottom-[15%] -left-[10%] w-[50vw] h-[50vh] rounded-full opacity-25 blur-[140px] pointer-events-none"
          style={{
            background: "radial-gradient(circle, rgba(34, 211, 238, 0.18) 0%, rgba(147, 102, 255, 0.06) 55%, transparent 75%)",
          }}
        />

        {/* Vignette depth overlay */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: "radial-gradient(circle at 50% 50%, transparent 40%, rgba(7, 9, 20, 0.65) 100%)",
          }}
        />
      </div>

      {/* 2. Delicate Orbital Ring Guides */}
      {showOrbits && (
        <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden flex items-center justify-center opacity-30">
          <div
            className={`w-[900px] h-[900px] rounded-full border border-white/[0.035] ${
              prefersReducedMotion ? "" : "animate-[spin_160s_linear_infinite]"
            }`}
            style={{ borderStyle: "dashed" }}
          />
          <div className="absolute w-[640px] h-[640px] rounded-full border border-purple-500/[0.04]" />
          <div className="absolute w-[380px] h-[380px] rounded-full border border-cyan-400/[0.04]" />
        </div>
      )}

      {/* 3. High-precision Subtle Coordinate Grid */}
      <div className="absolute inset-0 spatial-canvas-grid pointer-events-none z-0 opacity-60" />

      {/* Content Mount */}
      <div className="relative z-10 w-full h-full flex flex-col">{children}</div>
    </div>
  );
});

AmbientBackground.displayName = "AmbientBackground";
