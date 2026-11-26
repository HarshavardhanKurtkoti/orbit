"use client";

import React, { memo } from "react";
import { Handle, Position, NodeProps } from "@xyflow/react";
import { BookOpen } from "lucide-react";
import { motion } from "framer-motion";
import { useWorkspaceStore } from "@/stores/workspace-store";

export const NoteNode = memo(({ id, data, selected }: NodeProps) => {
  const setSelectedEntity = useWorkspaceStore((s) => s.setSelectedEntity);
  const noteData = data as any;

  return (
    <motion.div
      whileHover={{ y: -2 }}
      whileTap={{ scale: 0.99 }}
      transition={{ duration: 0.12, ease: [0.16, 1, 0.3, 1] }}
      onClick={() =>
        setSelectedEntity({
          type: "note",
          id: noteData.entityId || id,
          data: noteData,
        })
      }
      className={`px-3 py-2.5 rounded-xl glass-standard w-52 cursor-pointer select-none transition-all duration-150 relative group bg-[#101918] ${
        selected
          ? "border-[#fbbf24] ring-1 ring-[#fbbf24]/50"
          : "border-[#202e2b] hover:border-[#fbbf24]/40"
      }`}
    >
      <Handle
        type="target"
        position={Position.Top}
        className="!w-2 !h-2 !bg-[#fbbf24] !border !border-[#080d10]"
      />

      <div className="flex items-center gap-2">
        <div className="p-1 rounded-md bg-[#15221e] text-[#fbbf24] border border-[#202e2b]">
          <BookOpen className="h-3 w-3" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="text-xs font-medium text-[#f1f5f4] truncate group-hover:text-[#fbbf24] transition-colors">
            {noteData.title || "Knowledge Note"}
          </div>
          <div className="text-[9px] font-mono text-[#6e807d] mt-0.5">Knowledge Doc</div>
        </div>
      </div>

      <Handle
        type="source"
        position={Position.Bottom}
        className="!w-2 !h-2 !bg-[#fbbf24] !border !border-[#080d10]"
      />
    </motion.div>
  );
});

NoteNode.displayName = "NoteNode";
