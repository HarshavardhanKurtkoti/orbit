"use client";

import React, { forwardRef } from "react";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export type GlassElevation = "subtle" | "standard" | "elevated";

export interface GlassPanelProps extends React.HTMLAttributes<HTMLDivElement> {
  elevation?: GlassElevation;
  glow?: "none" | "violet" | "cyan" | "emerald" | "aurora";
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
      violet: "glow-violet",
      cyan: "glow-cyan",
      emerald: "glow-emerald",
      aurora: "glow-aurora",
    }[glow];

    return (
      <div
        ref={ref}
        className={twMerge(
          clsx(
            "relative rounded-2xl transition-all duration-200",
            elevationClass,
            glowClass,
            hoverable && "hover:border-white/20 hover:shadow-glass-lg hover:-translate-y-0.5",
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
