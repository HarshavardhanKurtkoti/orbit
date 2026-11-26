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
      sm: "px-2.5 py-1 text-xs rounded-md gap-1.5 min-h-[30px]",
      md: "px-3.5 py-1.5 text-xs font-medium rounded-lg gap-2 min-h-[36px]",
      lg: "px-4.5 py-2 text-sm font-medium rounded-lg gap-2 min-h-[40px]",
    }[size];

    const variantClasses = {
      primary:
        "bg-[#a7f3d0] text-[#080d10] font-semibold border border-[#a7f3d0] hover:bg-[#86efac] hover:border-[#86efac] active:translate-y-[1px]",
      secondary:
        "bg-[#15221e] text-[#f1f5f4] border border-[#202e2b] hover:bg-[#1c2e29] hover:border-[#2f433f] active:translate-y-[1px]",
      subtle:
        "bg-transparent text-[#9aaba8] border border-transparent hover:text-[#f1f5f4] hover:bg-[#15221e]/60 hover:border-[#202e2b] active:translate-y-[1px]",
      danger:
        "bg-[#f87171]/10 border border-[#f87171]/25 text-[#f87171] hover:bg-[#f87171]/20 hover:border-[#f87171]/50 active:translate-y-[1px]",
    }[variant];

    return (
      <motion.button
        ref={ref}
        disabled={disabled}
        whileHover={!disabled ? { scale: 1.015 } : undefined}
        whileTap={
          !disabled
            ? {
                scaleX: 1.03,
                scaleY: 0.96,
                transition: { duration: 0.09, ease: [0.16, 1, 0.3, 1] },
              }
            : undefined
        }
        className={twMerge(
          clsx(
            "inline-flex items-center justify-center font-sans transition-all duration-150 select-none disabled:opacity-50 disabled:pointer-events-none active:outline-none focus-visible:ring-2 focus-visible:ring-[#a7f3d0] focus-visible:ring-offset-1 focus-visible:ring-offset-[#080d10]",
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
