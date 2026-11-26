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
    <div className="relative w-full h-full overflow-hidden bg-[#080d10] text-[#f1f5f4]">
      {/* 1. Deep Subtle Slate Canvas Depth (harshakurtkoti.in reference) */}
      <div className="absolute inset-0 pointer-events-none z-0">
        {/* Subtle center-top radial light source */}
        <div
          className="absolute -top-[15%] left-1/2 -translate-x-1/2 w-[60vw] h-[40vh] rounded-full opacity-15 blur-[120px] pointer-events-none"
          style={{
            background: "radial-gradient(circle, rgba(167, 243, 208, 0.18) 0%, rgba(52, 211, 153, 0.05) 50%, transparent 80%)",
          }}
        />

        {/* Subtle corner depth */}
        <div
          className="absolute bottom-0 right-0 w-[40vw] h-[35vh] rounded-full opacity-10 blur-[130px] pointer-events-none"
          style={{
            background: "radial-gradient(circle, rgba(56, 189, 248, 0.12) 0%, transparent 70%)",
          }}
        />

        {/* Vignette depth overlay */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: "radial-gradient(circle at 50% 50%, transparent 60%, rgba(8, 13, 16, 0.8) 100%)",
          }}
        />
      </div>

      {/* 2. Delicate Architectural Coordinate Guides (Systems in Motion reference) */}
      {showOrbits && (
        <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden flex items-center justify-center opacity-15">
          <div
            className={`w-[850px] h-[850px] rounded-full border border-[#202e2b] ${
              prefersReducedMotion ? "" : "animate-[spin_240s_linear_infinite]"
            }`}
            style={{ borderStyle: "dashed" }}
          />
          <div className="absolute w-[580px] h-[580px] rounded-full border border-[#16221f]" />
          <div className="absolute w-[320px] h-[320px] rounded-full border border-[#202e2b]/60" />
        </div>
      )}

      {/* 3. High-precision Subtle Coordinate Grid */}
      <div className="absolute inset-0 spatial-canvas-grid pointer-events-none z-0 opacity-45" />

      {/* Content Mount */}
      <div className="relative z-10 w-full h-full flex flex-col">{children}</div>
    </div>
  );
});

AmbientBackground.displayName = "AmbientBackground";
