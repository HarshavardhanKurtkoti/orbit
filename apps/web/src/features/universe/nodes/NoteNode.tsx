"use client";

import React, { memo } from "react";
import { Handle, Position, NodeProps } from "@xyflow/react";
import { BookOpen } from "lucide-react";
import { motion } from "framer-motion";
import { useWorkspaceStore } from "@/stores/workspace-store";

export const NoteNode = memo(({ id, data, selected }: NodeProps) => {
  const setSelectedEntity = useWorkspaceStore((s) => s.setSelectedEntity);

  return (
    <motion.div
      whileHover={{ scale: 1.03 }}
      onClick={() =>
        setSelectedEntity({
          type: "note",
          id: (data as any).entityId || id,
          data,
        })
      }
      className={`px-3 py-2.5 rounded-xl bg-[#191C26]/90 border backdrop-blur-xl shadow-lg w-52 cursor-pointer transition-all ${
        selected ? "border-amber-400 ring-2 ring-amber-400/30" : "border-white/10 hover:border-white/20"
      }`}
    >
      <Handle type="target" position={Position.Top} className="!bg-amber-400 !w-2 !h-2" />

      <div className="flex items-center gap-2">
        <div className="p-1 rounded-md bg-amber-400/20 text-amber-400">
          <BookOpen className="h-3.5 w-3.5" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="text-xs font-medium text-slate-200 truncate">{(data as any).title || "Note"}</div>
          <div className="text-[9px] font-mono text-slate-500 mt-0.5">Knowledge Document</div>
        </div>
      </div>

      <Handle type="source" position={Position.Bottom} className="!bg-amber-400 !w-2 !h-2" />
    </motion.div>
  );
});

NoteNode.displayName = "NoteNode";
