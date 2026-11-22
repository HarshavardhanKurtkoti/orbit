"use client";

import React, { forwardRef } from "react";
import { motion } from "framer-motion";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export interface GlassButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "subtle" | "danger";
  size?: "sm" | "md" | "lg";
  icon?: React.ReactNode;
}

export const GlassButton = forwardRef<HTMLButtonElement, GlassButtonProps>(
  ({ className, variant = "primary", size = "md", icon, children, disabled, ...props }, ref) => {
    const sizeClasses = {
      sm: "px-3 py-1.5 text-xs rounded-xl gap-1.5 min-h-[32px]",
      md: "px-4 py-2 text-xs font-medium rounded-xl gap-2 min-h-[38px]",
      lg: "px-5 py-2.5 text-sm font-semibold rounded-2xl gap-2.5 min-h-[44px]",
    }[size];

    const variantClasses = {
      primary:
        "bg-gradient-to-r from-[#9366FF] to-[#38BDF8] text-white shadow-lg shadow-purple-500/20 hover:shadow-glow-violet border border-white/20 hover:brightness-110",
      secondary:
        "glass-standard text-white hover:text-white hover:border-[#9366FF]/50 hover:bg-[#171B32]/90",
      subtle:
        "glass-subtle text-slate-300 hover:text-white hover:bg-white/10 hover:border-white/20",
      danger:
        "bg-rose-500/15 border border-rose-500/30 text-rose-300 hover:bg-rose-500/25 hover:border-rose-500/60",
    }[variant];

    return (
      <motion.button
        ref={ref}
        disabled={disabled}
        whileHover={!disabled ? { scale: 1.025 } : undefined}
        whileTap={
          !disabled
            ? {
                scaleX: 1.04,
                scaleY: 0.94,
                transition: { duration: 0.09, ease: [0.16, 1, 0.3, 1] },
              }
            : undefined
        }
        className={twMerge(
          clsx(
            "inline-flex items-center justify-center font-sans transition-all duration-150 select-none disabled:opacity-50 disabled:pointer-events-none active:outline-none focus-visible:ring-2 focus-visible:ring-[#9366FF]",
            sizeClasses,
            variantClasses,
            className
          )
        )}
        {...(props as any)}
      >
        {icon && <span className="flex-shrink-0">{icon}</span>}
        {children}
      </motion.button>
    );
  }
);

GlassButton.displayName = "GlassButton";
