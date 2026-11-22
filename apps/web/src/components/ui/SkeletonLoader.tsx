"use client";

import React from "react";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  shimmer?: boolean;
}

export const SkeletonLoader: React.FC<SkeletonProps> = ({ className, shimmer = true, ...props }) => {
  return (
    <div
      className={twMerge(
        clsx(
          "relative overflow-hidden rounded-xl bg-white/[0.04] border border-white/[0.05]",
          shimmer &&
            "before:absolute before:inset-0 before:-translate-x-full before:animate-[shimmer_2s_infinite] before:bg-gradient-to-r before:from-transparent before:via-white/[0.07] before:to-transparent",
          className
        )
      )}
      {...props}
    />
  );
};
