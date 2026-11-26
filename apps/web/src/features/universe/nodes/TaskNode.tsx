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
      whileHover={{ y: -2 }}
      whileTap="press"
      variants={squashStretchVariant}
      onClick={() =>
        setSelectedEntity({
          type: "task",
          id: taskData.entityId || id,
          data: taskData,
        })
      }
      className={`px-3 py-2.5 rounded-xl glass-standard w-56 cursor-pointer select-none transition-all duration-150 relative group bg-[#101918] ${
        selected
          ? "border-[#38bdf8] ring-1 ring-[#38bdf8]/50"
          : "border-[#202e2b] hover:border-[#38bdf8]/40"
      }`}
    >
      <Handle
        type="target"
        position={Position.Top}
        className="!w-2 !h-2 !bg-[#38bdf8] !border !border-[#080d10]"
      />

      <div className="flex items-center gap-2">
        <div className={`p-0.5 rounded ${isDone ? "text-[#34d399]" : "text-[#6e807d]"}`}>
          {isDone ? <CheckCircle2 className="h-3.5 w-3.5" /> : <Circle className="h-3.5 w-3.5" />}
        </div>
        <div className="flex-1 min-w-0">
          <div
            className={`text-xs truncate font-medium ${
              isDone ? "line-through text-[#6e807d]" : "text-[#f1f5f4] group-hover:text-[#38bdf8]"
            }`}
          >
            {taskData.title || "Task"}
          </div>
          <div className="flex items-center justify-between mt-1 text-[9px] font-mono">
            <span
              className={`uppercase px-1.5 py-0.2 rounded ${
                taskData.priority === "urgent"
                  ? "text-[#f87171] bg-[#f87171]/10 border border-[#f87171]/20"
                  : taskData.priority === "high"
                  ? "text-[#fbbf24] bg-[#fbbf24]/10 border border-[#fbbf24]/20"
                  : "text-[#6e807d] bg-[#15221e]"
              }`}
            >
              {taskData.priority || "medium"}
            </span>
            <span className="text-[#6e807d] uppercase">
              {taskData.status || "todo"}
            </span>
          </div>
        </div>
      </div>

      <Handle
        type="source"
        position={Position.Bottom}
        className="!w-2 !h-2 !bg-[#38bdf8] !border !border-[#080d10]"
      />
    </motion.div>
  );
});

TaskNode.displayName = "TaskNode";
