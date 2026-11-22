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
      whileHover={{ scale: 1.03, y: -2 }}
      whileTap={{ scale: 0.98 }}
      transition={{ duration: 0.15, ease: [0.16, 1, 0.3, 1] }}
      onClick={() =>
        setSelectedEntity({
          type: "note",
          id: noteData.entityId || id,
          data: noteData,
        })
      }
      className={`px-3.5 py-3 rounded-2xl glass-standard w-56 cursor-pointer select-none transition-all duration-200 relative group ${
        selected
          ? "border-amber-400 ring-2 ring-amber-400/40 shadow-[0_0_20px_rgba(251,191,36,0.3)]"
          : "border-white/[0.10] hover:border-amber-400/40"
      }`}
    >
      <Handle
        type="target"
        position={Position.Top}
        className="!w-2.5 !h-2.5 !bg-amber-400 !border-2 !border-[#070914] shadow-[0_0_8px_#FBBF24]"
      />

      <div className="flex items-center gap-2.5">
        <div className="p-1.5 rounded-xl bg-amber-400/15 text-amber-400 border border-amber-400/25">
          <BookOpen className="h-3.5 w-3.5" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="text-xs font-semibold text-slate-200 truncate group-hover:text-amber-200 transition-colors">
            {noteData.title || "Knowledge Note"}
          </div>
          <div className="text-[9px] font-mono text-slate-400 mt-0.5">Knowledge Document</div>
        </div>
      </div>

      <Handle
        type="source"
        position={Position.Bottom}
        className="!w-2.5 !h-2.5 !bg-amber-400 !border-2 !border-[#070914] shadow-[0_0_8px_#FBBF24]"
      />
    </motion.div>
  );
});

NoteNode.displayName = "NoteNode";
