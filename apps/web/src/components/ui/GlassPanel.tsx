"use client";

import React, { forwardRef } from "react";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export type GlassElevation = "subtle" | "standard" | "elevated";

export interface GlassPanelProps extends React.HTMLAttributes<HTMLDivElement> {
  elevation?: GlassElevation;
  glow?: "none" | "violet" | "cyan" | "emerald" | "aurora" | "mint";
  hoverable?: boolean;
}

export const GlassPanel = forwardRef<HTMLDivElement, GlassPanelProps>(
  ({ className, elevation = "standard", glow = "none", hoverable = false, children, ...props }, ref) => {
    const elevationClass = {
      subtle: "glass-subtle",
      standard: "glass-standard",
      elevated: "glass-elevated",
    }[elevation];

    const glowClass = {
      none: "",
      violet: "",
      cyan: "",
      emerald: "shadow-mint-subtle border-[#34d399]/30",
      aurora: "border-[#a7f3d0]/25 shadow-mint-subtle",
      mint: "border-[#a7f3d0]/30 shadow-mint-subtle",
    }[glow];

    return (
      <div
        ref={ref}
        className={twMerge(
          clsx(
            "relative rounded-xl transition-all duration-200 border border-[#202e2b]",
            elevationClass,
            glowClass,
            hoverable && "hover:border-[#334641] hover:-translate-y-0.5",
            className
          )
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);

GlassPanel.displayName = "GlassPanel";
