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
  ({ className, elevation = "standard", tilt = false, glowOnHover = false, children, ...props }, ref) => {
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
                y: -2,
                transition: { duration: 0.15, ease: [0.16, 1, 0.3, 1] },
              }
            : undefined
        }
        whileTap={{
          scale: 0.99,
          transition: { duration: 0.08, ease: [0.16, 1, 0.3, 1] },
        }}
        className={twMerge(
          clsx(
            "relative rounded-xl cursor-pointer select-none transition-all duration-150 group border border-[#202e2b]",
            elevationClass,
            "hover:border-[#334641]",
            glowOnHover && "hover:border-[#a7f3d0]/35 hover:shadow-mint-subtle",
            className
          )
        )}
        {...(props as any)}
      >
        {/* Subtle architectural top specular rule */}
        <div className="absolute inset-x-3 top-0 h-[1px] bg-gradient-to-r from-transparent via-white/[0.08] to-transparent pointer-events-none opacity-50 group-hover:opacity-100 transition-opacity" />
        {children}
      </motion.div>
    );
  }
);

GlassCard.displayName = "GlassCard";
