"use client";

import React, { memo } from "react";
import { Handle, Position, NodeProps } from "@xyflow/react";
import { CheckCircle2, Circle } from "lucide-react";
import { motion } from "framer-motion";
import { useWorkspaceStore } from "@/stores/workspace-store";
import { squashStretchVariant } from "@/motion";

export const TaskNode = memo(({ id, data, selected }: NodeProps) => {
  const setSelectedEntity = useWorkspaceStore((s) => s.setSelectedEntity);
  const taskData = data as any;
  const isDone = taskData.status === "done";

  return (
    <motion.div
      whileHover={{ scale: 1.03, y: -2 }}
      whileTap="press"
      variants={squashStretchVariant}
      onClick={() =>
        setSelectedEntity({
          type: "task",
          id: taskData.entityId || id,
          data: taskData,
        })
      }
      className={`px-3.5 py-3 rounded-2xl glass-standard w-60 cursor-pointer select-none transition-all duration-200 relative group ${
        selected
          ? "border-[#38BDF8] ring-2 ring-[#38BDF8]/40 shadow-glow-cyan"
          : "border-white/[0.10] hover:border-[#38BDF8]/40 hover:shadow-glow-cyan/20"
      }`}
    >
      <Handle
        type="target"
        position={Position.Top}
        className="!w-2.5 !h-2.5 !bg-[#38BDF8] !border-2 !border-[#070914] shadow-[0_0_8px_#38BDF8]"
      />

      <div className="flex items-center gap-2.5">
        <div className={`p-1 rounded-lg ${isDone ? "text-emerald-400 bg-emerald-500/15" : "text-slate-400 bg-white/5"}`}>
          {isDone ? <CheckCircle2 className="h-4 w-4" /> : <Circle className="h-4 w-4" />}
        </div>
        <div className="flex-1 min-w-0">
          <div
            className={`text-xs truncate font-medium ${
              isDone ? "line-through text-slate-500" : "text-slate-200 group-hover:text-white"
            }`}
          >
            {taskData.title || "Task"}
          </div>
          <div className="flex items-center justify-between mt-1">
            <span
              className={`text-[9px] font-mono uppercase px-1.5 py-0.2 rounded ${
                taskData.priority === "urgent"
                  ? "text-rose-400 bg-rose-500/10"
                  : taskData.priority === "high"
                  ? "text-purple-400 bg-purple-500/10"
                  : "text-slate-500"
              }`}
            >
              {taskData.priority || "medium"}
            </span>
            <span className="text-[9px] font-mono text-slate-500 uppercase">
              {taskData.status || "todo"}
            </span>
          </div>
        </div>
      </div>

      <Handle
        type="source"
        position={Position.Bottom}
        className="!w-2.5 !h-2.5 !bg-[#38BDF8] !border-2 !border-[#070914] shadow-[0_0_8px_#38BDF8]"
      />
    </motion.div>
  );
});

TaskNode.displayName = "TaskNode";
