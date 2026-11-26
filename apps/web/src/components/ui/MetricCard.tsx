"use client";

import React from "react";
import { ArrowUpRight } from "lucide-react";
import { GlassCard } from "./GlassCard";

interface MetricCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: React.ReactNode;
  accentColor?: "violet" | "cyan" | "emerald" | "amber" | "mint";
  trend?: {
    value: string;
    positive?: boolean;
  };
  onClick?: () => void;
}

export const MetricCard: React.FC<MetricCardProps> = ({
  title,
  value,
  subtitle,
  icon,
  accentColor = "mint",
  trend,
  onClick,
}) => {
  const accentClasses = {
    violet: "text-[#38bdf8] bg-[#38bdf8]/10 border-[#38bdf8]/20",
    cyan: "text-[#38bdf8] bg-[#38bdf8]/10 border-[#38bdf8]/20",
    emerald: "text-[#34d399] bg-[#34d399]/10 border-[#34d399]/20",
    amber: "text-[#fbbf24] bg-[#fbbf24]/10 border-[#fbbf24]/20",
    mint: "text-[#a7f3d0] bg-[#a7f3d0]/10 border-[#a7f3d0]/20",
  }[accentColor];

  return (
    <GlassCard
      elevation="standard"
      onClick={onClick}
      className="p-4 flex flex-col justify-between min-h-[120px] rounded-xl"
    >
      <div className="flex items-center justify-between">
        <span className="text-[10px] font-mono uppercase tracking-widest text-[#9aaba8] font-medium">
          {title}
        </span>
        <div className={`p-1.5 rounded-lg border backdrop-blur-md ${accentClasses}`}>
          {icon}
        </div>
      </div>

      <div className="mt-2.5">
        <div className="text-2xl font-semibold tracking-tight text-[#f1f5f4] font-sans tabular-nums">
          {value}
        </div>
        <div className="flex items-center justify-between mt-1">
          {subtitle && (
            <span className="text-[11px] text-[#6e807d] font-mono tracking-tight">{subtitle}</span>
          )}
          {trend && (
            <span
              className={`text-[10px] font-mono px-1.5 py-0.5 rounded flex items-center gap-0.5 ${
                trend.positive
                  ? "text-[#34d399] bg-[#34d399]/10 border border-[#34d399]/20"
                  : "text-[#9aaba8] bg-[#15221e] border border-[#202e2b]"
              }`}
            >
              {trend.value}
              {trend.positive && <ArrowUpRight className="h-2.5 w-2.5" />}
            </span>
          )}
        </div>
      </div>
    </GlassCard>
  );
};
