"use client";

import React from "react";
import { Orbit, Sparkles, Plus } from "lucide-react";
import { GlassPanel } from "./GlassPanel";
import { GlassButton } from "./GlassButton";

interface EmptyStateProps {
  title: string;
  description: string;
  icon?: React.ReactNode;
  actionLabel?: string;
  onAction?: () => void;
  secondaryActionLabel?: string;
  onSecondaryAction?: () => void;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title,
  description,
  icon,
  actionLabel,
  onAction,
  secondaryActionLabel,
  onSecondaryAction,
}) => {
  return (
    <GlassPanel
      elevation="standard"
      className="p-8 md:p-12 text-center flex flex-col items-center justify-center max-w-lg mx-auto border-white/10"
    >
      <div className="relative mb-5">
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-[#9366FF]/20 to-[#38BDF8]/20 border border-white/15 flex items-center justify-center shadow-glow-violet">
          {icon || <Orbit className="h-8 w-8 text-[#9366FF] animate-[spin_30s_linear_infinite]" />}
        </div>
        <div className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-[#38BDF8]/20 border border-[#38BDF8]/40 flex items-center justify-center text-[#38BDF8]">
          <Sparkles className="h-3 w-3" />
        </div>
      </div>

      <h3 className="text-base font-semibold text-white tracking-tight">{title}</h3>
      <p className="text-xs text-slate-400 mt-2 max-w-sm leading-relaxed">{description}</p>

      {(actionLabel || secondaryActionLabel) && (
        <div className="flex items-center gap-3 mt-6 flex-wrap justify-center">
          {actionLabel && onAction && (
            <GlassButton variant="primary" size="md" onClick={onAction} icon={<Plus className="h-3.5 w-3.5" />}>
              {actionLabel}
            </GlassButton>
          )}
          {secondaryActionLabel && onSecondaryAction && (
            <GlassButton variant="subtle" size="md" onClick={onSecondaryAction}>
              {secondaryActionLabel}
            </GlassButton>
          )}
        </div>
      )}
    </GlassPanel>
  );
};
