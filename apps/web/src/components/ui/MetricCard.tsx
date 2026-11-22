"use client";

import React from "react";
import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { GlassCard } from "./GlassCard";

interface MetricCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: React.ReactNode;
  accentColor?: "violet" | "cyan" | "emerald" | "amber";
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
  accentColor = "violet",
  trend,
  onClick,
}) => {
  const accentClasses = {
    violet: "text-[#9366FF] bg-[#9366FF]/15 border-[#9366FF]/30",
    cyan: "text-[#38BDF8] bg-[#38BDF8]/15 border-[#38BDF8]/30",
    emerald: "text-[#34D399] bg-[#34D399]/15 border-[#34D399]/30",
    amber: "text-[#FBBF24] bg-[#FBBF24]/15 border-[#FBBF24]/30",
  }[accentColor];

  return (
    <GlassCard
      elevation="standard"
      onClick={onClick}
      className="p-5 flex flex-col justify-between min-h-[135px]"
    >
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium text-slate-400 tracking-wide">{title}</span>
        <div className={`p-2 rounded-xl border backdrop-blur-md ${accentClasses}`}>
          {icon}
        </div>
      </div>

      <div className="mt-3">
        <div className="text-3xl font-bold tracking-tight text-white font-sans">{value}</div>
        <div className="flex items-center justify-between mt-1.5">
          {subtitle && (
            <span className="text-[11px] text-slate-500 font-mono tracking-tight">{subtitle}</span>
          )}
          {trend && (
            <span
              className={`text-[10px] font-mono px-1.5 py-0.5 rounded-full flex items-center gap-0.5 ${
                trend.positive
                  ? "text-emerald-400 bg-emerald-500/10 border border-emerald-500/20"
                  : "text-slate-400 bg-white/5"
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
