"use client";

import React, { memo } from "react";
import { Handle, Position, NodeProps } from "@xyflow/react";
import { Target, Sparkles, CheckCircle2 } from "lucide-react";
import { motion } from "framer-motion";
import { useWorkspaceStore } from "@/stores/workspace-store";
import { ProgressRing } from "@/components/ui/ProgressRing";

export const GoalNode = memo(({ id, data, selected }: NodeProps) => {
  const setSelectedEntity = useWorkspaceStore((s) => s.setSelectedEntity);
  const goalData = data as any;
  const progress = goalData.progress || 84;

  return (
    <motion.div
      whileHover={{ scale: 1.03, y: -2 }}
      whileTap={{ scale: 0.98 }}
      transition={{ duration: 0.15, ease: [0.16, 1, 0.3, 1] }}
      onClick={() =>
        setSelectedEntity({
          type: "goal",
          id: goalData.entityId || id,
          data: goalData,
        })
      }
      className={`px-5 py-4 rounded-3xl glass-elevated w-80 cursor-pointer select-none transition-all duration-200 relative group ${
        selected
          ? "border-emerald-400 ring-2 ring-emerald-400/40 shadow-glow-emerald"
          : "border-white/[0.14] hover:border-emerald-400/50 hover:shadow-glow-emerald/30"
      }`}
    >
      {/* Top ambient highlight line */}
      <div className="absolute inset-x-6 top-0 h-[1.5px] bg-gradient-to-r from-transparent via-emerald-400/40 to-transparent pointer-events-none" />

      <div className="flex items-center justify-between mb-2.5">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 shadow-sm">
            <Target className="h-4 w-4" />
          </div>
          <div>
            <span className="text-[10px] font-mono text-emerald-400 uppercase tracking-widest font-semibold block">
              STRATEGIC GOAL
            </span>
            <span className="text-[9px] text-slate-500 font-mono">Top-level Anchor</span>
          </div>
        </div>

        <ProgressRing progress={progress} size={34} strokeWidth={3} color="emerald" showValue />
      </div>

      <div className="text-sm font-bold text-white leading-snug group-hover:text-emerald-200 transition-colors">
        {goalData.title || "Strategic Mission"}
      </div>

      <div className="mt-3 pt-2.5 border-t border-white/[0.08] flex items-center justify-between text-[10px] font-mono text-slate-400">
        <span className="flex items-center gap-1 text-emerald-400">
          <Sparkles className="h-3 w-3" /> Core Objective
        </span>
        <span className="capitalize">{goalData.priority || "Urgent"}</span>
      </div>

      {/* React Flow Connection Handles with luminous glow */}
      <Handle
        type="source"
        position={Position.Bottom}
        className="!w-3 !h-3 !bg-emerald-400 !border-2 !border-[#070914] shadow-[0_0_10px_#34D399]"
      />
    </motion.div>
  );
});

GoalNode.displayName = "GoalNode";
