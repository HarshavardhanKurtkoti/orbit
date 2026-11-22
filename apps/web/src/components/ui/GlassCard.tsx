"use client";

import React, { forwardRef } from "react";
import { motion } from "framer-motion";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { GlassElevation } from "./GlassPanel";

export interface GlassCardProps extends React.HTMLAttributes<HTMLDivElement> {
  elevation?: GlassElevation;
  tilt?: boolean;
  glowOnHover?: boolean;
}

export const GlassCard = forwardRef<HTMLDivElement, GlassCardProps>(
  ({ className, elevation = "standard", tilt = true, glowOnHover = true, children, ...props }, ref) => {
    const elevationClass = {
      subtle: "glass-subtle",
      standard: "glass-standard",
      elevated: "glass-elevated",
    }[elevation];

    return (
      <motion.div
        ref={ref}
        whileHover={
          tilt
            ? {
                scale: 1.018,
                y: -3,
                transition: { duration: 0.15, ease: [0.16, 1, 0.3, 1] },
              }
            : undefined
        }
        whileTap={{
          scale: 0.985,
          transition: { duration: 0.09, ease: [0.16, 1, 0.3, 1] },
        }}
        className={twMerge(
          clsx(
            "relative rounded-2xl cursor-pointer select-none transition-colors group",
            elevationClass,
            glowOnHover && "hover:border-[#9366FF]/40 hover:shadow-glow-violet",
            className
          )
        )}
        {...(props as any)}
      >
        {/* Subtle luminous top highlight line */}
        <div className="absolute inset-x-4 top-0 h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent pointer-events-none opacity-60 group-hover:opacity-100 transition-opacity" />
        {children}
      </motion.div>
    );
  }
);

GlassCard.displayName = "GlassCard";
