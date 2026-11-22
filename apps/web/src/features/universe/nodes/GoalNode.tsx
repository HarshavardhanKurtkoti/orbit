"use client";

import React, { memo } from "react";
import { Handle, Position, NodeProps } from "@xyflow/react";
import { Target, Flag } from "lucide-react";
import { motion } from "framer-motion";
import { useWorkspaceStore } from "@/stores/workspace-store";

export const GoalNode = memo(({ id, data, selected }: NodeProps) => {
  const setSelectedEntity = useWorkspaceStore((s) => s.setSelectedEntity);

  return (
    <motion.div
      whileHover={{ scale: 1.04 }}
      onClick={() =>
        setSelectedEntity({
          type: "goal",
          id: (data as any).entityId || id,
          data,
        })
      }
      className={`px-4 py-3 rounded-2xl bg-[#11131A]/95 border backdrop-blur-xl shadow-2xl w-72 cursor-pointer transition-all ${
        selected ? "border-emerald-400 ring-2 ring-emerald-400/30 glow-cyan" : "border-emerald-500/30 hover:border-emerald-400/60"
      }`}
    >
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-emerald-500/20 text-emerald-400">
            <Target className="h-4 w-4" />
          </div>
          <span className="text-[10px] font-mono text-emerald-400 uppercase tracking-wider">STRATEGIC GOAL</span>
        </div>
        <span className="text-[10px] font-mono text-slate-400">{(data as any).progress || 0}%</span>
      </div>

      <div className="text-xs font-bold text-white leading-snug">{(data as any).title || "Goal"}</div>

      <Handle type="source" position={Position.Bottom} className="!bg-emerald-400 !w-2.5 !h-2.5" />
    </motion.div>
  );
});

GoalNode.displayName = "GoalNode";
