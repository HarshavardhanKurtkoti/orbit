"use client";

import React, { memo } from "react";
import { Handle, Position, NodeProps } from "@xyflow/react";
import { CheckSquare, CheckCircle2, Circle } from "lucide-react";
import { motion } from "framer-motion";
import { useWorkspaceStore } from "@/stores/workspace-store";
import { squashStretchVariant } from "@/motion";

export const TaskNode = memo(({ id, data, selected }: NodeProps) => {
  const setSelectedEntity = useWorkspaceStore((s) => s.setSelectedEntity);
  const isDone = (data as any).status === "done";

  return (
    <motion.div
      whileHover={{ scale: 1.03 }}
      whileTap="press"
      variants={squashStretchVariant}
      onClick={() =>
        setSelectedEntity({
          type: "task",
          id: (data as any).entityId || id,
          data,
        })
      }
      className={`px-3 py-2.5 rounded-xl bg-[#11131A]/95 border backdrop-blur-xl shadow-lg w-56 cursor-pointer transition-all ${
        selected ? "border-[#38BDF8] ring-2 ring-[#38BDF8]/30" : "border-white/10 hover:border-white/20"
      }`}
    >
      <Handle type="target" position={Position.Top} className="!bg-[#38BDF8] !w-2 !h-2" />

      <div className="flex items-center gap-2">
        <div className={`p-1 rounded-md ${isDone ? "text-emerald-400" : "text-slate-400"}`}>
          {isDone ? <CheckCircle2 className="h-3.5 w-3.5" /> : <Circle className="h-3.5 w-3.5" />}
        </div>
        <div className="flex-1 min-w-0">
          <div className={`text-xs truncate ${isDone ? "line-through text-slate-500" : "text-slate-200 font-medium"}`}>
            {(data as any).title || "Task"}
          </div>
          <div className="flex items-center gap-2 mt-0.5">
            <span
              className={`text-[9px] font-mono uppercase ${
                (data as any).priority === "urgent"
                  ? "text-rose-400"
                  : (data as any).priority === "high"
                  ? "text-amber-400"
                  : "text-slate-500"
              }`}
            >
              {(data as any).priority || "medium"}
            </span>
          </div>
        </div>
      </div>

      <Handle type="source" position={Position.Bottom} className="!bg-[#38BDF8] !w-2 !h-2" />
    </motion.div>
  );
});

TaskNode.displayName = "TaskNode";
