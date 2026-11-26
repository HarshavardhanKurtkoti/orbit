"use client";

import React from "react";
import { Compass, Sparkles, Plus } from "lucide-react";
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
      className="p-8 md:p-10 text-center flex flex-col items-center justify-center max-w-md mx-auto border-[#202e2b] rounded-xl"
    >
      <div className="mb-4">
        <div className="w-12 h-12 rounded-xl bg-[#15221e] border border-[#202e2b] flex items-center justify-center text-[#a7f3d0]">
          {icon || <Compass className="h-6 w-6" />}
        </div>
      </div>

      <h3 className="text-sm font-semibold text-[#f1f5f4] tracking-tight">{title}</h3>
      <p className="text-xs text-[#9aaba8] mt-1.5 max-w-sm leading-relaxed">{description}</p>

      {(actionLabel || secondaryActionLabel) && (
        <div className="flex items-center gap-2.5 mt-5 flex-wrap justify-center">
          {actionLabel && onAction && (
            <GlassButton variant="primary" size="sm" onClick={onAction} icon={<Plus className="h-3.5 w-3.5" />}>
              {actionLabel}
            </GlassButton>
          )}
          {secondaryActionLabel && onSecondaryAction && (
            <GlassButton variant="subtle" size="sm" onClick={onSecondaryAction}>
              {secondaryActionLabel}
            </GlassButton>
          )}
        </div>
      )}
    </GlassPanel>
  );
};
