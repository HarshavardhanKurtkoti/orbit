"use client";

import React from "react";

interface ProgressRingProps {
  progress: number; // 0 to 100
  size?: number;
  strokeWidth?: number;
  color?: "violet" | "cyan" | "emerald" | "mint" | "gradient";
  showValue?: boolean;
}

export const ProgressRing: React.FC<ProgressRingProps> = ({
  progress,
  size = 36,
  strokeWidth = 3,
  color = "mint",
  showValue = false,
}) => {
  const normalized = Math.min(Math.max(progress, 0), 100);
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const strokeDashoffset = circumference - (normalized / 100) * circumference;

  const strokeColor = {
    mint: "#a7f3d0",
    emerald: "#34d399",
    cyan: "#38bdf8",
    violet: "#38bdf8",
    gradient: "#a7f3d0",
  }[color];

  return (
    <div className="relative inline-flex items-center justify-center" style={{ width: size, height: size }}>
      <svg className="w-full h-full -rotate-90 transform" viewBox={`0 0 ${size} ${size}`}>
        {/* Background Track */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          className="stroke-[#16221f]"
          strokeWidth={strokeWidth}
          fill="transparent"
        />

        {/* Progress Arc */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={strokeColor}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          fill="transparent"
          className="transition-all duration-500 ease-out"
        />
      </svg>

      {showValue && (
        <span className="absolute text-[10px] font-mono font-medium text-[#d6dedc] tabular-nums">
          {Math.round(normalized)}%
        </span>
      )}
    </div>
  );
};
