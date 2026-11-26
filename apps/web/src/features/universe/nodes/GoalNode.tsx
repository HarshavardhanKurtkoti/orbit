"use client";

import React, { memo } from "react";
import { Handle, Position, NodeProps } from "@xyflow/react";
import { Target, Sparkles } from "lucide-react";
import { motion } from "framer-motion";
import { useWorkspaceStore } from "@/stores/workspace-store";
import { ProgressRing } from "@/components/ui/ProgressRing";

export const GoalNode = memo(({ id, data, selected }: NodeProps) => {
  const setSelectedEntity = useWorkspaceStore((s) => s.setSelectedEntity);
  const goalData = data as any;
  const progress = goalData.progress || 84;

  return (
    <motion.div
      whileHover={{ y: -2 }}
      whileTap={{ scale: 0.99 }}
      transition={{ duration: 0.12, ease: [0.16, 1, 0.3, 1] }}
      onClick={() =>
        setSelectedEntity({
          type: "goal",
          id: goalData.entityId || id,
          data: goalData,
        })
      }
      className={`px-4 py-3 rounded-xl glass-elevated w-72 cursor-pointer select-none transition-all duration-150 relative group bg-[#15221e] ${
        selected
          ? "border-[#34d399] ring-1 ring-[#34d399]/50"
          : "border-[#202e2b] hover:border-[#34d399]/40"
      }`}
    >
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <div className="p-1 rounded-md bg-[#101918] text-[#34d399] border border-[#202e2b]">
            <Target className="h-3.5 w-3.5" />
          </div>
          <div>
            <span className="text-[10px] font-mono text-[#34d399] uppercase tracking-widest font-medium block">
              Strategic Goal
            </span>
          </div>
        </div>

        <ProgressRing progress={progress} size={26} strokeWidth={2.5} color="emerald" showValue />
      </div>

      <div className="text-xs font-semibold text-[#f1f5f4] leading-snug group-hover:text-[#34d399] transition-colors">
        {goalData.title || "Strategic Objective"}
      </div>

      <div className="mt-2 pt-1.5 border-t border-[#16221f] flex items-center justify-between text-[10px] font-mono text-[#6e807d]">
        <span className="flex items-center gap-1 text-[#34d399]">
          <Sparkles className="h-3 w-3" /> Core Goal
        </span>
        <span className="capitalize">{goalData.priority || "Urgent"}</span>
      </div>

      <Handle
        type="source"
        position={Position.Bottom}
        className="!w-2 !h-2 !bg-[#34d399] !border !border-[#080d10]"
      />
    </motion.div>
  );
});

GoalNode.displayName = "GoalNode";
