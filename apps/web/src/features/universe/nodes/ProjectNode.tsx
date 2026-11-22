"use client";

import React, { memo } from "react";
import { Handle, Position, NodeProps } from "@xyflow/react";
import { FolderGit2, CheckCircle, Clock } from "lucide-react";
import { motion } from "framer-motion";
import { useWorkspaceStore } from "@/stores/workspace-store";

export const ProjectNode = memo(({ id, data, selected }: NodeProps) => {
  const setSelectedEntity = useWorkspaceStore((s) => s.setSelectedEntity);

  return (
    <motion.div
      whileHover={{ scale: 1.03, y: -2 }}
      onClick={() =>
        setSelectedEntity({
          type: "project",
          id: (data as any).entityId || id,
          data,
        })
      }
      className={`px-4 py-3 rounded-2xl bg-[#11131A]/95 border backdrop-blur-xl shadow-xl w-64 cursor-pointer transition-all ${
        selected ? "border-[#8B5CF6] ring-2 ring-[#8B5CF6]/30 shadow-purple-500/20" : "border-white/10 hover:border-white/25"
      }`}
    >
      <Handle type="target" position={Position.Top} className="!bg-[#8B5CF6] !w-2.5 !h-2.5" />

      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-[#8B5CF6]/20 text-[#8B5CF6]">
            <FolderGit2 className="h-4 w-4" />
          </div>
          <span className="text-[10px] font-mono text-purple-400 uppercase tracking-wider">PROJECT</span>
        </div>
        <span className="text-[10px] font-mono text-slate-500 capitalize">{(data as any).priority || "medium"}</span>
      </div>

      <div className="text-xs font-semibold text-white truncate">{(data as any).title || "Untitled Project"}</div>

      <div className="mt-3 flex items-center justify-between">
        <div className="w-full bg-white/10 h-1.5 rounded-full overflow-hidden mr-2">
          <div
            className="bg-gradient-to-r from-[#8B5CF6] to-[#38BDF8] h-full rounded-full transition-all duration-300"
            style={{ width: `${(data as any).progress || 50}%` }}
          />
        </div>
        <span className="text-[10px] font-mono text-slate-400">{(data as any).progress || 50}%</span>
      </div>

      <Handle type="source" position={Position.Bottom} className="!bg-[#8B5CF6] !w-2.5 !h-2.5" />
    </motion.div>
  );
});

ProjectNode.displayName = "ProjectNode";
